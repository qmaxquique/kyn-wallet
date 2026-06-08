import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import RegisterForm from './RegisterForm';
import { AuthService } from '../lib/services/AuthService';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('../lib/services/AuthService', () => ({
  AuthService: {
    register: vi.fn(),
    isEmailTaken: vi.fn().mockReturnValue(false),
  },
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('nombre vacío: blur → "Este campo es obligatorio"', () => {
    render(<RegisterForm />);
    const nameInput = screen.getByLabelText(/nombre completo/i);
    fireEvent.blur(nameInput);
    expect(screen.getByText('Este campo es obligatorio')).toBeInTheDocument();
  });

  it('nombre con solo espacios: blur → "Este campo es obligatorio"', () => {
    render(<RegisterForm />);
    const nameInput = screen.getByLabelText(/nombre completo/i);
    fireEvent.change(nameInput, { target: { value: '   ' } });
    fireEvent.blur(nameInput);
    expect(screen.getByText('Este campo es obligatorio')).toBeInTheDocument();
  });

  it('email vacío: blur → "Este campo es obligatorio"', () => {
    render(<RegisterForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    fireEvent.blur(emailInput);
    expect(screen.getByText('Este campo es obligatorio')).toBeInTheDocument();
  });

  it('email inválido (no vacío): blur → "Ingresa un correo electrónico válido"', () => {
    render(<RegisterForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    fireEvent.change(emailInput, { target: { value: 'nodomain' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Ingresa un correo electrónico válido')).toBeInTheDocument();
  });

  it('password vacío: blur → "Este campo es obligatorio"', () => {
    render(<RegisterForm />);
    const passInput = screen.getByLabelText(/^contraseña$/i);
    fireEvent.blur(passInput);
    expect(screen.getByText('Este campo es obligatorio')).toBeInTheDocument();
  });

  it('password < 8 chars (no vacío): blur → "La contraseña debe tener al menos 8 caracteres"', () => {
    render(<RegisterForm />);
    const passInput = screen.getByLabelText(/^contraseña$/i);
    fireEvent.change(passInput, { target: { value: 'short' } });
    fireEvent.blur(passInput);
    expect(screen.getByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument();
  });

  it('confirmPassword vacío: blur → "Este campo es obligatorio"', () => {
    render(<RegisterForm />);
    const confirmInput = screen.getByLabelText(/confirmar contraseña/i);
    fireEvent.blur(confirmInput);
    expect(screen.getByText('Este campo es obligatorio')).toBeInTheDocument();
  });

  it('confirmación distinta (no vacía): blur → "Las contraseñas no coinciden"', () => {
    render(<RegisterForm />);
    const passInput = screen.getByLabelText(/^contraseña$/i);
    const confirmInput = screen.getByLabelText(/confirmar contraseña/i);
    fireEvent.change(passInput, { target: { value: 'Abc12345' } });
    fireEvent.change(confirmInput, { target: { value: 'diferente' } });
    fireEvent.blur(confirmInput);
    expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
  });

  it('términos no aceptados en submit → "Debes aceptar los términos y condiciones"', () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Diego Martínez' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@ejemplo.com' } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'Abc12345' } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'Abc12345' } });
    // NO marcar checkbox
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));
    expect(screen.getByText('Debes aceptar los términos y condiciones')).toBeInTheDocument();
  });

  it('submit con errores NO llama a AuthService.register', () => {
    render(<RegisterForm />);
    // sin nombre
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));
    expect(AuthService.register).not.toHaveBeenCalled();
  });

  it('submit válido llama a AuthService.register con los datos correctos', async () => {
    vi.mocked(AuthService.register).mockResolvedValue({ Success: true });

    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Diego Martínez' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@ejemplo.com' } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'Abc12345' } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'Abc12345' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalledWith({
        FullName: 'Diego Martínez',
        Email: 'test@ejemplo.com',
        Password: 'Abc12345',
        ConfirmPassword: 'Abc12345',
        AcceptsTerms: true,
      });
    });
  });

  // T022 — Social logins
  it('click en "Google" dispara alert con texto exacto "Próximamente"', () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<RegisterForm />);
    fireEvent.click(screen.getByRole('button', { name: /google/i }));
    expect(window.alert).toHaveBeenCalledWith('Próximamente');
    vi.restoreAllMocks();
  });

  it('click en "Apple" dispara alert con texto exacto "Próximamente"', () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<RegisterForm />);
    fireEvent.click(screen.getByRole('button', { name: /apple/i }));
    expect(window.alert).toHaveBeenCalledWith('Próximamente');
    vi.restoreAllMocks();
  });

  it('link "Inicia sesión" apunta a /login', () => {
    render(<RegisterForm />);
    expect(screen.getByRole('link', { name: /inicia sesión/i })).toHaveAttribute('href', '/login');
  });
});
