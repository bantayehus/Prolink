const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8082';

export interface LoginResponse {
  token: string;
  message?: string;
  status?: string;
  fullName?: string;
}

// ─── Helper: build national ID image URL by phone ───────────────────────────
export function getNationalIdUrl(phone: string | null): string | null {
  if (!phone) return null;
  return `${BASE_URL}/api/files/national-id?phone=${encodeURIComponent(phone)}`;
}

export function getCategoryImageUrl(name: string | null): string | null {
  if (!name) return null;
  return `${BASE_URL}/api/files/category-image?name=${encodeURIComponent(name)}`;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('adminToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('adminToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('adminToken');
  }
  // ─── Unauthenticated request ─────────────────────────────────────────
  // private async publicRequest(endpoint: string, options: RequestInit = {}) {
  //   const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  //   const url = `${BASE_URL}${cleanEndpoint}`;

  //   const response = await fetch(url, {
  //     ...options,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       ...options.headers,
  //     },
  //   });

  //   if (!response.ok) {
  //     const errorText = await response.text().catch(() => 'No error details');
  //     throw new Error(`HTTP ${response.status}: ${errorText}`);
  //   }

  //   return response.json();
  // }


  private async publicRequest(endpoint: string, options: RequestInit = {}) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${cleanEndpoint}`;
  
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: Error occurred`;
      try {
        const errorData = await response.json();
        // Use the 'message' field from your API response
        errorMessage = errorData.message || JSON.stringify(errorData);
      } catch (e) {
        // Fallback if the response isn't JSON
        errorMessage = await response.text();
      }
      throw new Error(errorMessage);
    }
  
    return response.json();
  }
  // ─── Authenticated request ───────────────────────────────────────────
  // private async authRequest(endpoint: string, options: RequestInit = {}) {
  //   const token = this.getToken();

  //   if (!token) {
  //     window.dispatchEvent(new Event('token-expired'));
  //     throw new Error('No auth token found. Please log in.');
  //   }

  //   const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  //   const url = `${BASE_URL}${cleanEndpoint}`;

  //   console.log(`📡 [${options.method || 'GET'}] ${url}`);

  //   try {
  //     const response = await fetch(url, {
  //       ...options,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //         ...options.headers,
  //       },
  //     });

  //     console.log(`📨 Response: ${response.status} ${response.statusText}`);

  //     if (response.status === 401) {
  //       this.clearToken();
  //       window.dispatchEvent(new Event('token-expired'));
  //       throw new Error('Token expired. Please login again.');
  //     }

  //     if (!response.ok) {
  //       const errorText = await response.text().catch(() => 'No error message');
  //       throw new Error(`HTTP ${response.status}: ${errorText}`);
  //     }

  //     return response.json();
  //   } catch (error: any) {
  //     console.error('❌ Fetch Error:', error.message);
  //     console.error('🔗 Failed URL:', url);

  //     if (error.message.includes('Failed to fetch')) {
  //       throw new Error(`Cannot connect to backend at ${BASE_URL}. Make sure Spring Boot is running on port 8082.`);
  //     }

  //     throw error;
  //   }
  // }
  private async authRequest(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
  
    if (!token) {
      window.dispatchEvent(new Event('token-expired'));
      throw new Error('No auth token found. Please log in.');
    }
  
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${cleanEndpoint}`;
  
    console.log(`📡 [${options.method || 'GET'}] ${url}`);
  
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });
  
      console.log(`📨 Response: ${response.status} ${response.statusText}`);
  
      // Handle 401 specifically
      if (response.status === 401) {
        this.clearToken();
        window.dispatchEvent(new Event('token-expired'));
        throw new Error('Token expired. Please login again.');
      }
  
      // Handle non-200 responses by parsing the JSON error message
      if (!response.ok) {
        let errorMessage: string;
        try {
          const errorData = await response.json();
          // Extract the 'message' field from your API's JSON response
          errorMessage = errorData.message || `HTTP ${response.status}: An error occurred`;
        } catch (e) {
          // Fallback if the body is not JSON
          errorMessage = await response.text().catch(() => `HTTP ${response.status}: Unexpected error`);
        }
        throw new Error(errorMessage);
      }
  
      return response.json();
    } catch (error: any) {
      console.error('❌ Fetch Error:', error.message);
      
      // Provide a helpful hint for network connectivity issues
      if (error.message.includes('Failed to login')) {
        throw new Error(`Cannot connect to backend at ${BASE_URL}. Make sure the server is running.`);
      }
  
      // Re-throw the clean error message to be caught by the UI
      throw error;
    }
  }
  

  // ─── Authenticated image fetch (returns blob URL) ────────────────────
  async fetchImageAsBlob(url: string): Promise<string | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) return null;

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  }

  // ─── Auth ────────────────────────────────────────────────────────────
  async login(phone: string, password: string): Promise<LoginResponse> {
    return this.publicRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
  }

  // ─── Providers ───────────────────────────────────────────────────────
  async getProviders() {
    return this.authRequest('/api/providers');
  }

  async verifyProvider(phone: string, verified: boolean) {
    return this.authRequest(
      `/api/verify?phone=${encodeURIComponent(phone)}&verified=${verified}`,
      { method: 'PUT' }
    );
  }

  // ─── Provider National ID image ──────────────────────────────────────
  async getProviderImage(phone: string): Promise<string | null> {
    const url = getNationalIdUrl(phone);
    if (!url) return null;
    return this.fetchImageAsBlob(url);
  }


  // ─── Category image ───────────────────────────────────────────────────
async getCategoryImage(name: string): Promise<string | null> {
  const url = getCategoryImageUrl(name);
  if (!url) return null;
  return this.fetchImageAsBlob(url);
}

// ─── Add Category (multipart/form-data) ──────────────────────────────
async addCategory(name: string, description: string, image: File): Promise<any> {
  const token = this.getToken();
  if (!token) throw new Error('No auth token found. Please log in.');

  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  formData.append('image', image);

  const response = await fetch(`${BASE_URL}/api/categories`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // ⚠️ Do NOT set Content-Type here — browser sets it automatically with boundary for multipart
    },
    body: formData,
  });

  if (response.status === 401) {
    this.clearToken();
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'No error details');
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}
  // ─── Categories ──────────────────────────────────────────────────────
  async getCategories() {
    return this.authRequest('/api/categories');
  }

  // ─── Customers ───────────────────────────────────────────────────────
  async getCustomers() {
    return this.authRequest('/api/customers/all');
  }
  // ─── Orders ───────────────────────────────────────────────────────────
async getAllOrders() {
  return this.authRequest('/api/orders/all');
}
async getDashboard() {
  return this.authRequest('/api/dashboard/stats');
}
async getAllservices(){

  return this.authRequest('/api/services/getAllServiceForAdmin?roleContext=ROLE_CUSTOMER')
}
async updateServiceStatus(serviceId: number, approved: boolean) {
  return this.authRequest(`/api/services/${serviceId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ approved }),
  });
}
async getFeedback(){

  return this.authRequest('/api/feedback/all')
}

// Add these methods to your ApiClient class

async updateCategory(id: number, name: string, description: string, image?: File) {
  const token = this.getToken();
  if (!token) throw new Error('No auth token found. Please log in.');

  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  if (image) formData.append('image', image);

  const response = await fetch(`${BASE_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (response.status === 401) {
    this.clearToken();
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Update failed');
    throw new Error(errorText);
  }

  return response.json();
}

async deleteCategory(id: number) {
  const token = this.getToken();
  if (!token) throw new Error('No auth token found.');

  const response = await fetch(`${BASE_URL}/api/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    this.clearToken();
    throw new Error('Session expired.');
  }

  if (!response.ok) {
    throw new Error('Failed to delete category');
  }

  return true;
}
}

export const apiClient = new ApiClient();