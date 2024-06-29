import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import { FaUser } from 'react-icons/fa';

function Main() {
    const [applicationsData, setApplicationsData] = useState([]);
    const [demandCount, setDemandCount] = useState(0);
    const [teacherCount, setTeacherCount] = useState(0);
    const [resultatCount, setresultatCount] = useState(0);
    const [highestLowestScores, setHighestLowestScores] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data for applications count by title
                const response = await axios.get('http://localhost:8081/applications_count');
                setApplicationsData(response.data);

                // Fetch data for demand count
                const demandResponse = await axios.get('http://localhost:8081/demand_count');
                console.log('Demand count from backend:', demandResponse.data.count); // Log the count

                setDemandCount(demandResponse.data.count);

                // Fetch data for teacher count
                const teacherResponse = await axios.get('http://localhost:8081/teacher_count');
                setTeacherCount(teacherResponse.data.count);

                const resultatResponse = await axios.get('http://localhost:8081/resultat_count');
                setresultatCount(resultatResponse.data.count);

                // Fetch data for highest and lowest scores
                const highestLowestScoresResponse = await axios.get('http://localhost:8081/highest_lowest_scores');
                setHighestLowestScores(highestLowestScoresResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const chartData = {
        labels: applicationsData.map(entry => entry.title),
        datasets: [{
            data: applicationsData.map(entry => entry.count),
            backgroundColor: [
                'rgba(66, 135, 245, 0.6)',
                'rgba(51, 102, 204, 0.6)',
                'rgba(36, 71, 139, 0.6)',
                'rgba(25, 50, 98, 0.6)',
                'rgba(15, 30, 59, 0.6)',
                'rgba(10, 20, 39, 0.6)'
            ],
            hoverBackgroundColor: [
                'rgba(66, 135, 245, 0.8)',
                'rgba(51, 102, 204, 0.8)',
                'rgba(36, 71, 139, 0.8)',
                'rgba(25, 50, 98, 0.8)',
                'rgba(15, 30, 59, 0.8)',
                'rgba(10, 20, 39, 0.8)'
            ]
        }]
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '80px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius:'40px'}}>
                <h3 style={{ marginLeft:'40px', marginRight: '40px', display: 'flex', alignItems: 'center',fontSize:'40px' }}>Welcome Admin <FaUser style={{ marginLeft: '10px' ,color:'rgba(66, 135, 245, 0.6)'}} /></h3>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '80%', textAlign: 'center', position: 'relative', marginRight:'250px' }}>
                    <h2>Applications </h2>
                    <div style={{ width: '80%', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px', padding: '20px', background: '#f5f5f5' }}>
                        <Doughnut
                            data={chartData}
                            options={{
                                maintainAspectRatio: false,
                                aspectRatio: 1, // Set aspect ratio to maintain circular shape
                                plugins: {
                                    legend: {
                                        position: 'right', // Set legend position to right
                                    }
                                },
                                scales: {
                                    y: {
                                        ticks: {
                                            font: {
                                                size: 14 // Set font size for chart labels
                                            }
                                        }
                                    }
                                }
                            }}
                            width={400} // Set width of the chart
                            height={400} // Set height of the chart
                        />
                    </div>
                    <div style={{ gap:'22px', position: 'absolute', top: '40px', left: '100%', marginLeft: '20px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ width: '240px', height: '130px', backgroundColor: '#f5f5f5', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '10px', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>Demandes:</div>
                            <div style={{ fontSize: '24px', textAlign: 'center' }}>{demandCount}</div>
                        </div>
                        <div style={{ width: '240px', height: '130px', backgroundColor: '#f5f5f5', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '10px', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>Coordinateurs:</div>
                            <div style={{ fontSize: '24px', textAlign: 'center' }}>{teacherCount}</div>
                        </div>
                        <div style={{ width: '240px', height: '130px', backgroundColor: '#f5f5f5', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '10px', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>Demandes Acceptées</div>
                            <div style={{ fontSize: '24px', textAlign: 'center' }}>{resultatCount}</div>
                        </div>
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <div style={{ width: '240px', height: '130px', backgroundColor: '#f5f5f5', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>2023</div>
                            <div style={{ fontSize: '16px', textAlign: 'center' }}>Highest Score: {highestLowestScores.highest_lowest_scores_2023?.highest_score_2023}</div>
                            <div style={{ fontSize: '16px', textAlign: 'center' }}>Lowest Score: {highestLowestScores.highest_lowest_scores_2023?.lowest_score_2023}</div>
                        </div>
                        <div style={{ width: '240px', height: '130px', backgroundColor: '#f5f5f5', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>2022</div>
                            <div style={{ fontSize: '16px', textAlign: 'center' }}>Highest Score: {highestLowestScores.highest_lowest_scores_2022?.highest_score_2022}</div>
                            <div style={{ fontSize: '16px', textAlign: 'center' }}>Lowest Score: {highestLowestScores.highest_lowest_scores_2022?.lowest_score_2022}</div>
                        </div>
                        <div style={{ width: '240px', height: '130px', backgroundColor: '#f5f5f5', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>2021</div>
                            <div style={{ fontSize: '16px', textAlign: 'center' }}>Highest Score: {highestLowestScores.highest_lowest_scores_2021?.highest_score_2021}</div>
                            <div style={{ fontSize: '16px', textAlign: 'center' }}>Lowest Score: {highestLowestScores.highest_lowest_scores_2021?.lowest_score_2021}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
