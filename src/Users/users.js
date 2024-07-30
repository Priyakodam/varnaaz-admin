// src/UserTable.js
import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/FirebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import "./users.css" ;

const UserTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, { status: newStatus });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
    <h1 style={{textAlign:"center",}}> Users</h1>
    <div className='table-container'>
      <table className="styled-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Role</th>
            <th>Project Assigned</th>
            <th>Email</th>
            <th>Phone Number</th>
            
            <th>Status</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.projectAssigned}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>
                <select
                  value={user.status}
                  onChange={(e) => handleStatusChange(user.id, e.target.value)}
                >
                  <option value="Not Verified">Not Verified</option>
                  <option value="Verified">Verified</option>
                </select>
              </td>
              <td>{user.latitude},{user.longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default UserTable;
