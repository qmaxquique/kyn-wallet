# Plan de Implementación: Registro de Usuarios

**Branch**: `feature/registro-enrique-conci` | **Fecha**: 2026-06-07 | **Spec**: [specs/002-registro-enrique-conci/spec.md](spec.md)
**Entrada**: Especificación de funcionalidad desde `specs/002-registro-enrique-conci/spec.md`

## Resumen

Implementar la pantalla de Registro de Usuarios en la ruta `/`, migrando el Login existente a `/login`. El formulario captura nombre completo, correo, contraseña y confirmación, con validaciones inline y redirección a `/login` con mensaje de éxito tras registro exitoso. El diseño sigue el frame "04 · Registro" de Figma con layout de dos paneles (Brand + Form). Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, sin librerías externas adicionales.

## Contexto Técnico

**Lenguaje/Versión**: TypeScript / Next.js 14 (App Router)
**Dependencias primarias**: React 18, Next.js 14, Tailwind CSS 3.x
**Almacenamiento**: En memoria — array `MOCK_USERS` en `AuthService.ts`
**Testing**: Vitest + React Testing Library + JSDOM (patrón existente en `vitest.config.ts`)
**Plataforma objetivo**: Web — breakpoint `lg` (1024px) para layout de dos paneles
**Restricciones**: Sin librerías externas de UI, `PascalCase` estricto en todos los tipos y componentes
**Alcance**: Feature de Registro con migración de ruta del Login existente; tests del Login deben mantenerse verdes

## Verificación de Constitución

*PUERTA: Debe pasar antes de iniciar la Fase 0. Re-verificar después de la Fase 1.*

- [x] **TDD**: Tests escritos antes del código en cada fase; runner: Vitest + RTL (patrón de `LoginForm.test.tsx` y `AuthService.test.ts`)
- [x] **SOLID**: `RegisterForm` solo maneja UI; `AuthService.register()` encapsula lógica de dominio; `Validation.ts` centraliza reglas
- [x] **Clean Architecture**: `app/` (rutas/entrada) → `components/` (UI) → `lib/services/` (casos de uso) → `lib/types/` (dominio)
- [x] **DRY**: `BrandPanel`, `Button`, `Input`, `validateEmail`, `validatePassword` reutilizados sin cambios; `SocialLogins` se modifica mínimamente (solo texto del alert, FR-006)
- [x] **YAGNI**: No se crean abstracciones nuevas; se extienden solo las existentes
- [x] **Naming**: `PascalCase` en todos los tipos e interfaces; camelCase en variables y funciones utilitarias
- [x] **Dependencias**: Solo Next.js, React y Tailwind CSS; sin instalar paquetes nuevos
- [x] **Seguridad**: Todas las entradas validadas antes del procesamiento; contraseña almacenada como hash simulado (no texto plano)

## Análisis de Impacto sobre el Código Existente

### Archivos que se modifican (sin romper tests actuales)

| Archivo | Tipo de cambio | Impacto en tests existentes |
|---|---|---|
| `lib/types/Auth.ts` | Añadir interfaces nuevas; `AuthCredentials` sin cambios; `User` añade `FullName?: string` (opcional) | Ninguno — `FullName` es opcional, no rompe objetos existentes |
| `lib/constants/DesignTokens.ts` | Añadir 3 tokens nuevos al objeto `Colors`; estructura existente intacta | Ninguno |
| `lib/utils/Validation.ts` | Añadir 3 funciones nuevas; `validateEmail` y `validatePassword` sin cambios | Ninguno — `Validation.test.ts` sigue verde |
| `lib/services/AuthService.ts` | Añadir `register()` e `isEmailTaken()` a `IAuthService` y a `AuthService`; `login()` e `isAuthenticated()` sin cambios | Ninguno — `AuthService.test.ts` sigue verde |
| `app/page.tsx` | Reemplazar `LoginForm` por `RegisterForm`; estructura del layout idéntica | `app/login.test.tsx` migra a `/login` (ver T006) |

### Archivos nuevos

| Archivo | Descripción |
|---|---|
| `app/login/page.tsx` | Login existente movido aquí (copia exacta de `app/page.tsx` actual) |
| `components/RegisterForm.tsx` | Componente de formulario de registro; sigue el patrón de `LoginForm.tsx` |
| `components/RegisterForm.test.tsx` | Tests unitarios de UI; sigue el patrón de `LoginForm.test.tsx` |
| `app/register.test.tsx` | Tests de integración del flujo completo; sigue el patrón de `app/login.test.tsx` |

