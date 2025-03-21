import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FormProvider } from '../../context/FormProvider';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useState, useEffect, useCallback, useContext } from 'react';
import { postCreateTeam } from '../../api/request/post/teams/createTeam';
import { toast } from 'react-toastify';
import { teamSchema } from '../../api/schemas/schemaTeam';
import { getTeam } from '../../api/request/get/teams/getTeam';
import { updateTeam } from '../../api/request/put/teams/updateTeam';
import { getSports } from '../../api/request/get/sports/getSports';
import { UserTeam } from '../teams/UserTeam';
import { LoginContext } from '../../context/LoginContext';

const initialTeam = {
    name: '',
    sport_id: '',
    public: true,
};

export const TeamForm = ({ teamId = null, openModal, refetch, closeModal }) => {
    const [team, setTeam] = useState(initialTeam);
    const [sports, setSports] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState(null);
    const { login } = useContext(LoginContext);

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
            setTeam(initialTeam);
            closeModal();
            refetch && refetch();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setTeam(initialTeam);
        closeModal();
    };

    useEffect(() => {
        if (teamId && openModal) {
            fetchTeam();
        }
        fetchSports();
    }, [teamId, openModal]);

    useEffect(() => {
        if (team && login) {
            const canEdit =
                login?.admin ||
                (team.user_teams?.find((userTeam) => userTeam.user.email === login?.email && userTeam.is_captain) && teamId) ||
                !teamId;
            setForm(canEdit);
        }
    }, [team, login, teamId]);

    return (
        <>
            {isLoading}
            <Dialog open={openModal} onOpenChange={handleCloseModal}>
                <DialogContent className="bg-white overflow-y-auto max-h-[90vh] sm:max-h-[85vh] p-4 sm:p-6 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[95vw] sm:w-full rounded-lg">
                    <DialogHeader className="mb-4">
                        <DialogTitle>
                            {!login?.admin && !team.user_teams?.some((ut) => ut.user.email === login?.email && ut.is_captain)
                                ? 'Datos del equipo'
                                : teamId
                                ? 'Editar equipo'
                                : 'Crear nuevo equipo'}
                        </DialogTitle>
                        <DialogDescription>
                            {!login?.admin && !team.user_teams?.some((ut) => ut.user.email === login?.email && ut.is_captain)
                                ? 'Aqui puedes ver los datos del equipo y sus miembros'
                                : teamId
                                ? 'Edita los datos del equipo'
                                : 'Ingresa los datos del nuevo equipo'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="overflow-y-auto pr-2">
                        <FormProvider initialValue={team} clase="w-full items-center" onSubmit={handleSubmit} schema={teamSchema}>
                            <div className="grid grid-cols-1 w-full justify-center items-center gap-4">
                                <Input
                                    label="Nombre"
                                    name="name"
                                    type="text"
                                    placeholder="Introduzca el nombre del equipo"
                                    required
                                    disabled={!form}
                                />

                                <Select label="Deporte" name="sport_id" options={sports} required disabled={!form} />

                                <div className="flex w-full justify-between items-center">
                                    <label htmlFor="public" className="text-sm">
                                        ¿El equipo será público?
                                    </label>
                                    <div className="flex justify-end">
                                        <Input
                                            name="public"
                                            type="checkbox"
                                            placeholder="¿El equipo será público?"
                                            clase="w-[15px] h-[15px]"
                                            disabled={!form}
                                        />
                                    </div>
                                </div>

                                {form && (
                                    <div className="w-full flex flex-col items-center justify-center mt-5 h-full">
                                        <Button type="submit" text={teamId ? 'Actualizar equipo' : 'Registrar equipo'} clase="w-full" />
                                    </div>
                                )}
                            </div>
                        </FormProvider>
                        <div className="mt-4">
                            <h3 className="font-medium text-sm mb-2">Miembros del equipo</h3>
                            <div className="max-h-[150px] sm:max-h-[200px] overflow-y-auto rounded-lg border border-gray-200">
                                {team.user_teams?.length > 0 ? (
                                    team.user_teams.map((userTeam) => <UserTeam key={userTeam.id} userTeam={userTeam} />)
                                ) : (
                                    <p className="text-center text-gray-500 p-4">No hay miembros en el equipo</p>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
