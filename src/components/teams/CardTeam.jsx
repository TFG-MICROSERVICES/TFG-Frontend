import { Trash, UserPlus } from 'lucide-react';
import { useContext } from 'react';
import { LoginContext } from '../../context/LoginContext';
export const CardTeam = ({ team, handleOnEdit, handleOnDelete, handleOnJoin }) => {
    const { login } = useContext(LoginContext);
    return (
        <div
            onClick={() => handleOnEdit()}
            className="bg-white hover:bg-gray-100 cursor-pointer p-4 w-full flex gap-3 mt-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 items-center"
        >
            <div className="w-full flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800">{team.name}</h3>
                <p className="text-sm text-gray-600">{team.sport.name}</p>
                <p className="text-sm text-gray-600">{team.description}</p>
            </div>
            {login?.admin && (
                <>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOnJoin();
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            title="Unirse al equipo"
                        >
                            <UserPlus className="w-5 h-5 text-blue-600" />
                        </button>
                        <div className="justify-center items-center cursor-pointer text-red-500" onClick={() => handleOnDelete()}>
                            <Trash size={24} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
