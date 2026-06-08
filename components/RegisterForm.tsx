'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import SocialLogins from './SocialLogins';
import { AuthService } from '../lib/services/AuthService';
import {
  validateEmail,
  validatePassword,
  validateNotEmpty,
  validateFullName,
  validateConfirmPassword,
  validateTerms,
} from '../lib/utils/Validation';

const RegisterForm: React.FC = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFullNameBlur = () => {
    if (!validateFullName(fullName)) {
      setFullNameError('Este campo es obligatorio');
    } else {
      setFullNameError(null);
    }
  };

  const handleEmailBlur = () => {
    if (!validateNotEmpty(email)) {
      setEmailError('Este campo es obligatorio');
    } else if (!validateEmail(email)) {
      setEmailError('Ingresa un correo electrónico válido');
    } else {
      setEmailError(null);
    }
  };

  const handlePasswordBlur = () => {
    if (!validateNotEmpty(password)) {
      setPasswordError('Este campo es obligatorio');
    } else if (!validatePassword(password)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
    } else {
      setPasswordError(null);
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (!validateNotEmpty(confirmPassword)) {
      setConfirmPasswordError('Este campo es obligatorio');
    } else if (!validateConfirmPassword(password, confirmPassword)) {
      setConfirmPasswordError('Las contraseñas no coinciden');
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    let hasError = false;

    if (!validateFullName(fullName)) {
      setFullNameError('Este campo es obligatorio');
      hasError = true;
    } else {
      setFullNameError(null);
    }

    if (!validateNotEmpty(email)) {
      setEmailError('Este campo es obligatorio');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Ingresa un correo electrónico válido');
      hasError = true;
    } else {
      setEmailError(null);
    }

    if (!validateNotEmpty(password)) {
      setPasswordError('Este campo es obligatorio');
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (!validateNotEmpty(confirmPassword)) {
      setConfirmPasswordError('Este campo es obligatorio');
      hasError = true;
    } else if (!validateConfirmPassword(password, confirmPassword)) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      hasError = true;
    } else {
      setConfirmPasswordError(null);
    }

    if (!validateTerms(acceptsTerms)) {
      setTermsError('Debes aceptar los términos y condiciones');
      hasError = true;
    } else {
      setTermsError(null);
    }

    if (hasError) {
      return;
    }

    const result = await AuthService.register({
      FullName: fullName,
      Email: email,
      Password: password,
      ConfirmPassword: confirmPassword,
      AcceptsTerms: acceptsTerms,
    });

    if (result.Success) {
      router.push('/login?registered=true');
    } else if (result.ErrorMessage === 'Este correo ya está registrado') {
      setEmailError(result.ErrorMessage);
    } else {
      setSubmitError(result.ErrorMessage || 'Error al registrarse');
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center lg:text-left">
        <h1 className="text-[30px] font-bold text-[#16182C]">Crea tu cuenta</h1>
        <p className="mt-2 text-[16px] font-normal text-[#8A8CA8]">
          Completa tus datos para comenzar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="fullName"
          label="Nombre completo"
          type="text"
          placeholder="Diego Martínez"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onBlur={handleFullNameBlur}
          error={fullNameError || undefined}
          className="h-[52px] rounded-xl border-[1.5px] border-[#D7D9E6]"
          autoComplete="name"
        />

        <Input
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleEmailBlur}
          error={emailError || undefined}
          className="h-[52px] rounded-xl border-[1.5px] border-[#D7D9E6]"
          autoComplete="email"
        />

        <div className="relative">
          <Input
            id="password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handlePasswordBlur}
            error={passwordError || undefined}
            className="h-[52px] rounded-xl border-[1.5px] border-[#D7D9E6]"
            autoComplete="new-password"
          />
          <button
            type="button"
            aria-label="Mostrar contraseña"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-[38px] text-[#8A8CA8] text-xs"
          >
            {showPassword ? 'Ocultar' : 'Ver'}
          </button>
        </div>

        <div className="relative">
          <Input
            id="confirmPassword"
            label="Confirmar contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={handleConfirmPasswordBlur}
            error={confirmPasswordError || undefined}
            className="h-[52px] rounded-xl border-[1.5px] border-[#D7D9E6]"
            autoComplete="new-password"
          />
          <button
            type="button"
            aria-label="Mostrar confirmación de contraseña"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute right-4 top-[38px] text-[#8A8CA8] text-xs"
          >
            {showConfirmPassword ? 'Ocultar' : 'Ver'}
          </button>
        </div>

        <div className="flex items-start gap-3">
          <input
            id="acceptsTerms"
            type="checkbox"
            checked={acceptsTerms}
            onChange={(e) => setAcceptsTerms(e.target.checked)}
            className="mt-1 h-4 w-4 text-brand-primary border-neutral-300 rounded"
          />
          <label htmlFor="acceptsTerms" className="text-sm text-[#8A8CA8]">
            Acepto los{' '}
            <span className="font-semibold text-[#EF5226]">términos y condiciones</span>
          </label>
        </div>

        {termsError && (
          <p className="text-xs text-red-500">{termsError}</p>
        )}

        {submitError && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-100">
            {submitError}
          </div>
        )}

        <Button type="submit" className="h-[52px]">
          Crear cuenta
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#D7D9E6]" />
        <span className="text-[13px] text-[#8A8CA8]">o regístrate con</span>
        <div className="flex-1 h-px bg-[#D7D9E6]" />
      </div>

      <SocialLogins />

      <p className="text-center text-[14px] text-[#8A8CA8]">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-semibold text-[#EF5226]">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
