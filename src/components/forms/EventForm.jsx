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
import { typeElimination } from '@/constants/tournament';
import { BlueLoader } from '../ui/Loader';
import { generateError } from '@/utils/generateError';
import { checkExistsNameEvent } from '@/api/request/post/events/checkExistsNameEvent';
import { formatDateTime } from '@/utils/formatTime';
import { tournamentSchema, updateTournamentSchema } from '@/api/schemas/schemaTournament';
import { leagueSchema, updateLeagueSchema } from '@/api/schemas/schemaLeague';

const initialValue = {
    
}

export const EventForm = ({ eventId = null, openModal, setOpenModal, refetch, setEventId }) => {
    const { login } = useContext(LoginContext);
    const { sports } = useContext(SportContext);
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState('single');
    const [typeOfElimination, setTypeOfElimination] = useState('single_elimination');
    const [filteredSports, setFilteredSports] = useState([]);
    const { selectedSport } = useContext(SportContext);

    const [event, setEvent] = useState({
        sport_id: 1,
        name: '',
        description: '',
        event_type: 'single',
        status: '1',
        location: '',
        start_time: '',
        end_time: '',
        registration_start: '',
        registration_end: '',

        // Campos específicos de torneo
        elimination_type: 'single_elimination',
        number_of_teams: '',

        // Campos específicos de liga
        teams_max: '',
        round_robin: true,
    });

    const formatEventData = (data) => {
        const baseEvent = {
            sport_id: data.sport_id || 1,
            name: data.name || '',
            description: data.description || '',
            event_type: data.event_type || 'single',
            status: data.status || '1',
            location: data.location || '',
            start_time: data.start_time ? formatDateTime(data.start_time) : '',
            end_time: data.end_time ? formatDateTime(data.end_time) : '',
            registration_start: data.registration_start ? formatDateTime(data.registration_start) : '',
            registration_end: data.registration_end ? formatDateTime(data.registration_end) : '',
            owner: data.owner,

            // Inicializamos con string vacío
            elimination_type: 'single_elimination',
            team_for_group: '',
            number_of_teams: '',
            teams_max: '',
            round_robin: true,
        };

        // Si es un torneo, actualizamos sus campos específicos
        if (data.tournament) {
            baseEvent.elimination_type = data.tournament.elimination_type || '';
            baseEvent.number_of_teams = data.tournament.number_of_teams?.toString() || '';
            baseEvent.group_stage = data.tournament.group_stage || false;
        }

        // Si es una liga, actualizamos sus campos específicos
        if (data.league) {
            baseEvent.teams_max = data.league.teams_max?.toString() || '';
            baseEvent.round_robin = data.league.round_robin?.toString() || '';
        }

        return baseEvent;
    };

    const fetchEvent = async () => {
        try {
            setIsLoading(true);
            const response = await getEvent(eventId);
            if (response.status !== 200) {
                toast.error('Error al obtener el evento');
                return;
            }
            // Inside fetchEvent:
            const formattedEvent = formatEventData(response.data);
            setEvent(formattedEvent);
            setType(response?.data?.event_type);
        } catch (error) {
            console.log(error);
            toast.error('Error al obtener el evento');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (sports) {
            const activeSports = sports.filter((sport) => {
                if (sport.status) {
                    return sport;
                }
            });
            setFilteredSports(activeSports);
        }
    }, [sports]);

    const handleSubmit = async (formValue) => {
        try {
            if (!eventId) {
                try {
                    const response = await checkExistsNameEvent({ event: formValue });
                    if (response.status !== 200 || response.data) {
                        generateError(response.message, response.status);
                    }
                } catch (error) {
                    toast.error(error.message, error.status);
                    return;
                }
            }
            setIsLoading(true);
            let response;
            if (eventId) {
                formValue.event_id = eventId;
                response = await updateEvent(eventId, { data: formValue });
            } else {
                formValue.user_id = login?.user_id;
                response = await postCreateEvent({ data: formValue });
            }
            if (response.status !== 201 && response.status !== 200) {
                toast.error(response.message);
                return;
            }
            toast.success(eventId ? 'Evento actualizado correctamente' : 'Evento creado correctamente');
            setEventId(null);
            setEvent({
                sport_id: selectedSport?.id || 1,
                name: '',
                description: '',
                event_type: 'single',
                status: '1',
                location: '',
                start_time: '',
                end_time: '',
                registration_start: '',
                registration_end: '',
                elimination_type: 'single_elimination',
                number_of_teams: '',
                teams_max: '',
                round_robin: true,
            });
            setOpenModal(false);
            refetch && refetch();
        } catch (error) {
            console.log(error);
            toast.error('Error al procesar el evento');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setEventId(null);
        setEvent({
            sport_id: selectedSport?.id || 1,
            name: '',
            description: '',
            event_type: 'single',
            status: '1',
            location: '',
            start_time: '',
            end_time: '',
            registration_start: '',
            registration_end: '',
            elimination_type: 'single_elimination',
            number_of_teams: '',
            teams_max: '',
            round_robin: true,
        });
        setOpenModal(false);
        setType('single');
        setTypeOfElimination('single_elimination');
    };

    const handleTypeEvent = (value) => {
        setType(value);
        if (value !== 'tournament') {
            setTypeOfElimination(null);
        }
    };

    const handleTypeElimination = (value) => {
        setTypeOfElimination(value);
    };

    useEffect(() => {
        if (eventId && openModal) {
            fetchEvent();
        }
    }, [eventId, openModal]);

    useEffect(() => {
        if(selectedSport){
            setEvent((prev) => ({
                ...prev,
                sport_id: selectedSport.id,
            }));
        }
    }, [selectedSport]);

    console.log("event", event);

    return (
        <>
            {' '}
            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <BlueLoader />
                </div>
            )}
            <Dialog open={openModal && sports} onOpenChange={handleClose}>
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
                            schema={
                                eventId 
                                    ? (type === 'tournament' 
                                        ? updateTournamentSchema 
                                        : type === 'league' 
                                            ? updateLeagueSchema 
                                            : eventSchema)
                                    : (type === 'tournament' 
                                        ? tournamentSchema 
                                        : type === 'league' 
                                            ? leagueSchema 
                                            : eventSchema)
                            }
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Nombre del evento" name="name" type="text" placeholder="Nombre del evento" />

                                <Select
                                    label="Deporte"
                                    name="sport_id"
                                    options={filteredSports.map((sport) => ({
                                        value: parseInt(sport.id),
                                        label: sport.name,
                                    }))}
                                />

                                <Select label="Tipo de evento" name="event_type" options={eventTypes} handleSelectOption={handleTypeEvent} />

                                <Select label="Estado" name="status" options={eventStatus} disabled={!login?.admin} />

                                {type === 'tournament' ? (
                                    <>
                                        <div className="md:col-span-2 flex flex-col md:flex-row gap-2">
                                            <Select
                                                label="Tipo de eliminatoria"
                                                name="elimination_type"
                                                options={typeElimination}
                                                handleSelectOption={handleTypeElimination}
                                            />
                                            <Input
                                                label="Número de equipos"
                                                name="number_of_teams"
                                                type="number"
                                                min={2}
                                                placeholder="Número de equipos"
                                            />
                                        </div>
                                    </>
                                ) : type === 'league' ? (
                                    <div className="md:col-span-2 flex flex-col md:flex-row gap-2">
                                        <Input
                                            label="Número máximo de equipos"
                                            name="teams_max"
                                            type="number"
                                            min={10}
                                            placeholder="Número máximo de equipos"
                                        />
                                        <Select
                                            label="Ida y Vuelta"
                                            name="round_robin"
                                            options={[
                                                {
                                                    label: 'Si',
                                                    value: true,
                                                },
                                                {
                                                    label: 'No',
                                                    value: false,
                                                },
                                            ]}
                                        />
                                    </div>
                                ) : null}

                                <div className="md:col-span-2 flex flex-col md:flex-row gap-2">
                                    <Input label="Ubicación" name="location" type="text" placeholder="Ubicación del evento" />
                                    <Input label="Descripción" name="description" type="textarea" placeholder="Descripción del evento" />
                                </div>

                                <Input label="Inicio del evento" name="start_time" type="datetime-local" />

                                <Input label="Fin del evento" name="end_time" type="datetime-local" />

                                <Input label="Inicio de inscripciones" name="registration_start" type="datetime-local" />

                                <Input label="Fin de inscripciones" name="registration_end" type="datetime-local" />

                                {(login?.admin || login?.user_id === event?.owner?.user_id || !eventId) && (
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
        </>
    );
};
