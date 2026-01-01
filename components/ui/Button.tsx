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
          "bg-primary text-primary-foreground shadow-[var(--elevation-1)] hover:opacity-90 hover:shadow-[var(--elevation-2)]",
        monochrome:
          "bg-secondary text-secondary-foreground shadow-[var(--elevation-1)] hover:opacity-90 hover:shadow-[var(--elevation-2)]",
        gradient:
          "[background:var(--button-gradient)] text-[color:var(--md-sys-color-on-secondary)] shadow-[var(--elevation-1)] hover:opacity-90 hover:shadow-[var(--elevation-2)]",
        secondary:
          "bg-card text-card-foreground border border-border/30 shadow-[var(--elevation-1)] hover:bg-muted",
        ghost: "bg-transparent text-foreground hover:bg-muted",
        outline: "bg-transparent border border-border text-foreground hover:bg-muted",
        link: "bg-transparent text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
        star:
          "relative inline-block overflow-hidden rounded-full bg-transparent",
      },
      size: {
        sm: "h-10 px-5 text-sm min-w-[90px]",
        md: "h-12 px-7 py-2.5 text-base min-w-[110px]",
        lg: "h-14 px-9 text-base min-w-[140px]",
        icon: "h-12 w-12 p-0",
      },
    },
    compoundVariants: [
      { variant: "link", className: "h-auto min-w-0 p-0" },
      { variant: "star", className: "h-auto min-w-0 px-0 py-0" },
    ],
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
  speed?: React.CSSProperties["animationDuration"];
  thickness?: number;
  starColor?: string;
  starSpeed?: React.CSSProperties["animationDuration"];
  starThickness?: number;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      iconLeading,
      iconTrailing,
      color,
      speed,
      thickness,
      starColor,
      starSpeed,
      starThickness,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isStar = variant === "star";
    const resolvedColor = color ?? starColor ?? "var(--md-sys-color-primary)";
    const resolvedSpeed = speed ?? starSpeed ?? "6s";
    const resolvedThickness = thickness ?? starThickness ?? 1;
    const resolvedStyle = isStar
      ? ({
          padding: `${resolvedThickness}px 0`,
          ...style,
        } as React.CSSProperties)
      : style;

    if (isStar) {
      return (
        <Comp
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }))}
          style={resolvedStyle}
          {...props}
        >
          <div
            className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
            style={{
              background: `radial-gradient(circle, ${resolvedColor}, transparent 10%)`,
              animationDuration: resolvedSpeed,
            }}
            aria-hidden="true"
          />
          <div
            className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
            style={{
              background: `radial-gradient(circle, ${resolvedColor}, transparent 10%)`,
              animationDuration: resolvedSpeed,
            }}
            aria-hidden="true"
          />
          <div className="relative z-[1] star-border__content text-center text-[16px] py-[16px] px-[26px] rounded-full">
            {iconLeading ? <span className="inline-flex shrink-0">{iconLeading}</span> : null}
            {children}
            {iconTrailing ? <span className="inline-flex shrink-0">{iconTrailing}</span> : null}
          </div>
        </Comp>
      );
    }

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        style={resolvedStyle}
        {...props}
      >
        {iconLeading ? <span className="inline-flex shrink-0">{iconLeading}</span> : null}
        {children}
        {iconTrailing ? <span className="inline-flex shrink-0">{iconTrailing}</span> : null}
      </Comp>
    );
  }
);

Button.displayName = "Button";
