import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FormProvider } from '../../context/FormProvider';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useState, useEffect } from 'react';
import { postCreateSport } from '../../api/request/post/sports/createSport';
import { toast } from 'react-toastify';
import { sportSchema } from '../../api/schemas/schemaSport';
import { getSport } from '../../api/request/get/sports/getSport';
import { updateSport } from '../../api/request/put/sports/updateSport';

const status = [
    {
        value: false,
        label: 'Inactiva',
    },
    {
        value: true,
        label: 'Activa',
    },
];

export const SportForm = ({ sportId = null, openModal, setOpenModal, refetch }) => {
    const [sport, setSport] = useState({
        name: '',
        minimum_players: '',
        status: true,
        description: '',
        image: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const fetchSport = async () => {
        try {
            setIsLoading(true);
            const response = await getSport(sportId);
            if (response.status !== 200) {
                toast.error('Error al obtener el deporte');
                return;
            }
            setSport(response.sport.sport);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (formValue) => {
        try {
            setIsLoading(true);
            let response;
            if (sportId) {
                response = await updateSport(sportId, formValue);
            } else {
                response = await postCreateSport(formValue);
            }
            if (response.status !== 201 && response.status !== 200) {
                toast.error(response.message);
                return;
            }
            toast.success(sportId ? 'Deporte actualizado correctamente' : 'Deporte creado correctamente');
            setOpenModal(false);
            refetch && refetch();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (sportId && openModal) {
            fetchSport();
        }
    }, [sportId, openModal]);

    return (
        <>
            {isLoading}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Crear nuevo deporte</DialogTitle>
                        <DialogDescription>Ingresa los datos del nuevo deporte</DialogDescription>
                    </DialogHeader>
                    <FormProvider initialValue={sport} clase="w-full items-center" onSubmit={handleSubmit} schema={sportSchema}>
                        <div className="grid grid-cols-1 w-full justify-center items-center gap-4">
                            <Input label="Nombre" name="name" type="text" placeholder="Introduzca el nombre del deporte" />

                            <Input
                                label="Cantidad mínima de jugadores"
                                name="minimum_players"
                                type="number"
                                min="0"
                                placeholder="Introduzca la cantidad minima de jugadores por equipo"
                            />

                            <Select label="Estado" name="status" options={status} />

                            <Input label="Descripción" name="description" type="text" placeholder="Introduzca la descripción del deporte" />

                            <Input label="Imagen" name="image" type="image" placeholder="Introduzca la foto del deporte" />

                            <div className="w-full flex flex-col items-center justify-center mt-5 h-full">
                                <Button type="submit" text={sportId ? 'Actualizar deporte' : 'Registrar deporte'} clase="w-full" />
                            </div>
                        </div>
                    </FormProvider>
                </DialogContent>
            </Dialog>
        </>
    );
};
