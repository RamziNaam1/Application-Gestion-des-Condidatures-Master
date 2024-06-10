import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSyncAlt, FaFilePdf, FaCheckCircle, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { Document, Page } from 'react-pdf';
import '@react-pdf-viewer/core/lib/styles/index.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import "react-pdf/dist/esm/Page/TextLayer.css";
import { pdfjs } from 'react-pdf';
import './pdfStyle.css';
import { MdViewKanban } from "react-icons/md";
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PDFDocument,rgb , StandardFonts} from 'pdf-lib';
import { saveAs } from 'file-saver';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function DemandList() {
  const [applications, setApplications] = useState([]);
  const [masterTitles, setMasterTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('Master of Science in Computer Science');
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [files, setFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [applicationData, setApplicationData] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortOrderMoyenne, setSortOrderMoyenne] = useState('asc');
  const [actionPerformedRows, setActionPerformedRows] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:8081/applications');
        if (Array.isArray(response.data.applications)) {
          setApplications(response.data.applications);
          setFilteredApplications(response.data.applications);
        } else {
          console.error('Error fetching applications: Applications data is not an array');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    const fetchMasterTitles = async () => {
      try {
        const response = await axios.get('http://localhost:8081/programMasters');
        if (Array.isArray(response.data.programMasters)) {
          const titles = response.data.programMasters.map(master => master.title);
          setMasterTitles(titles);
        } else {
          console.error('Error fetching program masters: Program masters data is not an array');
        }
      } catch (error) {
        console.error('Error fetching program masters:', error);
      }
    };

    fetchApplications();
    fetchMasterTitles();
  }, []);

  useEffect(() => {
    const filterApplications = () => {
      if (selectedTitle) {
        setFilteredApplications(applications.filter(application => application.title === selectedTitle));
      } else {
        setFilteredApplications(applications);
      }
    };

    filterApplications();
  }, [selectedTitle, applications]);

  const handleViewFiles = (files, applicationData) => {
    const mainFiles = [
      applicationData.file1,
      applicationData.file2,
      applicationData.file3,
      applicationData.fileBac // Include fileBac here
    ].filter(Boolean);

    const filesArray = mainFiles.map(file => `http://localhost:8081/${file}`);

    setFiles(filesArray); 
    setApplicationData(applicationData);
    setShowFiles(true);
  };

  const handleDeleteConfirmation = (application) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(application);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      }
    });
  };

  const handleBackToList = () => {
    setShowFiles(false);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortApplications = (apps) => {
    const sortedApps = [...apps].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.score_accumulator - b.score_accumulator;
      } else {
        return b.score_accumulator - a.score_accumulator;
      }
    });
    return sortedApps;
  };

  const handleAnotherAction = async (application, index) => {
    const { username, cin, cordID, title, moyenne_totale, score_accumulator }= application;
    
    try {
      const response = await axios.post('http://localhost:8081/resultat', {
        username,
        cordID,
        cin,
        title,
        moyenne_totale,
        score_accumulator
      });
  
      console.log(response.data);
      const newActionPerformedRows = [...actionPerformedRows];
      newActionPerformedRows[index] = true;
      setActionPerformedRows(newActionPerformedRows);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  
  const handleDelete = async (application) => {
    try {
      // Make a DELETE request to delete the application
      await axios.delete(`http://localhost:8081/applications/${application.id}`);
      // Remove the deleted application from the state
      setApplications(applications.filter(app => app.id !== application.id));
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };
  
  const handleTitleChange = (event) => {
    setSelectedTitle(event.target.value);
  };

  const filteredApplicationsList = filteredApplications.filter(application => {
    return application.title.toLowerCase().includes(searchTerm.toLowerCase()) || application.cin.includes(searchTerm);
  });

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text('Demandes List', 14, 16);
    doc.setFontSize(12);
    doc.setTextColor(100);

    const tableColumn = ["#", "Username", "CIN", "Title", "Moyenne", "Score"];
    const tableRows = [];

    filteredApplicationsList.forEach((application, index) => {
      const applicationData = [
        index + 1,
        application.username,
        application.cin,
        application.title,
        application.moyenne_totale,
        application.score_accumulator
      ];
      tableRows.push(applicationData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('demandes_list.pdf');
  };

 const exportViewedFilesToPDF = async () => {
  const mergedPdf = await PDFDocument.create();
  const username = applicationData.username;
  const moyenne = applicationData.moyenne_totale;
  const score = applicationData.score_accumulator;

  try {
    // Create a new page for the username and other details
    const usernamePage = mergedPdf.addPage([595.28, 841.89]); // A4 size in points
    const { width, height } = usernamePage.getSize();
    const font = await mergedPdf.embedFont(StandardFonts.Helvetica);
    
    // Add username, moyenne, and score to the page
    usernamePage.drawText(`Username: ${username}`, {
      x: 50,
      y: height - 100,
      size: 24,
      font: font,
      color: rgb(0, 0, 0),
    });
    usernamePage.drawText(`Moyenne Totale: ${moyenne}`, {
      x: 50,
      y: height - 140,
      size: 18,
      font: font,
      color: rgb(0, 0, 0),
    });
    usernamePage.drawText(`Score Accumulator: ${score}`, {
      x: 50,
      y: height - 180,
      size: 18,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Loop through the file URLs and fetch each file
    for (let index = 0; index < files.length; index++) {
      const fileUrl = files[index];
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      const pdfDoc = await PDFDocument.load(response.data);

      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });

      console.log(`File ${index + 1} added to PDF.`);
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

    saveAs(blob, `files_${applicationData.username}.pdf`);
    console.log('PDF exported successfully.');
  } catch (error) {
    console.error('Error exporting files to PDF:', error);
  }
};
  
  


  return (
    <div className="container" style={{ fontFamily: 'PT Sans' }}>
      {!showFiles && (
        <div className="panel">
          <div className="panel-heading" style={{ padding: '20px 15px', borderRadius: '10px 10px 0 0', margin: '0', background: 'linear-gradient(90deg, rgba(221,230,237,1) 0%, rgba(39,55,77,1) 68%)' }}>
            <h4 className="title" style={{ color:'#323e4e', fontSize: '28px', fontWeight: '500', textTransform: 'capitalize', lineHeight: '40px', margin: '0' }}>Demandes List</h4>
            <div className="btn_group d-flex justify-content-end align-items-center">
              <input type="text" className="form-control mr-4" placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ color: '#fff', backgroundColor: 'transparent', width: '35%', height: '40px', border: '2px solid #fff', borderRadius: '20px', transition: 'all 0.3s ease 0s' }} />
              <select className="form-control mr-2" value={selectedTitle} onChange={handleTitleChange} style={{ color: '#000', backgroundColor: 'transparent', border: '2px solid #fff', borderRadius: '20px', transition: 'all 0.3s ease 0s', marginRight: '10px', marginLeft: '10px' }}>
                <option value="">All Titles</option>
                {masterTitles.map((title, index) => (
                  <option key={index} value={title}>{title}</option>
                ))}
              </select>
              <button className="btn btn-default mr-2" title="Pdf" onClick={exportToPDF} style={{ color: 'rgba(255,255,255,0.5)', background: 'transparent', fontSize: '16px', textTransform: 'capitalize', border: '2px solid #fff', borderRadius: '50px', transition: 'all 0.3s ease 0s' }}><FaFilePdf /></button>
            </div>
          </div>
          <div className="panel-body table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>CIN</th>
                  <th>Title</th>
                  <th>Moyenne</th>
                  <th onClick={toggleSortOrder} style={{ cursor: 'pointer' }}>Score <FaSyncAlt style={{ verticalAlign: 'middle', fontSize: '14px', marginLeft: '5px', transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'none' }} /></th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortApplications(filteredApplicationsList).map((application, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{application.username}</td>
                    <td>{application.cin}</td>
                    <td>{application.title}</td>
                    <td>{application.moyenne_totale}</td>
                    <td>{application.score_accumulator}</td>
                    <td className="list-inline d-flex justify-content-center">
                      <button
                        onClick={() => handleViewFiles([application.file1, application.file2, application.file3, application.fileBac], application)} // Pass all files including fileBac here
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'transparent',
                          color: '#5f7593',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                        }}
                      >
                        <MdViewKanban style={{  fontSize: '30px'}} />
                      </button>
                      <button
                        onClick={() => handleDeleteConfirmation(application)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'transparent',
                          color: '#5f7593',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                        }}
                      >
                        <FaTrash style={{  fontSize: '24px'}} />
                      </button>
                      <button
                        onClick={() => handleAnotherAction(application, index)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'transparent',
                          color: actionPerformedRows[index] ? 'green' : '#5f7593',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                        }}
                      >
                        <FaCheckCircle style={{  fontSize: '24px'}}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel-footer" style={{ color: '#fff', backgroundColor: 'transparent', padding: '15px', border: 'none' }}>
            <div className="row">
              <div className="col-sm-6 col-xs-6">Showing <b>{filteredApplicationsList.length}</b> out of <b>{applications.length}</b> entries</div>
            </div>
          </div>
        </div>
      )}

      {showFiles && (
        <div className="files-section">
          <div className="file-container-wrapper">
            <button onClick={handleBackToList} className="back-button"><FaArrowLeft /></button>
            <div className="file-container">
              {applicationData && (
                <div className="application-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems:'center' }}>
                  <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px', marginRight: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <p style={{ margin: '0' }}>Moyenne Totale:</p>
                    <p style={{ margin: '0', fontWeight: 'bold' }}>{applicationData.moyenne_totale}</p>
                  </div>
                  <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <p style={{ margin: '0' }}>Score Accumulator:</p>
                    <p style={{ margin: '0', fontWeight: 'bold' }}>{applicationData.score_accumulator}</p>
                  </div>
                  <button 
                    className="btn btn-default" 
                    title="Export PDF" 
                    onClick={exportViewedFilesToPDF} 
                    style={{ 
                      color: 'rgba(0,0,0,0.5)', 
                      background: 'transparent', 
                      fontSize: '16px', 
                      textTransform: 'capitalize', 
                      border: '2px solid #000', 
                      borderRadius: '5px', 
                      transition: 'all 0.3s ease 0s' 
                    }}>
                    <FaFilePdf /> Export Files
                  </button>
                </div>
              )}
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <p className="file-name">Releve de note {index + 1}:</p>
                  <Document file={file}>
                    <Page pageNumber={1} className="pdf-page" />
                  </Document>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DemandList;