---

## Decisiones Técnicas

### Mensaje de éxito post-registro
**Mecanismo**: `router.push('/login?registered=true')` en `RegisterForm.tsx`. El componente `LoginForm` lee `useSearchParams()` y, si el parámetro `registered=true` está presente, renderiza el banner de éxito encima del formulario.

**Rationale**: No requiere estado global ni librerías externas. Es el patrón estándar de Next.js App Router para comunicación entre rutas. El parámetro desaparece si el usuario recarga la página (comportamiento correcto: el mensaje es transiente).

**Alternativa rechazada**: `localStorage` — viola la restricción de no persistir datos del servicio y complica la limpieza del estado.

### Hash simulado de contraseña
**Mecanismo**: La función `simulateHash(password: string): string` en `AuthService.ts` retorna `btoa(password)` (Base64). Esto es una simulación explícita — no es criptografía real — pero garantiza que la contraseña no se almacene como texto plano en el array `MOCK_USERS`.

**Rationale**: Cumple el principio de seguridad de la constitución sin introducir dependencias (`crypto` del navegador no está disponible en todos los contextos de JSDOM).

### Validación de correo duplicado
**Mecanismo**: `AuthService.isEmailTaken(email)` consulta el array `MOCK_USERS` antes de registrar. `RegisterForm` llama a este método durante el submit (no en `onBlur`, para evitar falsos positivos en edición parcial).

### Reutilización del componente `Input`
El componente existente ya soporta `label`, `error`, `type="password"`, `placeholder`, `value` y `onChange` — cubre los 4 campos del `RegisterForm` sin modificaciones.

### Reutilización del componente `Button`
`variant="primary"` con `bg-brand-primary` ya mapea a `#FF6B3D` vía `DesignTokens.ts` en `tailwind.config.ts` — cubre el botón "Crear cuenta" sin modificaciones.

---

## Estructura del Proyecto

### Documentación (esta feature)

```text
specs/002-registro-enrique-conci/
├── spec.md                      # Especificación de funcionalidad
├── plan.md                      # Este archivo
├── research.md                  # Análisis Figma + codebase
├── data-model.md                # Entidades de datos
├── quickstart.md                # Guía de inicio rápido
├── tasks.md                     # Desglose de tareas TDD
├── checklists/
│   └── requirements.md          # Checklist de calidad del spec
└── contracts/
    └── register-service.md      # Contrato del RegisterService
```

### Código Fuente — Mapa completo de cambios

```text
app/
├── page.tsx                     # MODIFICAR: BrandPanel + RegisterForm (mismo layout que Login)
├── register.test.tsx            # CREAR: tests de integración del flujo de registro
├── login/
│   └── page.tsx                 # CREAR: copia exacta del app/page.tsx actual + leer ?registered=true
└── construction/
    └── page.tsx                 # SIN CAMBIOS

components/
├── BrandPanel.tsx               # SIN CAMBIOS (frame idéntico al Login)
├── RegisterForm.tsx             # CREAR: patrón de LoginForm.tsx; 4 campos + checkbox + SocialLogins
├── RegisterForm.test.tsx        # CREAR: patrón de LoginForm.test.tsx
├── SocialLogins.tsx             # MODIFICAR: corregir texto del alert de `${provider} estará disponible próximamente.` a `'Próximamente'` (FR-006 exige texto exacto)
└── ui/
    ├── Button.tsx               # SIN CAMBIOS
    └── Input.tsx                # SIN CAMBIOS

lib/
├── constants/
│   └── DesignTokens.ts          # EXTENDER: añadir AccentOrange (#EF5226), LabelColor (#3D3F5C),
│                                #           PlaceholderColor (#A9ABC2) dentro de Colors{}
├── services/
│   ├── AuthService.ts           # EXTENDER: añadir register() e isEmailTaken() a IAuthService
│   │                            #           y a AuthService; simulateHash() como función privada
│   └── AuthService.test.ts      # EXTENDER: añadir describe('register') con casos del contrato
├── types/
│   └── Auth.ts                  # EXTENDER: añadir RegisterCredentials, RegisterResult,
│                                #           ValidationError; User añade campo FullName
└── utils/
    ├── Validation.ts            # EXTENDER: añadir validateFullName(), validateConfirmPassword(),
    │                            #           validateNotEmpty(), validateTerms()
    └── Validation.test.ts       # EXTENDER: añadir describe() para cada función nueva
```

