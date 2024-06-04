const baseUrl = "http://localhost:5000";

export const api = `${baseUrl}/api`;

export const generatePublicUrlProducts = (fileName) => {
  return `${baseUrl}/public/products/${fileName}`;
};

export const generatePublicUrlProductsCategories = (fileName) => {
  return `${baseUrl}/public/productscategories/${fileName}`;
};

export const generatePublicUrlClients = (fileName) => {
  return `${baseUrl}/public/clients/${fileName}`;
};

export const generatePublicUrlProviders = (fileName) => {
  return `${baseUrl}/public/providers/${fileName}`;
};

export const generatePublicUrlPartners = (fileName) => {
  return `${baseUrl}/public/partners/${fileName}`;
};

export const generatePublicUrlWorkers = (fileName) => {
  return `${baseUrl}/public/workers/${fileName}`;
};