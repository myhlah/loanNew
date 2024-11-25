import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar, Pie,  Doughnut } from 'react-chartjs-2'; // Import Pie Chart too
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Generate.css'; 

// Registering chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement 
  );

const Generate = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(true);
// Handle logout
const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setLoggedIn(false);
    navigate('/login');
  };

  // Sample chart data
  const loanData = {
    labels: ['Personal', 'Mortgage', 'Auto', 'Education'],
    datasets: [
      {
        label: 'Disbursement by Loan Type',
        data: [120000, 350000, 150000, 80000],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const repaymentPerformanceData = {
    labels: ['On-Time', 'Overdue'],
    datasets: [
      {
        label: 'Repayment Performance',
        data: [75, 15],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderWidth: 1,
      },
    ],
  };
// Borrower Demographics Data
const ageDistributionData = {
    labels: ['18-25', '26-35', '36-50', '50+'],
    datasets: [
      {
        label: 'Age Distribution (%)',
        data: [20, 40, 30, 10], // Example data
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderWidth: 1,
      },
    ],
  };
  const ageChartOptions = {
    responsive: true, // Makes the chart resize on window resize
    maintainAspectRatio: false, // Prevents aspect ratio from being maintained, so we can adjust width/height directly
    plugins: {
      legend: {
        position: 'top', // Adjust legend position
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Age Range',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Borrowers',
        },
      },
    },
  };

  const occupationData = {
    labels: ['Teachers', 'Entrepreneurs', 'Engineers'],
    datasets: [
      {
        label: 'Top Occupations (%)',
        data: [30, 40, 30], // Example data for occupations
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
        borderWidth: 1,
      },
    ],
  };
  const occupationChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const loanPurposeData = {
    labels: ['Pensioner', 'Education', 'Personal'],
    datasets: [
      {
        label: 'Loan Type Breakdown (%)',
        data: [50, 30, 20], // Example data for loan purposes
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
        borderWidth: 1,
      },
    ],
  };
  const loanPurposeChartOptions = {
    responsive: true, // Makes the chart resize based on its container
    maintainAspectRatio: false, // Prevents maintaining the aspect ratio
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

// overall
// Data for Doughnut Chart (Loan Status)
const loanStatusData = {
    labels: ['Pending Loan Applications','Active Loans', 'Overdue Payment Loans', 'Rejected Loan Applications'],
    datasets: [
      {
        data: [400, 100,42,15],  // Values based on your example
        backgroundColor: ['#7BB8E6', '#77D1A7','#FF8F8F','#FFB74D'],
      },
    ],
  };
  
  // Data for Horizontal Bar Chart (Applications)
  const applicationData = {
    labels: ['Pending Loan Applications','Active Loans', 'Overdue Payment Loans', 'Rejected Loan Applications'],
    datasets: [
      {
        label: 'Loan Applications', 
        data: [400, 100,42,15],  // Values based on your example
        backgroundColor: ['#7BB8E6', '#77D1A7','#FF8F8F','#FFB74D'],
      },
    ],
  };
  
  // Common options for charts
  const optionsover = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };  

 // PDF Download Function
 const overviewRef = useRef(null);
 const handleDownloadPDF = async () => {
  if (!overviewRef.current) {
    console.error("Element not attached to the DOM.");
    return;
  }

  try {
    const canvas = await html2canvas(overviewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    // Set up PDF dimensions
    const pdf = new jsPDF('p', 'mm', [215.9, 330.2]); // Adjust for long paper size
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let position = 0; // To track the vertical position
    const pageHeight = pdf.internal.pageSize.getHeight(); // Height of one page in PDF
    
    // Loop through canvas and create pages if the content exceeds one page
    while (position < imgHeight) {
      pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight); // Y position set to -position
      position += pageHeight; // Move down by one page height

      // Add a new page if there's still content left to add
      if (position < imgHeight) {
        pdf.addPage();
      }
    }
    
    pdf.save('Overview_Report.pdf');
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};


const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update date and time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clear timer on component unmount
    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formattedDate = currentDateTime.toLocaleDateString();
  const formattedTime = currentDateTime.toLocaleTimeString();

  return (
    <div className="offdashboard">
      <header className="headeroff">
        <img src="logo.png" alt="MSU-IIT NMPC Logo" className="logooff" />
        <h2 className="landingh2off2">MSU-IIT National Multi-Purpose Cooperative</h2>
      </header>

      <div className="sidebar">
        <div className="profile">
          <img src="User_circle1.png" alt="Profile" className="profile-pic" />
          <div className="profile-info">
            <h3 className="username">Nicholas Patrick</h3>
            <div className="username-divider"></div>
            <p className="role">Loan Clerk</p>
          </div>
        </div>
        <nav className="nav-menu">
          <Link to="/officerdashboard1">Dashboard</Link>
          <Link to="/OfficerDashboard2">Loan Applications</Link>
          <Link to="/OfficerDashboard3">Borrower List</Link>
          <Link to="/Officerprof">Profile</Link>
        </nav>

        <div className="Logoff" onClick={handleLogout}>
          <img src="Sign_out_squre.png" alt="Logout" className="outpicoff" />
          <div className="logoutcontoff">
            <Link to="/login" className="logoutoff">Logout</Link>
          </div>
        </div>
      </div>

      <div className="containerOverview" ref={overviewRef} id="overviewRef">
        <h1>
          Loan Management System Overview
          <button className="printDownload" onClick={handleDownloadPDF}>Download</button>
        </h1>
        <h5>Date: {formattedDate} Time: {formattedTime}</h5>
       
     
        <div>
        
            <div className="cardover">
               <div className="titleSum"><h3>Overall Loan Portfolio Summary</h3></div>
                <div className="chart-containerover">
                    {/*<div className="chart-itemover">
                      <Doughnut data={loanStatusData} options={optionsover} />
                    </div>*/}
                    <div className="chart-itemover">
                      <Bar data={applicationData} options={{ ...optionsover, indexAxis: 'y' }} />
                    </div>
                </div>
            </div><br/>

            
        </div>

        <div className="cardover2">
            <div className="titleSum2"><h3>Borrower Demographics</h3></div>
            <div className="chart-row">
                <div className="chart-item">
                <br /> <li>Borrower Age Distribution:</li><br />
                    <Bar data={ageDistributionData} options={ageChartOptions} />
                </div><br />
                
                <div className="chart-item">
                <br />  <li>Loan Type Breakdown:</li><br />
                    <Pie data={loanPurposeData} options={loanPurposeChartOptions} />
                </div><br />

                <div className="chart-item">
                    <br />  <li>Top Occupations:</li><br />
                    <Bar data={occupationData} options={occupationChartOptions}  />
                </div>
            </div>
          </div>  <br/>

         {/*<div className="summary-cards">
          <div className="card">
           <div className="titleSum1"><h3>Loan Disbursement Summary</h3></div>
            <ul>
                <li>Total Loan Amount Disbursed: ₱1,000,000</li>
                <li>Average Loan Amount: ₱200,000</li>
                <li>Disbursement by Loan Type:</li>
                <Bar data={loanData} />
            </ul>
            </div>
            <div className="card">
            <div className="titleSum1"><h3>Repayment Performance</h3></div>
            <ul>
                <li>Total Collected Payments: ₱800,000</li>
                <li>On-Time Payment Rate: 75%</li>
                <li>Overdue Payment Rate: 15%</li>
                <Bar data={repaymentPerformanceData} />
            </ul>
            </div>  
        </div>

        <div className="summary-cards">
            <div className="card">
            <div className="titleSum1"><h3>Income Analysis</h3></div>
            <table className="data-table">
                <tbody>
                    <tr>
                        <td>Average Borrower Income:</td>
                        <td className="right-align">₱30,000</td>
                    </tr>
                    <tr>
                        <td>Loan-to-Income Ratios: </td>
                        <td className="right-align">1.5x</td>
                    </tr>
                    <tr>
                        <td>Income Distribution:</td>
                        <td className="right-align">Low: 40%, Medium: 40%, High: 20%</td>
                    </tr>
                </tbody>
            </table>
            </div>

            <div className="card">
            <div className="titleSum1"><h3>Operational Efficiency</h3></div>
            <table className="data-table">
                <tbody>
                    <tr>
                        <td>Average Loan Processing Time: </td>
                        <td className="right-align">5 days</td>
                    </tr>
                    <tr>
                        <td>Application Approval Rate: 85%</td>
                        <td className="right-align">85%</td>
                    </tr>
                    <tr>
                        <td>Loan Officer Performance:</td>
                        <td className="right-align"> 5 loans processed, 5% delinquency rate</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div> 

        <div className="summary-cards">

            <div className="card">
            <div className="titleSum1"><h3>Outstanding Loan Balance</h3></div>
              <table className="data-table">
                  <tbody>
                      <tr>
                          <td>Total Outstanding Balance:</td>
                          <td className="right-align">₱500,000</td>
                      </tr>
                      <tr>
                          <td>Average Outstanding Balance:</td>
                          <td className="right-align">₱125,000</td>
                      </tr>
                  </tbody>
              </table>
            </div>
        </div> 

          <div className="cardover">     
            <div className="titleSum"><h3>Alerts and Notifications</h3></div>
            <table className="data-table">
                <tbody>
                    <tr>
                        <td>Upcoming Payments Due:</td>
                        <td className="right-align">10 loans</td>
                    </tr>
                    <tr>
                        <td>Delinquent Accounts:</td>
                        <td className="right-align">5 loans (30+ days overdue)</td>
                    </tr>
                    <tr>
                        <td>Accounts Reaching Default:</td>
                        <td className="right-align">3 loans (90+ days overdue)</td>
                    </tr>
                </tbody>
            </table>
           
        </div> <br />*/}

        <div className="cardover">     
        <div className="titleSum"><h3>Financial Summary</h3></div>
            <table className="data-table">
                <tbody>
                    <tr>
                        <td>Revenue from Interest:</td>
                        <td className="right-align">₱200,000</td>
                    </tr>
                    <tr>
                        <td>Penalty Fees Collected:</td>
                        <td className="right-align">₱5,000</td>
                    </tr>
                    <tr>
                        <td>Provision for Loan Losses:</td>
                        <td className="right-align">₱20,000</td>
                    </tr>
                </tbody>
            </table>
        </div> <br /><br />

      </div>
    </div>
    
  );
};

export default Generate;
