import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { AuthService } from '../lib/services/AuthService';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('../lib/services/AuthService', () => ({
  AuthService: {
    register: vi.fn(),
    isEmailTaken: vi.fn().mockReturnValue(false),
  },
}));

describe('RegisterForm Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('envío válido llama a router.push con "/login?registered=true"', async () => {
    vi.mocked(AuthService.register).mockResolvedValue({ Success: true });

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Diego Martínez' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'nuevo@ejemplo.com' } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'Abc12345' } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'Abc12345' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login?registered=true');
    });
  });

  it('envío con correo duplicado muestra "Este correo ya está registrado"', async () => {
    vi.mocked(AuthService.register).mockResolvedValue({
      Success: false,
      ErrorMessage: 'Este correo ya está registrado',
    });

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Diego Martínez' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'tucorreo@ejemplo.com' } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'Abc12345' } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'Abc12345' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(screen.getByText('Este correo ya está registrado')).toBeInTheDocument();
    });
  });
});
