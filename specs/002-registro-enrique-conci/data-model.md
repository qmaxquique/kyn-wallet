# Modelo de Datos: Registro de Usuarios

## Entidades

### RegisterCredentials

Representa los datos capturados del formulario de registro antes de ser procesados.

| Campo | Tipo | Validación | Descripción |
|---|---|---|---|
| `FullName` | `string` | Requerido, no solo espacios en blanco | Nombre completo del usuario. |
| `Email` | `string` | Requerido, formato de correo válido (regex), no existente en el sistema | Correo electrónico único. |
| `Password` | `string` | Requerido, mínimo 8 caracteres | Contraseña de la nueva cuenta. |
| `ConfirmPassword` | `string` | Requerido, igual a `Password` | Confirmación de la contraseña. |
| `AcceptsTerms` | `boolean` | Debe ser `true` | Aceptación de términos y condiciones. |

---

### RegisterResult

Representa el resultado de un intento de registro procesado por el servicio.

| Campo | Tipo | Descripción |
|---|---|---|
| `Success` | `boolean` | `true` si el registro fue exitoso; `false` si ocurrió un error. |
| `ErrorMessage` | `string` (opcional) | Mensaje de error descriptivo cuando `Success` es `false`. |

---

### ValidationError

Representa un error de validación asociado a un campo específico del formulario.

| Campo | Tipo | Descripción |
|---|---|---|
| `Field` | `string` | Identificador del campo con error (ej. `"Email"`, `"Password"`, `"AcceptsTerms"`). |
| `Message` | `string` | Mensaje de error legible para el usuario (ej. `"Ingresa un correo electrónico válido"`). |

---

### User *(entidad existente — extensión)*

Entidad existente del sistema simulado. Para el registro, se extiende con el campo `FullName`.

| Campo | Tipo | Descripción |
|---|---|---|
| `FullName` | `string` | Nombre completo registrado. |
| `Email` | `string` | Correo electrónico único. |
| `PasswordHash` | `string` | Representación no reversible de la contraseña (hash simulado). |

---

## Tokens de Diseño — Valores Nuevos (extensión de `DesignTokens.ts`)

Estos tokens se identificaron en el frame "04 · Registro" y no estaban presentes en la definición del Login:

| Token | Valor | Aplicación |
|---|---|---|
| `AccentOrange` | `#EF5226` | Link "términos y condiciones", link "Inicia sesión" en footer |
| `LabelColor` | `#3D3F5C` | Color de las etiquetas de los campos del formulario |
| `PlaceholderColor` | `#A9ABC2` | Color del texto placeholder en inputs |

---

## Relaciones

- `RegisterCredentials` es el objeto de entrada que el `RegisterForm` construye a partir de los campos del usuario.
- El `RegisterService` recibe un `RegisterCredentials`, ejecuta las validaciones de negocio y retorna un `RegisterResult`.
- Si `RegisterResult.Success` es `true`, el sistema crea un nuevo `User` en el array en memoria y redirige a `/login`.
- Si las validaciones de campo fallan antes de llamar al servicio, se generan instancias de `ValidationError` que el `RegisterForm` muestra inline.
- `User` es compartido con el `AuthService` existente: el nuevo usuario registrado puede iniciar sesión inmediatamente en `/login`.
