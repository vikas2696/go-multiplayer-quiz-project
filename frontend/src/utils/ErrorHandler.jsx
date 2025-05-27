export function GetErrorMessage(err) {
  if (err.response?.data) {
    const data = err.response.data;
    const messageKey = Object.keys(data).find(
      (key) =>
        key.toLowerCase().includes('message') ||
        key.toLowerCase().includes('error')
    );
    return messageKey ? data[messageKey] : 'Something went wrong';
  } else if (err.request) {
    return 'Cannot connect to server.';
  } else {
    return 'An unexpected error occurred: ' + err.message;
  }
}
