import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactCountryFlag from 'react-country-flag';

const Standing = () => {
    const [standings, setStandings] = useState([]);
    const [year, setYear] = useState(2024);
    const [category, setCategory] = useState('driver');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStandings();
    }, [year, category]);

    const fetchStandings = async () => {
        try {
            const response = await fetch(`http://localhost:8000/standings/${category}/${year}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setStandings(data);
        } catch (error) {
            console.error('Error fetching standings:', error);
        }
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    return (
        <div style={{ backgroundColor: '#36454F', color: '#fff', minHeight: '100vh', padding: '20px', textAlign: 'center' }}>
            <h1 style={{ color: '#ff0000', marginBottom: '20px' }}>Standings</h1>
            <div style={{ marginBottom: '20px' }}>
                <label style={{ marginRight: '10px' }}>
                    Year:
                    <select
                        value={year}
                        onChange={handleYearChange}
                        style={{ marginLeft: '5px', padding: '8px', borderRadius: '5px', border: '1px solid #ff0000', backgroundColor: '#1a1a1a', color: '#fff' }}
                    >
                        {Array.from({ length: 2024 - 1950 + 1 }, (_, i) => 1950 + i).map((yr) => (
                            <option key={yr} value={yr}>
                                {yr}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Category:
                    <select
                        value={category}
                        onChange={handleCategoryChange}
                        style={{ marginLeft: '5px', padding: '8px', borderRadius: '5px', border: '1px solid #ff0000', backgroundColor: '#1a1a1a', color: '#fff' }}
                    >
                        <option value="driver">Driver</option>
                        <option value="constructor">Constructor</option>
                    </select>
                </label>
            </div>
            <table style={{ width: '80%', margin: '0 auto', borderCollapse: 'collapse', textAlign: 'center', backgroundColor: '#1a1a1a', color: '#fff' }}>
                <thead>
                    <tr style={{ backgroundColor: '#ff0000' }}>
                        <th style={{ padding: '10px', border: '1px solid #000' }}>Position</th>
                        <th style={{ padding: '10px', border: '1px solid #000' }}>Name</th>
                        <th style={{ padding: '10px', border: '1px solid #000' }}>Points</th>
                        {category === 'driver' && <th style={{ padding: '10px', border: '1px solid #000' }}>Constructor</th>}
                    </tr>
                </thead>
                <tbody>
                    {standings.map((item, index) => (
                        <tr
                            key={item.position_number}
                            style={{
                                backgroundColor: index === 0 ? '#FFD700' : index % 2 === 0 ? '#fff' : '#d2d2d2',
                                color: index === 0 ? '#000' : '#000',
                            }}
                        >
                            <td style={{ padding: '10px', border: '1px solid #ff0000' }}>
                                {item.position_number} {index === 0 && '🏆'}
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ff0000' }}>
                                {category === 'driver' ? (
                                    <span
                                        style={{ cursor: 'pointer', color: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                        onClick={() => navigate(`/driver-info/${item.driver_id}`)}
                                    >
                                        <ReactCountryFlag countryCode={item.alpha2_code} style={{ fontSize: '1.5rem' }} /> {item.driver_name}
                                    </span>
                                ) : (
                                    <span
                                        style={{ cursor: 'pointer', color: '#ff0000' }}
                                        onClick={() => navigate(`/constructor-info/${item.constructor_id}`)}
                                    >
                                        {item.constructor_name}
                                    </span>
                                )}
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ff0000' }}>{item.points}</td>
                            {category === 'driver' && (
                                <td>
                                    <span
                                        style={{ cursor: 'pointer', color: '#ff0000' }}
                                        onClick={() => navigate(`/constructor-info/${item.constructor_id}`)}
                                    >
                                        {item.constructor_name}
                                    </span>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Standing;
