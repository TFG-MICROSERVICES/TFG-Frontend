import { getEvent } from "@/api/request/get/events/getEvent";
import { createResultsLeague } from "@/api/request/post/results/createResultsLeague";
import { LeagueMatches } from "@/components/events/LeagueMatches";
import { Ranking } from "@/components/events/Ranking";
import { TeamsListEvent } from "@/components/events/TeamListEvent";
import TournamentMatches from "@/components/events/TournamentMatches";
import { Button } from "@/components/ui/Button";
import { BlueLoader } from "@/components/ui/Loader";
import { TabMenu } from "@/components/ui/TabMenu";
import { LoginContext } from "@/context/LoginContext";
import { generateError } from "@/utils/generateError";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const eventTabs = [
    { name: 'Enfrentamientos' },
    { name: 'Equipos' }
];

export const Evento = () => {
    const [loading, setLoading] = useState();
    const [event, setEvent] = useState({});
    const [results, setResults] = useState([]);
    const { event_id } = useParams();
    const { login } = useContext(LoginContext);
    const [currentTab, setCurrentTab] = useState('Enfrentamientos');

    const fetchEvent = async () => {
        try {
            setLoading(true);
            const response = await getEvent(event_id);
            if (response.status !== 200) {
                toast.error('Error al obtener el evento');
                return;
            }
            setEvent(response.data);
        } catch (error) {
            console.log(error);
            toast.error('Error al obtener el evento');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateMatch = async () => {
        try {
            const response = await createResultsLeague(event.teams, event.id);
            if (response.status !== 201) {
                generateError(response.message, response.status);
            } else {
                toast.success(response.message);
                await fetchEvent();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (event_id) {
            fetchEvent();
        }
    }, [event_id]);

    useEffect(() => {
        if (event) {
            setResults(event?.results);
        }
    }, [event]);

    return (
        <>
            {loading ? <BlueLoader /> : null}
            <TabMenu
                tabs={eventTabs}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
            />
            <div className="flex justify-between items-center mb-6 px-12">
                <h2 className="text-2xl font-bold text-gray-800">
                    Enfrentamientos
                </h2>
                {(login?.admin || event?.owner?.user_id === login?.user_id) && <Button
                    handleOnClick={() => handleGenerateMatch()}
                    clase="w-auto"
                    variant={event?.results?.length > 0 ? "secondary" : "primary"}
                >
                    {event?.results?.length > 0 ? "Reajustar enfrentamientos" : event?.event_type === 'tournament' ? 'Generar enfretamientos de eliminatoria' : 'Generar enfrentamientos'}
                </Button>}
            </div>
            {currentTab === 'Equipos' && <TeamsListEvent teams={event?.teams} />}
            {results?.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full h-full py-12">
                    <svg
                        className="w-12 h-12 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v4m0 0l-4.553 2.276A2 2 0 014 17.618V19a2 2 0 002 2h12a2 2 0 002-2v-1.382a2 2 0 00-.447-1.342L15 14z"
                        />
                    </svg>
                    <p className="text-lg font-semibold text-gray-600 mb-1">No hay enfrentamientos aún</p>
                    <p className="text-sm text-gray-400">Cuando se generen, aparecerán aquí.</p>
                </div>
            ) : (
                <>
                    {(currentTab === 'Enfrentamientos' && event?.event_type === 'league')
                        ? <LeagueMatches teams={event?.teams} matchesData={event?.results} event={event} refetch={fetchEvent} />
                        : (currentTab === 'Enfrentamientos') ? <TournamentMatches teams={event?.teams} event={event} results={event?.results} refetch={fetchEvent} />
                            : null
                    }
                </>
            )}
        </>
    );
}