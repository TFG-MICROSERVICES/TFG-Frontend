import { NavLink } from "react-router-dom";

export const MenuItem = ({text, clase, to}) =>{

    return(
        <NavLink 
            to={to}
            className={({ isActive }) => 
                `block p-4 text-gray-600 hover:bg-gray-100 ${isActive ? 'bg-blue-100' : ''} ${clase}`
            }
        >
            {text}
        </NavLink>
    )
}