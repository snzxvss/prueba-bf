import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createRegistro, getMonedas } from '../services/api';
import StatusModal from './StatusModal';

const CreateModal = ({ show, handleClose, refreshData }) => {
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [monedaId, setMonedaId] = useState('');
  const [monedas, setMonedas] = useState([]);
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusVisible, setStatusVisible] = useState(false); 

  useEffect(() => {
    const fetchMonedas = async () => {
      try {
        const data = await getMonedas();
        setMonedas(data);
      } catch (error) {
        console.error('Error fetching monedas:', error);
      }
    };

    fetchMonedas();
  }, []);

  const handleSave = async () => {
    try {
      const response = await createRegistro({
        descripcion,
        direccion,
        identificacion,
        monedaId,
      });

      if (response.status === 201) {
        setStatus('success');
        setStatusMessage('Registro creado exitosamente');
        setStatusVisible(true);
        setTimeout(() => {
          setStatusVisible(false); // Ocultar
          handleClose(); // Cierra el modal
          refreshData(); // Actualización
        }, 5000);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating registro:', error);
      setStatus('error');
      setStatusMessage('Error al crear registro');
      setStatusVisible(true);
      setTimeout(() => {
        setStatusVisible(false); // Ocultar el StatusModal
        handleClose(); // Cerrar el modal
      }, 5000); 
    }
  };

  const handleMonedaChange = (event) => {
    const selectedOption = event.target.value;
    const selectedMoneda = monedas.find(
      (moneda) => `${moneda.nombre} (${moneda.codigo})` === selectedOption
    );
    if (selectedMoneda) {
      setMonedaId(selectedMoneda.id);
    }
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <>
      <div className="modal-backdrop" />
      <div className="modal">
        <div className="modal-content">
          <button className="close-btn" onClick={handleClose}>×</button>
          <h2>Crear Nuevo Registro</h2>
          <div className="modal-body">
            <label>
              Descripción:
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción"
              />
            </label>
            <label>
              Dirección:
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Dirección"
              />
            </label>
            <label>
              Identificación:
              <input
                type="text"
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
                placeholder="Identificación"
              />
            </label>
            <label>
              Moneda:
              <select onChange={handleMonedaChange}>
                <option value="">Selecciona una moneda</option>
                {monedas.map((moneda) => (
                  <option key={moneda.id}>
                    {moneda.nombre} ({moneda.codigo})
                  </option>
                ))}
              </select>
            </label>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
      {statusVisible && (
        <StatusModal status={status} message={statusMessage} />
      )}
    </>,
    document.body
  );
};

export default CreateModal;
