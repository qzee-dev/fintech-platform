import api from './api';

export const authService = {
  login: async (email, password) => {
    // ✅ Demo login bypass
    if (email === 'demo@fintech.com' && password === 'demo123') {
      return { user: { id: 1, name: 'Demo User', email }, token: 'demo-token' };
    }
    // ✅ Real backend login
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};









//import api from './api';

//export const authService = {
 // login: async (email, password) => {
 //   const response = await api.post('/auth/login', { email, password });
 //  //  return response.data;
// // },
 // register: async (userData) => {
 // //  const response = await api.post('/auth/register', userData);
 //   return response.data;
 // },
 // logout: async () => {
 //   const response = await api.post('/auth/logout');
 //   return response.data;
// // },
//};



