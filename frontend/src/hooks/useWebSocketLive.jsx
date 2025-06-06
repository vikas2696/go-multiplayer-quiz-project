import { useEffect, useRef, useState } from 'react';


const useWebSocketLive = (url) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      console.log('WebSocket connected');
    }

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

  return [socketRef, connected]; 
};

export default useWebSocketLive;
