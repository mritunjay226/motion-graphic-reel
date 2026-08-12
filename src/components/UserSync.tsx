"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * UserSync Component.
 *
 * Automatically syncs authenticated Clerk user profiles into the Convex 'users' table.
 */
export const UserSync: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const syncUser = useMutation(api.users.syncUser);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const email = user.primaryEmailAddress?.emailAddress || "";
    const name = user.fullName || user.firstName || "";
    const imageUrl = user.imageUrl || "";

    syncUser({
      clerkId: user.id,
      email,
      name,
      imageUrl,
    }).catch((err) => {
      console.error("Failed to sync user with Convex database:", err);
    });
  }, [isSignedIn, user, syncUser]);

  return null;
};
