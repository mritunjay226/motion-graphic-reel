"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Plus, Video } from "lucide-react";

export function StudioNavbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  const isCreate = pathname === "/create-video";
  const isDashboard = pathname === "/dashboard" || pathname === "/reel";
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FBFBFD]/80 backdrop-blur-xl backdrop-saturate-150 border-b border-black/[0.06] transition-all select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-4">

        {/* Brand & Mark */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0071E3] to-[#47A3FF] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,113,227,0.3)] group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-[#1D1D1F]">
                ReelStudio
              </span>
              <span className="text-[10px] font-medium text-[#86868B] bg-black/[0.04] px-2 py-0.5 rounded-full border border-black/[0.04]">
                Pro
              </span>
            </div>
          </Link>
        </div>

        {/* Center: iOS Segmented Pill Navigation */}
        <nav className="hidden sm:flex items-center bg-black/[0.04] p-1 rounded-full border border-black/[0.04]">
          <Link
            href="/"
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${isHome
                ? "bg-white text-[#1D1D1F] shadow-sm"
                : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
          >
            Overview
          </Link>

          <Link
            href="/create-video"
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${isCreate
                ? "bg-white text-[#1D1D1F] shadow-sm"
                : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
          >
            <span>Create</span>
          </Link>

          <Link
            href="/reel"
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${isDashboard
                ? "bg-white text-[#1D1D1F] shadow-sm"
                : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
          >
            <span>Library</span>
          </Link>
        </nav>

        {/* Right CTA & User Controls */}
        <div className="flex items-center gap-2.5">
          {!isCreate && (
            <Link
              href="/create-video"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-sm hover:shadow-[0_4px_14px_rgba(0,113,227,0.3)] active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Reel</span>
            </Link>
          )}

          {/* User Auth Profile */}
          {isLoaded && (
            <div className="flex items-center pl-1">
              {isSignedIn ? (
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-7 h-7 ring-1 ring-black/10 rounded-full",
                    },
                  }}
                />
              ) : (
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-[#1D1D1F] hover:bg-black/[0.04] transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
