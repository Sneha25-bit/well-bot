export interface User {
  _id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  height?: string;
  weight?: string;
  bloodType?: string;
  allergies?: string[];
  medications?: string[];
  chronicConditions?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: {
    periodTracker: boolean;
    medicineReminders: boolean;
    healthInsights: boolean;
    notifications: boolean;
  };
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
