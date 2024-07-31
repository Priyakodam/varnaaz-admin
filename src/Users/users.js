// src/UserTable.js
import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/FirebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import AssignLocationModal from './AssignLocationModal';
import "./users.css";
import AdminDashboard from '../Dashboard/AdminDashboard';

const UserTable = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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
      const user = users.find(user => user.id === userId);
      let updateData = { status: newStatus };


      if (newStatus === "Verified") {
        const formattedName = user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase();
        const newPassword = `${formattedName.replace(/\s+/g, '')}@123`;
        updateData.password = newPassword;

       
        const emailPayload = {
          pdf_url: "https://firebasestorage.googleapis.com/v0/b/crm2-991af.appspot.com/o/pdfs%2Fsale_0JFqYoRXbNSBsu77t1Hx.pdf?alt=media&token=35c6e266-9d4e-482e-a4ed-cc5d1a8ad876",
          to_email: [user.email],
          subject: "Your Account Details",
          message: `Your account has been verified. Your login details are:\n\nEmail: ${user.email}\nPassword: ${newPassword}`
        };

        await fetch('https://kodamharish.pythonanywhere.com/send_pdf_email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailPayload)
        });
      }

      await updateDoc(userDoc, updateData);

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, ...updateData } : user
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAssignClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  return (
    <div className='users-container'>
  <div className={`users-content ${collapsed ? 'collapsed' : ''}`}>
      <AdminDashboard onToggleSidebar={setCollapsed} />
      <h1 style={{ textAlign: "center" }}>Users</h1>
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
              <th>Password</th>
              <th>Action</th>
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
                <td>{user.password || 'NA'}</td>
                <td>
                  <button onClick={() => handleAssignClick(user)}>Assign</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedUser && (
        <AssignLocationModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </div>
    </div>
  );
};

export default UserTable;
