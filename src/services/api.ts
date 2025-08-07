const BASE_URL = 'https://menumaster-two.vercel.app/api';

// Generic API function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// Generic API function for FormData
async function apiCallFormData<T>(
  endpoint: string,
  formData: FormData,
  method: 'POST' | 'PUT' = 'POST'
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// Restaurant Admins API
export const restaurantAdminsAPI = {
  getAll: () => apiCall<any[]>('/restaurant-admins'),
  getById: (id: string) => apiCall<any>(`/restaurant-admins/${id}`),
  create: (admin: any) => apiCall<any>('/restaurant-admins', {
    method: 'POST',
    body: JSON.stringify(admin),
  }),
  update: (id: string, admin: any) => apiCall<any>(`/restaurant-admins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(admin),
  }),
  delete: (id: string) => apiCall<{ message: string }>(`/restaurant-admins/${id}`, {
    method: 'DELETE',
  }),
};

// Restaurants API
export const restaurantsAPI = {
  getAll: () => apiCall<any[]>('/restaurants'),
  getById: (id: string) => apiCall<any>(`/restaurants/${id}`),
  create: (formData: FormData) => apiCallFormData<any>('/restaurants', formData),
  update: (id: string, formData: FormData) => apiCallFormData<any>(`/restaurants/${id}`, formData, 'PUT'),
  delete: (id: string) => apiCall<{ message: string }>(`/restaurants/${id}`, {
    method: 'DELETE',
  }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiCall<any[]>('/categories'),
  getById: (id: string) => apiCall<any>(`/categories/${id}`),
  create: (formData: FormData) => apiCallFormData<any>('/categories', formData),
  update: (id: string, formData: FormData) => apiCallFormData<any>(`/categories/${id}`, formData, 'PUT'),
  delete: (id: string) => apiCall<{ message: string }>(`/categories/${id}`, {
    method: 'DELETE',
  }),
};

// Products API
export const productsAPI = {
  getAll: () => apiCall<any[]>('/products'),
  getById: (id: string) => apiCall<any>(`/products/${id}`),
  create: (formData: FormData) => apiCallFormData<any>('/products', formData),
  update: (id: string, formData: FormData) => apiCallFormData<any>(`/products/${id}`, formData, 'PUT'),
  delete: (id: string) => apiCall<{ message: string }>(`/products/${id}`, {
    method: 'DELETE',
  }),
};

// Offers API
export const offersAPI = {
  getAll: () => apiCall<any[]>('/offers'),
  getById: (id: string) => apiCall<any>(`/offers/${id}`),
  create: (offer: any) => apiCall<any>('/offers', {
    method: 'POST',
    body: JSON.stringify(offer),
  }),
  update: (id: string, offer: any) => apiCall<any>(`/offers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(offer),
  }),
  delete: (id: string) => apiCall<{ message: string }>(`/offers/${id}`, {
    method: 'DELETE',
  }),
};