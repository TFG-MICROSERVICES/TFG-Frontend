import { Search } from 'lucide-react';

export const SearchBar = ({ setSearch, text, clase }) => {
    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm mb-6 ${clase}`}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder={text}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setSearch(e)}
                />
            </div>
        </div>
    );
};
