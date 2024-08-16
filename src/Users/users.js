// src/UserTable.js
import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/FirebaseConfig';
import { collection, getDocs, updateDoc, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import AssignLocationModal from './AssignLocationModal';
import "./users.css";
import AdminDashboard from '../Dashboard/AdminDashboard';
import { Button, Form, Col, Row, Pagination } from "react-bootstrap";
import ModalForm from './AddRoleForm';

const UserTable = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

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
      const oldUserDocRef = doc(db, 'users', userId);
      const oldUserSnapshot = await getDoc(oldUserDocRef);
      if (!oldUserSnapshot.exists()) {
        throw new Error("User document not found");
      }
  
      const user = oldUserSnapshot.data();
      let updateData = { status: newStatus };
  
      if (newStatus === "Verified") {
        const formattedName = user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase();
        const newPassword = `${formattedName.replace(/\s+/g, '')}@123`;
        updateData = { ...updateData, password: newPassword, employeeUid: '' }; // Initialize employeeUid as an empty string
  
        const emailPayload = {
          pdf_url: "https://firebasestorage.googleapis.com/v0/b/crm2-991af.appspot.com/o/pdfs%2Fsale_0JFqYoRXbNSBsu77t1Hx.pdf?alt=media&token=35c6e266-9d4e-482e-a4ed-cc5d1a8ad876",
          to_email: [user.email],
          subject: "Your Account Details",
          message: `Your account has been verified. Your login credentials are:\n\nEmail: ${user.email}\nPassword: ${newPassword}`
        };
  
        await fetch('https://kodamharish.pythonanywhere.com/send_pdf_email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailPayload)
        });
  
        // Create or update user in Firebase Authentication
        const auth = getAuth();
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, user.email, newPassword);
          const userUid = userCredential.user.uid; // Get the UID from the created user
  
          // Update the document with the UID as the ID and add employeeUid
          const newUserDocRef = doc(db, 'users', userUid);
          await setDoc(newUserDocRef, { ...user, ...updateData, employeeUid: userUid });
  
          // Delete the old user document
          await deleteDoc(oldUserDocRef);
  
          // Refetch the users data
          const usersCollection = collection(db, 'users');
          const usersSnapshot = await getDocs(usersCollection);
          const usersList = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setUsers(usersList);
  
        } catch (authError) {
          console.error('Error creating user in Firebase Authentication:', authError);
        }
      } else {
        // For other statuses, just update the existing document
        await updateDoc(oldUserDocRef, updateData);
  
        // Refetch the users data
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setUsers(usersList);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false); // Set showModal to false to close the modal
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const filteredUsers = users.filter(user =>
    Object.values(user).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastUser = currentPage * pageSize;
  const indexOfFirstUser = indexOfLastUser - pageSize;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return (
      <Pagination>
        <Pagination.Prev
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        {pages}
        <Pagination.Next
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <div className='users-container'>
      <AdminDashboard onToggleSidebar={setCollapsed} />
      <div className={`users-content ${collapsed ? 'collapsed' : ''}`}>
        <h1 style={{ textAlign: "center" }}>Users</h1>
        <Form className="my-3">
          <Row className="align-items-center">
            <Col xs="auto" className="my-1">
              <Form.Control as="select" value={pageSize} onChange={handlePageSizeChange}>
                <option value={5}>5 rows</option>
                <option value={10}>10 rows</option>
                <option value={15}>15 rows</option>
                <option value={20}>20 rows</option>
              </Form.Control>
            </Col>
            <Col xs="auto" className="my-1 position-relative">
              <Form.Control
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ paddingRight: '30px' }} // Provide space for the clear icon
              />
              {searchTerm && (
                <span 
                  className="clear-icon" 
                  onClick={handleClearSearch} 
                  style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                >
                  &times;
                </span>
              )}
            </Col>
            <Col xs="auto" className="my-1">
             
            </Col>
          </Row>
        </Form>
        <div>
        <Button className='add-role-button' style={{marginLeft:"1150px"}}variant="primary" onClick={handleShowModal}>
                Add Role
              </Button>
        </div>
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
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.project}</td>
                  <td>{user.email}</td>
                  <td>{user.mobileNumber}</td>
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
                  {/* <td>
                    <button onClick={() => handleAssignClick(user)}>Assign</button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center">
          {renderPagination()}
        </div>
      </div>
      <ModalForm show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default UserTable;
