import React, { useState, useEffect } from 'react';
import { db } from '../Firebase/FirebaseConfig'; // Adjust the import path
import { collection, getDocs } from 'firebase/firestore';
import AdminDashboard from '../Dashboard/AdminDashboard';
import './Attendance.css';

const Attendance = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [users, setUsers] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Get today's date
    const today = new Date();
    
    // Format a date to 'YYYY-MM-DD' format (for Firestore keys)
    const formatDateForKey = (date) => {
        return date.toISOString().split('T')[0];
    };

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const userData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userData);
        } catch (error) {
            console.error("Error fetching users data: ", error);
        }
    };

    const fetchAttendance = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'attendance'));
            const attendance = querySnapshot.docs.map(doc => {
                const docData = doc.data();
                const entries = Object.keys(docData).map(dateKey => ({
                    id: doc.id,
                    date: dateKey,
                    ...docData[dateKey]
                }));
                return entries;
            }).flat();
            setAttendanceData(attendance);
        } catch (error) {
            console.error("Error fetching attendance data: ", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchAttendance();
    }, []);

    const todayKey = formatDateForKey(currentDate);

    // Combine users and their attendance data
    const combinedData = users.map(user => {
        const userAttendance = attendanceData.find(entry => entry.employeeUid === user.id && entry.date === todayKey);
        return {
            ...user,
            checkIn: userAttendance ? userAttendance.checkIn : null,
            checkOut: userAttendance ? userAttendance.checkOut : null
        };
    });

    // Handle Previous button click
    const handlePrevious = () => {
        const prevDate = new Date(currentDate);
        prevDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(prevDate);
    };

    // Handle Next button click
    const handleNext = () => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(nextDate);
    };

    // Check if the current date is today
    const isToday = formatDateForKey(currentDate) === formatDateForKey(today);
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    

    return (
        <div className='attendance-container'>
            <AdminDashboard onToggleSidebar={setCollapsed} />
            <div className={`attendance-content ${collapsed ? 'collapsed' : ''}`}>
                <div className="navigation-buttons d-flex">
                    <button onClick={handlePrevious}>Previous</button>&nbsp; &nbsp;
                    <h2 className='attendance-heading'>Attendance for {formatDate(currentDate)}</h2>

                    &nbsp; &nbsp;<button onClick={handleNext} disabled={isToday}>Next</button>
                </div>
                <table className='attendance-table mt-2'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Check-In</th>
                            <th>Check-Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {combinedData.length > 0 ? (
                            combinedData.map((user, index) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{user.name || 'N/A'}</td>
                                    <td>{user.role || 'N/A'}</td>
                                    <td>{user.checkIn ? new Date(user.checkIn.seconds * 1000).toLocaleTimeString() : 'N/A'}</td>
<td>{user.checkOut ? new Date(user.checkOut.seconds * 1000).toLocaleTimeString() : 'N/A'}</td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No data available for this date.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Attendance;
