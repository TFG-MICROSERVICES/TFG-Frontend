'use client';

import { useState, useEffect, useContext } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { getSports } from '../api/request/get/sports/getSports';
import { toast } from 'react-toastify';
import { CardSport } from '../components/ui/CardSport';
import { Button } from '../components/ui/Button';
import { LoginContext } from '../context/LoginContext';
import { SportForm } from '../components/forms/SportForm';
import { deleteSport } from '../api/request/delete/sports/deleteSport';
import { BlueLoader } from '@/components/ui/Loader';
import { SearchBar } from '@/components/ui/SearchBar';

export const Sports = () => {
    // Estados
    const [sports, setSports] = useState([]);
    const [filteredSports, setFilteredSports] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [sportId, setSportId] = useState(0);
    const { login } = useContext(LoginContext);

    const fetchSports = async () => {
        try {
            const response = await getSports();
            if (response.status === 200) {
                const sportsData = response.sports?.sports || [];
                setSports(sportsData);
                setFilteredSports(sportsData);
            } else {
                toast.error('Error al buscar deportes');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error al obtener los deportes');
            setSports([]);
            setFilteredSports([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredSports(sports);
            return;
        }

        const searchTermLower = searchTerm.toLowerCase();
        const filtered = sports.filter(
            (sport) => sport.name.toLowerCase().includes(searchTermLower) || sport.description.toLowerCase().includes(searchTermLower)
        );
        setFilteredSports(filtered);
    }, [searchTerm, sports]);

    // Cargar deportes al montar el componente
    useEffect(() => {
        fetchSports();
    }, []);

    const handleOnEdit = (sportId) => {
        setSportId(sportId);
        setOpenModal(true);
    };

    const handleOnDelete = async (e, sportId) => {
        try {
            e.stopPropagation();
            const response = await deleteSport(sportId);
            if (response.status === 200) {
                toast.success('Deporte eliminado correctamente');
                fetchSports();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error al eliminar el deporte');
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <SportForm openModal={openModal} setOpenModal={setOpenModal} sportId={sportId} setSportId={setSportId} refetch={fetchSports} />
            <div className="container mx-auto">
                {/* Cabecera */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Deportes</h2>
                    {login?.admin && (
                        <Button clase="w-44" handleOnClick={handleOpenModal}>
                            <Plus className="h-5 w-5 mr-2" />
                            Añadir deporte
                        </Button>
                    )}
                </div>

                {/* Barra de búsqueda */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <SearchBar setSearch={handleSearch} />
                </div>

                {/* Lista de deportes */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <BlueLoader />
                    </div>
                ) : filteredSports.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="text-gray-500">
                            <h3 className="text-xl font-semibold mb-2">No se encontraron deportes</h3>
                            <p>No hay deportes que coincidan con tu búsqueda.</p>
                        </div>
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                Limpiar búsqueda
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSports.map((sport) => (
                            <CardSport key={sport.id} sport={sport} handleOnEdit={handleOnEdit} handleOnDelete={handleOnDelete} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};
