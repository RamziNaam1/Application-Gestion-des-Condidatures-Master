import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilePdf, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import issat from '../images/issat.png';

function Resultat() {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('Master of Science in Computer Science');
  const [titles, setTitles] = useState([]); // State to hold titles

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:8081/Getresultat');
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    const fetchTitles = async () => {
      try {
        const response = await axios.get('http://localhost:8081/resultat/titles');
        const uniqueTitles = Array.from(new Set(response.data)); // Filter duplicates
        setTitles(uniqueTitles);
        console.log('Titles:', uniqueTitles); // Log titles
      } catch (error) {
        console.error('Error fetching titles:', error);
      }
    };

    fetchApplications();
    fetchTitles();
  }, []);

  const handleDeleteConfirmation = (index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(index);
      }
    });
  };

  const handleDelete = async (index) => {
    try {
      const application = applications[index];
      await axios.delete(`http://localhost:8081/applications/${application.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setApplications(prevApplications => prevApplications.filter((_, i) => i !== index));
      Swal.fire(
        'Deleted!',
        'The application has been deleted.',
        'success'
      );
    } catch (error) {
      console.error('Error deleting application:', error);
      Swal.fire(
        'Error!',
        'There was an error deleting the application.',
        'error'
      );
    }
  };

  const handleTitleChange = (event) => {
    setSelectedTitle(event.target.value);
  };

  const handleExportPDF = (applicationsToExport, fileName) => {
    const doc = new jsPDF();
    
    // Add ISSAT logo
    const imgData = issat; // Assuming issat is the imported image
    doc.addImage(imgData, 'PNG', 10, 10, 30, 30);
  
    // Add title
    doc.setFontSize(18);
    doc.text(fileName, 105, 20, null, null, 'center');
  
    const data = applicationsToExport.map((application, index) => {
      // Modify CIN format
      const cin = application.cin;
      const modifiedCIN = cin.substring(0, 2) + '****' + cin.substring(cin.length - 2);
  
      return [
        index + 1,
        application.username,
        modifiedCIN, // Use the modified CIN here
        application.title,
        application.moyenne_totale,
        application.score_accumulator
      ];
    });
  
    doc.autoTable({
      startY: 50,
      head: [['#', 'Username', 'CIN', 'Title', 'Moyenne', 'Score']],
      body: data,
      theme: 'grid',
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        cellPadding: 3,
        fontSize: 10,
        halign: 'center',
        valign: 'middle',
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      alternateRowStyles: {
        fillColor: [239, 239, 239]
      }
    });
  
    // Add signature area
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    doc.text('Signature:', 20, pageHeight - 20);
    doc.line(50, pageHeight - 20, 150, pageHeight - 20); // Signature line
  
    doc.save(`${fileName}.pdf`);
  };
  
  
  const filteredApplications = applications.filter(application => {
    return application.title.toLowerCase().includes(searchTerm.toLowerCase()) || application.cin.includes(searchTerm);
  });

  const filteredApplicationsByTitle = selectedTitle ? applications.filter(application => {
    return application.title === selectedTitle;
  }) : applications;

  // Sort the filteredApplicationsByTitle array based on score in descending order
  const sortedApplications = filteredApplicationsByTitle.sort((a, b) => b.score_accumulator - a.score_accumulator);

  // Slice the applications array to get the first 5 applications and the rest
  const firstFiveApplications = sortedApplications.slice(0, 2);
  const waitingListApplications = sortedApplications.slice(2);

  return (
    <div className="container">
      <div className="panel">
        <div className="panel-heading" style={{ padding: '20px 15px', borderRadius: '10px 10px 0 0', margin: '0', background: 'linear-gradient(90deg, rgba(221,230,237,1) 0%, rgba(39,55,77,1) 68%)' }}>
          <h4 className="title" style={{ color: '#323e4e', fontSize: '28px', fontWeight: '500', textTransform: 'capitalize', lineHeight: '40px', margin: '0' }}>Result</h4>
          <div className="btn_group d-flex justify-content-end align-items-center">
            <input type="text" className="form-control mr-4" placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ color: '#fff', backgroundColor: 'transparent', width: '35%', height: '40px', border: '2px solid #fff', borderRadius: '20px', transition: 'all 0.3s ease 0s' }} />
            <select className="form-control mr-2" value={selectedTitle} onChange={handleTitleChange} style={{ color: '#000', backgroundColor: 'transparent', border: '2px solid #fff', borderRadius: '20px', transition: 'all 0.3s ease 0s', marginRight:'10px', marginLeft:'10px' }}>
              <option value="">All Titles</option>
              {Array.isArray(titles) && titles.map((title, index) => (
                <option key={`${title}-${index}`} value={title}>{title}</option>
              ))}
            </select>
            <button className="btn btn-default mr-2" title="Pdf" onClick={() => handleExportPDF(firstFiveApplications, 'Resultat')} style={{ color: 'rgba(255,255,255,0.5)', background: 'transparent', fontSize: '16px', textTransform: 'capitalize', border: '2px solid #fff', borderRadius: '50px', transition: 'all 0.3s ease 0s' }}><FaFilePdf /></button>
          </div>
        </div>
        <div className="panel-body table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Etudiant</th>
                <th>CIN</th>
                <th>Title</th>
                <th>Moyenne</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {firstFiveApplications.map((application, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{application.username}</td>
                  <td>{application.cin}</td>
                  <td>{application.title}</td>
                  <td>{application.moyenne_totale}</td>
                  <td>{application.score_accumulator}</td>
                  <td>
                    <ul className="list-inline d-flex">
                      <li style={{ marginLeft: '20px' }}>
                        <a href="#" data-tip="delete" style={{ color: '#5f7593', fontSize: '24px' }} onClick={() => handleDeleteConfirmation(index)}>
                          <FaTrash />
                        </a>
                      </li>
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Waiting List Table */}
      <div className="panel">
        <div className="panel-heading" style={{ padding: '20px 15px', borderRadius: '10px 10px 0 0', margin: '0', background: 'linear-gradient(90deg, rgba(221,230,237,1) 0%, rgba(39,55,77,1) 68%)' }}>
          <h4 className="title" style={{ color: '#323e4e', fontSize: '28px', fontWeight: '500', textTransform: 'capitalize', lineHeight: '40px', margin: '0' }}>Waiting List</h4>
          <div className="btn_group d-flex justify-content-end align-items-center">
            <button className="btn btn-default mr-2" title="Pdf" onClick={() => handleExportPDF(waitingListApplications, 'Waiting List')} style={{ color: 'rgba(255,255,255,0.5)', background: 'transparent', fontSize: '16px', textTransform: 'capitalize', border: '2px solid #fff', borderRadius: '50px', transition: 'all 0.3s ease 0s' }}><FaFilePdf /></button>
          </div>
        </div>
        <div className="panel-body table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Etudiant</th>
                <th>CIN</th>
                <th>Title</th>
                <th>Moyenne</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {waitingListApplications.map((application, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{application.username}</td>
                  <td>{application.cin}</td>
                  <td>{application.title}</td>
                  <td>{application.moyenne_totale}</td>
                  <td>{application.score_accumulator}</td>
                  <td>
                    <ul className="list-inline d-flex">
                      <li style={{ marginLeft: '20px' }}>
                        <a href="#" data-tip="delete" style={{ color: '#5f7593', fontSize: '24px' }} onClick={() => handleDeleteConfirmation(index)}>
                          <FaTrash />
                        </a>
                      </li>
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Resultat;
