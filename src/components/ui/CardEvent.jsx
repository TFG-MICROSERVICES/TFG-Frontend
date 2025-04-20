import { Trash, Edit, MapPin, Calendar, Clock, Trophy, Users, Eye } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../context/LoginContext';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { formatDate } from '@/utils/formatDate';
import { formatDateTimeDisplay } from '@/utils/formatTime';
import { Button } from './Button';
import { toast } from 'react-toastify';
import { SportContext } from '@/context/SportContext';

export const CardEvent = ({ event, handleOnEdit, handleOnDelete, setInfoModal, setEventId }) => {
    const { login } = useContext(LoginContext);
    const { team } = useContext(SportContext);
    const [canRegister, setCanRegister] = useState(false);

    // Obtener icono en función del tipo de evento que sea
    const getEventTypeIcon = (type) => {
        switch (type) {
            case 'single':
                return <Calendar className="h-5 w-5" />;
            case 'tournament':
                return <Trophy className="h-5 w-5" />;
            case 'league':
                return <Users className="h-5 w-5" />;
            default:
                return <Calendar className="h-5 w-5" />;
        }
    };

    // Verificar si el registro está abierto
    const isRegistrationOpen = (event) => {
        const now = new Date();
        return now >= new Date(event.registration_start) && now <= new Date(event.registration_end);
    };

    const handleEvent = () => {
        try {
            setInfoModal(true);
            setEventId(event.id);
        } catch (error) {
            toast.error('Error al abrir el evento');
        }
    };

    useEffect(() => {
        if (event?.status !== '1' || !team) {
            setCanRegister(false);
        } else {
            setCanRegister(true);
        }

        if (event?.teams.find((currentTeam) => currentTeam.team_id === team?.team_id)) {
            setCanRegister(false);
        }
    }, [event, team]);

    return (
        <Card className="hover:shadow-md transition-shadow duration-300 bg-white">
            <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className={`p-2 rounded-lg ${
                                    event.event_type === 'single'
                                        ? 'bg-blue-50 text-blue-600'
                                        : event.event_type === 'tournament'
                                        ? 'bg-purple-50 text-purple-600'
                                        : 'bg-green-50 text-green-600'
                                }`}
                            >
                                {getEventTypeIcon(event.event_type)}
                            </div>
                            <span
                                className={`text-sm font-medium ${
                                    event.event_type === 'single'
                                        ? 'text-blue-600'
                                        : event.event_type === 'tournament'
                                        ? 'text-purple-600'
                                        : 'text-green-600'
                                }`}
                            >
                                {event.event_type === 'single' ? 'Evento Único' : event.event_type === 'tournament' ? 'Torneo' : 'Liga'}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{event.name}</h3>
                    </div>

                    {(login?.admin || login?.id === event?.owner?.user_id) && (
                        <div className="flex items-start gap-1.5 shrink-0">
                            <button
                                onClick={(e) => handleOnEdit(e, event.id)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                            >
                                <Edit className="h-4 w-4 group-hover:text-blue-600" />
                                <span className="sr-only">Editar evento</span>
                            </button>
                            <button
                                onClick={(e) => handleOnDelete(e, event.id)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                            >
                                <Trash className="h-4 w-4 group-hover:text-red-600" />
                                <span className="sr-only">Eliminar evento</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.start_time)}</span>
                    <MapPin className="h-4 w-4 ml-2" />
                    <span>{event.location}</span>
                </div>
            </CardHeader>

            <CardContent className="p-4">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                            {formatDate(event.start_time)}
                            {formatDate(event.start_time) !== formatDate(event.end_time) && ` - ${formatDate(event.end_time)}`}
                        </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                            {formatDateTimeDisplay(event.start_time)} - {formatDateTimeDisplay(event.end_time)}
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span
                        className={`text-xs font-medium ${
                            isRegistrationOpen(event) && event.status === '1' && canRegister
                                ? 'text-green-600 bg-green-50'
                                : !canRegister
                                ? 'text-primary bg-blue-50'
                                : 'text-red-600 bg-red-50'
                        } px-2 py-1 rounded-full`}
                    >
                        {isRegistrationOpen(event) && event.status === '1' && canRegister
                            ? 'Inscripción abierta'
                            : !canRegister
                            ? 'Ya estas inscrito '
                            : 'Inscripción cerrada'}
                    </span>
                </div>

                <div className="flex gap-2 ml-auto">
                    <Button
                        clase={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-blue-50 hover:bg-blue-100 text-blue-600 `}
                        handleOnClick={() => handleEvent()}
                    >
                        <Eye className="h-4 w-4" />
                        <span>Ver Detalles</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};
