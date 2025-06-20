import { useState, useEffect, useContext } from 'react';
import { Search, Plus, Users, Filter, X } from 'lucide-react';
import { LoginContext } from '../context/LoginContext';
import { SportContext } from '../context/SportContext';
import { CardTeam } from '../components/teams/CardTeam';
import { TeamForm } from '../components/forms/TeamForm';
import { Requests } from '../components/teams/Requests';
import { toast } from 'react-toastify';
import { getTeams } from '../api/request/get/teams/getTeams';
import { deleteTeam } from '../api/request/delete/teams/deleteTeam';
import { postJoinTeam } from '../api/request/post/teams/joinTeam';
import { postRequestTeam } from '../api/request/post/teams/requestTeam';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { BlueLoader } from '@/components/ui/Loader';
import { useSearchParams } from 'react-router-dom';

export const Teams = () => {
    // Estados
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [teamId, setTeamId] = useState(0);
    const [showModalRequests, setShowModalRequests] = useState(false);
    const [requests, setRequests] = useState([]);
    const [searchParams] = useSearchParams();
    

    const { login } = useContext(LoginContext);
    const { selectedSport } = useContext(SportContext);

    const fetchTeams = async () => {
        setIsLoading(true);
        try {
            const response = await getTeams('', selectedSport.id);
            if (response.status === 200) {
                setTeams(response.teams || []);
                setFilteredTeams(response.teams || []);
            } else {
                toast.error('Error al obtener los equipos');
            }
        } catch (error) {
            toast.error('Error al obtener los equipos');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredTeams(teams);
            return;
        }

        const searchTermLower = searchTerm.toLowerCase();
        const filtered = teams.filter((team) => team.name.toLowerCase().includes(searchTermLower));
        setFilteredTeams(filtered);
    }, [searchTerm, teams]);

    useEffect(() => {
        if (selectedSport) {
            fetchTeams();
        }
    }, [selectedSport]);

    useEffect(() => {
        const teamIdFromUrl = searchParams.get('team_id');
        if (teamIdFromUrl) {
            setTeamId(parseInt(teamIdFromUrl));
            setOpenModal(true);
        }
    }, [searchParams]);

    const handleOnEdit = (e, teamId) => {
        e.stopPropagation();
        setTeamId(teamId);
        setOpenModal(true);
    };

    const handleOnDelete = async (e, teamId) => {
        try {
            e.stopPropagation();
            const response = await deleteTeam(teamId);
            if (response.status === 200) {
                toast.success('Equipo eliminado correctamente');
                fetchTeams();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al eliminar el equipo');
        }
    };

    const handleOnJoin = async (teamId, sportId) => {
        try {
            console.log()
            const response = await postJoinTeam({
                team_id: teamId,
                user_email: login.email,
                status: '1',
                sport_id: sportId,
            });
            if (response.status === 201) {
                toast.success('Te has unido al equipo correctamente');
                fetchTeams();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al unirse al equipo');
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
            if (response.status === 201) {
                toast.success('Solicitud enviada correctamente');
                fetchTeams();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al enviar la solicitud');
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

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="container mx-auto">
            {/* Modales */}
            <TeamForm
                teamId={teamId}
                openModal={openModal}
                closeModal={() => {
                    setTeamId(0);
                    setOpenModal(false);
                }}
                refetch={fetchTeams}
            />
            <Requests openModal={showModalRequests} setOpenModal={setShowModalRequests} requests={requests} refetch={fetchTeams} />

            {/* Cabecera */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Equipos</h2>
                <Button clase="w-44" handleOnClick={handleOpenModal}>
                    <Plus className="h-5 w-5 mr-2" />
                    Crear equipo
                </Button>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* SearchBar Component */}
                    <div className="w-full">
                        <SearchBar setSearch={handleSearch} text="Buscar equipos..." clase="w-full" value={searchTerm} />
                    </div>
                </div>
            </div>

            {/* Lista de equipos */}
            {isLoading ? (
                <BlueLoader />
            ) : filteredTeams.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="text-gray-500 mb-4">
                        <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold mb-2">No se encontraron equipos</h3>
                        <p>No hay equipos que coincidan con tus criterios de búsqueda.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeams.map((team) => (
                        <CardTeam
                            key={team.id}
                            team={team}
                            handleOnEdit={(e) => handleOnEdit(e, team.id)}
                            handleOnDelete={(e) => handleOnDelete(e,team.id)}
                            handleOnJoin={() => handleOnJoin(team.id, team.sport.id)}
                            handleOnRequest={handleOnRequest}
                            showRequests={handleRequestModal}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
