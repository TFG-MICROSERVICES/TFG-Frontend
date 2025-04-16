import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FormProvider } from '../../context/FormProvider';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useState, useEffect, useContext } from 'react';
import { postCreateEvent } from '../../api/request/post/events/createEvent';
import { toast } from 'react-toastify';
import { LoginContext } from '../../context/LoginContext';
import { eventSchema, updateEventSchema } from '@/api/schemas/schemaEvent';
import { getEvent } from '@/api/request/get/events/getEvent';
import { updateEvent } from '@/api/request/put/events/updateEvent';
import { SportContext } from '@/context/SportContext';
import { eventStatus, eventTypes } from '@/utils/consts';

export const EventForm = ({ eventId = null, openModal, setOpenModal, refetch, setEventId }) => {
    const { login } = useContext(LoginContext);
    const { sports } = useContext(SportContext);
    const [isLoading, setIsLoading] = useState(false);

    const [event, setEvent] = useState({
        sport_id: '',
        name: '',
        description: '',
        event_type: 'single',
        status: '1',
        location: '',
        start_time: '',
        end_time: '',
        registration_start: '',
        registration_end: '',
    });

    const fetchEvent = async () => {
        try {
            setIsLoading(true);
            const response = await getEvent(eventId);
            if (response.status !== 200) {
                toast.error('Error al obtener el evento');
                return;
            }
            setEvent(response.event);
        } catch (error) {
            console.log(error);
            toast.error('Error al obtener el evento');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (formValue) => {
        try {
            console.log(formValue);
            setIsLoading(true);
            let response;
            if (eventId) {
                response = await updateEvent(eventId, formValue);
            } else {
                response = await postCreateEvent({ data: formValue });
            }
            if (response.status !== 201 && response.status !== 200) {
                toast.error(response.message);
                return;
            }
            toast.success(eventId ? 'Evento actualizado correctamente' : 'Evento creado correctamente');
            setEventId(null);
            setEvent(null);
            setOpenModal(false);
            refetch && refetch();
        } catch (error) {
            console.log(error);
            toast.error('Error al procesar el evento');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (eventId && openModal) {
            fetchEvent();
        }
    }, [eventId, openModal]);

    const handleClose = () => {
        setEventId(null);
        setEvent(null);
        setOpenModal(false);
    };

    return (
        <Dialog open={openModal} onOpenChange={handleClose}>
            <DialogContent className="bg-white overflow-y-auto max-h-[90vh] sm:max-h-[85vh] p-4 sm:p-6">
                <DialogHeader className="mb-4">
                    <DialogTitle>{eventId ? 'Editar evento' : 'Crear nuevo evento'}</DialogTitle>
                    <DialogDescription>{eventId ? 'Modifica los datos del evento' : 'Ingresa los datos del nuevo evento'}</DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto pr-2">
                    <FormProvider
                        initialValue={event}
                        clase="w-full items-center"
                        onSubmit={handleSubmit}
                        schema={eventId ? updateEventSchema : eventSchema}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Nombre del evento" name="name" type="text" placeholder="Nombre del evento" disabled={!login?.admin} />

                            <Select
                                label="Deporte"
                                name="sport_id"
                                options={sports.map((sport) => ({
                                    value: sport.id,
                                    label: sport.name,
                                }))}
                                disabled={!login?.admin}
                            />

                            <Select label="Tipo de evento" name="event_type" options={eventTypes} disabled={!login?.admin} />

                            <Select label="Estado" name="status" options={eventStatus} disabled={!login?.admin} />

                            <div className="md:col-span-2">
                                <Input label="Ubicación" name="location" type="text" placeholder="Ubicación del evento" disabled={!login?.admin} />
                            </div>

                            <div className="md:col-span-2">
                                <Input
                                    label="Descripción"
                                    name="description"
                                    type="textarea"
                                    placeholder="Descripción del evento"
                                    disabled={!login?.admin}
                                />
                            </div>

                            <Input label="Inicio del evento" name="start_time" type="datetime-local" disabled={!login?.admin} />

                            <Input label="Fin del evento" name="end_time" type="datetime-local" disabled={!login?.admin} />

                            <Input label="Inicio de inscripciones" name="registration_start" type="datetime-local" disabled={!login?.admin} />

                            <Input label="Fin de inscripciones" name="registration_end" type="datetime-local" disabled={!login?.admin} />

                            {login?.admin && (
                                <div className="md:col-span-2 mt-4">
                                    <Button type="submit" clase="w-full justify-center">
                                        {eventId ? 'Actualizar evento' : 'Crear evento'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </FormProvider>
                </div>
            </DialogContent>
        </Dialog>
    );
};
