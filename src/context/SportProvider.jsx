import { useContext, useEffect, useState } from 'react';
import { SportContext } from './SportContext';
import { getSports } from '../api/request/get/sports/getSports';
import { LoginContext } from './LoginContext';
import { getTeams } from '@/api/request/get/teams/getTeams';
import { getTeamsByUser } from '@/api/request/get/teams/getTeamByUserId';

export const SportProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [sports, setSports] = useState([]);
    const [selectedSport, setSelectedSport] = useState(null);
    const [teams, setTeams] = useState([]);
    const { login } = useContext(LoginContext);

    const fetchSports = async () => {
        try {
            setIsLoading(true);
            const response = await getSports();
            if (response.status !== 200) {
                console.log(response);
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
            setTeams(response.teams);
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
        <SportContext.Provider value={{ isLoading, fetchSports, sports, setSports, selectedSport, setSelectedSport }}>
            {children}
        </SportContext.Provider>
    );
};
