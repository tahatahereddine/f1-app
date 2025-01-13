import ReactCountryFlag from 'react-country-flag';


const MiniCardConstructor = ({ constructor, handleClick, alpha2Code }) => (
    <div
        onClick={() => handleClick(constructor)}
        style={{
            cursor: 'pointer',
            padding: '15px',
            border: '1px solid #ccc',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
            transition: 'transform 0.3s, box-shadow 0.3s',
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
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
                height: '150px',
                borderRadius: '10px',
                objectFit: 'cover',
                marginBottom: '15px',
            }}
        />
        <div>
            <h2 style={{ margin: '0', color: '#cc0000', fontSize: '1.5em' }}>{constructor.full_name}</h2>
            <p style={{ margin: '5px 0' }}><strong>Country:</strong> {alpha2Code && <ReactCountryFlag countryCode={alpha2Code} style={{ fontSize: '1.5rem' }} />}</p>
            <p style={{ margin: '5px 0' }}><strong>Race Wins 🏅:</strong> {constructor.total_race_wins}</p>
            <p style={{ margin: '5px 0' }}><strong>Podiums 🏆:</strong> {constructor.total_podiums}</p>
        </div>
    </div>
);
export default MiniCardConstructor;