import React, { useState, useEffect } from 'react';
import { getRegistros, deleteRegistro } from '../services/api';
import CreateModal from '../components/createModal';
import EditModal from '../components/EditModal';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../assets/styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PAGE_SIZE = 5;

const Home = () => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(false); 

  useEffect(() => {
    const fetchRegistros = async () => {
      setLoading(true);
      try {
        const data = await getRegistros();
        setRegistros(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching registros:', error);
        setLoading(false);
      }
    };

    fetchRegistros();
  }, []);

  const handleDelete = async (Codigo) => {
    if (window.confirm('¿Seguro que quiere eliminar este registro?')) {
      try {
        await deleteRegistro(Codigo);
        setRegistros((prev) => prev.filter((registro) => registro.Codigo !== Codigo));
      } catch (error) {
        console.error('Error deleting registro:', error);
      }
    }
  };

  const handlePageChange = async (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    setIsPageLoading(true); // Activar animación de carga
    setCurrentPage(page);

    setTimeout(() => {
      setIsPageLoading(false); // Desactivar animación de carga
    }, 300);
  };

  const refreshData = async () => {
    try {
      const data = await getRegistros();
      setRegistros(data);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedRegistros = registros.slice(startIndex, endIndex);

  const totalPages = Math.ceil(registros.length / PAGE_SIZE);

  return (
    <div className="container">
      <div className="table-container">
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-circle"></i> Agregar Registro
        </button>
        <table className="table">
          <thead>
            <tr>
            <th>Codigo</th>
              <th>Descripción</th>
              <th>Dirección</th>
              <th>Identificación</th>
              <th>Moneda</th>
              <th>Fecha de Creación</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading || isPageLoading ? (
              [...Array(PAGE_SIZE).keys()].map((_, idx) => (
                <tr key={idx}>
                  <td><Skeleton height={30} width={150} /></td>
                  <td><Skeleton height={30} width={150} /></td>
                  <td><Skeleton height={30} width={150} /></td>
                  <td><Skeleton height={30} width={150} /></td>
                  <td><Skeleton height={30} width={150} /></td>
                  <td><Skeleton height={30} width={150} /></td>
                  <td><Skeleton height={30} width={150} /></td>
                </tr>
              ))
            ) : (
              paginatedRegistros.map((registro) => (
                <tr key={registro.codigo}>
                  <td>{registro.codigo}</td>
                  <td>{registro.descripcion}</td>
                  <td>{registro.direccion}</td>
                  <td>{registro.identificacion}</td>
                  <td>{registro.monedaNombre}</td>
                  <td>{new Date(registro.fechaCreacion).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setSelectedRegistro(registro);
                          setShowEditModal(true);
                        }}
                      >
                        <i className="bi bi-pencil"></i> Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(registro.Codigo)}
                      >
                        <i className="bi bi-trash"></i> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className={`pagination ${isPageLoading ? 'loading' : ''}`}>
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo; Anterior
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente &raquo;
          </button>
        </div>
      </div>

      {showCreateModal && (
        <CreateModal
          show={showCreateModal}
          handleClose={() => setShowCreateModal(false)}
          refreshData={refreshData}
        />
      )}
      
      {showEditModal && selectedRegistro && (
        <EditModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          registro={selectedRegistro}
          refreshData={refreshData}
        />
      )}
    </div>
  );
};

export default Home;
