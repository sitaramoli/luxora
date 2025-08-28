import * as React from "react";
import { Loader } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      default: "h-8 w-8",
      sm: "h-4 w-4",
      lg: "h-12 w-12",
      icon: "h-5 w-5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface LoadingSpinnerProps
  extends React.HTMLAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {}

export const LoadingSpinner = React.forwardRef<
  SVGSVGElement,
  LoadingSpinnerProps
>(({ className, size, ...props }, ref) => {
  return (
    <Loader
      className={cn(spinnerVariants({ size, className }))}
      ref={ref}
      {...props}
    />
  );
});
LoadingSpinner.displayName = "LoadingSpinner";

interface PageLoaderProps {
  isLoading: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" />
    </div>
  );
};
