import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ProgramForm from './ProgramForm';
import ProgramDetailsModal from './ProgramDetailsModal';
import { Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaFilePdf } from 'react-icons/fa'; // Import icons
import { IoIosCreate } from "react-icons/io";


function AssignmentPage() {
  const [programMasters, setProgramMasters] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProgramMaster, setSelectedProgramMaster] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProgramMasters();
  }, []);

  const fetchProgramMasters = async () => {
    try {
      const response = await axios.get('http://localhost:8081/programMasters');
      setProgramMasters(response.data.programMasters);
    } catch (error) {
      console.error('Error fetching program masters:', error);
    }
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setIsCreateModalOpen(true);
  };

  const handleEditClick = (programMasterId) => {
    // Find the selected program master by ID
    const selectedProgramMaster = programMasters.find(programMaster => programMaster.id === programMasterId);
    
    // Check if the selected program master exists
    if (selectedProgramMaster) {
      // Save the title of the selected program master in local storage
      localStorage.setItem('selectedProgramTitle', selectedProgramMaster.title);
    }
    
    // Set the editing ID and open the create modal
    setEditingId(programMasterId);
    setIsCreateModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsCreateModalOpen(false);
  };

  const handleDeleteClick = (programMasterId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8081/programMasters/${programMasterId}`);
          await fetchProgramMasters();
          Swal.fire('Deleted!', 'Your program master has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting program master:', error);
          Swal.fire('Error', 'Failed to delete program master', 'error');
        }
      }
    });
  };

  const handleViewClick = (programMaster) => {
    setSelectedProgramMaster(programMaster);
    setIsDetailsModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = programMasters.filter(programMaster => {
    return programMaster.title.toLowerCase().includes(searchTerm.toLowerCase());
  }).slice(indexOfFirstItem, indexOfLastItem);

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        <Button
          className="btn d-flex align-items-center"
          onClick={handleCreateClick}
          style={{ background: 'rgba(39, 55, 77, 1)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '40px', cursor: 'pointer' }}
        >
           <IoIosCreate style={{ fontSize: '24px'}}/>Create
        </Button>
      </div>
      {isCreateModalOpen || editingId !== null ? (
        <ProgramForm
          isOpen={isCreateModalOpen || editingId !== null}
          programMasterId={editingId}
          onCancel={handleCancelEdit}
          onSuccess={() => {
            fetchProgramMasters();
            setIsCreateModalOpen(false);
          }}
        />
      ) : (
        <>
          <div className="panel-heading" style={{ padding: '20px 15px', borderRadius: '10px 10px 0 0', margin: '0', background: 'linear-gradient(90deg, rgba(221,230,237,1) 0%, rgba(39,55,77,1) 68%)' }}>
            <h4 className="title" style={{ color: '#323e4e', fontSize: '28px', fontWeight: '500', textTransform: 'capitalize', lineHeight: '40px', margin: '0' }}>Program Masters List</h4>
            <div className="btn_group d-flex justify-content-end align-items-center">
              <input type="text" className="form-control mr-4" placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ color: '#fff', backgroundColor: 'transparent', width: '35%', height: '40px', border: '2px solid #fff', borderRadius: '20px', transition: 'all 0.3s ease 0s' }} />
            </div>
          </div>
          <div className="panel-body table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Title</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((programMaster, index) => (
                  <tr key={programMaster.id}>
                    <td>{index + 1}</td>
                    <td>{programMaster.title}</td>
                    <td>
                      <ul className="list-inline d-flex justify-content-center" style={{ marginLeft: '-20px' }}>
                        <li className="mr-5"><a href="#" data-tip="edit" onClick={() => handleEditClick(programMaster.id)} style={{ marginRight: '40px', color: '#5f7593', fontSize: '24px' }}><FaEdit /></a></li>
                        <li className="mr-5"><a href="#" data-tip="delete" onClick={() => handleDeleteClick(programMaster.id)} style={{ marginRight: '40px', color: '#5f7593', fontSize: '24px' }}><FaTrash /></a></li>
                        <li><a href="#" data-tip="view" onClick={() => handleViewClick(programMaster)} style={{ marginRight: '-70px', color: '#5f7593', fontSize: '24px' }}><FaEye /></a></li>
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={indexOfLastItem >= programMasters.length}
            >
              Next
            </Button>
          </div>
        </>
      )}
      <ProgramDetailsModal
        programMaster={selectedProgramMaster}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
}

export default AssignmentPage;
