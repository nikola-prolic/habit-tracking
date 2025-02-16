import type { Prisma } from "@prisma/client";

export type HabitWithEntries = Prisma.HabitGetPayload<{
  include: {
    entries: true; // Include the 'posts' relation
  };
}>;
