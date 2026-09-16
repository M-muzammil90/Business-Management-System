"use client";

import {
  Bell,
  Menu,
  Search,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[#dfe9df] bg-[#f4f7f1]/95 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Left */}

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden items-center gap-2 sm:flex">
            <Search className="h-4 w-4 text-[#78928a]" />

            <span className="text-sm text-[#78928a]">
              Search anything...
            </span>

            <kbd className="ml-2 hidden rounded border border-[#d7e4d7] bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#78928a] md:inline-block">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Right */}

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full"
          >
            <Bell className="h-[18px] w-[18px] text-[#55736d]" />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
          </Button>

          <Separator
            orientation="vertical"
            className="mx-2 hidden h-6 sm:block"
          />

          <button
            type="button"
            className="flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-muted"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[#b9f268] text-xs font-semibold text-[#173f37]">
                MM
              </AvatarFallback>
            </Avatar>

            <div className="hidden text-left md:block">
                <p className="text-sm font-semibold leading-none text-[#204940]">
                Muhammad
              </p>

                <p className="mt-1 text-[11px] text-[#78928a]">
                Administrator
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}