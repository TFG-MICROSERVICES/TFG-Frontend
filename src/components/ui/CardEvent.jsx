import { Trash, Edit, MapPin, Calendar, Clock, Trophy, Users } from 'lucide-react';
import { useContext } from 'react';
import { LoginContext } from '../../context/LoginContext';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { formatDate } from '@/utils/formatDate';
import { formatTime } from '@/utils/formatTime';
import { Button } from './Button';
import { toast } from 'react-toastify';

export const CardEvent = ({ event, handleOnEdit, handleOnDelete, setInfoModal, setEventId }) => {
    const { login } = useContext(LoginContext);

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

    return (
        <Card className="hover:shadow-md transition-shadow duration-300 bg-white">
            <CardHeader className="p-4 pb-0">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{event.name}</h3>
                    <div className="flex items-center justify-center rounded-full bg-blue-50 p-2 ml-2">{getEventTypeIcon(event.event_type)}</div>
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
                            {formatTime(event.start_time)} - {formatTime(event.end_time)}
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                    {isRegistrationOpen(event) && event.status === '1' ? 'Inscripción abierta' : 'Inscripción cerrada'}
                </span>
                <Button
                    clase={`px-4 py-1.5 rounded text-sm font-medium ${
                        isRegistrationOpen(event) && event.status === '1'
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!isRegistrationOpen(event) || event.status !== '1'}
                    handleOnClick={() => handleEvent()}
                >
                    Ver detalles
                </Button>
            </CardFooter>
        </Card>
    );
};
