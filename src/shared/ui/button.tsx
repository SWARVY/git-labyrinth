import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-sm font-bold border-2 border-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-0.5 active:border-b-2",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground border-b-4 border-black hover:brightness-110",
      destructive:
        "bg-destructive text-destructive-foreground border-b-4 border-black hover:brightness-110",
      outline:
        "border-2 border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground",
      secondary:
        "bg-secondary text-secondary-foreground border-b-4 border-black hover:brightness-110",
      ghost: "border-0 hover:bg-accent hover:text-accent-foreground",
      link: "border-0 text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-10 px-5 py-2",
      sm: "h-8 px-3 text-xs",
      lg: "h-12 px-8 text-base",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={buttonVariants({ variant, size, className })} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
