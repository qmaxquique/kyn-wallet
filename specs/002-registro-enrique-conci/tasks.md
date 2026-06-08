# Tareas: Registro de Usuarios

**Entrada**: Documentos de diseño de `/specs/002-registro-enrique-conci/`
**Prerrequisitos**: plan.md (requerido), spec.md (requerido para historias de usuario), research.md, data-model.md, contracts/

## Formato: `[ID] [P?] [HU?] Descripción`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias)
- **[HU]**: Historia de usuario a la que pertenece la tarea (HU1–HU4)
- Incluir rutas de archivo exactas y nombres de funciones/tipos concretos

---

## Fase 1: Preparación — Dominio y Tokens

**Objetivo**: Extender el dominio y los tokens antes de cualquier UI. Ninguna tarea aquí rompe tests existentes.

- [ ] T001 Extender `lib/types/Auth.ts`: añadir interfaces `RegisterCredentials`, `RegisterResult` y `ValidationError`; añadir campo `FullName: string` a la interfaz `User` existente. `AuthCredentials` no se modifica.
- [ ] T002 [P] Extender `lib/constants/DesignTokens.ts`: añadir dentro de `Colors{}` los tokens `AccentOrange: '#EF5226'`, `LabelColor: '#3D3F5C'` y `PlaceholderColor: '#A9ABC2'`. La estructura `DesignTokens` no se modifica en ninguna otra parte.
- [ ] T003 [P] Verificar que `tailwind.config.ts` ya expone los colores de `DesignTokens.Colors` y que los nuevos tokens quedan disponibles como clases de Tailwind (`text-accent-orange`, etc.).

---

## Fase 2: Migración de Ruta — Prerrequisito Bloqueante

**Objetivo**: Liberar `/` para el Registro y mover el Login existente a `/login`. Los tests actuales deben mantenerse verdes.

- [ ] T004 Crear `app/login/page.tsx`: contenido idéntico al `app/page.tsx` actual (importa `BrandPanel` y `LoginForm`). Convertir a `'use client'` y añadir `useSearchParams()` para leer el parámetro `registered`. Si `registered === 'true'`, renderizar encima del formulario un `<div>` con el mensaje "Cuenta creada exitosamente. Ahora puedes iniciar sesión." con fondo verde claro (`bg-green-50`, borde `border-green-200`, texto `text-green-800`).
- [ ] T005 [P] Revisar `components/LoginForm.tsx`: verificar que no hay referencias hardcodeadas a la ruta `/` en navegaciones internas. No se espera ningún cambio — solo confirmación.
- [ ] T006 [P] Actualizar `app/login.test.tsx`: el archivo actualmente renderiza `LoginForm` directamente. Como la migración no cambia `LoginForm` sino solo la ruta que lo contiene, verificar que los tests siguen verdes sin cambios. Si algún test depende de `app/page.tsx` como entrada, actualizar el import a `app/login/page.tsx`.

---

## Fase 3: HU1 — Registro Exitoso (P1) 🎯 MVP

**Objetivo**: Flujo completo: formulario válido → `AuthService.register()` → `router.push('/login?registered=true')` → banner visible en `/login`.

**Prueba independiente**: Llenar los 4 campos con datos válidos, marcar checkbox, click en "Crear cuenta" → verificar `router.push` llamado con `/login?registered=true`.

### Tests — Escribir ANTES de implementar ⚠️

- [ ] T007 [P] [HU1] Añadir `describe('register', ...)` en `lib/services/AuthService.test.ts`:
  - `register()` con datos válidos retorna `{ Success: true }` y el nuevo usuario aparece en `MOCK_USERS`
  - `register()` con correo duplicado (`tucorreo@ejemplo.com`) retorna `{ Success: false, ErrorMessage: 'Este correo ya está registrado' }`
  - `isEmailTaken('tucorreo@ejemplo.com')` retorna `true`
  - `isEmailTaken('nuevo@ejemplo.com')` retorna `false`

- [ ] T008 [P] [HU1] Crear `app/register.test.tsx` (patrón de `app/login.test.tsx`):
  - Mock de `next/navigation` con `mockPush = vi.fn()`
  - "envío con datos válidos llama a `router.push('/login?registered=true')`"
  - "envío con correo duplicado muestra error inline 'Este correo ya está registrado'"

