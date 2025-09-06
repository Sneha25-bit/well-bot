const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface AuthResponse extends ApiResponse {
  token?: string;
  refreshToken?: string;
  user?: unknown;
  data?: {
    token?: string;
    refreshToken?: string;
    user?: unknown;
  };
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      console.log('Making API request to:', url);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error [${response.status}]:`, errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || `Server error: ${response.status}`);
        } catch {
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
      }
      
      const data = await response.json();
      console.log('API response:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Request details:', { url, method: config.method });
      throw error;
    }
  }

  // Authentication methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
  }) {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && (response.token || response.data?.token)) {
      const token = response.token || response.data?.token;
      this.setToken(token);
    }

    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && (response.token || response.data?.token)) {
      const token = response.token || response.data?.token;
      this.setToken(token);
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'GET' });
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(userData: Record<string, unknown>) {
    return this.request('/auth/updatedetails', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async updatePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request('/auth/updatepassword', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgotpassword', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request(`/auth/resetpassword/${token}`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });
  }

  async verifyEmail(token: string) {
    return this.request(`/auth/verifyemail/${token}`, {
      method: 'GET',
    });
  }

  // User methods
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(userData: Record<string, unknown>) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getDashboardData() {
    return this.request('/users/dashboard');
  }

  async getUserPreferences() {
    return this.request('/users/preferences');
  }

  async updateUserPreferences(preferences: any) {
    return this.request('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    });
  }

  async deleteAccount() {
    return this.request('/users/account', {
      method: 'DELETE',
    });
  }

  // Chat methods
  async getChatSessions(params?: {
    page?: number;
    limit?: number;
    status?: string;
    sessionType?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    return this.request(`/chat/sessions${queryString ? `?${queryString}` : ''}`);
  }

  async getChatSession(id: string) {
    return this.request(`/chat/sessions/${id}`);
  }

  async createChatSession(data: { title: string; sessionType?: string }) {
    return this.request('/chat/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async addMessage(sessionId: string, messageData: {
    text: string;
    sender: 'user' | 'bot';
    messageType?: string;
    metadata?: any;
  }) {
    return this.request(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async updateChatSession(id: string, data: any) {
    return this.request(`/chat/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteChatSession(id: string) {
    return this.request(`/chat/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  async getChatAnalytics(period?: string) {
    const queryParams = period ? `?period=${period}` : '';
    return this.request(`/chat/analytics${queryParams}`);
  }

  // Medicine methods
  async getMedicines(params?: {
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    return this.request(`/medicines${queryString ? `?${queryString}` : ''}`);
  }

  async getMedicine(id: string) {
    return this.request(`/medicines/${id}`);
  }

  async createMedicine(medicineData: {
    name: string;
    dosage: string;
    frequency: string;
    times: string[];
    instructions?: string;
    reminders?: any;
  }) {
    return this.request('/medicines', {
      method: 'POST',
      body: JSON.stringify(medicineData),
    });
  }

  async updateMedicine(id: string, medicineData: any) {
    return this.request(`/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicineData),
    });
  }

  async deleteMedicine(id: string) {
    return this.request(`/medicines/${id}`, {
      method: 'DELETE',
    });
  }

  async markMedicineTaken(id: string, data: { time?: string; notes?: string }) {
    return this.request(`/medicines/${id}/taken`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMedicineReminders(date?: string) {
    const queryParams = date ? `?date=${date}` : '';
    return this.request(`/medicines/reminders${queryParams}`);
  }

  async getMedicineAnalytics(period?: string) {
    const queryParams = period ? `?period=${period}` : '';
    return this.request(`/medicines/analytics${queryParams}`);
  }

  // Period tracking methods
  async getPeriodHistory() {
    return this.request('/period/history');
  }

  async addPeriodEntry(entryData: {
    date: string;
    flowIntensity: 'light' | 'medium' | 'heavy';
    symptoms?: string[];
    mood?: string;
    notes?: string;
  }) {
    return this.request('/period/entries', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  async getCurrentPeriodCycle() {
    return this.request('/period/current');
  }

  async startPeriodCycle(cycleData: {
    periodStartDate: string;
    flowIntensity?: string;
    symptoms?: string[];
    mood?: string;
    notes?: string;
  }) {
    return this.request('/period/cycles', {
      method: 'POST',
      body: JSON.stringify(cycleData),
    });
  }

  async endPeriodCycle(id: string, data: { periodEndDate: string; notes?: string }) {
    return this.request(`/period/cycles/${id}/end`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getPeriodPredictions() {
    return this.request('/period/predictions');
  }

  async getPeriodAnalytics(period?: string) {
    const queryParams = period ? `?period=${period}` : '';
    return this.request(`/period/analytics${queryParams}`);
  }

  // Health plan methods
  async getHealthPlans(params?: {
    status?: string;
    planType?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    return this.request(`/health-plans${queryString ? `?${queryString}` : ''}`);
  }

  async getHealthPlan(id: string) {
    return this.request(`/health-plans/${id}`);
  }

  async createHealthPlan(planData: {
    title: string;
    description?: string;
    planType: string;
    duration: number;
    symptoms?: string[];
    tasks?: any[];
  }) {
    return this.request('/health-plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  async updateHealthPlan(id: string, planData: any) {
    return this.request(`/health-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(planData),
    });
  }

  async deleteHealthPlan(id: string) {
    return this.request(`/health-plans/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleTaskCompletion(planId: string, taskId: string, data: {
    completed?: boolean;
    notes?: string;
  }) {
    return this.request(`/health-plans/${planId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async generateAIHealthPlan(data: {
    symptoms: string[];
    planType?: string;
    duration?: number;
  }) {
    return this.request('/health-plans/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getHealthPlanAnalytics(period?: string) {
    const queryParams = period ? `?period=${period}` : '';
    return this.request(`/health-plans/analytics${queryParams}`);
  }

  // Token management
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export const apiService = new ApiService();
export default apiService;
