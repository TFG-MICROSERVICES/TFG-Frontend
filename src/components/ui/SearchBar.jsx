import { Icon, Search } from "lucide-react"
import { useSearch } from "../../hooks/useSearch"

export const SearchBar = ({setSearch, text}) =>{
    
    return (
        <div className="w-full relative">
            <input 
                type="text" 
                placeholder={text}
                className="w-full p-2 rounded-md border border-gray-300 pl-10"
                onChange={(e) => setSearch(e)}
            />
            <Search size={20} className="absolute left-2 top-1/2 transform -translate-y-1/2" />
        </div>
    )
}