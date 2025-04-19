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
import { FilterBar } from '@/components/ui/FilterBar';
import { Button } from '@/components/ui/Button';

export const Teams = () => {
    // Estados
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [teamId, setTeamId] = useState(0);
    const [showModalRequests, setShowModalRequests] = useState(false);
    const [requests, setRequests] = useState([]);

    const { login } = useContext(LoginContext);
    const { sports, selectedSport } = useContext(SportContext);

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
        let result = teams;

        if (searchTerm) {
            result = result.filter(
                (team) =>
                    team.name.toLowerCase().includes(searchTerm.toLowerCase()) || team.sport.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (activeFilters.length > 0) {
            result = result.filter((team) => activeFilters.includes(team.sport.id.toString()));
        }

        setFilteredTeams(result);
    }, [searchTerm, activeFilters, teams]);

    useEffect(() => {
        if (selectedSport) {
            fetchTeams();
        }
    }, [selectedSport]);

    const handleFilterToggle = (sportId) => {
        setActiveFilters(activeFilters.includes(sportId) ? activeFilters.filter((f) => f !== sportId) : [...activeFilters, sportId]);
    };

    const clearFilters = () => {
        setActiveFilters([]);
        setSearchTerm('');
    };

    const handleOnEdit = (teamId) => {
        setTeamId(teamId);
        setOpenModal(true);
    };

    const handleOnDelete = async (teamId) => {
        try {
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
                    <div className="w-full md:w-72">
                        <SearchBar setSearch={setSearchTerm} text="Buscar equipos..." clase="w-full" value={searchTerm} />
                    </div>

                    {/* FilterBar Component */}
                    <div className="w-full md:flex-1">
                        <FilterBar
                            filters={sports}
                            activeFilters={activeFilters}
                            onFilterToggle={handleFilterToggle}
                            onClearFilters={clearFilters}
                            label="Deportes:"
                            showClear={activeFilters.length > 0 || searchTerm !== ''}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Lista de equipos */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : filteredTeams.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="text-gray-500 mb-4">
                        <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold mb-2">No se encontraron equipos</h3>
                        <p>No hay equipos que coincidan con tus criterios de búsqueda.</p>
                    </div>
                    <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Limpiar filtros
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeams.map((team) => (
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
            )}
        </div>
    );
};
