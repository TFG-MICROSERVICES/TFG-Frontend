import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Home = () =>{
    const navigate = useNavigate();
    return(
        <>
            <h1>HOME</h1>
            <Link to="/register">Register</Link>
            <Link to="/sport">sport</Link>
        </>     
    )
}