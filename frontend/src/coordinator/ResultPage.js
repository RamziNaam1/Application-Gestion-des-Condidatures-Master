import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilePdf, FaTrash } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import issat from '../images/issat.png';

function ResultPage() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFiles, setShowFiles] = useState(false);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const tokenTeacher = localStorage.getItem('tokenTeacher');
        const teacherId = localStorage.getItem('teacherId');
        const response = await axios.get(`http://localhost:8081/cordresult`, {
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

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add ISSAT logo
    const imgData = issat; // Assuming issat is the imported image
    doc.addImage(imgData, 'PNG', 10, 10, 30, 30);

    // Add title
    doc.setFontSize(18);
    doc.text('Resultat', 105, 20, null, null, 'center');

    const data = demandes.map((demande, index) => {
      // Modify CIN format
      const cin = demande.cin;
      const modifiedCIN = cin.substring(0, 2) + '****' + cin.substring(cin.length - 2);

      return [
        index + 1,
        demande.username,
        modifiedCIN, // Use the modified CIN here
        demande.title,
        demande.moyenne_totale,
        demande.score_accumulator
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

    doc.save('Resultat.pdf');
  };

  const filteredDemandes = demandes.filter(demande => {
    return demande.username.toLowerCase().includes(searchTerm.toLowerCase()) || demande.cin.includes(searchTerm);
  });

  return (
    <div className="container">
      <div className="panel">
        <div className="panel-heading" style={{ padding: '20px 15px', borderRadius: '10px 10px 0 0', margin: '0', background: 'linear-gradient(90deg, rgba(221,230,237,1) 0%, rgba(39,55,77,1) 68%)' }}>
          <h4 className="title" style={{ color:'#323e4e', fontSize: '28px', fontWeight: '500', textTransform: 'capitalize', lineHeight: '40px', margin: '0' }}>Resultat</h4>
          <div className="btn_group d-flex justify-content-end align-items-center">
            <input type="text" className="form-control mr-4" placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ color: '#fff', backgroundColor: 'transparent', width: '35%', height: '40px', border: '2px solid #fff', borderRadius: '20px', transition: 'all 0.3s ease 0s' }} />
            <button className="btn btn-default mr-2" title="Pdf" onClick={handleExportPDF} style={{ color: 'rgba(255,255,255,0.5)', background: 'transparent', fontSize: '16px', textTransform: 'capitalize', border: '2px solid #fff', borderRadius: '50px', transition: 'all 0.3s ease 0s' }}><FaFilePdf /></button>
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
                <th>Moyenne</th>
                <th>Score</th>
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
                  <td>{demande.moyenne_totale}</td>
                  <td>{demande.score_accumulator}</td>
                  <td>
                    <ul className="list-inline d-flex">
                      <li style={{ marginLeft: '20px' }}><a href="#" data-tip="delete" style={{ color:'#5f7593',fontSize: '24px' }}><FaTrash /></a></li>
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

export default ResultPage;
