import { useContext, useState, useEffect } from 'react';
import { LoginContext } from '../context/LoginContext';
import { TabMenu } from '../components/ui/TabMenu';
import { Users } from './Users';
import { useNavigate } from 'react-router-dom';
const tabs = [
    {
        name: 'Usuarios',
    },
];

export const Admin = () => {
    const [currentTab, setCurrentTab] = useState('Usuarios');
    const { login } = useContext(LoginContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (login && !login?.admin) {
            navigate('/');
        }
    }, [login]);

    return (
        <>
            <TabMenu tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
            {currentTab === 'Usuarios' && <Users />}
        </>
    );
};
