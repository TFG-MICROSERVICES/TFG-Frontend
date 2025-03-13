import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FormProvider } from '../../context/FormProvider';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useState, useEffect, useCallback } from 'react';
import { postCreateTeam } from '../../api/request/post/teams/createTeam';
import { toast } from 'react-toastify';
import { teamSchema } from '../../api/schemas/schemaTeam';
import { getTeam } from '../../api/request/get/teams/getTeam';
import { updateTeam } from '../../api/request/put/teams/updateTeam';
import { getSports } from '../../api/request/get/sports/getSports';

export const TeamForm = ({ teamId = null, openModal, setOpenModal, refetch }) => {
    const [team, setTeam] = useState({
        name: '',
        sport_id: '',
        public: true,
    });
    const [sports, setSports] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTeam = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getTeam(teamId);
            if (response.status !== 200) {
                toast.error('Error al obtener el equipo');
                return;
            }
            setTeam(response.team);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [teamId]);

    const fetchSports = async () => {
        try {
            setIsLoading(true);
            const response = await getSports();
            if (response.status !== 200) {
                toast.error('Error al buscar deportes');
                return;
            }
            const sportsData = response.sports?.sports.map((sport) => ({ value: sport.id, label: sport.name })) || [];
            setSports(sportsData);
        } catch (error) {
            console.log(error);
            toast.error('Error al obtener los deportes');
            setSports([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (formValue) => {
        try {
            setIsLoading(true);
            let response;
            if (teamId) {
                response = await updateTeam(teamId, formValue);
            } else {
                response = await postCreateTeam(formValue);
            }
            if (response.status !== 201 && response.status !== 200) {
                toast.error(response.message);
                return;
            }
            toast.success(teamId ? 'Equipo actualizado correctamente' : 'Equipo creado correctamente');
            setOpenModal(false);
            refetch && refetch();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (teamId && openModal) {
            fetchTeam();
        }
        fetchSports();
    }, [teamId, openModal]);

    return (
        <>
            {isLoading}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Crear nuevo equipo</DialogTitle>
                        <DialogDescription>Ingresa los datos del nuevo equipo</DialogDescription>
                    </DialogHeader>
                    <FormProvider initialValue={team} clase="w-full items-center" onSubmit={handleSubmit} schema={teamSchema}>
                        <div className="grid grid-cols-1 w-full justify-center items-center gap-4">
                            <Input label="Nombre" name="name" type="text" placeholder="Introduzca el nombre del equipo" required />

                            <Select label="Deporte" name="sport_id" options={sports} required />

                            <div className="flex w-full justify-between items-center">
                                <label htmlFor="public" className="text-sm">
                                    ¿El equipo será público?
                                </label>
                                <div className="flex justify-end">
                                    <Input name="public" type="checkbox" placeholder="¿El equipo será público?" clase="w-[15px] h-[15px]" />
                                </div>
                            </div>

                            <div className="w-full flex flex-col items-center justify-center mt-5 h-full">
                                <Button type="submit" text={teamId ? 'Actualizar equipo' : 'Registrar equipo'} clase="w-full" />
                            </div>
                        </div>
                    </FormProvider>
                </DialogContent>
            </Dialog>
        </>
    );
};
