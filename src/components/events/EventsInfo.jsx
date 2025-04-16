import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '../ui/Button';
import { Calendar, Clock, MapPin, Users, Calendar as CalendarIcon } from 'lucide-react';
import { formatTime } from '@/utils/formatTime';
import { formatDate } from '@/utils/formatDate';
import { useEffect, useState } from 'react';
import { getEvent } from '@/api/request/get/events/getEvent';
import { toast } from 'react-toastify';

export const EventsInfoModal = ({ open, setOpen, eventId }) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(false);

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
        console.log(status);
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

    useEffect(() => {
        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                                <p className="text-gray-600">{formatTime(event?.start_time)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Fin</p>
                                <p className="text-gray-600">{formatTime(event?.end_time)}</p>
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
                                <p className="text-gray-600">{formatDate(event?.registration_start)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Cierre</p>
                                <p className="text-gray-600">{formatDate(event?.registration_end)}</p>
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
                </div>

                <DialogFooter className="flex justify-end gap-2">
                    <Button clase="items-center" handleOnClick={() => setOpen(false)}>
                        Cerrar
                    </Button>
                    <Button clase="items-center" handleOnClick={() => setOpen(false)}>
                        Inscribirme
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
