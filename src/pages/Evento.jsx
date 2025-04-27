import { getEvent } from "@/api/request/get/events/getEvent";
import { LeagueMatches } from "@/components/events/LeagueMatches";
import { Ranking } from "@/components/events/Ranking";
import { BlueLoader } from "@/components/ui/Loader";
import { TabMenu } from "@/components/ui/TabMenu";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const eventTabs = [
  { name: 'Enfrentamientos' },
  { name: 'Ranking' }
];

export const Evento = () => {
    const [loading, setLoading] = useState();
    const [event, setEvent] = useState({});
    const { event_id } = useParams();
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


    useEffect(() => {
        if(event_id){
            fetchEvent();
        }
    },[event_id])

    return (
        <>
            {loading ? <BlueLoader /> : null }
            <TabMenu
                tabs={eventTabs}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
            />
            {currentTab === 'Ranking' && <Ranking />}
            {currentTab === 'Enfrentamientos' && <LeagueMatches />}
        </>
    );
}