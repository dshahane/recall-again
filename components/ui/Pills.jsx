import {Button} from "@/components/ui/button";

/**
 * A reusable component for rendering clickable pills.
 * @param {Array<Object>} items - Array of pill items with `label` and `value`.
 * @param {Function} onClick - The function to call when a pill is clicked.
 * @param {string} type - The type of pill (e.g., 'agent', 'question').
 */
export default function Pills ({ items, onClick, type }) {
return (
    <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {items.map((item, index) => (
            <Button
                key={index}
                onClick={() => onClick(item.value)}
                className={`flex items-center space-x-2 text-sm px-4 py-2 ${type === 'agent' ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
                {item.icon && <span className="text-xl">{item.icon}</span>}
                <span>{item.label}</span>
            </Button>
        ))}
    </div>
)};