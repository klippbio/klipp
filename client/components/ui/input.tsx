import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
export interface PrefixInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

const PrefixInputLeft = React.forwardRef<HTMLInputElement, PrefixInputProps>(
  ({ className, type, prefix, ...props }, ref) => {
    return (
      <div
        className={cn(
          "group relative mb-1 flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {/* Static Prefix */}
        <div className="flex items-center px-3 border-r-0 rounded-l-md h-9 leading-7 bg-muted text-muted-foreground">
          <span className="whitespace-nowrap text-sm">{prefix}</span>
        </div>
        {/* Editable Input */}
        <input
          ref={ref}
          type={type}
          className={cn(
            "block w-full h-9 px-1 text-sm leading-4 transition border-l-0 rounded-none rounded-r-md focus:outline-none"
          )}
          {...props}
        />
      </div>
    );
  }
);
PrefixInputLeft.displayName = "PrefixInputLeft";

export { PrefixInputLeft };

const PrefixInputRight = React.forwardRef<HTMLInputElement, PrefixInputProps>(
  ({ className, type, prefix, ...props }, ref) => {
    return (
      <div
        className={cn(
          "group relative mb-1 flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {/* Editable Input */}
        <input
          ref={ref}
          type={type}
          className={cn(
            "block w-full h-9 px-3 text-sm leading-4 transition border-r-0 rounded-none rounded-l-md focus:outline-none"
          )}
          {...props}
        />
        {/* Static Prefix */}
        <div className="flex items-center px-3 rounded-r-md h-9 leading-7 bg-muted text-muted-foreground">
          <span className="whitespace-nowrap text-sm">{prefix}</span>
        </div>
      </div>
    );
  }
);

PrefixInputRight.displayName = "PrefixInputRight";

export { PrefixInputRight };
