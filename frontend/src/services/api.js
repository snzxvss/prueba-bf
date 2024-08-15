import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5193',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Obtener JWT del almacenamiento local
const getToken = () => localStorage.getItem('jwt');

// Configurar interceptores para añadir el JWT a las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Enviando solicitud:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => Promise.reject(error)
);

// Configurar interceptores para manejar respuestas y redirigir si es necesario
apiClient.interceptors.response.use(
  (response) => {
    console.log('Respuesta recibida:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.log('Error en la respuesta:', {
        url: error.config.url,
        method: error.config.method,
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.log('Error en la solicitud:', error.message);
    }

    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getMonedas = async () => {
  try {
    console.log('Obteniendo monedas');
    const response = await apiClient.get('/api/Monedas');
    console.log('Monedas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error al obtener monedas:', error);
    throw error;
  }
};

export const createMoneda = async (moneda) => {
  try {
    console.log('Creando moneda:', moneda);
    const response = await apiClient.post('/api/Monedas/Create', moneda);
    console.log('Moneda creada:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error al crear moneda:', error);
    throw error;
  }
};

export const updateMoneda = async (moneda) => {
  try {
    console.log('Actualizando moneda:', moneda);
    const response = await apiClient.put('/api/Monedas/Edit', moneda);
    console.log('Moneda actualizada:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error al actualizar moneda:', error);
    throw error;
  }
};

export const deleteMoneda = async (id) => {
  try {
    console.log(`Eliminando moneda con ID ${id}`);
    const response = await apiClient.delete(`/api/Monedas/Delete/${id}`);
    console.log('Moneda eliminada:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error al eliminar moneda:', error);
    throw error;
  }
};

export const getRegistros = async () => {
  try {
    console.log('Obteniendo registros');
    const response = await apiClient.get('/api/Registros');
    console.log('Registros obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error al obtener registros:', error);
    throw error;
  }
};

export const createRegistro = async (registro) => {
  try {
    const response = await apiClient.post('/api/Registros', registro);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Error en createRegistro:', error.response || error.message);

    const err = new Error(error.message);
    err.status = error.response?.status;
    throw err;
  }
};

export const updateRegistro = async (codigo, registro) => {
  try {
    const registroConCodigo = { ...registro, codigo };
    
    console.log(`Actualizando registro con Codigo: ${codigo}:`, registroConCodigo);
    const response = await apiClient.put('/api/Registros', registroConCodigo);
    
    console.log('Registro actualizado:', response.data);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.log('Error al actualizar registro:', error.response || error.message);
    const customError = new Error(error.message);
    customError.status = error.response?.status;
    throw customError;
  }
};

export const deleteRegistro = async (codigo) => {
  try {
    console.log(`Eliminando registro con Codigo ${codigo}`);
    const response = await apiClient.delete(`/api/Registros/${codigo}`);
    console.log('Registro eliminado:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error al eliminar registro:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    console.log('Datos de inicio de sesión:', credentials);
    const response = await apiClient.post('/api/Auth/Login', credentials);
    localStorage.setItem('jwt', response.data.token);
    console.log('Respuesta de inicio de sesión:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error de inicio de sesión:', error.response || error.message);
    if (error.response && error.response.data && error.response.data.message) {
      console.error('Mensaje de error del servidor:', error.response.data.message);
    }
    throw error;
  }
};

