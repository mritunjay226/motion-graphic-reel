"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Zap, Folder } from "lucide-react";

export function StudioNavbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  const isCreate = pathname === "/create-video";
  const isDashboard = pathname === "/dashboard";
  const isHome = pathname === "/";

  return (
    <header className="border-b-2 border-[#0C0C0E] bg-[#F2F1EC]/95 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3.5 transition-all shadow-xs select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Studio Identity */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#0C0C0E] text-[#B4F500] font-bebas text-lg flex items-center justify-center border-2 border-[#0C0C0E] shadow-[2px_2px_0px_#0C0C0E] group-hover:scale-105 group-hover:bg-[#B4F500] group-hover:text-[#0C0C0E] transition-all">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bebas text-xl sm:text-2xl text-[#0C0C0E] tracking-wider leading-none">
                  VOX REEL ENGINE
                </span>
                <span className="text-[9px] bg-[#B4F500] text-[#0C0C0E] border border-[#0C0C0E] px-1.5 py-0.2 rounded font-utility font-black uppercase">
                  2.5D
                </span>
              </div>
              <p className="text-[9px] text-[#666666] font-utility font-bold uppercase tracking-wider hidden sm:block">
                High-Retention Motion Graphics Workstation
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 ml-4 bg-[#E7E6E0] p-1 rounded-xl border border-[#D8D7D2]">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isHome
                  ? "bg-[#0C0C0E] text-[#B4F500] shadow-xs"
                  : "text-[#444444] hover:text-[#0C0C0E] hover:bg-white/60"
              }`}
            >
              Overview
            </Link>

            <Link
              href="/create-video"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                isCreate
                  ? "bg-[#0C0C0E] text-[#B4F500] shadow-xs"
                  : "text-[#444444] hover:text-[#0C0C0E] hover:bg-white/60"
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Fast Create</span>
            </Link>

            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                isDashboard
                  ? "bg-[#0C0C0E] text-[#B4F500] shadow-xs"
                  : "text-[#444444] hover:text-[#0C0C0E] hover:bg-white/60"
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>My Reels Library</span>
            </Link>
          </nav>
        </div>

        {/* Right CTA & User Controls */}
        <div className="flex items-center gap-3">
          
          {/* Quick Create Highlight Button (Hidden if already on /create-video) */}
          {!isCreate && (
            <Link
              href="/create-video"
              className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-[#B4F500] hover:bg-[#a5e400] text-[#0C0C0E] border-2 border-[#0C0C0E] shadow-[2px_2px_0px_#0C0C0E] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">CREATE REEL</span>
              <span className="sm:hidden">CREATE</span>
            </Link>
          )}

          {/* User Auth Profile */}
          {isLoaded && (
            <>
              {isSignedIn ? (
                <div className="flex items-center gap-2">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-8 h-8 rounded-lg border-2 border-[#0C0C0E] shadow-[2px_2px_0px_#0C0C0E]",
                      },
                    }}
                  />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[#0C0C0E] hover:bg-[#E7E6E0] transition-all border border-[#0C0C0E]"
                  >
                    Sign In
                  </button>
                </SignInButton>
              )}
            </>
          )}
        </div>

      </div>
    </header>
  );
}
