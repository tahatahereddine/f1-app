import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '../Components/Pagination/Pagination';
import MiniCardDriver from '../Components/MiniCardDriver';

const Drivers = () => {
    const [searchParams] = useSearchParams();
    const [drivers, setDrivers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Zero-based index
    const [lastPage, setLastPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('total_race_wins');
    const [sortOrder, setSortOrder] = useState('desc');
    const [countries, setCountries] = useState({});

    useEffect(() => {
        const filter = searchParams.get('filter');
        if (filter) {
            switch (filter) {
                case 'most-wins':
                    setSortBy('total_race_wins');
                    break;
                case 'most-championships':
                    setSortBy('total_championship_wins');
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
                    setSortBy('total_race_wins');
            }
            setSortOrder('desc');
        }
    }, [searchParams]);

    useEffect(() => {
        fetchCountries();
        fetchDrivers(currentPage + 1); // Convert to one-based index for API
    }, [currentPage, search, sortBy, sortOrder]);

    const navigate = useNavigate();

    const handleClick = (driver) => {
        navigate(`/driver-info/${driver.id}`);
    };

    const fetchDrivers = async (page) => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/drivers?page=${page}&search=${search}&sort_by=${sortBy}&sort_order=${sortOrder}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDrivers(data.data);
            setLastPage(Math.max(data.last_page, 1)); // Ensure lastPage is at least 1
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/country`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const countryMap = data.reduce((acc, country) => {
                acc[country.id] = country.alpha2_code;
                return acc;
            }, {});
            setCountries(countryMap);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // `selected` is zero-based
    };

    return (
        <div style={{ backgroundColor: '#f5f5f5', color: '#333', minHeight: '100vh', padding: '20px', textAlign: 'center' }}>
            <h1 style={{ color: '#cc0000', marginBottom: '20px' }}>Drivers</h1>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search drivers..."
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
                    <option value="total_race_wins">Race Wins</option>
                    <option value="total_podiums">Podiums</option>
                    <option value="total_championship_wins">Championships</option>
                    <option value="total_pole_positions">Pole Positions</option>
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
            <div className="driver-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                {drivers.map((driver) => (
                    <div key={driver.id} onClick={() => handleClick(driver)}>
                        <MiniCardDriver driver={driver} alpha2code={countries[driver.nationality_country_id]} />
                    </div>
                ))}
            </div>
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

export default Drivers;