import axios from 'axios';

// Test API connection
const testAPI = async () => {
  try {
    console.log('Testing API connection...');
    const response = await axios.get('https://task-eight-tan-50.vercel.app/');
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Connection Error:', error);
    return null;
  }
};

// Test user registration
const testRegistration = async (username, password) => {
  try {
    console.log(`Testing registration for user: ${username}`);
    const response = await axios.post('https://task-eight-tan-50.vercel.app/api/users/register', {
      username,
      password
    });
    console.log('Registration Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration Error:', error.response?.data || error.message);
    return null;
  }
};

// Test user login
const testLogin = async (username, password) => {
  try {
    console.log(`Testing login for user: ${username}`);
    const response = await axios.post('https://task-eight-tan-50.vercel.app/api/users/login', {
      username,
      password
    });
    console.log('Login Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);
    return null;
  }
};

export { testAPI, testRegistration, testLogin };