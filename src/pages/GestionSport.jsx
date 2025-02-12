import { useState, useEffect } from 'react';
import { FormProvider } from "../context/FormProvider"
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { sportSchema } from '../schemas/schemaSport';
import { Select } from '../components/ui/Select';

const status = [
    {label: 'Activo', value: 1},
    {label: 'Inactivo', value: 0}
]

export const GestionSport = ({sport}) =>{

    const [currentSport, setCurrentSport] = useState({
        name: sport?.name || '',
        description: sport?.description || '',
        status: sport?.description || '',
        image: sport?.image || '',
        minimum_players: sport?.minimum_players || '',
        sport_id: sport?.sport_id || '',
    });
    const [currentStatus, setCurrentStatus] = useState(0);

    const handleSubmit = () =>{

    }

    return(
        <FormProvider
            initialValue={currentSport}
            clase="w-full items-center"
        >
            <div className="grid grid-cols-2 w-full justify-center items-center gap-4">
                <div className="w-full flex flex-col gap-4">
                    <Input 
                        label="Nombre" 
                        name="name" 
                        type="text" 
                        required 
                        placeholder="Introduzca el nombre del deporte" 
                        clase="w-1/2"
                    />

                    <Input 
                        label="Cantidad mínima de jugadores" 
                        name="minimun_players" 
                        type="number" 
                        required 
                        placeholder="Introduzca la cantidad minima de jugadores por equipo" 
                        clase="w-1/2"
                    />
                </div>

                <div className="w-full flex flex-col gap-4">
                    <Input 
                        label="Descripción" 
                        name="description" 
                        type="text" 
                        placeholder="Introduzca la descripción del deporte" 
                        clase="w-full"
                    />

                    <Input 
                        label="Imagen" 
                        name="image" 
                        type="image" 
                        placeholder="Introduzca la foto del deporte" 
                        clase="w-full"
                    />

                </div>
            </div>
            <div className="w-full flex flex-col items-center justify-center mt-5">
                <Select
                    placeholder="Selecciona el estado del deporte"
                    options={status}
                    handleSelectOption={(value) => setCurrentStatus(value)}
                    label="Estado"
                    required
                    clase="w-full"
                    name="status"
                />

                <Button
                    type="submit"
                    clase="mt-10 items-center"
                    text="Registrar deporte"
                    className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-all"
                />
            </div>
            
        </FormProvider>
    )


}