import { toast } from 'react-toastify'; 
 
 const handleUnload = (endpoint, method, token) => {
    fetch(endpoint, {
      method: method,
      headers: {
        'Authorization': `${token}`,
      },
        keepalive: true,
      })
      .then(res => res.json())
      .then(data => {
        toast.success(data.message);
      })
      .catch(err => {
        toast.error('Error:', err);
      });
    };

    export default handleUnload;