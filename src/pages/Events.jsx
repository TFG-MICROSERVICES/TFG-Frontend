'use client';

import { useState, useEffect, useContext } from 'react';
import { Calendar, Plus, Trophy, Users } from 'lucide-react';
import { CardEvent } from '@/components/ui/CardEvent';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterBar } from '@/components/ui/FilterBar';
import { EventForm } from '@/components/forms/EventForm';
import { Button } from '@/components/ui/Button';
import { getEvents } from '@/api/request/get/events/getEvents';
import { toast } from 'react-toastify';
import { EventsInfoModal } from '@/components/events/EventsInfo';
import { deleteEvent } from '@/api/request/delete/events/deleteEvent';
import { generateError } from '@/utils/generateError';
import { SportContext } from '@/context/SportContext';
import { BlueLoader } from '@/components/ui/Loader';
import { useSearchParams } from 'react-router-dom';

const eventTypes = [
    {
        id: 'single',
        name: 'Evento único',
        icon: <Calendar className="h-4 w-4" />,
    },
    {
        id: 'tournament',
        name: 'Torneo',
        icon: <Trophy className="h-4 w-4" />,
    },
    {
        id: 'league',
        name: 'Liga',
        icon: <Users className="h-4 w-4" />,
    },
];

export const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [eventId, setEventId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openInfoModal, setOpenInfoModal] = useState(false);
    const { selectedSport } = useContext(SportContext);
    const [searchParams] = useSearchParams();

    //Obtenemos los eventos
    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const response = await getEvents(selectedSport.id);
            setEvents(response.data);
            setFilteredEvents(response.data);
        } catch (error) {
            toast.error('Error al obtener los eventos');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterToggle = (filter) => {
        if (activeFilters.includes(filter)) {
            setActiveFilters(activeFilters.filter((f) => f !== filter));
        } else {
            setActiveFilters([...activeFilters, filter]);
        }
    };

    const clearFilters = () => {
        setActiveFilters([]);
        setSearchTerm('');
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleEditEvent = (e, eventId) => {
        e.stopPropagation();
        setEventId(eventId);
        setOpenModal(true);
    };

    const handleDeleteEvent = async (e, eventId) => {
        try {
            e.stopPropagation();
            const response = await deleteEvent(eventId);
            if (response.status !== 200) {
                generateError(response.message, response.status);
            } else {
                toast.success(response.message);
                fetchEvents();
            }
        } catch (error) {
            toast.error(error.message, error.status);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        if (selectedSport) {
            fetchEvents();
        }
    }, [selectedSport]);

    useEffect(() => {
        let filteredResults = events;

        // Filtrar por tipo de evento
        if (activeFilters.length > 0) {
            filteredResults = filteredResults.filter((event) => activeFilters.includes(event.event_type));
        }

        // Filtrar por término de búsqueda
        if (searchTerm.trim() !== '') {
            const searchTermLower = searchTerm.toLowerCase();
            filteredResults = filteredResults.filter((event) => event.name.toLowerCase().includes(searchTermLower));
        }

        setFilteredEvents(filteredResults);
    }, [activeFilters, searchTerm, events]);

    useEffect(() => {
        const eventIdFromUrl = searchParams.get('event_id');
        if (eventIdFromUrl) {
            setEventId(parseInt(eventIdFromUrl));
            setOpenInfoModal(true);
        }
    }, [searchParams]);

    return (
        <>
            <EventForm openModal={openModal} setOpenModal={setOpenModal} eventId={eventId} setEventId={setEventId} refetch={fetchEvents} />
            <EventsInfoModal open={openInfoModal} setOpen={setOpenInfoModal} eventId={eventId} setEventId={setEventId} refetch={fetchEvents} />
            <div className="container mx-auto">
                {/* Cabecera de la página */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Eventos</h2>
                    <Button clase="w-44" handleOnClick={handleOpenModal}>
                        <Plus className="h-5 w-5 mr-2" />
                        Crear evento
                    </Button>
                </div>

                {/* Barra de búsqueda y filtros */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            {/* SearchBar Component */}
                            <div className="w-full md:w-72">
                                <SearchBar setSearch={handleSearch} text="Buscar eventos..." clase="w-full" value={searchTerm} />
                            </div>

                            {/* FilterBar Component */}
                            <div className="w-full md:flex-1">
                                <FilterBar
                                    filters={eventTypes}
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
                </div>

                {/* Lista de eventos */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <BlueLoader size="lg" />
                    </div>
                ) : filteredEvents && filteredEvents.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="text-gray-500 mb-4">
                            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-xl font-semibold mb-2">No se encontraron eventos</h3>
                            <p>No hay eventos que coincidan con tus criterios de búsqueda.</p>
                        </div>
                        <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents &&
                            filteredEvents.map((event) => (
                                <CardEvent
                                    key={event.id}
                                    event={event}
                                    setEventId={setEventId}
                                    setInfoModal={setOpenInfoModal}
                                    handleOnEdit={handleEditEvent}
                                    handleOnDelete={handleDeleteEvent}
                                />
                            ))}
                    </div>
                )}
            </div>
        </>
    );
};
