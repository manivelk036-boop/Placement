import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [student, setStudent] = useState(() => {
    const saved = localStorage.getItem('student');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/students/me')
        .then((res) => {
          setStudent(res.data.data);
          localStorage.setItem('student', JSON.stringify(res.data.data));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('student');
          setStudent(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, student: studentData } = res.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('student', JSON.stringify(studentData));
    setStudent(studentData);
    return studentData;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { token, student: studentData } = res.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('student', JSON.stringify(studentData));
    setStudent(studentData);
    return studentData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    setStudent(null);
  };

  const refreshStudent = async () => {
    const res = await api.get('/students/me');
    setStudent(res.data.data);
    localStorage.setItem('student', JSON.stringify(res.data.data));
    return res.data.data;
  };

  return (
    <AuthContext.Provider value={{ student, loading, login, register, logout, refreshStudent, setStudent }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
