import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
export const UserDeleteModal = ({ openModal, setOpenModal, handleOnDelete, user }) => {
    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Eliminar usuario</DialogTitle>
                </DialogHeader>
                <DialogDescription>¿Estás seguro de que deseas eliminar a este usuario?</DialogDescription>
                <DialogFooter>
                    <button className="bg-red-500 text-white w-full rounded-md p-2 border-none" onClick={() => handleOnDelete(user?.email)}>
                        Eliminar
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
