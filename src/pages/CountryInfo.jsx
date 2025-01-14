import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactCountryFlag from 'react-country-flag';

const CountryInfo = () => {
    const { countryId } = useParams(); // Extract countryId from the URL
    const [country, setCountry] = useState(null);

    useEffect(() => {
        console.log('Country ID:', countryId); // Debug: Log the countryId
        if (countryId) {
            fetchCountry();
        }
    }, [countryId]);

    const fetchCountry = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/country-stats/${countryId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('API Response:', data); // Debug: Log the API response

            // Extract the first object from the array
            if (Array.isArray(data) && data.length > 0) {
                setCountry(data[0]); // Use the first object in the array
            } else {
                console.error('Unexpected API response format:', data);
                setCountry(null); // Handle unexpected response
            }
        } catch (error) {
            console.error('Error fetching country:', error);
        }
    };

    if (!country) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ backgroundColor: '#f5f5f5', color: '#333', minHeight: '100vh', padding: '20px', textAlign: 'center' }}>
            <h1 style={{ color: '#cc0000', marginBottom: '0px' }}>{country.country_name}</h1>
            <ReactCountryFlag
                countryCode={country.alpha2_code}
                style={{
                    fontSize: '11em', // Adjust the size of the flag
                    marginBottom: '20px',
                }}
                svg // Use SVG flags for better quality
            />
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns
                gap: '20px', // Space between grid items
                maxWidth: '800px', // Limit the width of the grid
                margin: '0 auto', // Center the grid
            }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '16px' }}>
                    <h3>🏎️ Drivers</h3>
                    <p>{country.driver_count || 0}</p>
                </div>
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '16px' }}>
                    <h3>🏆 Points</h3>
                    <p>{country.total_points || 0}</p>
                </div>
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '16px' }}>
                    <h3>🥇 Wins</h3>
                    <p>{country.total_race_wins || 0}</p>
                </div>
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '16px' }}>
                    <h3>🎉 Podiums</h3>
                    <p>{country.total_podiums || 0}</p>
                </div>
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '16px' }}>
                    <h3>🚩 Poles</h3>
                    <p>{country.total_pole_positions || 0}</p>
                </div>
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '16px' }}>
                    <h3>⏱️ Fastest Laps</h3>
                    <p>{country.total_fastest_laps || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default CountryInfo;