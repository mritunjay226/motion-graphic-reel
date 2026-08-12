/**
 * Convex Auth Configuration for Clerk Integration.
 *
 * Configures Clerk JWT issuer domain to authenticate Convex mutations and queries.
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || "https://clerk.dev",
      applicationID: "convex",
    },
  ],
};
