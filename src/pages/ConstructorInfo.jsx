import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactCountryFlag from 'react-country-flag';
import { Link } from 'react-router-dom';

function ConstructorInfo() {
    const { id } = useParams();
    const [constructor, setConstructor] = useState(null);
    const [alpha2Code, setAlpha2Code] = useState(null);
    const [countryName, setCountryName] = useState(null);
    const [countryId, setCountryId] = useState(null);


    useEffect(() => {
        fetchConstructor();
    }, []);

    const fetchConstructor = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/constructors/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setConstructor(data);
            fetchCountryCode(data.country_id);
        } catch (error) {
            console.error('Error fetching constructor:', error);
        }
    };

    const fetchCountryCode = async (countryId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/country/${countryId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAlpha2Code(data.alpha2_code);
            setCountryName(data.name);
            setCountryId(data.id);
        } catch (error) {
            console.error('Error fetching country code:', error);
        }
    };

    return (
        <div>
            <h1 style={{ marginLeft: "10%", color: 'red', borderBottom: '2px solid red', paddingBottom: '5px', width: '80%' }}>
                Constructor Information
            </h1>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                {constructor ? (
                    <div
                        style={{
                            width: '1000px',
                            padding: '20px',
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center',
                            backgroundColor: '#f9f9f9',
                        }}
                    >
                        <img
                            src={`/images/constructors/${constructor.id}.webp`}
                            alt={constructor.full_name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/constructors/none.jpg';
                            }}
                            style={{
                                width: '200px',
                                objectFit: 'contain',
                                marginBottom: '20px',
                            }}
                        />
                        <h2 style={{ fontSize: '2em', color: '#222', marginBottom: '20px' }}>{constructor.full_name} <ReactCountryFlag countryCode={alpha2Code} style={{ fontSize: '2rem'  }} /></h2>
                        <hr style={{ margin: '20px 0', border: 'none', borderTop: '2px solid #ccc' }} />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', backgroundColor: '#333333', color: '#fff', padding: '20px', borderRadius: '10px' }}>
                            <p><strong style={{ color: '#FF6969' }}>Country:</strong> {' '}
                            <Link to={`/country-info/${countryId}`} style={{color: "white"}}>{countryName}</Link> {''}
                                {alpha2Code && <ReactCountryFlag countryCode={alpha2Code} style={{ fontSize: '1.5rem'  }} />}</p>
                            <p><strong style={{ color: '#FF6969' }}>Best Championship Position:</strong> {constructor.best_championship_position}</p>
                            <p><strong style={{ color: '#FF6969' }}>Best Starting Grid Position:</strong> {constructor.best_starting_grid_position}</p>
                            <p><strong style={{ color: '#FF6969' }}>Best Race Result 🏎:</strong> {constructor.best_race_result}</p>
                            <p><strong style={{ color: '#FF6969' }}>Total Championships 🏆:</strong> {constructor.total_championship_wins}</p>
                            <p><strong style={{ color: '#FF6969' }}>Total Race Entries:</strong> {constructor.total_race_entries}</p>
                            <p><strong style={{ color: '#FF6969' }}>Total Race Starts 🏁:</strong> {constructor.total_race_starts} </p>
                            <p><strong style={{ color: '#FF6969' }}>Total Race Wins 🥇:</strong> {constructor.total_race_wins}</p>
                            <p><strong style={{ color: '#FF6969' }}>Total 1-2 Finishes 🥇🥈:</strong> {constructor.total_1_and_2_finishes}</p>
                            <p><strong style={{ color: '#FF6969' }}>Total Race Laps:</strong> {constructor.total_race_laps}</p>
                            <p><strong style={{ color: '#FF6969' }}>Total Podiums 🎖️:</strong> {constructor.total_podiums} </p>
                            <p><strong style={{ color: '#FF6969' }}>Total Points:</strong> {constructor.total_points}</p>
                            <p><strong style={{ color: '#FF6969' }}>Total Fastest Laps 🏎️ 💨:</strong> {constructor.total_fastest_laps}</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading constructor information...</p>
                )}
            </div>
        </div>
    );
}

export default ConstructorInfo;
