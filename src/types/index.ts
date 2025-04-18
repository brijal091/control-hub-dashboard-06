// User types
export type UserRole = '1' | '2' | '3';

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
  id: number;
  orgname: string;
  rowstate: string;
  createdAt: string;
  updatedAt: string;
}

// IoT Device types
export type DeviceType = 'switch' | 'slider' | 'button' | 'input' | 'stepH' | 'stepV' | 'joystick' | 'timer';

export interface DeviceFormData {
  name: string;
  type: DeviceType;
  icon?: string;
  min?: number;
  max?: number;
  value?: number;
  color?: string;
}

export interface IoTDevice extends DeviceFormData {
  id: string;
  status?: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  organizationId: string;
  timerValue?: number;
  joystickPosition?: { x: number; y: number };
}