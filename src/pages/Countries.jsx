import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '../Components/Pagination/Pagination';
import MiniCardCountry from '../Components/MiniCardCountry';

const Countries = () => {
    const [searchParams] = useSearchParams();
    const [countries, setCountries] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Zero-based index
    const [lastPage, setLastPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('total_points');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        const filter = searchParams.get('filter');
        if (filter) {
            switch (filter) {
                case 'most-points':
                    setSortBy('total_points');
                    break;
                case 'most-wins':
                    setSortBy('total_race_wins');
                    break;
                case 'most-podiums':
                    setSortBy('total_podiums');
                    break;
                case 'most-poles':
                    setSortBy('total_pole_positions');
                    break;
                case 'most-fastest-laps':
                    setSortBy('total_fastest_laps');
                    break;
                default:
                    setSortBy('total_points');
            }
            setSortOrder('desc');
        }
    }, [searchParams]);

    useEffect(() => {
        fetchCountries(currentPage + 1); 
    }, [currentPage, search, sortBy, sortOrder]);

    const navigate = useNavigate();

    const handleClick = (country) => {
        navigate(`/country-info/${country.nationality_country_id}`);
    };

    const fetchCountries = async (page) => {
        try {
            const response = await fetch(
                `http://localhost:8000/country-stats?page=${page}&search=${search}&sort_by=${sortBy}&sort_order=${sortOrder}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCountries(data.data || []); // Fallback to an empty array if data.data is undefined
            setLastPage(Math.max(data.last_page || 1, 1)); // Ensure lastPage is at least 1
            console.log('Countries fetched:', data);
        } catch (error) {
            console.error('Error fetching countries:', error);
            setCountries([]); // Set countries to an empty array on error
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // `selected` is zero-based
    };

    return (
        <div style={{ backgroundColor: '#f5f5f5', color: '#333', minHeight: '100vh', padding: '20px', textAlign: 'center' }}>
            <h1 style={{ color: '#cc0000', marginBottom: '20px' }}>Countries</h1>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search countries..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        width: '200px',
                        marginRight: '10px',
                    }}
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        marginRight: '10px',
                    }}
                >
                    <option value="total_points">Points</option>
                    <option value="total_race_wins">Wins</option>
                    <option value="total_podiums">Podiums</option>
                    <option value="total_pole_positions">Poles</option>
                    <option value="total_fastest_laps">Fastest Laps</option>
                </select>
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>
            {countries.length > 0 ? ( // Only render if countries array is not empty
                <div className="country-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                    {countries.map((country) => (
                        <MiniCardCountry
                            key={country.nationality_country_id}
                            country={country}
                            handleClick={handleClick}
                        />
                    ))}
                </div>
            ) : (
                <p>No countries found.</p> // Display a message if no countries are found
            )}
            {lastPage > 1 && ( // Only render if there are multiple pages
                <Pagination
                    pageCount={lastPage}
                    handlePageClick={handlePageChange}
                    currentPage={currentPage}
                />
            )}
        </div>
    );
};

export default Countries;