
// User types
export type UserRole = 'superadmin' | 'orgadmin' | 'user';

export interface User {
  id: string;
  userName: string;
  userRole: UserRole;
  organizationId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface UserDetails {
  userName: string;
  userRole: UserRole;
}

export interface AuthResponse {
  jwtToken: string;
  userDetails: UserDetails;
}

// Organization types
export interface Organization {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// IoT Device types
export interface IoTDevice {
  id: string;
  name: string;
  type: 'switch' | 'toggle' | 'button' | 'slider' | 'thermostat';
  status: boolean;
  value?: number;
  min?: number;
  max?: number;
  x: number;
  y: number;
  icon?: string;
  color?: string;
  organizationId: string;
}
