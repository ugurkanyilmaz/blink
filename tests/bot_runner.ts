import io from 'socket.io-client';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';
const SOCKET_URL = 'http://localhost:3000';
const NUM_BOTS = 2000;

const createBot = async (index: number) => {
    try {
        const phone = `+90555${String(index).padStart(7, '0')}`;
        const password = 'password123';
        const alias = `Bot_${index}`;
        const alias_tag = `@bot${index}`;

        // 1. Register
        console.log(`Bot ${index}: Registering...`);
        let token;
        let userId;

        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, { phone, password });
            token = regRes.data.accessToken;
            userId = regRes.data.user.id;
        } catch (e: any) {
            if (e.response?.status === 400 || e.response?.status === 409) {
                // User exists, try login
                console.log(`Bot ${index}: User exists, logging in...`);
                const loginRes = await axios.post(`${API_URL}/auth/login`, { phone, password });
                token = loginRes.data.accessToken;
                userId = loginRes.data.user.id;
            } else {
                throw e;
            }
        }

        // 2. Update Profile
        console.log(`Bot ${index}: Updating profile...`);
        await axios.put(`${API_URL}/profile`, {
            alias,
            alias_tag,
            location_lat: 41.0082 + (Math.random() - 0.5) * 0.5, // Spread out over ~50km
            location_lon: 28.9784 + (Math.random() - 0.5) * 0.5,
            birthDate: `${Math.floor(Math.random() * (2005 - 1980) + 1980)}-01-01` // Random age 20-45
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // 3. Connect Socket & Join Pool
        console.log(`Bot ${index}: Connecting to socket...`);
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log(`Bot ${index}: Socket connected, joining pool...`);
            socket.emit('join_pool', { userId });
        });

        socket.on('role_assigned', (data) => {
            console.log(`Bot ${index}: Role assigned -> ${data.role}`);
        });

        socket.on('match_found', (data) => {
            console.log(`Bot ${index}: MATCH FOUND! Room: ${data.roomId}, Role: ${data.role}`);
            // Bot stays connected to keep the match alive
        });

    } catch (error: any) {
        console.error(`Bot ${index} Error:`, error.message);
    }
};

const runBots = async () => {
    console.log(`Starting ${NUM_BOTS} bots...`);
    for (let i = 0; i < NUM_BOTS; i++) {
        createBot(i);
        // Add delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 200));
    }
};

runBots();
