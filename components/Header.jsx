import Navigation from './Navigation';

export default function Header({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
    return (
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
                Agent Dashboard
            </h1>
            <Navigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />
        </header>
    );
}