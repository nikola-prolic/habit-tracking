// types/nuxt-auth.d.ts
import type { Session } from "next-auth"; // Import from "next-auth"
import type { JWT } from "next-auth/jwt"; // Import JWT as well

declare module "next-auth" { // Augment "next-auth" module
  interface Session {
    user?: {
      id?: string | null; // Add the id property to the user object within Session
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module 'next-auth/jwt' { // Augment "next-auth/jwt" module for JWT type
  interface JWT {
    id?: string
  }
}
