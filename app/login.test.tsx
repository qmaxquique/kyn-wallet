import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from '../components/LoginForm';
import LoginPage from '../app/login/page';
import { AuthService } from '../lib/services/AuthService';
import React from 'react';

// Mock the router
const mockPush = vi.fn();
const mockGetSearchParam = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({ get: mockGetSearchParam }),
}));

describe('LoginForm Integration', () => {
  it('should redirect to /construction on successful login', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'tucorreo@ejemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/construction');
    }, { timeout: 2000 });
  });

  it('should show error message on failed login (valid format but wrong credentials)', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } }); // 8+ chars to pass client-side validation
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
    });
  });
});

describe('LoginPage banner de éxito', () => {
  it('muestra banner de éxito cuando searchParams registered=true', () => {
    mockGetSearchParam.mockImplementation((key: string) => (key === 'registered' ? 'true' : null));
    render(<LoginPage />);
    expect(
      screen.getByText('Cuenta creada exitosamente. Ahora puedes iniciar sesión.')
    ).toBeInTheDocument();
  });

  it('NO muestra banner cuando no hay parámetro registered', () => {
    mockGetSearchParam.mockReturnValue(null);
    render(<LoginPage />);
    expect(screen.queryByText(/cuenta creada/i)).not.toBeInTheDocument();
  });
});
