import React from 'react';
import ReactCountryFlag from 'react-country-flag';

const MiniDriverCard = ({ driver, alpha2code }) => {
    const image = `/images/drivers/${driver.id}.webp`;
    const fallbackImage = `/images/drivers/none.webp`;

    return (
        <div
            className="mini-driver-card"
            style={{
                cursor: 'pointer',
                width: '250px',
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '10px',
                margin: '15px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
                color: '#333',
                textAlign: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
            <img
                src={image}
                alt={driver.name}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                }}
                style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #ccc',
                    marginBottom: '10px',
                }}
            />
            <h2 style={{ fontSize: '1.4em', margin: '10px 0', color: '#cc0000' }}>
                {driver.name}
            </h2>
            <p style={{ margin: '5px 0' }}>
                <strong>Nationality:</strong> {driver.nationality_country_id}{' '}
                <ReactCountryFlag 
                    countryCode={alpha2code}
                    style={{
                        width: '1.5em',
                        height: '1.5em',
                    }}
                />
                
            </p>
            <p style={{ margin: '5px 0' }}><strong>Race Wins 🏅:</strong> {driver.total_race_wins}</p>
        </div>
    );
};

export default MiniDriverCard;
