import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, validateNotEmpty, validateFullName, validateConfirmPassword, validateTerms } from './Validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for passwords with 8+ characters', () => {
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('12345678')).toBe(true);
    });

    it('should return false for passwords with less than 8 characters', () => {
      expect(validatePassword('short')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('validateNotEmpty', () => {
    it('string vacío → false', () => {
      expect(validateNotEmpty('')).toBe(false);
    });

    it('solo espacios → false', () => {
      expect(validateNotEmpty('   ')).toBe(false);
    });

    it('string con contenido → true', () => {
      expect(validateNotEmpty('Diego')).toBe(true);
    });
  });

  describe('validateFullName', () => {
    it('nombre vacío → false', () => {
      expect(validateFullName('')).toBe(false);
    });

    it('solo espacios → false', () => {
      expect(validateFullName('   ')).toBe(false);
    });

    it('nombre válido → true', () => {
      expect(validateFullName('Diego Martínez')).toBe(true);
    });
  });

  describe('validateConfirmPassword', () => {
    it('passwords iguales → true', () => {
      expect(validateConfirmPassword('Abc12345', 'Abc12345')).toBe(true);
    });

    it('passwords distintas → false', () => {
      expect(validateConfirmPassword('Abc12345', 'distinto')).toBe(false);
    });

    it('segundo vacío → false', () => {
      expect(validateConfirmPassword('Abc12345', '')).toBe(false);
    });
  });

  describe('validateTerms', () => {
    it('false → false', () => {
      expect(validateTerms(false)).toBe(false);
    });

    it('true → true', () => {
      expect(validateTerms(true)).toBe(true);
    });
  });
});
