import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import TeacherForm from './TeacherForm';
import TeacherDetailsModal from './TeacherDetailsModal';
import { Button } from 'react-bootstrap';
import { FaEdit,FaTrash, FaEye, FaSyncAlt, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import { IoIosCreate } from "react-icons/io";

function HelpPage() {
  const [teachers, setTeachers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/teacher');
      setTeachers(response.data.teachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setIsCreateModalOpen(true);
  };

  const handleEditClick = (teacherId) => {
    const selected = teachers.find(teacher => teacher.id === teacherId);
    setSelectedTeacher(selected);
    setIsCreateModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsCreateModalOpen(false);
  };

  const handleDeleteClick = (teacherId) => {
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
          await axios.delete(`http://localhost:8081/teachers/${teacherId}`);
          await fetchTeachers();
          Swal.fire('Deleted!', 'Your teacher has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting teacher:', error);
          Swal.fire('Error', 'Failed to delete teacher', 'error');
        }
      }
    });
  };

  const handleViewClick = (teacher) => {
    setSelectedTeacher(teacher);
    setIsDetailsModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeachers = teachers.filter(teacher => {
    return teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || teacher.cin.includes(searchTerm);
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
          className="btn"
          onClick={handleCreateClick}
          style={{ background: ' rgba(39,55,77,1) ', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '40px', cursor: 'pointer' }}
        >
          <IoIosCreate style={{ fontSize: '24px'}}/>Create
        </Button>
      </div>
      {isCreateModalOpen || editingId !== null ? (
        <TeacherForm
          isOpen={isCreateModalOpen || editingId !== null}
          teacher={selectedTeacher}
          onCancel={() => {
            setSelectedTeacher(null);
            setIsCreateModalOpen(false);
          }}
          onSuccess={() => {
            fetchTeachers();
            setIsCreateModalOpen(false);
          }}
        />
      ) : (
        <>
          <div className="panel-heading" style={{ padding: '20px 15px', borderRadius: '10px 10px 0 0', margin: '0', background: 'linear-gradient(90deg, rgba(221,230,237,1) 0%, rgba(39,55,77,1) 68%)' }}>
            <h4 className="title" style={{ color:'#323e4e', fontSize: '28px', fontWeight: '500', textTransform: 'capitalize', lineHeight: '40px', margin: '0' }}>Cordinators List</h4>
            <div className="btn_group d-flex justify-content-end align-items-center">
                <input type="text" className="form-control mr-4" placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ color: '#fff', backgroundColor: 'transparent', width: '35%', height: '40px', border: '2px solid #fff', borderRadius: '20px', transition: 'all 0.3s ease 0s' }} />
                <button className="btn btn-default mr-2" title="Pdf" style={{ color: 'rgba(255,255,255,0.5)', background: 'transparent', fontSize: '16px', textTransform: 'capitalize', border: '2px solid #fff', borderRadius: '50px', transition: 'all 0.3s ease 0s' }}><FaFilePdf /></button>
            </div>
          </div>
          <div className="panel-body table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Coordinateur</th>
                  <th scope="col">CIN</th>
                  <th scope="col">Program</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTeachers.map((teacher, index) => (
                  <tr key={teacher.id}>
                    <td>{index + 1}</td>
                    <td>{teacher.name}</td>
                    <td>{teacher.cin}</td>
                    <td>{teacher.program}</td>
                    <td>
                      <ul className="list-inline d-flex justify-content-center" style={{marginLeft:'-20px'}}>
                        <li className="mr-5"><a href="#" data-tip="edit"  onClick={() => handleEditClick(teacher.id)} style={{ marginRight:'40px', color:'#5f7593', fontSize: '24px' }}><FaEdit /></a></li>
                        <li className="mr-5"><a href="#" data-tip="delete" onClick={() => handleDeleteClick(teacher.id)} style={{ marginRight:'40px',color:'#5f7593',fontSize: '24px' }}><FaTrash /></a></li>
                        <li><a href="#" data-tip="view" onClick={() => handleViewClick(teacher)} style={{ marginRight:'-70px', color:'#5f7593',fontSize: '24px' }}><FaEye  /></a></li>
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
              disabled={indexOfLastItem >= teachers.length}
            >
              Next
            </Button>
          </div>
        </>
      )}

      <TeacherDetailsModal
        teacher={selectedTeacher}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
}

export default HelpPage;

