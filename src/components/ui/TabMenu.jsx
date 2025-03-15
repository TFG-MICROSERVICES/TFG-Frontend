export const TabMenu = ({ tabs, currentTab, setCurrentTab }) => {
    return (
        <div className="flex flex-row gap-4 w-full items-center justify-center mb-10 overflow-x-auto max-w-screen-lg mx-auto">
            {tabs.map((tab) => (
                <p
                    key={tab.name}
                    className={`hover:cursor-pointer ${currentTab === tab.name ? 'text-blue-500 underline font-bold' : ''}`}
                    onClick={() => setCurrentTab(tab.name)}
                >
                    {tab.name}
                </p>
            ))}
        </div>
    );
};
