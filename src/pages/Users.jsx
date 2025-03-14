import { toast } from 'react-toastify';
import { getUsers } from '../api/request/get/getUsers';
import { useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce.js';
import { CardUser } from '../components/ui/CardUser.jsx';
import { SearchBar } from '../components/ui/SearchBar.jsx';
import { useSearch } from '../hooks/useSearch.js';

export const Users = () => {
    const [users, setUsers] = useState([]);
    const { search, handleSearch } = useSearch('');
    const debounceSearch = useDebounce(search, 300);

    const fetchUsers = async () => {
        try {
            const response = await getUsers(search);
            if (response.status !== 200) toast.error('Error al obtener los usuarios');
            setUsers(response.users.users);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleOnEdit = async () => {
        console.log('edit');
    };

    useEffect(() => {
        fetchUsers();
    }, [debounceSearch]);
    return (
        <>
            <div>
                <SearchBar setSearch={handleSearch} text="Buscar usuario..." />
                {users.map((user) => (
                    <CardUser key={user.id} user={user} handleOnEdit={handleOnEdit} />
                ))}
            </div>
        </>
    );
};
