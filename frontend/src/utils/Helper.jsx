/**
  * Function to make an api call
*/
export const apiCall = async (path, method, body, token) => {
  const fetchOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    }
  };
  if (body !== null) {
    fetchOptions.body = JSON.stringify(body);
  }
  const response = await fetch('http://localhost:5005' + path, fetchOptions);
  const data = await response.json();
  if (data.error) {
    console.log(data.error);
  } else {
    return data;
  }
};

/*
  * Function to convert a file to a data url
*/
export const fileToDataUrl = (file) => {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }
  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}
