import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadImage = async (file) => {
  if (!file) return '';
  const formData = new FormData();
  formData.append('image', file);
  try {
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.url;
  } catch (err) {
    alert('Gagal mengunggah gambar: ' + (err.response?.data?.error || err.message));
    return '';
  }
};

export default api;
