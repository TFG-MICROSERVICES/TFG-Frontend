import { Trash, UserPlus, Lock, Users, Edit } from 'lucide-react';
import { useContext, useState } from 'react';
import { LoginContext } from '../../context/LoginContext';
import { JoinTeamModal } from './JoinTeamModal';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

export const CardTeam = ({ team, handleOnEdit, handleOnDelete, handleOnJoin, handleOnRequest, showRequests }) => {
    const { login } = useContext(LoginContext);
    const [joinModal, setJoinModal] = useState(false);

    const handleJoin = (e) => {
        e.stopPropagation();
        setJoinModal(true)
    }

    return (
        <>
            <JoinTeamModal
                team={team}
                openModal={joinModal}
                setOpenModal={setJoinModal}
                handleOnJoin={handleOnJoin}
                handleOnRequest={handleOnRequest}
            />
            <Card className="hover:shadow-md cursor-pointer transition-shadow duration-300 bg-white" onClick={handleOnEdit}>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
                            <p className="text-sm text-gray-600">{team.sport.name}</p>
                        </div>
                        <div className="flex gap-2">
                            {/* Botón de solicitudes pendientes */}
                            {team.request_teams?.length > 0 &&
                                team.user_teams?.some((userTeam) => userTeam.user.email === login?.email && userTeam.is_captain) && (
                                    <button
                                        onClick={() => showRequests(team)}
                                        className="p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors duration-200 relative"
                                        title="Solicitudes pendientes"
                                    >
                                        <Users className="h-4 w-4" />
                                        {team.request_teams?.length > 0 && (
                                            <div className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
                                                {team.request_teams?.length}
                                            </div>
                                        )}
                                    </button>
                                )}

                            {/* Botones de unirse/privado */}
                            {!team?.user_teams?.some((userTeam) => userTeam.user.email === login?.email) && (
                                <>
                                    {team.public ? (
                                        <button
                                            onClick={(e) => handleJoin(e)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                                            title="Unirse al equipo"
                                        >
                                            <UserPlus className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => handleJoin(e)}
                                            className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full transition-colors duration-200"
                                            title="Equipo privado"
                                        >
                                            <Lock className="h-4 w-4" />
                                        </button>
                                    )}
                                </>
                            )}

                            {/* Botón de editar para capitanes */}
                            {/* {team?.user_teams?.some((userTeam) => userTeam.user.email === login?.email && userTeam.is_captain) && (
                                <button
                                    onClick={() => handleOnEdit()}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                                    title="Editar equipo"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                            )} */}

                            {/* Botón de eliminar para administradores */}
                            {login &&
                                (login.admin || team?.user_teams?.some((userTeam) => userTeam.user.email === login.email && userTeam.is_captain)) && (
                                    <button
                                        onClick={(e) => handleOnDelete(e)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                                        title="Eliminar equipo"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </button>
                                )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <p className="text-gray-600 text-sm">{team.description}</p>
                </CardContent>

                <CardFooter className="flex justify-between items-center">
                    <span
                        className={`px-3 py-1 rounded-full text-sm ${team.public ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                        {team.public ? 'Público' : 'Privado'}
                    </span>
                    <span className="text-sm text-gray-600">{team.user_teams?.length || 0} miembros</span>
                </CardFooter>
            </Card >
        </>
    );
};
