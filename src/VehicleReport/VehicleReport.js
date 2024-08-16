import React, { useState, useEffect } from 'react';
import { db } from "../Firebase/FirebaseConfig";
import { collection, getDocs } from 'firebase/firestore';
import AdminDashboard from '../Dashboard/AdminDashboard';
import "./vehicleReport.css";

const VehicleReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [vehicleReports, setVehicleReports] = useState([]);

  useEffect(() => {
    // Fetch data from Firestore
    const fetchData = async () => {
      try {
        console.log("Fetching data from Firestore...");
        
        const querySnapshot = await getDocs(collection(db, 'vehicle_reports'));
        console.log("Query snapshot:", querySnapshot); // Log the entire query snapshot

        if (querySnapshot.empty) {
          console.log("No documents found in the collection.");
          setVehicleReports([]); // Set to an empty array if no documents are found
        } else {
          const allReports = [];

          querySnapshot.forEach(doc => {
            console.log("Document data:", doc.data()); // Log each document’s data
            const reports = doc.data().reports || []; // Extract reports array
            allReports.push(...reports); // Flatten reports into a single array
          });

          console.log("All Reports:", allReports); // Log the flattened reports data
          setVehicleReports(allReports); // Update state with fetched data
        }
      } catch (error) {
        console.error("Error fetching vehicle reports: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='vehiclereport-container'>
      <div className={`vehiclereport-content ${collapsed ? 'collapsed' : ''}`}>
        <AdminDashboard onToggleSidebar={setCollapsed} />
        <h1>Vehicle Report</h1>
        <table className='vehicle-report-table'>
          <thead>
            <tr>
                <th>S.No</th>
              <th>Vehicle Name</th>
              <th>Vehicle Number</th>
              <th>Start Location</th>
              <th>End Location</th>
              <th>Start Reading</th>
              <th>End Reading</th>
              <th>Usage Date</th>
              <th>Start Pic</th>
              <th>End Pic</th>
              <th>School Name</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {vehicleReports.length > 0 ? (
              vehicleReports.map((report, index) => (
                <tr key={index}>
                    <td>{index+1}</td>
                  <td>{report.vehicleName}</td>
                  <td>{report.vehicleNumber}</td>
                  <td>{report.startLocation}</td>
                  <td>{report.endLocation}</td>
                  <td>{report.startReading}</td>
                  <td>{report.endReading}</td>
                  <td>{report.usageDate}</td>
                  <td>{report.startPicURL && <img src={report.startPicURL} alt="Start" width="50" />}</td>
                  <td>{report.endPicURL && <img src={report.endPicURL} alt="End" width="50" />}</td>
                  <td>{report.schoolName}</td>
                  <td>{report.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No data available</td> {/* Adjust colSpan according to your table columns */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleReport;
