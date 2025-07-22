import axios from 'axios';

// Tạo một instance của axios
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL từ biến môi trường .env
  timeout: 10000, // timeout sau 10 giây
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor thêm token vào header trước mỗi request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor xử lý lỗi response tập trung (có thể mở rộng)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      console.warn('Hết phiên đăng nhập. Cần đăng nhập lại.');
      // Có thể redirect về trang login tại đây nếu muốn
    }

    return Promise.reject(error);
  }
);

export default instance;
