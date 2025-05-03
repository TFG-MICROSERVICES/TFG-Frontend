import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '../ui/Button';
import { Calendar, Clock, MapPin, Users, Calendar as CalendarIcon } from 'lucide-react';
import { formatDateTimeDisplay } from '@/utils/formatTime';
import { useContext, useEffect, useState } from 'react';
import { getEvent } from '@/api/request/get/events/getEvent';
import { toast } from 'react-toastify';
import { SportContext } from '@/context/SportContext';
import { generateError } from '@/utils/generateError';
import { createTeamEvent } from '@/api/request/post/events/createTeamEvent';
import { BlueLoader } from '../ui/Loader';
import { TeamEvent } from './TeamEvent';
import { useNavigate } from 'react-router-dom';

export const EventsInfoModal = ({ open, setOpen, eventId, setEventId }) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [canRegister, setCanRegister] = useState(true);
    const [existsTeam, setExistsTeam] = useState(false);
    const navigate = useNavigate();
    const { team, selectedSport, isCaptain } = useContext(SportContext);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            const response = await getEvent(eventId);
            if (response.status !== 200) {
                toast.error('Error al obtener el evento');
                return;
            }
            setEvent(response.data);
        } catch (error) {
            console.log(error);
            toast.error('Error al obtener el evento');
        } finally {
            setLoading(false);
        }
    };

    const getEventTypeLabel = (type) => {
        switch (type) {
            case 'single':
                return 'Evento Único';
            case 'tournament':
                return 'Torneo';
            case 'league':
                return 'Liga';
            default:
                return 'Desconocido';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case '0':
                return 'Borrador';
            case '1':
                return 'Activo';
            case '2':
                return 'Cancelado';
            case '3':
                return 'Finalizado';
            default:
                return 'Desconocido';
        }
    };

    const handleJoinEvent = async () => {
        try {
            setLoading(true);
            const data = { team_id: team.team.id, event_id: eventId, sport_id: selectedSport.id };
            const response = await createTeamEvent(data);
            if (response.status !== 201) {
                generateError(response.message, response.status);
            } else {
                toast.success('Inscripción realizada correctamente');
                setCanRegister(false);
                fetchEvent();
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEventId(null);
        setOpen(false);
    };

    const isRegistrationOpen = (event) => {
        const now = new Date();
        return now >= new Date(event?.registration_start) && now <= new Date(event?.registration_end);
    };

    useEffect(() => {
        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    useEffect(() => {
        if (event?.status !== '1' || !team) {
            setCanRegister(false);
        } else {
            setCanRegister(true);
        }

        if (event?.teams.find((currentTeam) => currentTeam.id === team?.team_id)) {
            setCanRegister(false);
            setExistsTeam(true);
        }
    }, [event, team]);

    return (
        <>
            {loading && (
                <div className="flex justify-center items-center h-64">
                    <BlueLoader size="lg" />
                </div>
            )}
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="bg-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{event?.name}</DialogTitle>
                        <DialogDescription className="text-gray-600 mt-2">{event?.description}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="font-medium">Ubicación</p>
                                    <p className="text-gray-600">{event?.location}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="font-medium">Tipo de evento</p>
                                    <p className="text-gray-600">{getEventTypeLabel(event?.event_type)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 border-t border-b py-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-purple-500" />
                                Fechas del evento
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium">Inicio</p>
                                    <p className="text-gray-600">{formatDateTimeDisplay(event?.start_time)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Fin</p>
                                    <p className="text-gray-600">{formatDateTimeDisplay(event?.end_time)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-orange-500" />
                                Período de inscripción
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium">Apertura</p>
                                    <p className="text-gray-600">{formatDateTimeDisplay(event?.registration_start)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Cierre</p>
                                    <p className="text-gray-600">{formatDateTimeDisplay(event?.registration_end)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-red-500" />
                                <span className="font-medium">Estado</span>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    event?.status === '1'
                                        ? 'bg-green-100 text-green-800'
                                        : event?.status === '2'
                                        ? 'bg-red-100 text-red-800'
                                        : event?.status === '3'
                                        ? 'bg-gray-100 text-gray-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}
                            >
                                {getStatusLabel(event?.status)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2 mt-2 max-h-[200px] overflow-y-auto">
                            {event?.teams && event?.teams.length > 0 ? (
                                event.teams.map((team) => <TeamEvent key={team.id} team={team} />)
                            ) : (
                                <p className="text-gray-500">No hay equipos inscritos</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end gap-2">
                        <Button clase="items-center" handleOnClick={() => setOpen(false)}>
                            Cerrar
                        </Button>
                        <Button
                            clase={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium ${
                                canRegister && isCaptain && isRegistrationOpen(event)
                                    ? 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                                    : 'bg-gray-300 cursor-not-allowed'
                            }`}
                            disabled={!canRegister || !isCaptain || !isRegistrationOpen(event)}
                            handleOnClick={() => handleJoinEvent()}
                        >
                            {!isRegistrationOpen(event)
                                ? 'Inscripción cerrada'
                                : existsTeam
                                ? 'Ya estás inscrito'
                                : !isCaptain
                                ? 'Solo puede inscribir al equipo el capitán'
                                : 'Inscribirme'}
                        </Button>
                        <Button
                            clase='max-w-[200px]'
                            handleOnClick={() => navigate(`/evento/${event.id}`)}
                        >
                            Ver Evento
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
