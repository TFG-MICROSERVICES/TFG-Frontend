import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Check, UserX } from 'lucide-react';
import { updateRequestTeam } from '../../api/request/put/teams/updateRequestTeam';
export const Requests = ({ openModal, setOpenModal, requests = [], refetch }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleAccept = async (requestId) => {
        try {
            setIsLoading(true);
            const response = await updateRequestTeam(requestId, { status: '1' });
            if (response.status === 200) {
                toast.success('Solicitud aceptada correctamente');
                setOpenModal(false);
                refetch && refetch();
            } else {
                toast.error('Error al aceptar la solicitud');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error al aceptar la solicitud');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async (requestId) => {
        try {
            setIsLoading(true);
            const response = await updateRequestTeam(requestId, { status: '2' });
            if (response.status === 200) {
                toast.success('Solicitud rechazada correctamente');
                setOpenModal(false);
                refetch && refetch();
            } else {
                toast.error('Error al rechazar la solicitud');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error al rechazar la solicitud');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Solicitudes pendientes</DialogTitle>
                        <DialogDescription>Gestiona las solicitudes de unión al equipo</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        {requests.length === 0 ? (
                            <p className="text-center text-gray-500">No hay solicitudes pendientes</p>
                        ) : (
                            requests.map((request) => (
                                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">{request.user.name}</p>
                                        <p className="text-sm text-gray-500">{request.user.email}</p>
                                        <p className="text-sm text-gray-500">{request.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div
                                            onClick={() => handleAccept(request.id)}
                                            className="w-10 h-10 p-0 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center border-none"
                                        >
                                            <Check className="w-5 h-5 text-white" />
                                        </div>
                                        <div
                                            onClick={() => handleReject(request.id)}
                                            className="w-10 h-10 p-0 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center border-none"
                                        >
                                            <UserX className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
