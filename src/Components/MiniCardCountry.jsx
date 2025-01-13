import React from 'react';
import ReactCountryFlag from 'react-country-flag';

const MiniCardCountry = ({ country, handleClick }) => {
    return (
        <div
            onClick={() => handleClick(country)}
            style={{
                backgroundColor: '#fff',
                width: '250px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                ':hover': {
                    transform: 'scale(1.05)',
                },
            }}
        >
            <ReactCountryFlag
                countryCode={country.alpha2_code}
                style={{
                    fontSize: '5em', // Adjust the size of the flag
                    marginBottom: '10px',
                }}
                svg // Use SVG flags for better quality
            />
            <h3>{country.country_name}</h3>
            <p>Drivers: {country.driver_count}</p>
            <p>Points: {country.total_points}</p>
            <p>Wins: {country.total_race_wins}</p>
            <p>Podiums: {country.total_podiums}</p>
            <p>Poles: {country.total_pole_positions}</p>
            <p>Fastest Laps: {country.total_fastest_laps}</p>
        </div>
    );
};

export default MiniCardCountry;