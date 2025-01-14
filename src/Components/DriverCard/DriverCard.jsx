import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './DriverCard.css';
import ReactCountryFlag from 'react-country-flag';

function DriverCard(props) {
    const { driver } = props;
    const [countryCode, setCountryCode] = useState('');
    const [countryName, setCountryName] = useState('');

    useEffect(() => {
        async function fetchCountryCode() {
            try {
                const response = await fetch(`http://localhost:8000/api/country/${driver.nationality_country_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch country data');
                }
                const data = await response.json();
                setCountryCode(data.alpha2_code || '');
                setCountryName(data.name || '');
                console.log('Country data:', data);
            } catch (error) {
                console.error('Error fetching country code:', error);
                setCountryCode(''); 
            }
        }

        if (driver.nationality_country_id) {
            fetchCountryCode();
        }
    }, [driver.nationality_country_id]);

    const [constructorName, setConstructorName] = useState('');
    const [constructorId, setConstructorId] = useState('');

    useEffect(() => {
        async function fetchConstructorData() {
            try {
                const response = await fetch(`http://localhost:8000/api/drivers/${driver.id}/latest-season`);
                if (!response.ok) {
                    throw new Error('Failed to fetch constructor data');
                }
                const data = await response.json();
                setConstructorName(data.constructor_full_name || 'Unknown');
                setConstructorId(data.constructor_id || '');
                console.log('Constructor data:', data);
            } catch (error) {
                console.error('Error fetching constructor data:', error);
                setConstructorName('Unknown');
            }
        }

        if (driver.id) {
            fetchConstructorData();
        }
    }, [driver.id]);

    return (
        <div className="driver-card">
            <div className="driver-image">
                <img src={`/images/drivers/${driver.id}.webp`} 
                    alt={driver.full_name} 
                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/drivers/none.webp'; }} 
                />
            </div>
            <div className="driver-info">
                <h2>
                    <ReactCountryFlag countryCode={countryCode} style={{ fontSize: "2.5rem" }} /> {driver.full_name}
                </h2>
                <h3>#{driver.permanent_number || '11'}</h3>
                <div className="driver-stats">
                    <span><strong>🏁 Starts:</strong> <span className="highlight">{driver.total_race_starts}</span></span>
                    <span><strong>🏆 Championships:</strong> <span className="highlight">{driver.total_championship_wins}</span></span>
                    <span><strong>🎉 Podiums:</strong> <span className="highlight">{driver.total_podiums}</span></span>
                    <span><strong>🥇 Wins:</strong> <span className="highlight">{driver.total_race_wins}</span></span>
                    <span><strong>⏱️ Fastest Laps:</strong> <span className="highlight">{driver.total_fastest_laps}</span></span>
                    <span><strong>🚩 Poles:</strong> <span className="highlight">{driver.total_pole_positions}</span></span>
                </div>
                <hr />
                <div className="driver-extra">
                    <p>
                        <strong>Latest Team:</strong> <br />
                        <span className="highlight">
                            <Link to={`/constructor-info/${constructorId}`} className="country-link">
                                {constructorName}
                            </Link>
                        </span>
                    </p>
                    <p>
                        <strong>Country:</strong> <br />
                        <span className="highlight">
                            <ReactCountryFlag countryCode={countryCode} /> {' '}
                            <Link to={`/country-info/${driver.country_of_birth_country_id}`} className="country-link">
                                {countryName || driver.country_of_birth_country_id}
                            </Link>, {driver.continent_name}
                        </span>
                    </p>
                    <p>
                        <strong>Date of Birth:</strong> <br />
                        <span className="highlight">{driver.date_of_birth} {driver.date_of_death ? `- ${driver.date_of_death}` : ''}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DriverCard;
