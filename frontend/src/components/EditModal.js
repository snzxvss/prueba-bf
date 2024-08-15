import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { updateRegistro, getMonedas } from '../services/api';
import StatusModal from './StatusModal';
import '../assets/modal.css';

const EditModal = ({ show, handleClose, registro, refreshData }) => {
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [monedaId, setMonedaId] = useState('');
  const [monedas, setMonedas] = useState([]);
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errors, setErrors] = useState({}); // Errores de validación

  useEffect(() => {
    const fetchMonedas = async () => {
      try {
        const data = await getMonedas();
        setMonedas(data);
        if (registro) {
          setDescripcion(registro.descripcion);
          setDireccion(registro.direccion);
          setIdentificacion(registro.identificacion);
          setMonedaId(registro.monedaId);
        }
      } catch (error) {
        console.error('Error fetching monedas:', error);
      }
    };

    fetchMonedas();
  }, [registro]);

  const validate = () => {
    const errors = {};
    if (!monedaId) errors.monedaId = 'Moneda es requerida';
    if (!descripcion || descripcion.length > 250) errors.descripcion = 'Descripción es requerida y debe tener menos de 250 caracteres';
    if (!direccion || direccion.length > 250) errors.direccion = 'Dirección es requerida y debe tener menos de 250 caracteres';
    if (!identificacion || identificacion.length > 50) errors.identificacion = 'Identificación es requerida y debe tener menos de 50 caracteres';
    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await updateRegistro(registro.codigo, {
        descripcion,
        direccion,
        identificacion,
        monedaId,
      });

      if (response.status === 200) {
        setStatus('success');
        setStatusMessage('Registro actualizado exitosamente');
        setTimeout(() => {
          setStatus(null); // Limpia el estado
          refreshData(); // Actualiza los datos
          handleClose(); // Cierra el modal
        }, 5000); // Tiempo para mostrar la notificación
      } else {
        throw new Error('No se actualizó correctamente');
      }
    } catch (error) {
      console.error('Error updating registro:', error);
      setStatus('error');
      setStatusMessage('Error al actualizar registro');
      setTimeout(() => {
        setStatus(null); // Limpiar el estado
      }, 5000);
    }
  };

  const handleMonedaChange = (event) => {
    setMonedaId(event.target.value);
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <>
      <div className="modal-backdrop" />
      <div className="modal-content">
        <button className="close-btn" onClick={handleClose}>×</button>
        <h2>Editar Registro</h2>
        <div className="modal-body">
          <label>
            Descripción:
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción"
            />
            {errors.descripcion && <p className="error-message">{errors.descripcion}</p>}
          </label>
          <label>
            Dirección:
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Dirección"
            />
            {errors.direccion && <p className="error-message">{errors.direccion}</p>}
          </label>
          <label>
            Identificación:
            <input
              type="text"
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
              placeholder="Identificación"
            />
            {errors.identificacion && <p className="error-message">{errors.identificacion}</p>}
          </label>
          <label>
            Moneda:
            <select value={monedaId} onChange={handleMonedaChange}>
              <option value="">Selecciona una moneda</option>
              {monedas.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.nombre} ({moneda.codigo})
                </option>
              ))}
            </select>
            {errors.monedaId && <p className="error-message">{errors.monedaId}</p>}
          </label>
          <button className="btn-save" onClick={handleSave}>Guardar</button>
        </div>
      </div>
      {status && (
        <StatusModal status={status} message={statusMessage} />
      )}
    </>,
    document.body
  );
};

export default EditModal;
