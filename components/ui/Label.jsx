export default function Label({ htmlFor, children, className }) {
    return (
        <label
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300 ${className}`}
            htmlFor={htmlFor}
        >
            {children}
        </label>
    );
}