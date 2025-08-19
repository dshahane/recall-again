export default function Card({ title, description, children }) {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-1.5 mb-4">
                <h3 className="text-2xl font-semibold leading-none tracking-tight text-gray-800 dark:text-gray-100">{title}</h3>
                <p className="text-sm text-muted-foreground text-gray-600 dark:text-gray-400">{description}</p>
            </div>
            {children}
        </div>
    );
}