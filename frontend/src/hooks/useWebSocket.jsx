import { useEffect, useRef } from 'react';


const useWebSocket = (url) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => console.log('WebSocket connected');

    socket.onmessage = (e) => {
      console.log('Received:', e.data);
    };

    socket.onerror = (e) => console.error('WebSocket error:', e);
    socket.onclose = () => console.log('WebSocket closed');

    return () => {  //calls when component unmounts
        if (socket.readyState === WebSocket.OPEN) {
        socket.send('leave');
    }
        socket.close()
    };
  }, [url]);

  return socketRef; 
};

export default useWebSocket;
