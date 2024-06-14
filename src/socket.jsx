import {io} from 'socket.io-client';

export const initSocket = async() => {
    const options = {
        'force new connection' : true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    const url = import.meta.env.VITE_BACKEND_URL;
    console.log('connecting to ',{url});
    return io(url, options);
}
