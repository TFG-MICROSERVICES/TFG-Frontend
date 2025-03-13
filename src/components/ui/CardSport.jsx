import { Trash } from 'lucide-react';
import { useContext } from 'react';
import { LoginContext } from '../../context/LoginContext';
export const CardSport = ({ sport, handleOnEdit, handleOnDelete }) => {
    const { login } = useContext(LoginContext);
    return (
        <div
            onClick={() => handleOnEdit()}
            className="bg-white hover:bg-gray-100 cursor-pointer p-4 w-full flex gap-3 mt-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 items-center"
        >
            <div className="w-full flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800">{sport.name}</h3>
                <p className="text-sm text-gray-600">{sport.description}</p>
            </div>
            {login?.admin && (
                <>
                    <div className="justify-center items-center cursor-pointer text-red-500" onClick={() => handleOnDelete()}>
                        <Trash size={24} />
                    </div>
                </>
            )}
        </div>
    );
};
