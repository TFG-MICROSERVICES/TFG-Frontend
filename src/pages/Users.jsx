import { toast } from "react-toastify";
import { getUsers } from "../api/request/get/getUsers";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce.js";

export const Users = () => {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const debounceSearch = useDebounce(search, 300);

    const fetchUsers = async () => {
        try{
            const response = await getUsers(search);
            console.log('Response:', response);
            if(response.status !== 200) toast.error('Error al obtener los usuarios');
            setUsers(response.users.users);
        }catch(error){
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [debounceSearch]);

    return (
        <div>
            <input 
                type="text" 
                placeholder="Buscar usuario" 
                className="w-full p-2 rounded-md border border-gray-300"
                onChange={(e) => setSearch(e.target.value)}
            />
            {
                users.map((user) => (
                    <div key={user.id} className="bg-white p-2 w-full flex flex-col gap-2 m-2 rounded-md shadow-md">
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        <p>{user.phone_number}</p>
                        <div className="flex flex-row gap-1"> 
                            <p>{user.city},</p>
                            <p>{user.autonomous_region}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}