import { useState } from "react"

export const useSearch = ({initialValue}) =>{

    const [search, setSearch] = useState(initialValue);

    const handleSearch = ({target}) => {
        setSearch(target.value);
    }

    return{
        search,
        handleSearch
    }
}