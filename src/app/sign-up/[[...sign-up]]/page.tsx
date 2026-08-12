import React from "react";
import { SignUp } from "@clerk/nextjs";

/**
 * Vox Reels SaaS — Sign-Up Page.
 */
export default function SignUpPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-neutral-950 px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Branding */}
      <div className="mb-8 text-center z-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white font-serif uppercase">
          VOX <span className="text-amber-400">REELS</span>
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Create your account to start generating automated 2.5D documentary videos
        </p>
      </div>

      {/* Clerk Sign Up Card */}
      <div className="z-10 shadow-2xl rounded-2xl overflow-hidden border border-neutral-800">
        <SignUp
          appearance={{
            elements: {
              card: "bg-neutral-900 border border-neutral-800 text-white shadow-2xl",
              headerTitle: "text-white font-bold",
              headerSubtitle: "text-neutral-400",
              socialButtonsBlockButton: "bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700",
              formFieldLabel: "text-neutral-300",
              formFieldInput: "bg-neutral-950 border-neutral-800 text-white focus:border-amber-400",
              formButtonPrimary: "bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold",
              footerActionLink: "text-amber-400 hover:text-amber-300",
            },
          }}
        />
      </div>
    </main>
  );
}
