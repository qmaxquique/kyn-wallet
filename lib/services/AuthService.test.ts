import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService, resetMockUsers } from './AuthService';

describe('AuthService', () => {
  it('should return true for valid credentials', async () => {
    const result = await AuthService.login({
      Email: 'tucorreo@ejemplo.com',
      Password: 'password123',
    });
    expect(result).toBe(true);
    expect(AuthService.isAuthenticated()).toBe(true);
  });

  it('should return false for invalid credentials', async () => {
    const result = await AuthService.login({
      Email: 'wrong@example.com',
      Password: 'wrongpassword',
    });
    expect(result).toBe(false);
  });
});

describe('register', () => {
  beforeEach(() => {
    resetMockUsers();
  });

  it('registro exitoso retorna { Success: true }', async () => {
    const result = await AuthService.register({
      FullName: 'Diego',
      Email: 'nuevo@ejemplo.com',
      Password: 'Abc12345',
      ConfirmPassword: 'Abc12345',
      AcceptsTerms: true,
    });
    expect(result).toEqual({ Success: true });
  });

  it('usuario registrado aparece en MOCK_USERS', async () => {
    await AuthService.register({
      FullName: 'Diego',
      Email: 'nuevo@ejemplo.com',
      Password: 'Abc12345',
      ConfirmPassword: 'Abc12345',
      AcceptsTerms: true,
    });
    expect(AuthService.isEmailTaken('nuevo@ejemplo.com')).toBe(true);
  });

  it('correo duplicado retorna { Success: false, ErrorMessage: "Este correo ya está registrado" }', async () => {
    const result = await AuthService.register({
      FullName: 'Diego',
      Email: 'tucorreo@ejemplo.com',
      Password: 'Abc12345',
      ConfirmPassword: 'Abc12345',
      AcceptsTerms: true,
    });
    expect(result).toEqual({ Success: false, ErrorMessage: 'Este correo ya está registrado' });
  });

  it('isEmailTaken con correo existente retorna true', () => {
    expect(AuthService.isEmailTaken('tucorreo@ejemplo.com')).toBe(true);
  });

  it('isEmailTaken con correo nuevo retorna false', () => {
    expect(AuthService.isEmailTaken('nadie@ejemplo.com')).toBe(false);
  });

  it('usuario registrado puede iniciar sesión', async () => {
    await AuthService.register({
      FullName: 'Diego',
      Email: 'nuevo@ejemplo.com',
      Password: 'Abc12345',
      ConfirmPassword: 'Abc12345',
      AcceptsTerms: true,
    });
    const result = await AuthService.login({
      Email: 'nuevo@ejemplo.com',
      Password: 'Abc12345',
    });
    expect(result).toBe(true);
  });

  it('email vacío retorna error "Este campo es obligatorio"', async () => {
    const result = await AuthService.register({
      FullName: 'Diego',
      Email: '',
      Password: 'Abc12345',
      ConfirmPassword: 'Abc12345',
      AcceptsTerms: true,
    });
    expect(result).toEqual({ Success: false, ErrorMessage: 'Este campo es obligatorio' });
  });

  it('email formato inválido retorna error', async () => {
    const result = await AuthService.register({
      FullName: 'Diego',
      Email: 'nodomain',
      Password: 'Abc12345',
      ConfirmPassword: 'Abc12345',
      AcceptsTerms: true,
    });
    expect(result).toEqual({ Success: false, ErrorMessage: 'Ingresa un correo electrónico válido' });
  });
});
