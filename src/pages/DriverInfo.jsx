import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DriverCard from '../Components/DriverCard/DriverCard';

function DriverInfo() {
    const { id } = useParams();
    const [driver, setDriver] = useState(null); // Use a single object instead of an array.

    useEffect(() => {
        fetchDriver();
    }, []);

    const fetchDriver = async () => {
        try {
            const response = await fetch(`http://localhost:8000/drivers/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDriver(data); // Assuming `data.data` is the driver object.
        } catch (error) {
            console.error('Error fetching driver:', error);
        }
    };

    return (
        <div >
            <h1 style={{marginLeft:"10%", color: 'red', borderBottom: '2px solid red', paddingBottom: '5px', width: '80%'}}>
                Driver Information
            </h1>
            <div>
                {driver ? (
                    <DriverCard driver={driver} />
                ) : (
                    <p>Loading driver information...</p>
                )}
            </div>
        </div>
    );
}

export default DriverInfo;
