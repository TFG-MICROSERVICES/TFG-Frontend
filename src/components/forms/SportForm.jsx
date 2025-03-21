import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FormProvider } from '../../context/FormProvider';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useState, useEffect, useContext } from 'react';
import { postCreateSport } from '../../api/request/post/sports/createSport';
import { toast } from 'react-toastify';
import { sportSchema } from '../../api/schemas/schemaSport';
import { getSport } from '../../api/request/get/sports/getSport';
import { updateSport } from '../../api/request/put/sports/updateSport';
import { LoginContext } from '../../context/LoginContext';

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
    const { login } = useContext(LoginContext);

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
                <DialogContent className="bg-white overflow-y-auto max-h-[90vh] sm:max-h-[85vh] p-4 sm:p-6 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[95vw] sm:w-full rounded-lg">
                    <DialogHeader className="mb-4">
                        <DialogTitle>Crear nuevo deporte</DialogTitle>
                        <DialogDescription>Ingresa los datos del nuevo deporte</DialogDescription>
                    </DialogHeader>
                    <div className="overflow-y-auto pr-2">
                        <FormProvider initialValue={sport} clase="w-full items-center" onSubmit={handleSubmit} schema={sportSchema}>
                            <div className="grid grid-cols-1 w-full justify-center items-center gap-4">
                                <Input
                                    label="Nombre"
                                    name="name"
                                    type="text"
                                    placeholder="Introduzca el nombre del deporte"
                                    disabled={!login?.admin}
                                />

                                <Input
                                    label="Cantidad mínima de jugadores"
                                    name="minimum_players"
                                    type="number"
                                    min="0"
                                    placeholder="Introduzca la cantidad minima de jugadores por equipo"
                                    disabled={!login?.admin}
                                />

                                <Select label="Estado" name="status" options={status} disabled={!login?.admin} />

                                <Input
                                    label="Descripción"
                                    name="description"
                                    type="text"
                                    placeholder="Introduzca la descripción del deporte"
                                    disabled={!login?.admin}
                                />

                                <Input
                                    label="Imagen"
                                    name="image"
                                    type="image"
                                    placeholder="Introduzca la foto del deporte"
                                    disabled={!login?.admin}
                                />

                                {login?.admin && (
                                    <div className="w-full flex flex-col items-center justify-center mt-5 h-full">
                                        <Button type="submit" text={sportId ? 'Actualizar deporte' : 'Registrar deporte'} clase="w-full" />
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
