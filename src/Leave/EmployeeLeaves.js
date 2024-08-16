import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseConfig';
import './EmployeeLeaves.css';
import ReactPaginate from 'react-paginate';
import AdminDashboard from '../Dashboard/AdminDashboard';

function EmployeeLeaves() {
  const [users, setUsers] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [leavesPerPage] = useState(5);

  const fetchAllLeaveRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'EmployeeLeaves'));
      const allLeaveRequests = [];

      querySnapshot.forEach((doc) => {
        const leaveData = doc.data().leaves || [];
        leaveData.forEach(leave => {
          allLeaveRequests.push({
            ...leave,
            userId: doc.id, // Add the user's ID to each leave for reference
            leaveDocId: doc.id, // Store document ID for updating the leave later
          });
        });
      });

      // Sort the leave requests by 'appliedOn' in descending order (recent first)
      const sortedLeaveRequests = allLeaveRequests.sort((a, b) => {
        return b.appliedOn.seconds - a.appliedOn.seconds; // Sorting by timestamp
      });

      setLeaveRequests(sortedLeaveRequests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : 'Unknown User'; // Default to 'Unknown User' if user is not found
  };

  const handleStatusChange = async (leave, status) => {
    try {
      const leaveRef = doc(db, 'EmployeeLeaves', leave.leaveDocId);
      const updatedLeaves = leaveRequests.map(l =>
        l.userId === leave.userId && l.appliedOn.seconds === leave.appliedOn.seconds ? { ...l, status } : l
      );
      const newLeaveArray = updatedLeaves.filter(l => l.leaveDocId === leave.leaveDocId);

      // Update the Firestore document
      await updateDoc(leaveRef, {
        leaves: newLeaveArray,
      });

      // Update the state
      setLeaveRequests(updatedLeaves);
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  useEffect(() => {
    fetchAllLeaveRequests();
    fetchUsers();
  }, []);

  const indexOfLastLeave = (currentPage + 1) * leavesPerPage;
  const indexOfFirstLeave = indexOfLastLeave - leavesPerPage;
  const currentLeaves = leaveRequests.slice(indexOfFirstLeave, indexOfLastLeave);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="leave-container">
      <AdminDashboard onToggleSidebar={setCollapsed} />
      <div className={`leave-content ${collapsed ? 'collapsed' : ''}`}>
        <div className="leave-header">
          <h5 className="mb-3">All Employee Leave Requests</h5>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">S No</th>
              <th scope="col">Username</th>
              <th scope="col">Leave Type</th>
              <th scope="col">From Date</th>
              <th scope="col">To Date</th>
              <th scope="col">Description</th>
              <th scope="col">Status</th>
              <th scope="col">Applied On</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentLeaves.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              currentLeaves.map((leave, index) => (
                <tr key={index}>
                  <td>{index + 1 + indexOfFirstLeave}</td>
                  <td>{getUserName(leave.userId)}</td>
                  <td>{leave.leaveType}</td>
                  <td>{formatDate(leave.fromDate)}</td>
                  <td>{formatDate(leave.toDate)}</td>
                  <td>{leave.description}</td>
                  {/* Conditional styling based on status */}
                  <td style={{ color: leave.status === 'Approved' ? 'green' : leave.status === 'Rejected' ? 'red' : 'black' }}>
                    {leave.status}
                  </td>
                  <td>{formatDate(new Date(leave.appliedOn.seconds * 1000))}</td>
                  <td>
                    <select
                      value={leave.status}
                      onChange={(e) => handleStatusChange(leave, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(leaveRequests.length / leavesPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={({ selected }) => paginate(selected)}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
}

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export default EmployeeLeaves;
