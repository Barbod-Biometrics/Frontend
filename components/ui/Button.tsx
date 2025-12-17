"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-secondary text-secondary-foreground shadow-[var(--elevation-1)] hover:opacity-90 hover:shadow-[var(--elevation-2)]",
        secondary:
          "bg-card text-card-foreground border border-border/30 shadow-[var(--elevation-1)] hover:bg-muted",
        ghost: "bg-transparent text-foreground hover:bg-muted",
        outline: "bg-transparent border border-border text-foreground hover:bg-muted",
        link: "bg-transparent text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
      },
      size: {
        sm: "h-10 px-5 text-sm min-w-[90px]",
        md: "h-12 px-7 py-2.5 text-base min-w-[110px]",
        lg: "h-14 px-9 text-base min-w-[140px]",
        icon: "h-12 w-12 p-0",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto min-w-0 p-0" }],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  iconLeading?: React.ReactNode;
  iconTrailing?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, iconLeading, iconTrailing, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props}>
        {iconLeading ? <span className="inline-flex shrink-0">{iconLeading}</span> : null}
        {children}
        {iconTrailing ? <span className="inline-flex shrink-0">{iconTrailing}</span> : null}
      </Comp>
    );
  }
);

Button.displayName = "Button";
