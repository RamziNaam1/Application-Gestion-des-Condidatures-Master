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
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
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
    <div className="container" style={{ fontFamily: 'PT Sans', padding: '20px' }}>
      {!showFiles && (
        <div className="panel">
          <div className="panel-heading" style={styles.panelHeading}>
            <h4 className="title" style={styles.title}>Demandes List</h4>
            <div className="btn_group" style={styles.btnGroup}>
              <input type="text" className="form-control" placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={styles.searchInput} />
              <select className="form-control" value={selectedTitle} onChange={handleTitleChange} style={styles.selectInput}>
                <option value="">All Titles</option>
                {masterTitles.map((title, index) => (
                  <option key={index} value={title}>{title}</option>
                ))}
              </select>
              <button className="btn btn-default" title="Pdf" onClick={exportToPDF} style={styles.pdfButton}><FaFilePdf /></button>
            </div>
          </div>
          <div className="panel-body table-responsive">
            <table className="table" style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>#</th>
                  <th style={styles.tableHeader}>Username</th>
                  <th style={styles.tableHeader}>CIN</th>
                  <th style={styles.tableHeader}>Title</th>
                  <th style={styles.tableHeader}>Moyenne</th>
                  <th style={styles.tableHeader} onClick={toggleSortOrder}>Score <FaSyncAlt style={styles.sortIcon(sortOrder)} /></th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortApplications(filteredApplicationsList).map((application, index) => (
                  <tr key={index} style={styles.tableRow}>
                    <td style={styles.tableCell}>{index + 1}</td>
                    <td style={styles.tableCell}>{application.username}</td>
                    <td style={styles.tableCell}>{application.cin}</td>
                    <td style={styles.tableCell}>{application.title}</td>
                    <td style={styles.tableCell}>{application.moyenne_totale}</td>
                    <td style={styles.tableCell}>{application.score_accumulator}</td>
                    <td style={styles.actionCell}>
                      <button onClick={() => handleViewFiles([application.file1, application.file2, application.file3, application.fileBac], application)} style={styles.actionButton}><MdViewKanban style={styles.icon} /></button>
                      <button onClick={() => handleDeleteConfirmation(application)} style={styles.actionButton}><FaTrash style={styles.icon} /></button>
                      <button onClick={() => handleAnotherAction(application, index)} style={{ ...styles.actionButton, color: actionPerformedRows[index] ? 'green' : '#5f7593' }}><FaCheckCircle style={styles.icon} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel-footer" style={styles.panelFooter}>
            <div>Showing <b>{filteredApplicationsList.length}</b> out of <b>{applications.length}</b> entries</div>
          </div>
        </div>
      )}

      {showFiles && (
        <div className="files-section">
          <div className="file-container-wrapper">
            <button onClick={handleBackToList} className="back-button" style={styles.backButton}><FaArrowLeft /></button>
            <div className="file-container" style={styles.fileContainer}>
              {applicationData && (
                <div className="application-info" style={styles.applicationInfo}>
                  <div style={styles.infoBox}>
                    <p style={styles.infoLabel}>Moyenne Totale:</p>
                    <p style={styles.infoValue}>{applicationData.moyenne_totale}</p>
                  </div>
                  <div style={styles.infoBox}>
                    <p style={styles.infoLabel}>Score Accumulator:</p>
                    <p style={styles.infoValue}>{applicationData.score_accumulator}</p>
                  </div>
                  <button 
                    className="btn btn-default" 
                    title="Export PDF" 
                    onClick={exportViewedFilesToPDF} 
                    style={styles.exportButton}>
                    <FaFilePdf /> Export Files
                  </button>
                </div>
              )}
              {files.map((file, index) => (
                <div key={index} className="file-item" style={styles.fileItem}>
                  <p className="file-name" style={styles.fileName}>Releve de note {index + 1}:</p>
                  <Document file={file}>
                    <Page pageNumber={1} className="pdf-page" style={styles.pdfPage} />
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

const styles = {
  panelHeading: {
    padding: '20px 15px',
    borderRadius: '10px 10px 0 0',
    margin: '0',
    background: 'linear-gradient(90deg, rgba(221,230,237,1) 0%, rgba(39,55,77,1) 68%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color:'#323e4e',
    fontSize: '28px',
    fontWeight: '500',
    textTransform: 'capitalize',
    lineHeight: '40px',
    margin: '0'
  },
  btnGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  searchInput: {
    color: '#fff',
    backgroundColor: 'transparent',
    width: '35%',
    height: '40px',
    border: '2px solid #fff',
    borderRadius: '20px',
    transition: 'all 0.3s ease 0s',
    marginRight: '10px'
  },
  selectInput: {
    color: '#000',
    backgroundColor: 'transparent',
    border: '2px solid #fff',
    borderRadius: '20px',
    transition: 'all 0.3s ease 0s',
    marginRight: '10px'
  },
  pdfButton: {
    color: 'rgba(255,255,255,0.5)',
    background: 'transparent',
    fontSize: '16px',
    textTransform: 'capitalize',
    border: '2px solid #fff',
    borderRadius: '50px',
    transition: 'all 0.3s ease 0s'
  },
  table: {
    width: '100%',
    marginBottom: '1rem',
    color: '#212529',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    padding: '0.75rem',
    verticalAlign: 'top',
    borderTop: '1px solid #dee2e6',
    borderBottom: '2px solid #dee2e6',
    backgroundColor: '#f8f9fa',
    textAlign: 'left'
  },
  tableRow: {
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#f1f1f1'
    }
  },
  tableCell: {
    padding: '0.75rem',
    verticalAlign: 'top',
    borderTop: '1px solid #dee2e6',
    textAlign: 'left'
  },
  actionCell: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color: '#5f7593',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'color 0.3s',
    '&:hover': {
      color: '#000'
    }
  },
  icon: {
    fontSize: '24px'
  },
  sortIcon: (sortOrder) => ({
    verticalAlign: 'middle',
    fontSize: '14px',
    marginLeft: '5px',
    transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'none'
  }),
  panelFooter: {
    color: '#fff',
    backgroundColor: 'transparent',
    padding: '15px',
    border: 'none'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color: '#5f7593',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  fileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '20px'
  },
  applicationInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '5px',
    marginRight: '10px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
  },
  infoLabel: {
    margin: '0'
  },
  infoValue: {
    margin: '0',
    fontWeight: 'bold'
  },
  exportButton: {
    color: 'rgba(0,0,0,0.5)', 
    background: 'transparent', 
    fontSize: '16px', 
    textTransform: 'capitalize', 
    border: '2px solid #000', 
    borderRadius: '5px', 
    transition: 'all 0.3s ease 0s'
  },
  fileItem: {
    width: '100%',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
  },
  fileName: {
    marginBottom: '10px',
    fontWeight: 'bold'
  },
  pdfPage: {
    border: '1px solid #ccc',
    borderRadius: '5px'
  }
};

export default DemandList;
