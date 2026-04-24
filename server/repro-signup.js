
const axios = require('axios');

async function testSignup() {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    const userData = {
        name: 'Test User',
        email: uniqueEmail,
        password: 'password123',
        confirmPassword: 'password123',
        role: 'user'
    };

    console.log(`Attempting signup with ${uniqueEmail} and confirmPassword...`);

    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', userData);
        console.log('Signup Successful!');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    } catch (error) {
        console.error('Signup Failed!');
        if (error.response) {
            console.error('Data Message:', error.response.data.message);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testSignup();
