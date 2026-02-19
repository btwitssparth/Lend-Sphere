import { forwardRef } from 'react';
import { motion } from 'framer-motion';

// A utility function to concatenate class names (acts similarly to standard clsx/tailwind-merge)
const cn = (...classes) => classes.filter(Boolean).join(' ');

const Button = forwardRef(({ 
    className, 
    variant = 'default', 
    size = 'default', 
    asChild = false, 
    children, 
    disabled,
    type = 'button',
    ...props 
}, ref) => {
    
    // 1. Base styles applied to all buttons
    // Includes strict focus states for accessibility and flat transition rules
    const baseStyles = "inline-flex items-center justify-center font-medium ring-offset-white dark:ring-offset-zinc-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap";

    // 2. Variants (Strictly flat colors, NO gradients)
    const variants = {
        default: "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 border border-transparent shadow-sm",
        outline: "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-sm",
        secondary: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-transparent",
        ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-900 dark:text-zinc-50 border border-transparent",
        danger: "bg-red-500 text-white hover:bg-red-600 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800 border border-transparent shadow-sm",
        link: "text-zinc-900 dark:text-zinc-50 underline-offset-4 hover:underline border border-transparent",
    };

    // 3. Sizes (matching the spacing system used in Home.jsx)
    const sizes = {
        default: "h-10 px-4 py-2 text-sm rounded-md",
        sm: "h-8 px-3 text-xs rounded-md",
        lg: "h-14 px-8 text-base rounded-lg font-semibold", // Specifically sized for the Hero search button
        icon: "h-10 w-10 rounded-md flex items-center justify-center",
    };

    // Construct the final standard Tailwind string
    const buttonClasses = cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
    );

    return (
        <motion.button
            ref={ref}
            type={type}
            className={buttonClasses}
            disabled={disabled}
            // Subtle, premium micro-interaction on click
            whileTap={disabled ? {} : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            {...props}
        >
            {children}
        </motion.button>
    );
});

Button.displayName = "Button";

export { Button };