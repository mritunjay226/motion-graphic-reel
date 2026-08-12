"use client";

import React from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { UserSync } from "./UserSync";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

/**
 * Convex + Clerk App Router Client Provider Wrapper with Automatic User Sync.
 *
 * Connects Clerk authentication token state with Convex real-time reactive database queries
 * and automatically synchronizes authenticated user profiles.
 */
export const ConvexClientProvider: React.FC<ConvexClientProviderProps> = ({ children }) => {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder"}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <UserSync />
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
