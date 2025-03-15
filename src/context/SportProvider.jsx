import { useContext, useEffect, useState } from 'react';
import { SportContext } from './SportContext';
import { getSports } from '../api/request/get/sports/getSports';
import { LoginContext } from './LoginContext';

export const SportProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [sports, setSports] = useState([]);
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
        } catch (error) {
            console.log(error);
            setSports([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (login) {
            fetchSports();
        }
    }, [login]);

    return <SportContext.Provider value={{ isLoading, fetchSports, sports, setSports }}>{children}</SportContext.Provider>;
};
