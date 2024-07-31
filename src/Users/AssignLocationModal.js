// src/AssignLocationModal.js
import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseConfig';
import axios from 'axios';

const AssignLocationModal = ({ user, onClose }) => {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    setLoading(true);
    try {
      const apiKey = '6def01c8540049198ba67faf164e3e00'; 
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`
      );
      const { lat, lng } = response.data.results[0].geometry;

      const userDoc = doc(db, 'users', user.id);
      await updateDoc(userDoc, { location, latitude: lat, longitude: lng });

      onClose();
    } catch (error) {
      console.error('Error assigning location:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Assign Location</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <button onClick={handleAssign} disabled={loading}>
          {loading ? 'Assigning...' : 'Assign'}
        </button>
        <button onClick={onClose} disabled={loading}>Close</button>
      </div>
    </div>
  );
};

export default AssignLocationModal;
