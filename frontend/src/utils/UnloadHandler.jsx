 const handleUnload = (endpoint, method, token) => {
    fetch(endpoint, {
      method: method,
      headers: {
        'Authorization': `${token}`,
      },
        keepalive: true,
      });
    };

    export default handleUnload;