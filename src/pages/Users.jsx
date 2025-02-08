import { toast } from "react-toastify";
import { getUsers } from "../api/request/get/getUsers";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce.js";
import { Icon, Mail, Phone, MapPin, Pencil, Pen } from "lucide-react";

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

    const handleOnEdit = async () =>{
        console.log("edit");
    }

    useEffect(() => {
        fetchUsers();
    }, [debounceSearch]);
    return (
        <>
            <div>
                <input 
                    type="text" 
                    placeholder="Buscar usuario" 
                className="w-full p-2 rounded-md border border-gray-300"
                onChange={(e) => setSearch(e.target.value)}
            />
            {
                users.map((user) => (
                    <div key={user.id} className="bg-white p-4 w-full flex gap-3 mt-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 items-center">
                        <div  className="w-full flex flex-col">
                            <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                            <div className="flex flex-col gap-2 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Mail size={18} />
                                    <p>{user.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={18} />
                                    <p>{user.phone_number}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} />
                                    <p>{user.city}, {user.autonomous_region}</p>
                                </div>
                            </div>
                        </div>
                        <div 
                            className="justify-center items-center cursor-pointer" 
                            onClick={() => handleOnEdit()}>
                            <Pencil size={18}/>
                        </div>
                    </div>
                ))
            }
            </div>
        </>
    )
}