import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import '../assets/login.css';

const Login = () => {
  const [identificacion, setIdentificacion] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigate = useNavigate();

  useEffect(() => {
    // Revisar si hay un error
    const storedError = localStorage.getItem('loginError');
    if (storedError) {
      setError(storedError);
      localStorage.removeItem('loginError'); // Limpiar el error
    }
  }, []);

  const handleChange = (e) => {
    setIdentificacion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir la recarga
    setError(''); // Limpiar errores previos
    setLoading(true); // Activar estado de carga
    try {
      console.log('Intentando iniciar sesión con:', { identificacion });

      // Llamada a la función de login del servicio
      await login({ identificacion });

      console.log('Login exitoso. Redirigiendo a /home.');
      navigate('/home');
    } catch (err) {
      console.error('Error al iniciar sesión:', err.response ? err.response.data : err.message);
      localStorage.setItem('loginError', 'Credenciales inválidas');
      window.location.reload(); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="icon-container">
          <i className="bi bi-person-circle"></i>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identificacion">Identificación:</label>
            <input
              type="text"
              id="identificacion"
              name="identificacion"
              value={identificacion}
              onChange={handleChange}
              required
              className="login-input"
            />
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Cargando...' : 'Login'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
