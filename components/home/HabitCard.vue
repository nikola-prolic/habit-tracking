<script setup lang="ts">
import { HabitWithEntries } from "../../prisma/types";
import dayjs from 'dayjs';

interface Props {
    habit: HabitWithEntries | undefined;
}

const props = defineProps<Props>();

const hasValidHabitProp = computed(() => !!props.habit);

const truncatedDescription = computed(() => {
    if (!hasValidHabitProp.value || !props.habit?.description) return '';
    const words = props.habit.description.split(' ');
    if (words.length > 50) {
        return words.slice(0, 50).join(' ') + '...';
    }
    return props.habit.description;
});

const hasEntries = computed(() => hasValidHabitProp.value && props.habit?.entries && props.habit.entries.length > 0);

const currentPeriodEntries = computed(() => {
    if (!hasEntries.value) return [];
    const now = dayjs();
    return props.habit!.entries.filter((entry: any) => {
        if (props.habit!.requiredEntryPeriod === 'DAILY') {
            return dayjs(entry.createdAt).isSame(now, 'day');
        } else if (props.habit!.requiredEntryPeriod === 'WEEKLY') {
            return dayjs(entry.createdAt).isSame(now, 'week');
        }
        return false;
    });
});

const pastPeriodEntries = (periodIndex: number) => {
    if (!hasEntries.value) return [];
    const now = dayjs();
    let periodStart, periodEnd;

    if (props.habit!.requiredEntryPeriod === 'DAILY') {
        periodStart = now.subtract(periodIndex + 1, 'day').startOf('day');
        periodEnd = now.subtract(periodIndex + 1, 'day').endOf('day');
    } else if (props.habit!.requiredEntryPeriod === 'WEEKLY') {
        periodStart = now.subtract(periodIndex + 1, 'week').startOf('week');
        periodEnd = now.subtract(periodIndex + 1, 'week').endOf('week');
    } else {
        return [];
    }

    return props.habit!.entries.filter((entry: any) => {
        return dayjs(entry.createdAt).isAfter(periodStart) && dayjs(entry.createdAt).isBefore(periodEnd);
    });
};


const currentPeriodChartData = computed(() => {
    if (!hasValidHabitProp.value) return { datasets: [] };
    const currentEntriesCount = currentPeriodEntries.value.length;
    const requiredEntries = props.habit!.requiredEntries;
    const completedPercentage = Math.min((currentEntriesCount / requiredEntries) * 100, 100);

    return {
        datasets: [{
            data: [completedPercentage, 100 - completedPercentage],
            backgroundColor: [completedPercentage === 100 ? '#3B82F6' : '#34D39A', '#F3F4F6'],
            borderWidth: 0,
        }],
    };
});

const lastThreePeriodsStatus = computed(() => {
    if (!hasValidHabitProp.value) return [];
    const periodsData = [];
    for (let i = 0; i < 3; i++) {
        const pastPeriodEntriesData = pastPeriodEntries(i);
        const periodEntriesCount = pastPeriodEntriesData.length;
        const requiredEntries = props.habit!.requiredEntries;
        const percentage = Math.min((periodEntriesCount / requiredEntries) * 100, 100);
        let periodName = '';

        if (props.habit!.requiredEntryPeriod === 'DAILY') {
            periodName = `Day ${dayjs().subtract(i + 1, 'day').format('MMM D')}`;
        } else if (props.habit!.requiredEntryPeriod === 'WEEKLY') {
            periodName = `Week ${dayjs().subtract(i + 1, 'week').format('MMM D')}`;
        }

        periodsData.push({
            period: periodName,
            entries: periodEntriesCount,
            required: requiredEntries,
            percentage: percentage,
            chartData: {
                datasets: [{
                    data: [percentage, 100 - percentage],
                    backgroundColor: [
                        percentage < 5 ? '#F43F5E' : percentage === 100 ? '#3B82F6' : '#34D39A',
                        '#F3F4F6'
                    ],
                    borderWidth: 0,
                }],
            }
        });
    }
    return periodsData;
});

const periodLabel = computed(() => {
    if (!hasValidHabitProp.value) return 'Periods';
    return props.habit!.requiredEntryPeriod === 'DAILY' ? 'Days' : 'Weeks';
});

</script>

<template>
    <div v-if="hasValidHabitProp" class="bg-white rounded shadow p-4 flex flex-col h-full">
        <div class="mb-4">
            <h3 class="font-semibold text-xl mb-1">{{ props.habit.title }}</h3>
            <p class="text-gray-600 text-sm habit-description" v-if="truncatedDescription">
                {{ truncatedDescription }}
            </p>
        </div>

        <template v-if="hasEntries">
            <div class="flex justify-center mb-6 px-2">
                <div class="relative w-40">
                    <DonutChart :total="props.habit.requiredEntries" :current="currentPeriodEntries.length"
                        :font-size="2.2" />
                </div>
            </div>

            <div class="mb-6" v-if="lastThreePeriodsStatus.length === 3">
                <h4 class="font-semibold text-md mb-2">Last 3 {{ periodLabel }}</h4>
                <div class="grid sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                    <div v-for="periodData in lastThreePeriodsStatus" :key="periodData.period" class="text-center">
                        <div class="relative inline-block px-1 w-36">
                            <DonutChart :total="periodData.required" :current="periodData.entries" :font-size="1.5" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="mb-6" v-else>
                <p class="text-sm text-gray-500 text-center">Not enough history to show last 3 periods.</p>
            </div>
        </template>
        <template v-else>
            <div class="text-center py-8 text-gray-500">No entries recorded yet. Track your habit to get started!</div>
        </template>


        <div class="flex justify-between mt-auto items-center">
            <HabitDeleteModal :habit="props.habit" />

            <div class="flex justify-end mt-auto items-center">
                <HabitEditModal :habit="props.habit" />
                <HabitTrackModal :habitId="props.habit?.id" />
            </div>
        </div>
    </div>
    <div v-else>
        <p>Error: Habit data is not loaded.</p>
    </div>
</template>

<style scoped>
/* Basic modal styling (you can customize this) */
.fixed.z-10.inset-0.overflow-y-auto {
    display: none;
    /* Hidden by default */
}

.fixed.z-10.inset-0.overflow-y-auto[aria-modal="true"] {
    display: block;
    /* Show modal when isModalVisible is true */
}

.habit-description {
    line-height: 1.4rem;
    /* Adjust this value to match your design's line height */
    height: 2.8rem;
    /* Exactly two lines (2 * line-height) */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    /* Required for multi-line ellipsis in WebKit browsers */
    -webkit-line-clamp: 2;
    /* Limit to 2 lines */
    -webkit-box-orient: vertical;
}
</style>