### Implementación

- [ ] T009 [HU1] Extender `lib/services/AuthService.ts`:
  - Añadir función privada `simulateHash(password: string): string` → `btoa(password)`
  - Añadir `isEmailTaken(email: string): boolean` a `IAuthService` y a `AuthService`
  - Añadir `register(credentials: RegisterCredentials): Promise<RegisterResult>` a `IAuthService` y a `AuthService` con la lógica del contrato (`contracts/register-service.md`)
  - El campo `Password` en `MOCK_USERS` pasa a llamarse `PasswordHash` en los usuarios registrados vía `register()`; el usuario hardcodeado existente mantiene su estructura para no romper `AuthService.login()`

- [ ] T010 [HU1] Crear `components/RegisterForm.tsx` (`'use client'`):
  - Estado: `fullName`, `email`, `password`, `confirmPassword`, `acceptsTerms` (string/boolean)
  - Errores: `fullNameError`, `emailError`, `passwordError`, `confirmPasswordError`, `termsError`, `submitError` (todos `string | null`)
  - `handleSubmit`: valida todos los campos, llama `AuthService.register()`, en éxito hace `router.push('/login?registered=true')`
  - JSX: 4 componentes `<Input>` + checkbox nativo + `<Button variant="primary">Crear cuenta</Button>`
  - No incluye aún estilos de Figma (los tokens se aplican en T018-T019)

- [ ] T011 [HU1] Modificar `app/page.tsx`: reemplazar `import LoginForm` por `import RegisterForm`; el resto del layout (`BrandPanel` + div contenedor) permanece idéntico.

---

## Fase 4: HU2 — Validaciones Inline (P2)

**Objetivo**: Cada campo muestra su error en `onBlur`; el submit queda bloqueado si hay errores.

**Prueba independiente**: Ingresar `"nodomain"` en el campo correo, hacer `fireEvent.blur` → verificar texto "Ingresa un correo electrónico válido" en el DOM en ≤300ms.

### Tests — Escribir ANTES de implementar ⚠️

- [ ] T013 [P] [HU2] Añadir `describe('validateFullName')`, `describe('validateNotEmpty')`, `describe('validateConfirmPassword')` y `describe('validateTerms')` en `lib/utils/Validation.test.ts` (patrón de los `describe` existentes):
  - `validateFullName('')` → `false`; `validateFullName('   ')` → `false`; `validateFullName('Diego')` → `true`
  - `validateConfirmPassword('Abc12345', 'Abc12345')` → `true`; `('Abc12345', 'distinto')` → `false`
  - `validateTerms(false)` → `false`; `validateTerms(true)` → `true`

- [ ] T014 [HU2] Crear `components/RegisterForm.test.tsx` (patrón de `components/LoginForm.test.tsx`):
  - Mock de `next/navigation` con `useRouter: () => ({ push: vi.fn() })`
  - "campo 'Nombre completo' vacío tras blur muestra 'Este campo es obligatorio'"
  - "correo inválido tras blur muestra 'Ingresa un correo electrónico válido'"
  - "contraseña < 8 chars tras blur muestra 'La contraseña debe tener al menos 8 caracteres'"
  - "contraseñas distintas tras blur en confirmar muestra 'Las contraseñas no coinciden'"
  - "checkbox no marcado en submit muestra 'Debes aceptar los términos y condiciones'"
  - "botón 'Crear cuenta' no llama a `register()` si alguna validación falla"

### Implementación

- [ ] T015 [P] [HU2] Extender `lib/utils/Validation.ts` añadiendo:
  - `validateNotEmpty(value: string): boolean` → `value.trim() !== ''`
  - `validateFullName(name: string): boolean` → delega a `validateNotEmpty`
  - `validateConfirmPassword(password: string, confirm: string): boolean` → `password === confirm`
  - `validateTerms(accepted: boolean): boolean` → `accepted === true`

- [ ] T016 [HU2] Actualizar `components/RegisterForm.tsx`: añadir handlers `onBlur` por campo que invocan las funciones de `Validation.ts` y actualizan los estados de error correspondientes. Los mensajes de error se pasan como prop `error` a `<Input>` (ya soportado por el componente).

