"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  showArrow?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

export function CTAButton({
  children,
  href,
  onClick,
  showArrow = true,
  className,
  type = "button",
  disabled = false,
}: CTAButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg bg-[#0D47A1] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:bg-[#0D47A1]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D47A1]/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    className
  );

  const content = (
    <>
      {children}
      {showArrow && (
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn("group", baseClasses)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn("group", baseClasses)}
    >
      {content}
    </button>
  );
}