---

## Especificaciones Técnicas por Archivo

### `lib/types/Auth.ts` — Adiciones

```
// Nuevas interfaces (sin modificar AuthCredentials ni User.Password)
interface RegisterCredentials {
  FullName: string
  Email: string
  Password: string
  ConfirmPassword: string
  AcceptsTerms: boolean
}

interface RegisterResult {
  Success: boolean
  ErrorMessage?: string
}

interface ValidationError {
  Field: string
  Message: string
}

// User se extiende añadiendo FullName como campo OPCIONAL para preservar
// compatibilidad con el objeto hardcodeado en MOCK_USERS
interface User {
  FullName?: string   // NUEVO — opcional
  Email: string
  Password: string    // pasa a PasswordHash al almacenar vía register()
}
```

### `lib/utils/Validation.ts` — Adiciones

```
// validateNotEmpty(value: string): boolean
// → false si value.trim() === ''

// validateFullName(name: string): boolean
// → false si validateNotEmpty(name) es false

// validateConfirmPassword(password: string, confirm: string): boolean
// → false si password !== confirm

// validateTerms(accepted: boolean): boolean
// → false si accepted === false
```

### `lib/services/AuthService.ts` — Adiciones a IAuthService y AuthService

```
// En IAuthService:
register(credentials: RegisterCredentials): Promise<RegisterResult>
isEmailTaken(email: string): boolean

// En AuthService:
isEmailTaken(email): busca en MOCK_USERS por Email (case-insensitive)

register(credentials):
  1. Si isEmailTaken(email) → { Success: false, ErrorMessage: "Este correo ya está registrado" }
  2. Si !validatePassword(password) → { Success: false, ErrorMessage: "La contraseña debe tener al menos 8 caracteres" }
  3. Si password !== confirmPassword → { Success: false, ErrorMessage: "Las contraseñas no coinciden" }
  4. Si !validateFullName(fullName) → { Success: false, ErrorMessage: "Este campo es obligatorio" }
  5. Si !acceptsTerms → { Success: false, ErrorMessage: "Debes aceptar los términos y condiciones" }
  6. Push { FullName, Email, Password: simulateHash(password) } a MOCK_USERS
  7. → { Success: true }
```

### `components/RegisterForm.tsx` — Patrón exacto de LoginForm.tsx

```
Estado: fullName, email, password, confirmPassword, acceptsTerms
Errores: fullNameError, emailError, passwordError, confirmPasswordError, termsError, submitError

Validación en onBlur por campo (no en useEffect — diferencia con LoginForm para evitar
  interferencia entre campos de contraseña durante la edición)

handleSubmit:
  1. Validar todos los campos en orden
  2. Si alguno falla → setear error correspondiente; return
  3. Llamar AuthService.register(credentials)
  4. Si Success → router.push('/login?registered=true')
  5. Si !Success → setSubmitError(result.ErrorMessage)

JSX: BrandPanel está en page.tsx (fuera del componente), igual que LoginForm
```

### `app/page.tsx` — Layout idéntico al actual, reemplazando LoginForm

```tsx
import RegisterForm from '@/components/RegisterForm'
// BrandPanel se mantiene igual
```

### `app/login/page.tsx` — Login migrado + banner de éxito

```
Añadir 'use client' para poder usar useSearchParams()
Leer searchParams.get('registered')
Si === 'true' → mostrar banner verde con texto
  "Cuenta creada exitosamente. Ahora puedes iniciar sesión."
  encima del formulario (inside el div del Form Panel, antes de <LoginForm />)
```

---

## Seguimiento de Complejidad

| Excepción | Razón | Alternativa más simple rechazada porque |
|---|---|---|
| Next.js / Tailwind | Directiva explícita del usuario que reemplaza la restricción de "sin librerías externas" para el framework base. | Construir un SSR personalizado y un parser CSS está fuera del alcance. |
| Migración de ruta `/` → `/login` | Requisito funcional explícito: `/` debe mostrar Registro. | Mantener el Login en `/` y poner el Registro en `/register` contradice directamente FR-001. |
| `useSearchParams` en `app/login/page.tsx` | Mecanismo nativo de Next.js para el mensaje de éxito post-registro sin estado global. | `localStorage` persiste más de lo necesario y viola el principio de no almacenar en storage del contrato. |
