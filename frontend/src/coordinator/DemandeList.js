import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaFilePdf, FaArrowLeft } from 'react-icons/fa';
import { Document, Page } from 'react-pdf';
import Swal from 'sweetalert2';
import '@react-pdf-viewer/core/lib/styles/index.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import "react-pdf/dist/esm/Page/TextLayer.css";
import { pdfjs } from 'react-pdf';
import { MdViewKanban } from "react-icons/md";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function DemandeList() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [demandeData, setDemandeData] = useState(null);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const tokenTeacher = localStorage.getItem('tokenTeacher');
        const response = await axios.get(`http://localhost:8081/teacherDemandes`, {
          headers: {
            Authorization: `Bearer ${tokenTeacher}`
          }
        });
        console.log('Response from server:', response.data);
        setDemandes(response.data.demandes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching demandes:', error);
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  const handleViewFiles = (files, demandeData) => {
    console.log("Files:", files);
    setFiles(files.map(file => `http://localhost:8081/${file}`));
    setShowFiles(true);
    setDemandeData(demandeData);
  };

  const handleBackToList = () => {
    setShowFiles(false);
    setSelectedDemande(null);
  };

  const handleDelete = async (id) => {
    try {
      const tokenTeacher = localStorage.getItem('tokenTeacher');
      await axios.delete(`http://localhost:8081/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${tokenTeacher}`
        }
      });
      setDemandes(demandes.filter(demande => demande.id !== id));
      Swal.fire('Deleted!', 'The demande has been deleted.', 'success');
    } catch (error) {
      console.error('Error deleting demande:', error);
      Swal.fire('Error!', 'There was an error deleting the demande.', 'error');
    }
  };

  const exportViewedFilesToPDF = async () => {
    const mergedPdf = await PDFDocument.create();
    const username = demandeData.username;
    const moyenne = demandeData.moyenne_totale;
    const score = demandeData.score_accumulator;
  
    try {
      const usernamePage = mergedPdf.addPage([595.28, 841.89]); // A4 size in points
      const { width, height } = usernamePage.getSize();
      const font = await mergedPdf.embedFont(StandardFonts.Helvetica);
      
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
  
      saveAs(blob, `files_${demandeData.username}.pdf`);
      console.log('PDF exported successfully.');
    } catch (error) {
      console.error('Error exporting files to PDF:', error);
    }
  };

  const exportAllDemandesToPDF = () => {
    const doc = new jsPDF();

    doc.text('Demandes List', 14, 16);
    doc.setFontSize(12);
    doc.setTextColor(100);

    const tableColumn = ["#", "Etudiant", "CIN", "Master", "Moyenne Totale", "Score"];
    const tableRows = [];

    demandes.forEach((demande, index) => {
      const demandeData = [
        index + 1,
        demande.username,
        demande.cin,
        demande.title,
        demande.moyenne_totale,
        demande.score_accumulator
      ];
      tableRows.push(demandeData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('demandes_list.pdf');
  };

  const filteredDemandes = demandes.filter(demande => {
    return demande.username.toLowerCase().includes(searchTerm.toLowerCase()) || demande.cin.includes(searchTerm);
  });

  return (
    <div className="container">
      {!showFiles && (
        <div className="panel">
          <div className="panel-heading" style={{ padding: '20px 15px', borderRadius: '10px 10px 0 0', margin: '0', background: 'linear-gradient(90deg, rgba(221,230,237,1) 0%, rgba(39,55,77,1) 68%)' }}>
            <h4 className="title" style={{ color:'#323e4e', fontSize: '28px', fontWeight: '500', textTransform: 'capitalize', lineHeight: '40px', margin: '0' }}>Demandes</h4>
            <div className="btn_group d-flex justify-content-end align-items-center">
                <input type="text" className="form-control mr-4" placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ color: '#fff', backgroundColor: 'transparent', width: '35%', height: '40px', border: '2px solid #fff', borderRadius: '20px', transition: 'all 0.3s ease 0s' }} />
                <button className="btn btn-default mr-2" title="Pdf" onClick={exportAllDemandesToPDF} style={{ color: 'rgba(255,255,255,0.5)', background: 'transparent', fontSize: '16px', textTransform: 'capitalize', border: '2px solid #fff', borderRadius: '50px', transition: 'all 0.3s ease 0s' }}><FaFilePdf /></button>
            </div>
          </div>
          <div className="panel-body table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Etudiant</th>
                  <th>CIN</th>
                  <th>Master</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDemandes.map((demande, index) => (
                  <tr key={demande.id}>
                    <td>{index + 1}</td>
                    <td>{demande.username}</td>
                    <td>{demande.cin}</td>
                    <td>{demande.title}</td>
                    <td>
                      <ul className="list-inline d-flex">
                          <li className="mr-3"><a href="#" data-tip="edit" style={{ color:'#5f7593', fontSize: '24px' }}><FaEdit /></a></li>
                          <li style={{ marginLeft: '20px' }}><a href="#" data-tip="delete" style={{ color:'#5f7593', fontSize: '24px' }} onClick={() => handleDelete(demande.id)}><FaTrash /></a></li>
                          <li style={{ marginLeft: '20px' }}><button onClick={() => handleViewFiles([demande.file1, demande.file2, demande.file3, demande.fileBac], demande)} className="btn btn-link" style={{ color:'#5f7593', fontSize: '28px', background: 'transparent', border: 'none', padding: '0' }}><MdViewKanban /></button></li>
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel-footer" style={{ color: '#fff', backgroundColor: 'transparent', padding: '15px', border: 'none' }}>
            <div className="row">
              <div className="col-sm-6 col-xs-6">Showing <b>{filteredDemandes.length}</b> out of <b>{demandes.length}</b> entries</div>
            </div>
          </div>
        </div>
      )}

      {showFiles && (
        <div className="files-section">
          <div className="file-container-wrapper">
            <button onClick={handleBackToList} className="back-button"><FaArrowLeft /></button>
            <div className="file-container">
              {demandeData && (
                  <div className="application-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px', marginRight: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                      <p style={{ margin: '0' }}>Moyenne Totale:</p>
                      <p style={{ margin: '0', fontWeight: 'bold' }}>{demandeData.moyenne_totale}</p>
                    </div>
                    <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                      <p style={{ margin: '0' }}>Score Accumulator:</p>
                      <p style={{ margin: '0', fontWeight: 'bold' }}>{demandeData.score_accumulator}</p>
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

export default DemandeList;
