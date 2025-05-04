'use client';

import { useContext, useEffect, useState } from 'react';
import { SportContext } from '@/context/SportContext';
import { toast } from 'react-toastify';

export function SportsTabs({ className }) {
    const [activeSports, setActiveSports] = useState([]);
    const { sports, setSelectedSport, selectedSport } = useContext(SportContext);

    //Función para obtener los deportes activos
    const getActiveSports = async () =>{
        try{
            const active = await sports.filter((sport) => {
                if(sport.status){
                    return sport;
                }
            });
            setActiveSports(active);
        }catch(error){
            toast.error('Error al obtener los deportes');
        }
    }

    useEffect(() => {
        if(sports){
            getActiveSports();
        }
    }, [sports]);

    return (
        <div className={`w-full bg-white py-4 border-b border-blue-100 shadow-sm ${className}`}>
            <div className="container px-4">
                <div className="flex overflow-x-auto hide-scrollbar gap-1 md:gap-2">
                    {activeSports.map((sport) => (
                        <button
                            key={sport?.id}
                            onClick={() => setSelectedSport(sport)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                                selectedSport?.id === sport?.id ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}
                        >
                            {sport?.icon && <sport.icon className="h-5 w-5" />}
                            <span>{sport?.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
