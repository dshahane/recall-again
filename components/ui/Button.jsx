export default function Button({ children, className, onClick, type = "button", variant = "default" }) {
    let variantClasses = "";
    if (variant === "outline") {
        variantClasses = "border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300";
    } else if (variant === "success") {
        variantClasses = "bg-green-600 text-white hover:bg-green-700";
    } else if (variant === "abstract") {
        variantClasses = "bg-transparent hover:bg-gray-300 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
    else {
        variantClasses = "border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300";
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2
        ${variantClasses}
        ${className}
      `}
        >
            {children}
        </button>
    );
}