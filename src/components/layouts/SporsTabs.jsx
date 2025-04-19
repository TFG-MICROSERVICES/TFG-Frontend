'use client';

import { useContext, useState } from 'react';
import { ClubIcon as Football, ShoppingBasketIcon as Basketball, TurtleIcon as Tennis, MonitorIcon as Running, Bike } from 'lucide-react';
import { SportContext } from '@/context/SportContext';

const sports = [
    { id: 1, name: 'Fútbol', icon: Football },
    { id: 2, name: 'Baloncesto', icon: Basketball },
    { id: 3, name: 'Tenis', icon: Tennis },
    { id: 4, name: 'Atletismo', icon: Running },
    { id: 5, name: 'Ciclismo', icon: Bike },
];

export function SportsTabs({ className }) {
    const { sports, setSelectedSport, selectedSport } = useContext(SportContext);

    return (
        <div className={`w-full bg-white py-4 border-b border-blue-100 shadow-sm ${className}`}>
            <div className="container mx-auto px-4">
                <div className="flex overflow-x-auto hide-scrollbar gap-1 md:gap-2">
                    {sports.map((sport) => (
                        <button
                            key={sport.id}
                            onClick={() => setSelectedSport(sport)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                                selectedSport.id === sport.id ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}
                        >
                            {sport.icon && <sport.icon className="h-5 w-5" />}
                            <span>{sport.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
