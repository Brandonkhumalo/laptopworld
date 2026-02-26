const API_BASE = '/api';

function getCartSession(): string {
  let session = localStorage.getItem('cart_session');
  if (!session) {
    session = crypto.randomUUID();
    localStorage.setItem('cart_session', session);
  }
  return session;
}

function getAdminToken(): string | null {
  return localStorage.getItem('admin_token');
}

function setAdminToken(token: string) {
  localStorage.setItem('admin_token', token);
}

function clearAdminToken() {
  localStorage.removeItem('admin_token');
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'X-Cart-Session': getCartSession(),
    ...(options.headers as Record<string, string> || {}),
  };

  const token = getAdminToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || err.detail || 'Request failed');
  }

  if (res.status === 204) return {};
  return res.json();
}

export const api = {
  categories: {
    list: () => apiFetch('/categories/'),
    get: (id: number) => apiFetch(`/categories/${id}/`),
    create: (data: FormData) => apiFetch('/categories/', { method: 'POST', body: data, headers: {} }),
    update: (id: number, data: FormData) => apiFetch(`/categories/${id}/`, { method: 'PUT', body: data, headers: {} }),
    delete: (id: number) => apiFetch(`/categories/${id}/`, { method: 'DELETE' }),
  },
  products: {
    list: (params?: { category?: number; search?: string }) => {
      const qs = new URLSearchParams();
      if (params?.category) qs.set('category', String(params.category));
      if (params?.search) qs.set('search', params.search);
      const query = qs.toString();
      return apiFetch(`/products/${query ? `?${query}` : ''}`);
    },
    get: (id: number) => apiFetch(`/products/${id}/`),
    create: (data: FormData) => apiFetch('/products/', { method: 'POST', body: data, headers: {} }),
    update: (id: number, data: FormData) => apiFetch(`/products/${id}/`, { method: 'PATCH', body: data, headers: {} }),
    delete: (id: number) => apiFetch(`/products/${id}/`, { method: 'DELETE' }),
    deleteImage: (imageId: number) => apiFetch(`/product-images/${imageId}/delete/`, { method: 'DELETE' }),
  },
  deals: {
    list: (activeOnly = false) => apiFetch(`/deals/${activeOnly ? '?active=true' : ''}`),
    create: (data: object) => apiFetch('/deals/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: object) => apiFetch(`/deals/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: number) => apiFetch(`/deals/${id}/`, { method: 'DELETE' }),
  },
  topPicks: {
    list: () => apiFetch('/top-picks/'),
    create: (data: object) => apiFetch('/top-picks/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: object) => apiFetch(`/top-picks/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: number) => apiFetch(`/top-picks/${id}/`, { method: 'DELETE' }),
  },
  cart: {
    get: () => apiFetch('/cart/'),
    add: (productId: number, quantity = 1) => apiFetch('/cart/add/', { method: 'POST', body: JSON.stringify({ product_id: productId, quantity }) }),
    update: (itemId: number, quantity: number) => apiFetch(`/cart/item/${itemId}/`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
    remove: (itemId: number) => apiFetch(`/cart/item/${itemId}/remove/`, { method: 'DELETE' }),
  },
  checkout: (data: object) => apiFetch('/checkout/', { method: 'POST', body: JSON.stringify(data) }),
  paymentStatus: (orderNumber: string) => apiFetch(`/payment/status/${orderNumber}/`),
  orders: {
    list: (params?: { status?: string; fulfillment_type?: string; search?: string }) => {
      const qs = new URLSearchParams();
      if (params?.status) qs.set('status', params.status);
      if (params?.fulfillment_type) qs.set('fulfillment_type', params.fulfillment_type);
      if (params?.search) qs.set('search', params.search);
      const query = qs.toString();
      return apiFetch(`/orders/${query ? `?${query}` : ''}`);
    },
    updateStatus: (id: number, status: string) => apiFetch(`/orders/${id}/update_status/`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
  auth: {
    login: async (username: string, password: string) => {
      const data = await apiFetch('/auth/login/', { method: 'POST', body: JSON.stringify({ username, password }) });
      if (data.token) setAdminToken(data.token);
      return data;
    },
    logout: async () => {
      await apiFetch('/auth/logout/', { method: 'POST' });
      clearAdminToken();
    },
    check: () => apiFetch('/auth/check/'),
  },
};

export { getCartSession, getAdminToken, clearAdminToken };
