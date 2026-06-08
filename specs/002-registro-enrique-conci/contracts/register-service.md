# Contrato: RegisterService

## Definición

Servicio encargado de la lógica de registro de nuevos usuarios en el sistema simulado. Extiende `AuthService` con la capacidad de crear cuentas nuevas en el array en memoria.

## Interfaz

```
RegisterService {
  /**
   * Intenta registrar un nuevo usuario con las credenciales proporcionadas.
   *
   * Precondiciones:
   * - credentials.Email debe tener formato válido y no existir en el sistema.
   * - credentials.Password debe tener al menos 8 caracteres.
   * - credentials.ConfirmPassword debe ser igual a credentials.Password.
   * - credentials.FullName no debe estar vacío ni ser solo espacios en blanco.
   * - credentials.AcceptsTerms debe ser true.
   *
   * Postcondiciones (éxito):
   * - Se añade un nuevo User al array en memoria con PasswordHash (hash simulado).
   * - Retorna RegisterResult { Success: true }.
   *
   * Postcondiciones (fallo):
   * - No modifica el array de usuarios.
   * - Retorna RegisterResult { Success: false, ErrorMessage: <descripción> }.
   *
   * Parámetros:
   *   credentials — Objeto RegisterCredentials con los datos del formulario.
   * Retorna:
   *   Promise<RegisterResult> — Resultado del intento de registro.
   */
  register(credentials: RegisterCredentials): Promise<RegisterResult>

  /**
   * Verifica si un correo electrónico ya está registrado en el sistema.
   *
   * Parámetros:
   *   email — Correo a verificar.
   * Retorna:
   *   boolean — true si el correo ya existe; false si está disponible.
   */
  isEmailTaken(email: string): boolean
}
```

## Escenarios de Comportamiento

| Escenario | Entrada | Salida esperada |
|---|---|---|
| Registro exitoso | Todos los campos válidos, correo no existente, `AcceptsTerms: true` | `{ Success: true }` |
| Correo duplicado | `Email` ya existente en el array | `{ Success: false, ErrorMessage: "Este correo ya está registrado" }` |
| Contraseña corta | `Password` con menos de 8 caracteres | `{ Success: false, ErrorMessage: "La contraseña debe tener al menos 8 caracteres" }` |
| Contraseñas distintas | `Password !== ConfirmPassword` | `{ Success: false, ErrorMessage: "Las contraseñas no coinciden" }` |
| Nombre vacío | `FullName` vacío o solo espacios | `{ Success: false, ErrorMessage: "Este campo es obligatorio" }` |
| Términos no aceptados | `AcceptsTerms: false` | `{ Success: false, ErrorMessage: "Debes aceptar los términos y condiciones" }` |

## Restricciones

- La contraseña NUNCA debe almacenarse en texto plano. El array en memoria debe guardar un `PasswordHash` (representación simulada no reversible).
- El servicio NO debe persistir datos en `localStorage`, `sessionStorage` ni ningún mecanismo externo; la simulación es puramente en memoria.
- El servicio DEBE ser compatible con el `AuthService.login()` existente: un usuario recién registrado debe poder iniciar sesión inmediatamente.
- Las validaciones de dominio (formato de correo, longitud de contraseña) son responsabilidad de `Validation.ts`; `RegisterService` invoca esas funciones sin duplicar la lógica.