- [ ] T017 [HU2] Actualizar `handleSubmit` en `components/RegisterForm.tsx`: ejecutar validación completa de todos los campos; si alguna falla, setear el error y hacer `return` sin llamar a `AuthService.register()`.

---

## Fase 5: HU3 — Fidelidad Visual Figma (P3)

**Objetivo**: Aplicar tokens de diseño exactos del frame "04 · Registro" al `RegisterForm`.

**Prueba independiente**: Inspección visual en 1440×1024 — Brand Panel con gradiente, inputs con borde `#D7D9E6` y radius 12px, botón con fondo `#FF6B3D`.

- [ ] T018 [P] [HU3] Aplicar en `components/RegisterForm.tsx` los estilos de los campos:
  - Labels: `text-sm font-medium` con color `text-[#3D3F5C]` (o clase Tailwind del token `LabelColor`)
  - Inputs: clases que resulten en 400px de ancho, 52px de alto, radius 12px, borde 1.5px `#D7D9E6` — verificar que `Input.tsx` ya aplica `border-neutral-300 rounded-lg`; ajustar solo si los valores difieren
  - Botón: `<Button variant="primary">` ya usa `bg-brand-primary` (`#FF6B3D`); verificar height 52px y radius 12px

- [ ] T019 [P] [HU3] Aplicar tipografía en `components/RegisterForm.tsx`:
  - Heading "Crea tu cuenta": `text-[30px] font-bold text-[#16182C]`
  - Subheading: `text-[16px] font-normal text-[#8A8BA8]`
  - Labels: `text-[14px] font-medium text-[#3D3F5C]`

- [ ] T020 [HU3] Verificar comportamiento responsive en `app/page.tsx`: el `BrandPanel` ya usa `hidden lg:block` (o equivalente); confirmar que en <1024px solo el Form Panel es visible. Ajustar clases si es necesario.

- [ ] T021 [P] [HU3] Añadir toggle de visibilidad de contraseña en `components/RegisterForm.tsx`: estado booleano `showPassword` y `showConfirmPassword`; cambiar `type` del `<Input>` entre `"password"` y `"text"` según el estado; botón de toggle como `<button type="button">` con `aria-label`.

---

## Fase 6: HU4 — Botones Sociales y Navegación Secundaria (P4)

**Objetivo**: `SocialLogins` con divisor "o regístrate con" y enlace footer a `/login`.

**Prueba independiente**: `fireEvent.click` en "Google" → `expect(window.alert).toHaveBeenCalledWith('Próximamente')`; click en "Inicia sesión" → `expect(mockPush).toHaveBeenCalledWith('/login')`.

- [ ] T022 [P] [HU4] Incluir `<SocialLogins />` en `components/RegisterForm.tsx` debajo del botón "Crear cuenta", con el divisor "o regístrate con":
  - Divisor: `<div className="flex items-center gap-4"><div className="flex-1 h-px bg-[#D7D9E6]"/><span className="text-[13px] text-[#8A8BA8]">o regístrate con</span><div className="flex-1 h-px bg-[#D7D9E6]"/></div>`

- [ ] T023 [HU4] Verificar `components/SocialLogins.tsx`: confirmar que los botones Google y Apple disparan `alert('Próximamente')` sin modificaciones. Si el texto actual del alert es distinto, actualizar únicamente ese string.

- [ ] T024 [HU4] Añadir footer en `components/RegisterForm.tsx`:
  ```
  <p className="text-center text-[14px] text-[#8A8BA8]">
    ¿Ya tienes cuenta?{' '}
    <Link href="/login" className="font-semibold text-[#EF5226]">Inicia sesión</Link>
  </p>
  ```
  Usar `import Link from 'next/link'` (navegación del lado del cliente, sin recarga).

---

## Fase 7: Pulido y Cierre

- [ ] T025 [P] Ejecutar `npm run test` — todos los tests deben pasar al 100%: `AuthService.test.ts`, `Validation.test.ts`, `LoginForm.test.tsx`, `login.test.tsx`, `RegisterForm.test.tsx`, `register.test.tsx`
- [ ] T026 [P] Verificar responsive manualmente en viewports 375px, 768px, 1024px y 1440px
- [ ] T027 [P] Revisar `PascalCase` en todos los archivos nuevos y modificados
- [ ] T028 Hacer commit con mensaje: `feat: implement Registro de Usuarios — routes / and /login`
