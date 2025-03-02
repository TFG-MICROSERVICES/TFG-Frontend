import { useState, useEffect, useContext } from 'react';
import { useSearch } from '../hooks/useSearch';
import { SearchBar } from '../components/ui/SearchBar';
import { useDebounce } from '../hooks/useDebounce';
import { getSports } from '../api/request/get/sports/getSports';
import { toast } from 'react-toastify';
import { CardSport } from '../components/ui/CardSport';
import { Button } from '../components/ui/Button';
import { LoginContext } from '../context/LoginContext';
import { SportForm } from '../components/forms/SportForm';
import { useMobile } from '../hooks/useMobile';
import { deleteSport } from '../api/request/delete/sports/deleteSport';

export const Sports = () => {
    const [sports, setSports] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const { search, handleSearch } = useSearch('');
    const debounceSearch = useDebounce(search, 300);
    const [sportId, setSportId] = useState(0);
    const { login } = useContext(LoginContext);
    const { isMobile } = useMobile();

    const fetchSports = async (searchTerm = '') => {
        try {
            const response = await getSports(searchTerm);
            if (response.status !== 200) {
                toast.error('Error al buscar deportes');
                return;
            }
            const sportsData = response.sports?.sports || [];
            setSports(sportsData);
        } catch (error) {
            console.log(error);
            toast.error('Error al obtener los deportes');
            setSports([]);
        }
    };

    const handleOnEdit = (sportId) => {
        setSportId(sportId);
        setOpenModal(true);
    };

    const handleOnDelete = async (sportId) => {
        try {
            const response = await deleteSport(sportId);
            if (response.status !== 200) {
                toast.error(response.message);
                return;
            }
            toast.success('Deporte eliminado correctamente');
            fetchSports();
        } catch (error) {
            console.log(error);
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    useEffect(() => {
        fetchSports(debounceSearch);
    }, [debounceSearch]);

    return (
        <>
            <SportForm sportId={sportId} openModal={openModal} setOpenModal={setOpenModal} refetch={fetchSports} />
            <div>
                <div className="w-full flex flex-row gap-2 justify-between">
                    <SearchBar setSearch={handleSearch} text="Buscar deporte..." clase="w-full md:w-60" />
                    {login?.admin && <Button handleOnClick={handleOpenModal} text={isMobile ? '+' : 'Crear nuevo deporte'} clase="w-1/2 md:w-44" />}
                </div>
                {sports.map((sport) => (
                    <CardSport
                        key={sport.id}
                        sport={sport}
                        handleOnEdit={() => handleOnEdit(sport.id)}
                        handleOnDelete={() => handleOnDelete(sport.id)}
                    />
                ))}
            </div>
        </>
    );
};
