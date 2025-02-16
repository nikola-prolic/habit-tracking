<template>
    <div class="donut-chart inline-block w-full h-full">
        <div class="progress relative flex items-center justify-center rounded-lg p-4">
            <svg class="progress-bar w-full h-full" viewBox="0 0 400 400">
                <circle class="progress-circle background-circle" cx="200" cy="200" r="180"></circle>
                <circle class="progress-circle foreground" cx="200" cy="200" r="180"
                    :style="{ strokeDashoffset: strokeDashOffset, stroke: donutColor, animationDuration: animationDurationStyle }"
                    stroke-width="30" style="animation-delay: 0ms" />
                <defs>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#3B82F6" />
                        <stop offset="100%" stop-color="#6366F1" />
                    </linearGradient>
                </defs>
            </svg>
            <div class="text absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col whitespace-nowrap"
                :style="{ color: textColor }">
                <span class="main-text font-semibold" :style="{ fontSize: fontSizeRem }">
                    {{ current }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    total: {
        type: Number,
        required: true,
    },
    current: {
        type: Number,
        required: true,
    },
    fontSize: {
        type: Number,
        default: 1.5
    }
});

const circumference = 2 * Math.PI * 180;
const completedPercentage = computed(() => {
    if (props.total === 0) return 0;
    return Math.min((props.current / props.total) * 100, 100);
});

const strokeDashOffset = computed(() => {
    return circumference - (circumference * completedPercentage.value) / 100;
});

const donutColor = computed(() => {
    const percentage = completedPercentage.value;
    if (percentage < 50) {
        return 'red';
    } else if (percentage < 76) {
        return 'orange';
    } else if (percentage < 100) {
        return 'green';
    } else {
        return 'url(#blueGradient)';
    }
});

const textColor = computed(() => {
    const percentage = completedPercentage.value;
    if (percentage == 0) {
        return 'gray'
    }
    else if (percentage < 50) {
        return 'red';
    } else if (percentage < 76) {
        return 'orange';
    } else if (percentage < 100) {
        return 'green';
    } else {
        return '#3B82F6';
    }
});
const animationDuration = computed(() => props.current * 300); // Duration in milliseconds
const animationDurationStyle = computed(() => `${animationDuration.value}ms`); // Style binding needs string with units

const fontSizeRem = computed(() => `${props.fontSize}rem`);
</script>

<style scoped>
.donut-chart {
    display: inline-block;
    width: 100%;
    height: 100%;
}

svg {
    transform: rotate(-90deg);
    margin: -10px;
    /* Added negative margin to SVG */
}

.progress-circle {
    fill: none;
    stroke-width: 30px;
    r: 180;
    cx: 200;
    cy: 200;
}

.progress-circle.background-circle {
    stroke: #E5E7EB;
    /* Gray color for the background circle - Tailwind 'gray-200' equivalent */
}

.progress-circle.foreground {
    stroke-dasharray: v-bind(circumference);
    stroke-linecap: round;
    animation: progressAnimation 1s ease;
    /* animation-delay: 200ms;  REMOVED animation-delay from CSS and added inline */
}

@keyframes progressAnimation {
    from {
        stroke-dashoffset: v-bind(circumference);
    }
}

.text {
    /* Tailwind classes for layout and basic styling - removed font-size from here */
    @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col whitespace-nowrap;
    font-family: poppins;
    /* Keep font-family in scoped CSS */
    font-weight: 500;
    /* Keep font-weight in scoped CSS */
}
</style>
