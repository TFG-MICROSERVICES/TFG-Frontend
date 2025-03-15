import { Mail, Phone, MapPin, Trash } from 'lucide-react';
import { LoginContext } from '../../context/LoginContext';
import { useContext } from 'react';

export const CardUser = ({ user, handleOnDelete }) => {
    const { login } = useContext(LoginContext);
    return (
        <div className="bg-white p-4 w-full flex gap-3 mt-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 items-center">
            <div className="w-full flex flex-col">
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
                        <p>
                            {user.city}, {user.autonomous_region}
                        </p>
                    </div>
                </div>
            </div>
            {login?.admin && user?.id !== login?.id && (
                <div className="flex flex-row gap-2">
                    <div
                        className="justify-center items-center cursor-pointer text-red-500"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOnDelete(user.id);
                        }}
                    >
                        <Trash size={22} />
                    </div>
                </div>
            )}
        </div>
    );
};
