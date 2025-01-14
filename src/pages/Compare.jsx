import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import MiniCardDriver from '../Components/MiniCardDriver';
import MiniCardConstructor from '../Components/MiniCardConstructor';
import './Compare.css';

const Compare = () => {
    const [comparisonType, setComparisonType] = useState('driver');
    const [search1, setSearch1] = useState('');
    const [search2, setSearch2] = useState('');
    const [options1, setOptions1] = useState([]);
    const [options2, setOptions2] = useState([]);
    const [selected1, setSelected1] = useState(null);
    const [selected2, setSelected2] = useState(null);
    const [comparisonData, setComparisonData] = useState(null);
    const [countries, setCountries] = useState({});
    
    useEffect(() => {
            fetchCountries();
        }, []);

    const debouncedSearch = debounce(async (query, setOptions) => {
        if (!query || query.length < 2) {
            setOptions([]);
            return;
        }

        try {
            const endpoint = comparisonType === 'driver' ? 'drivers' : 'constructors';
            const response = await fetch(
                `http://localhost:8000/api/${endpoint}?search=${encodeURIComponent(query)}&page=1`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setOptions(data.data || []);
        } catch (error) {
            console.error('Search error:', error);
            setOptions([]);
        }
    }, 300);

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

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, []);

    const handleSearch1Change = (e) => {
        const value = e.target.value;
        setSearch1(value);
        debouncedSearch(value, setOptions1);
    };

    const handleSearch2Change = (e) => {
        const value = e.target.value;
        setSearch2(value);
        debouncedSearch(value, setOptions2);
    };

    const handleSelect1 = (item) => {
        setSelected1(item);
        setSearch1(item.name);
        setOptions1([]);
    };

    const handleSelect2 = (item) => {
        setSelected2(item);
        setSearch2(item.name);
        setOptions2([]);
    };

    const clearSelection1 = () => {
        setSelected1(null);
        setSearch1('');
        setComparisonData(null);
    };

    const clearSelection2 = () => {
        setSelected2(null);
        setSearch2('');
        setComparisonData(null);
    };

    const handleCompare = () => {
        if (!selected1 || !selected2) return;

        const compareData = {
            labels: [],
            values1: [],
            values2: []
        };

        const statsToCompare = {
            'Total Wins 🥇': 'total_race_wins',
            'Championships 🏆': 'total_championship_wins',
            'Podiums 🎉': 'total_podiums',
            'Pole Positions 🚩': 'total_pole_positions',
            'Fastest Laps ⏱️': 'total_fastest_laps',
            'Points': 'total_points'
        };

        Object.entries(statsToCompare).forEach(([label, key]) => {
            compareData.labels.push(label);
            const value1 = parseFloat(selected1[key]) || 0;
            const value2 = parseFloat(selected2[key]) || 0;
            compareData.values1.push(value1);
            compareData.values2.push(value2);
        });

        setComparisonData(compareData);
    };

    const renderComparisonChart = () => {
        if (!comparisonData) return null;
    
        return (
            <div className="comparison-chart">
                {comparisonData.labels.map((label, index) => {
                    const value1 = comparisonData.values1[index];
                    const value2 = comparisonData.values2[index];
                    const maxValue = Math.max(value1, value2);
    
                    return (
                        <div key={label} className="stat-comparison">
                            <h3>{label}</h3>
                            <div className="stat-bars">
                                {/* Left-side bar (grows to the left) */}
                                <div className="stat-bar left">
                                    <div className="bar-container">
                                        <div
                                            className="bar bar1"
                                            style={{
                                                width: `${(value1 / maxValue) * 100}%`,
                                                backgroundColor: value1 >= value2 ? '#4caf50' : '#333',
                                                color: '#fff',
                                                textAlign: 'center',
                                                padding: '5px',
                                                marginLeft: 'auto',
                                            }}
                                        >
                                            {value1}
                                        </div>
                                    </div>
                                    <span>{selected1?.name}</span>
                                </div>
    
                                <div className="stat-bar right">
                                    <div className="bar-container">
                                        <div
                                            className="bar bar2"
                                            style={{
                                                width: `${(value2 / maxValue) * 100}%`,
                                                backgroundColor: value2 > value1 ? '#4caf50' : '#333',
                                                color: '#fff',
                                                textAlign: 'center',
                                                padding: '5px',
                                            }}
                                        >
                                            {value2}
                                        </div>
                                    </div>
                                    <span>{selected2?.name}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="comparison-container">
            <h1 className="comparison-header">Compare {comparisonType === 'driver' ? 'Drivers' : 'Constructors'}</h1>
            <select
                value={comparisonType}
                onChange={(e) => {
                    setComparisonType(e.target.value);
                    setSelected1(null);
                    setSelected2(null);
                    setComparisonData(null);
                }}
                className="comparison-select"
            >
                <option value="driver">Drivers</option>
                <option value="constructor">Constructors</option>
            </select>
            <div className="comparison-row">
                <div className="comparison-column">
                    {selected1 ? (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {comparisonType === 'driver' ? (
                                    <MiniCardDriver driver={selected1} alpha2code={countries[selected1.nationality_country_id]} />
                                ) : (
                                    <MiniCardConstructor constructor={selected1} alpha2Code={countries[selected1.country_id]} />
                                )}
                                <button onClick={clearSelection1} className="clear-button">Clear</button>
                            </div>
                        </>
                    ) : (
                        <div>
                            <input
                                type="text"
                                placeholder={`Search ${comparisonType} 1...`}
                                value={search1}
                                onChange={handleSearch1Change}
                                className="comparison-input"
                            />
                            <ul className="comparison-list">
                                {options1.map((option) => (
                                    <li
                                        key={option.id}
                                        onClick={() => handleSelect1(option)}
                                        className="comparison-list-item"
                                    >
                                        {option.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="comparison-column">
                    {selected2 ? (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {comparisonType === 'driver' ? (
                                    <MiniCardDriver driver={selected2} alpha2code={countries[selected2.nationality_country_id]} />
                                ) : (
                                    <MiniCardConstructor constructor={selected2} alpha2Code={countries[selected2.country_id]} />
                                )}
                                <button onClick={clearSelection2} className="clear-button">Clear</button>
                            </div>
                        </>
                    ) : (
                        <div>
                            <input
                                type="text"
                                placeholder={`Search ${comparisonType} 2...`}
                                value={search2}
                                onChange={handleSearch2Change}
                                className="comparison-input"
                            />
                            <ul className="comparison-list">
                                {options2.map((option) => (
                                    <li
                                        key={option.id}
                                        onClick={() => handleSelect2(option)}
                                        className="comparison-list-item"
                                    >
                                        {option.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <button
                onClick={handleCompare}
                disabled={!selected1 || !selected2}
                className="compare-button"
            >
                Compare
            </button>
            {renderComparisonChart()}
        </div>
    );
};

export default Compare;
