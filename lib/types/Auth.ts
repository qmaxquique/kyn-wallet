export interface AuthCredentials {
  Email: string;
  Password: string;
}

export interface User {
  Email: string;
  Password: string;
  FullName?: string;
}

export interface RegisterCredentials {
  FullName: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
  AcceptsTerms: boolean;
}

export interface RegisterResult {
  Success: boolean;
  ErrorMessage?: string;
}

export interface ValidationError {
  Field: string;
  Message: string;
}
