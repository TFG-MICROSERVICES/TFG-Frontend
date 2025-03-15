import { toast } from 'react-toastify';
import { getUsers } from '../api/request/get/getUsers';
import { useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce.js';
import { CardUser } from '../components/ui/CardUser.jsx';
import { SearchBar } from '../components/ui/SearchBar.jsx';
import { useSearch } from '../hooks/useSearch.js';
import { deleteUser } from '../api/request/delete/users/deleteUser.jsx';
import { UserDeleteModal } from '../components/users/UserDeleteModal.jsx';
export const Users = () => {
    const [users, setUsers] = useState([]);
    const { search, handleSearch } = useSearch('');
    const debounceSearch = useDebounce(search, 300);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [user, setUser] = useState(null);
    const fetchUsers = async () => {
        try {
            const response = await getUsers(search);
            if (response.status !== 200) toast.error('Error al obtener los usuarios');
            setUsers(response.users.users);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleOnDelete = async (email) => {
        console.log(email);
        try {
            const response = await deleteUser(email);
            if (response.status !== 200) toast.error('Error al eliminar el usuario');
            else toast.success('Usuario eliminado correctamente');
            fetchUsers();
            setOpenDeleteModal(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [debounceSearch]);
    return (
        <>
            <div>
                <SearchBar setSearch={handleSearch} text="Buscar usuario..." />
                <UserDeleteModal openModal={openDeleteModal} setOpenModal={setOpenDeleteModal} handleOnDelete={handleOnDelete} user={user} />
                {users.map((user) => (
                    <CardUser
                        key={user.id}
                        user={user}
                        handleOnDelete={() => {
                            setUser(user);
                            setOpenDeleteModal(true);
                        }}
                    />
                ))}
            </div>
        </>
    );
};
