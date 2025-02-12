import { useState, useCallback, useEffect, useContext} from "react"
import { useSearch } from '../hooks/useSearch';
import { SearchBar } from '../components/ui/SearchBar';
import { useDebounce } from '../hooks/useDebounce';
import { getSports } from '../api/request/get/sports/getSports';
import { toast } from 'react-toastify';
import { CardSport } from '../components/ui/CardSport';
import { Button } from '../components/ui/Button';
import { LoginContext } from '../context/LoginContext';
import { Link } from "react-router-dom";

export const Sports = () =>{
    const [sports, setSports] = useState([]);
    const { search, handleSearch } = useSearch('');
    const debounceSearch = useDebounce(search,300);
    const { login } = useContext(LoginContext);

    console.log(search);

    const fetchSports = async() =>{
        try{
            const response = await getSports(search);
            if(response.status !== 200) toast.error('Error al buscar el equipo');
            setSports[response.sports.sports];
        }catch(error){
            console.log(error);
        }
    };

    const handleOnEdit = () => {
        console.log('edit');
    }

    useEffect(() =>{
        console.log(search);
        fetchSports();
    },[debounceSearch])

    return(
        <>
            <div>
                <div className="w-full flex flex-row gap-2">
                    <SearchBar setSearch={handleSearch} text="Buscar deporte..." />
                    {login?.admin &&
                        <Link to={'/gestionar/deporte'}>
                            <Button
                                text={window.innerWidth <= 768 ? "+" : "Crear nuevo deporte"}
                                clase="w-1/4"
                            />
                        </Link>                     
                    }
                </div>
                {
                    sports.map((sport) => (
                        <CardSport key={sport.id} user={sport} handleOnEdit={handleOnEdit}/>
                    ))
                }
            </div>
        </>
    )   
}