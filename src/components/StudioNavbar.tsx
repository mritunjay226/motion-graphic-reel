"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Zap, Folder, Video, Film } from "lucide-react";
import { motion } from "framer-motion";

export function StudioNavbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  const isCreate = pathname === "/create-video";
  const isDashboard = pathname === "/dashboard" || pathname === "/reel" || pathname.startsWith("/reel");
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b-2 border-[#111111] transition-all select-none shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand & Mark matching Landing Page Hero */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.96 }}
              className="px-3.5 py-1.5 bg-[#111111] text-[#B5F500] font-bebas text-2xl tracking-widest rounded shadow-[3px_3px_0px_#FFE600] flex items-center gap-2 border border-[#111111] cursor-pointer"
            >
              <span>VOX</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#B5F500] animate-ping" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-bebas text-xl sm:text-2xl tracking-wide text-[#111111] leading-none">
                REEL ENGINE 2.5D
              </h1>
              <p className="text-[9px] text-[#555555] font-mono font-bold uppercase tracking-wider">
                Motion Graphic Broadcast Studio
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Tactile Broadcast Navigation */}
        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border-2 border-[#111111] ${
              isHome
                ? "bg-[#FFE600] text-[#111111] shadow-[2px_2px_0px_#111111]"
                : "bg-white text-[#111111] hover:bg-[#F4F4F6] shadow-[2px_2px_0px_#111111] hover:-translate-y-0.5"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </Link>

          <Link
            href="/create-video"
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border-2 border-[#111111] ${
              isCreate
                ? "bg-[#FFE600] text-[#111111] shadow-[2px_2px_0px_#111111]"
                : "bg-white text-[#111111] hover:bg-[#FFE600] shadow-[2px_2px_0px_#111111] hover:-translate-y-0.5"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#111111] fill-current" />
            <span>Create</span>
          </Link>

          <Link
            href="/reel"
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border-2 border-[#111111] ${
              isDashboard && !isCreate
                ? "bg-[#FFE600] text-[#111111] shadow-[2px_2px_0px_#111111]"
                : "bg-white text-[#111111] hover:bg-[#FFE600] shadow-[2px_2px_0px_#111111] hover:-translate-y-0.5"
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Vault</span>
          </Link>
        </nav>

        {/* Right CTA & User Controls */}
        <div className="flex items-center gap-2.5">
          {/* Live Studio REC Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#FFFDF7] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="font-mono text-[9px] font-black tracking-widest text-[#111111] uppercase">
              REC [30FPS]
            </span>
          </div>

          {!isCreate && (
            <Link
              href="/create-video"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-[#111111] text-white hover:bg-[#222222] shadow-[3px_3px_0px_#B5F500] border border-[#111111] transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-[#B5F500]" />
              <span>Fast Create</span>
            </Link>
          )}

          {/* User Auth Profile */}
          {isLoaded && (
            <div className="flex items-center pl-2 border-l-2 border-[#E2E2E8]">
              {isSignedIn ? (
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 rounded-full border-2 border-[#111111] shadow-[2px_2px_0px_#111111]",
                    },
                  }}
                />
              ) : (
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider bg-[#B5F500] text-[#111111] hover:bg-[#a6e200] transition-all shadow-[2px_2px_0px_#111111] border border-[#111111] cursor-pointer"
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
