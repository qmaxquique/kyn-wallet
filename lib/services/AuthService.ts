import { AuthCredentials, User, RegisterCredentials, RegisterResult } from '../types/Auth';
import { validateEmail, validatePassword, validateNotEmpty, validateFullName, validateConfirmPassword, validateTerms } from '../utils/Validation';

export interface IAuthService {
  login(credentials: AuthCredentials): Promise<boolean>;
  isAuthenticated(): boolean;
  isEmailTaken(email: string): boolean;
  register(credentials: RegisterCredentials): Promise<RegisterResult>;
}

const INITIAL_MOCK_USERS: User[] = [
  {
    Email: 'tucorreo@ejemplo.com',
    Password: 'password123',
  },
];

const MOCK_USERS: User[] = [...INITIAL_MOCK_USERS];

let currentUser: User | null = null;

const simulateHash = (p: string): string => btoa(p);

export const resetMockUsers = (): void => {
  MOCK_USERS.length = 0;
  MOCK_USERS.push(...INITIAL_MOCK_USERS);
};

export const AuthService: IAuthService = {
  async login(credentials: AuthCredentials): Promise<boolean> {
    // Simulating API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const hashedPassword = simulateHash(credentials.Password);
    const user = MOCK_USERS.find(
      (u) => u.Email === credentials.Email &&
        (u.Password === credentials.Password || u.Password === hashedPassword)
    );

    if (user) {
      currentUser = user;
      return true;
    }

    return false;
  },

  isAuthenticated(): boolean {
    return currentUser !== null;
  },

  isEmailTaken(email: string): boolean {
    return MOCK_USERS.some((u) => u.Email.toLowerCase() === email.toLowerCase());
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResult> {
    if (!validateNotEmpty(credentials.Email)) {
      return { Success: false, ErrorMessage: 'Este campo es obligatorio' };
    }
    if (!validateEmail(credentials.Email)) {
      return { Success: false, ErrorMessage: 'Ingresa un correo electrónico válido' };
    }
    if (this.isEmailTaken(credentials.Email)) {
      return { Success: false, ErrorMessage: 'Este correo ya está registrado' };
    }
    if (!validatePassword(credentials.Password)) {
      return { Success: false, ErrorMessage: 'La contraseña debe tener al menos 8 caracteres' };
    }
    if (!validateConfirmPassword(credentials.Password, credentials.ConfirmPassword)) {
      return { Success: false, ErrorMessage: 'Las contraseñas no coinciden' };
    }
    if (!validateFullName(credentials.FullName)) {
      return { Success: false, ErrorMessage: 'Este campo es obligatorio' };
    }
    if (!validateTerms(credentials.AcceptsTerms)) {
      return { Success: false, ErrorMessage: 'Debes aceptar los términos y condiciones' };
    }

    MOCK_USERS.push({
      FullName: credentials.FullName,
      Email: credentials.Email,
      Password: simulateHash(credentials.Password),
    });

    return { Success: true };
  },
};
