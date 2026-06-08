/**
 * Valida si un string tiene formato de correo electrónico válido.
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si una contraseña cumple con el mínimo de 8 caracteres.
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Valida que un string no esté vacío ni sea solo espacios.
 */
export const validateNotEmpty = (value: string): boolean => value.trim() !== '';

/**
 * Valida que un nombre completo no esté vacío ni sea solo espacios.
 */
export const validateFullName = (name: string): boolean => validateNotEmpty(name);

/**
 * Valida que dos contraseñas sean iguales.
 */
export const validateConfirmPassword = (password: string, confirm: string): boolean =>
  password === confirm;

/**
 * Valida que los términos y condiciones hayan sido aceptados.
 */
export const validateTerms = (accepted: boolean): boolean => accepted === true;
