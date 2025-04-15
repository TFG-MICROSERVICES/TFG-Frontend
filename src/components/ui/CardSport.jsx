import { Trash, Edit } from 'lucide-react';
import { useContext } from 'react';
import { LoginContext } from '../../context/LoginContext';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

export const CardSport = ({ sport, handleOnEdit, handleOnDelete }) => {
    const { login } = useContext(LoginContext);

    return (
        <Card className="hover:shadow-md transition-shadow duration-300 bg-white">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">{sport.name}</h3>
                    {login?.admin && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleOnEdit(sport.id)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                                title="Editar deporte"
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                            <button
                                onClick={(e) => handleOnDelete(e, sport.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                                title="Eliminar deporte"
                            >
                                <Trash className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-gray-600 text-sm mb-4">{sport.description}</p>
            </CardContent>

            <CardFooter className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${sport.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {sport.status ? 'Activo' : 'Inactivo'}
                </span>
                <span className="text-sm text-gray-600">Mínimo: {sport.minimum_players} jugadores</span>
            </CardFooter>
        </Card>
    );
};
