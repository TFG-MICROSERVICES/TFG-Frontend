// src/components/ui/FilterBar.jsx
import { Filter, X } from 'lucide-react';

export const FilterBar = ({ filters, activeFilters, onFilterToggle, onClearFilters, label = 'Filtros:', showClear = false, className = '' }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="flex items-center shrink-0">
                <Filter className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>

            <div className="flex gap-2 flex-wrap">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => onFilterToggle(filter.id.toString())}
                        className={`
                            px-3 py-1.5 
                            rounded-full 
                            text-sm 
                            font-medium 
                            flex 
                            items-center 
                            gap-1 
                            transition-colors 
                            duration-200
                            ${
                                activeFilters.includes(filter.id.toString())
                                    ? 'bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200'
                                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }
                        `}
                    >
                        {filter.name}
                    </button>
                ))}

                {showClear && activeFilters.length > 0 && (
                    <button
                        onClick={onClearFilters}
                        className="
                            px-3 
                            py-1.5 
                            rounded-full 
                            text-sm 
                            font-medium 
                            flex 
                            items-center 
                            gap-1 
                            bg-red-50 
                            text-red-700 
                            border 
                            border-red-200 
                            hover:bg-red-100 
                            transition-colors 
                            duration-200
                        "
                    >
                        <X className="h-4 w-4" />
                        Limpiar filtros
                    </button>
                )}
            </div>
        </div>
    );
};
