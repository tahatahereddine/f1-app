import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '../Components/Pagination/Pagination';
import MiniCardConstructor from '../Components/MiniCardConstructor';

const Constructors = () => {
    const [searchParams] = useSearchParams();
    const [constructors, setConstructors] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Zero-based index
    const [pageCount, setPageCount] = useState(1);
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
                case 'most-points':
                    setSortBy('total_points');
                    break;
                default:
                    setSortBy('total_race_wins');
            }
            setSortOrder('desc');
        }
    }, [searchParams]);

    useEffect(() => {
        fetchCountries();
        fetchConstructors(currentPage + 1); // Convert to one-based index for API
    }, [currentPage, search, sortBy, sortOrder]);

    const navigate = useNavigate();

    const handleClick = (constructor) => {
        navigate(`/constructor-info/${constructor.id}`);
    };

    const fetchCountries = async () => {
        try {
            const response = await fetch(`http://localhost:8000/country`);
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

    const fetchConstructors = async (page) => {
        try {
            const response = await fetch(
                `http://localhost:8000/constructors?page=${page}&search=${search}&sort_by=${sortBy}&sort_order=${sortOrder}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const enrichedConstructors = data.data.map((constructor) => ({
                ...constructor,
                alpha2Code: countries[constructor.country_id] || null,
            }));

            setConstructors(enrichedConstructors);
            setPageCount(Math.max(data.last_page, 1)); // Ensure pageCount is at least 1
        } catch (error) {
            console.error('Error fetching constructors:', error);
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // `selected` is zero-based
    };

    return (
        <div style={{ backgroundColor: '#f5f5f5', color: '#333', minHeight: '100vh', padding: '20px', textAlign: 'center' }}>
            <h1 style={{ color: '#cc0000', marginBottom: '20px' }}>Constructors</h1>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search constructors..."
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
            <div className="constructor-list" style={{ margin: '0 auto', width: '80%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {constructors.map((constructor) => (
                    <MiniCardConstructor
                        key={constructor.id}
                        constructor={constructor}
                        handleClick={handleClick}
                        alpha2Code={countries[constructor.country_id]}
                    />
                ))}
            </div>
            {pageCount > 1 && ( // Only render if there are multiple pages
                <Pagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    handlePageClick={handlePageChange}
                    style={{ marginTop: '20px' }}
                />
            )}
        </div>
    );
};

export default Constructors;