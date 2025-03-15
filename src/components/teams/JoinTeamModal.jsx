import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { Textarea } from '../ui/textarea';

export const JoinTeamModal = ({ team, openModal, setOpenModal, handleOnJoin, handleOnRequest }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleJoinTeam = async () => {
        try {
            setIsLoading(true);
            if (team?.public) {
                await handleOnJoin(team.id, team.sport.id);
            } else {
                await handleOnRequest(team.id, team.sport.id, message);
            }
            setOpenModal(false);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>{team?.public ? 'Unirse al equipo' : 'Solicitar unirse al equipo'}</DialogTitle>
                    <DialogDescription>
                        {team?.public
                            ? '¿Estás seguro de que deseas unirte a este equipo?'
                            : 'Este equipo es privado. ¿Deseas enviar una solicitud para unirte?'}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-sm mb-1">Detalles del equipo:</h3>
                        <p className="text-sm text-gray-600">Nombre: {team?.name}</p>
                        <p className="text-sm text-gray-600">Deporte: {team?.sport?.name}</p>
                        <p className="text-sm text-gray-600">Estado: {team?.public ? 'Público' : 'Privado'}</p>
                    </div>
                    {!team?.public && (
                        <Textarea
                            className="resize-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="¡Nos encantaría saber por qué quieres unirte a este equipo!"
                            maxLength={255}
                        />
                    )}
                    <div className="flex gap-2 justify-end">
                        <Button handleOnClick={() => setOpenModal(false)} text="Cancelar" />
                        <Button handleOnClick={handleJoinTeam} text={team?.public ? 'Unirme' : 'Enviar solicitud'} disabled={isLoading} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
