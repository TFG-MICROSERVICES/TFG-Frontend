import { useState, useEffect, useContext } from 'react';
import { useSearch } from '../hooks/useSearch';
import { SearchBar } from '../components/ui/SearchBar';
import { useDebounce } from '../hooks/useDebounce';
import { getTeams } from '../api/request/get/teams/getTeams';
import { toast } from 'react-toastify';
import { CardTeam } from '../components/teams/CardTeam';
import { Button } from '../components/ui/Button';
import { LoginContext } from '../context/LoginContext';
// import { TeamForm } from '../components/forms/TeamForm';
import { useMobile } from '../hooks/useMobile';
import { deleteTeam } from '../api/request/delete/teams/deleteTeam';

export const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const { search, handleSearch } = useSearch('');
    const debounceSearch = useDebounce(search, 300);
    const [teamId, setTeamId] = useState(0);
    const { login } = useContext(LoginContext);
    const { isMobile } = useMobile();

    const fetchTeams = async (searchTerm = '') => {
        try {
            const response = await getTeams(searchTerm);
            if (response.status !== 200 && response.status !== 404) {
                toast.error('Error al buscar equipos');
                return;
            }
            const teamsData = response.teams?.teams || [];
            setTeams(teamsData);
        } catch (error) {
            console.log(error);
            toast.error('Error al obtener los equipos');
            setTeams([]);
        }
    };

    const handleOnEdit = (teamId) => {
        setTeamId(teamId);
        setOpenModal(true);
    };

    const handleOnDelete = async (teamId) => {
        try {
            const response = await deleteTeam(teamId);
            if (response.status !== 200) {
                toast.error(response.message);
                return;
            }
            toast.success('Equipo eliminado correctamente');
            fetchTeams();
        } catch (error) {
            console.log(error);
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    useEffect(() => {
        fetchTeams(debounceSearch);
    }, [debounceSearch]);

    return (
        <>
            {/* <TeamForm teamId={teamId} openModal={openModal} setOpenModal={setOpenModal} refetch={fetchTeams} /> */}
            <div>
                <div className="w-full flex flex-row gap-2 justify-between">
                    <SearchBar setSearch={handleSearch} text="Buscar equipo..." clase="w-full md:w-60" />
                    {login?.admin && <Button handleOnClick={handleOpenModal} text={isMobile ? '+' : 'Crear nuevo equipo'} clase="w-1/2 md:w-44" />}
                </div>
                {teams.map((team) => (
                    <CardTeam key={team.id} team={team} handleOnEdit={() => handleOnEdit(team.id)} handleOnDelete={() => handleOnDelete(team.id)} />
                ))}
            </div>
        </>
    );
};
