import { useState, useEffect, useContext } from 'react';
import { useSearch } from '../hooks/useSearch';
import { SearchBar } from '../components/ui/SearchBar';
import { useDebounce } from '../hooks/useDebounce';
import { getTeams } from '../api/request/get/teams/getTeams';
import { toast } from 'react-toastify';
import { CardTeam } from '../components/teams/CardTeam';
import { Button } from '../components/ui/Button';
import { LoginContext } from '../context/LoginContext';
import { TeamForm } from '../components/forms/TeamForm';
import { useMobile } from '../hooks/useMobile';
import { deleteTeam } from '../api/request/delete/teams/deleteTeam';
import { postJoinTeam } from '../api/request/post/teams/joinTeam';
import { postRequestTeam } from '../api/request/post/teams/requestTeam';
import { Requests } from '../components/teams/Requests';
import { SportContext } from '../context/SportContext';

export const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [sportId, setSportId] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [teamId, setTeamId] = useState(0);
    const [showModalRequests, setShowModalRequests] = useState(false);
    const [requests, setRequests] = useState([]);
    const { search, handleSearch } = useSearch('');
    const debounceSearch = useDebounce(search, 300);
    const { login } = useContext(LoginContext);
    const { isMobile } = useMobile();
    const { sports } = useContext(SportContext);
    const fetchTeams = async (searchTerm = '') => {
        try {
            const response = await getTeams(searchTerm, sportId);
            if (response.status !== 200 && response.status !== 404) {
                toast.error('Error al buscar equipos');
                return;
            }
            const teamsData = response.teams || [];
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

    const handleOnJoin = async (teamId, sportId) => {
        try {
            const response = await postJoinTeam({ team_id: teamId, user_email: login.email, status: '1', sport_id: sportId });
            if (response.status !== 201) {
                toast.error(response.message);
                return;
            }
            toast.success('Equipo unido correctamente');
            fetchTeams();
        } catch (error) {
            console.log(error);
        }
    };

    const handleOnRequest = async (teamId, sportId, message) => {
        try {
            const response = await postRequestTeam({
                team_id: teamId,
                user_email: login.email,
                sport_id: sportId,
                status: '0',
                description: message || 'Solicitud de ingreso al equipo',
            });
            if (response.status !== 201) {
                toast.error(response.message);
                return;
            }
            toast.success('Solicitud enviada correctamente');
            fetchTeams();
        } catch (error) {
            console.log(error);
        }
    };

    const handleRequestModal = (team) => {
        setTeamId(team.id);
        setRequests(team.request_teams);
        setShowModalRequests(true);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setTeamId(0);
        setOpenModal(false);
    };

    const handleSportChange = (sportId) => {
        setSportId(sportId);
    };

    useEffect(() => {
        fetchTeams(debounceSearch, sportId);
    }, [debounceSearch, sportId]);

    return (
        <>
            <TeamForm teamId={teamId} openModal={openModal} closeModal={handleCloseModal} setOpenModal={handleOpenModal} refetch={fetchTeams} />
            <Requests openModal={showModalRequests} setOpenModal={setShowModalRequests} requests={requests} refetch={fetchTeams} />
            <div>
                <div className="w-full flex flex-row gap-2 justify-between">
                    <div className="flex flex-row gap-2">
                        <SearchBar setSearch={handleSearch} text="Buscar equipo..." clase="w-full md:w-60" />
                        <select className="w-full md:w-60 rounded-lg" onChange={(e) => handleSportChange(e.target.value)}>
                            <option value="">Todos los deportes</option>
                            {sports.map((sport) => (
                                <option key={sport.id} value={sport.id}>
                                    {sport.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button handleOnClick={handleOpenModal} text={isMobile ? '+' : 'Crear nuevo equipo'} clase="w-1/2 md:w-44" />
                </div>
                {teams.map((team) => (
                    <CardTeam
                        key={team.id}
                        team={team}
                        handleOnEdit={() => handleOnEdit(team.id)}
                        handleOnDelete={() => handleOnDelete(team.id)}
                        handleOnJoin={() => handleOnJoin(team.id, team.sport.id)}
                        handleOnRequest={handleOnRequest}
                        showRequests={handleRequestModal}
                    />
                ))}
            </div>
        </>
    );
};
