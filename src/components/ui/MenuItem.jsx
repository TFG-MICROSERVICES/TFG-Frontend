import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
export const MenuItem = ({ text, to, icon, className }) => {
    return (
        <Link to={to} className={`flex gap-2 hover:bg-gray-100 p-2 rounded ${className}`}>
            <Icon width={20} height={20} icon={icon} />
            <span>{text}</span>
        </Link>
    );
};
