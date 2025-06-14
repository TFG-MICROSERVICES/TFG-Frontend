import { useContext, useEffect, useState } from 'react';
import { SportContext } from './SportContext';
import { getSports } from '../api/request/get/sports/getSports';
import { LoginContext } from './LoginContext';
import { getTeamsByUser } from '@/api/request/get/teams/getTeamByUserId';

export const SportProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [sports, setSports] = useState([]);
    const [selectedSport, setSelectedSport] = useState(null);
    const [team, setTeam] = useState(null);
    const [isCaptain, setIsCaptain] = useState(false);
    const { login } = useContext(LoginContext);

    const fetchSports = async () => {
        try {
            setIsLoading(true);
            const response = await getSports();
            if (response.status !== 200) {
                return;
            }
            const sportsData = response.sports?.sports;
            setSports(sportsData);
            if (sportsData.length > 0) {
                setSelectedSport(sportsData[0]);
            }
        } catch (error) {
            console.log(error);
            setSports([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await getTeamsByUser(login.email, selectedSport.id);
            if (response.status !== 200) {
                return;
            }
            setTeam(response.data[0]);
            setIsCaptain(response.data[0].is_captain);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (selectedSport) {
            fetchTeams();
        }
    }, [selectedSport]);

    useEffect(() => {
        if (login) {
            fetchSports();
        }
    }, [login]);

    return (
        <SportContext.Provider value={{ isLoading, fetchSports, sports, setSports, selectedSport, setSelectedSport, team, isCaptain }}>
            {children}
        </SportContext.Provider>
    );
};
