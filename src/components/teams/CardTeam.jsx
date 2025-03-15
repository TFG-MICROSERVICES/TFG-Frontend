import { Trash, UserPlus, Lock, Users } from 'lucide-react';
import { useContext, useState } from 'react';
import { LoginContext } from '../../context/LoginContext';
import { JoinTeamModal } from './JoinTeamModal';

export const CardTeam = ({ team, handleOnEdit, handleOnDelete, handleOnJoin, handleOnRequest, showRequests }) => {
    const { login } = useContext(LoginContext);
    const [joinModal, setJoinModal] = useState(false);

    return (
        <>
            <JoinTeamModal
                team={team}
                openModal={joinModal}
                setOpenModal={setJoinModal}
                handleOnJoin={handleOnJoin}
                handleOnRequest={handleOnRequest}
            />
            <div
                onClick={() => handleOnEdit()}
                className="bg-white hover:bg-gray-100 cursor-pointer p-4 w-full flex gap-3 mt-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 items-center"
            >
                <div className="w-full flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-800">{team.name}</h3>
                    <p className="text-sm text-gray-600">{team.sport.name}</p>
                    <p className="text-sm text-gray-600">{team.description}</p>
                </div>
                <div className="flex gap-2 items-center">
                    {team.request_teams?.length > 0 &&
                        team.user_teams?.some((userTeam) => userTeam.user.email === login?.email && userTeam.is_captain) && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    showRequests(team);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative inline-flex items-center justify-center"
                                title="Solicitudes pendientes"
                            >
                                <Users className="w-5 h-5 text-primary" />
                                {team.request_teams?.length > 0 && (
                                    <div className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
                                        {team.request_teams?.length}
                                    </div>
                                )}
                            </button>
                        )}
                    {!team?.user_teams?.some((userTeam) => userTeam.user.email === login?.email) && (
                        <>
                            {team.public && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setJoinModal(true);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    title="Unirse al equipo"
                                >
                                    <UserPlus className="w-5 h-5 text-blue-600" />
                                </button>
                            )}
                            {!team.public && (
                                <div className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Equipo privado">
                                    <Lock
                                        className="w-5 h-5 text-gray-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setJoinModal(true);
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                    {login?.admin && (
                        <div
                            className="justify-center items-center cursor-pointer text-red-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOnDelete();
                            }}
                        >
                            <Trash size={24} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
