import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import '../styles/pages/landing.css';
import logoImg from '../img/logo.svg';
import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div id="page-landing">
            <div className="content-wrapper">
                <img src={logoImg} alt="" />

                <main>
                    <h1>Bring happiness to the world</h1>
                    <p>Visit orphanages and change many children's day.</p>
                </main>

                <div className="location">
                    <strong>São Bernardo do Campo</strong>
                    <span>São Paulo</span>
                </div>

                <Link to="/map" className="enter-app">
                    <FiArrowRight size={26} color="rgba(0,0,0,.6)" />
                </Link>
            </div>
        </div>
    );
}