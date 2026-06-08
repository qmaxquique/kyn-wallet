# Tareas: Registro de Usuarios

**Entrada**: Documentos de diseño de `/specs/002-registro-enrique-conci/`
**Prerrequisitos**: plan.md (requerido), spec.md (requerido para historias de usuario), research.md, data-model.md, contracts/

## Convenciones

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias entre sí)
- **[HU]**: Historia de usuario a la que pertenece (HU1–HU4)
- Cada tarea de test se escribe y hace pasar **antes** de la implementación correspondiente (TDD)
- Rutas y nombres de funciones son exactos y coinciden con el codebase real

## Advertencia de discrepancia detectada

> **SocialLogins.tsx** usa `alert(\`${provider} estará disponible próximamente.\`)`.
> La spec (FR-006) exige el texto exacto `"Próximamente"`. La tarea T023 corrige esto.

---

## Fase 1 — Dominio y Tokens (base compartida)

**Objetivo**: Tipos, interfaces y tokens listos antes de cualquier test o componente. Ninguna tarea aquí rompe tests existentes.

- [ ] T001 Extender `lib/types/Auth.ts`:
  - Añadir `FullName?: string` (**opcional**) a la interfaz `User` existente — la opcionalidad preserva compatibilidad con el objeto hardcodeado `{ Email, Password }` en `MOCK_USERS`; los usuarios registrados vía `register()` sí incluirán el campo
  - Añadir interfaz `RegisterCredentials { FullName: string; Email: string; Password: string; ConfirmPassword: string; AcceptsTerms: boolean }`
  - Añadir interfaz `RegisterResult { Success: boolean; ErrorMessage?: string }`
  - Añadir interfaz `ValidationError { Field: string; Message: string }`
  - `AuthCredentials` no se toca

- [ ] T002 [P] Extender `lib/constants/DesignTokens.ts`: dentro de `Colors{}` añadir:
  - `AccentOrange: '#EF5226'`
  - `LabelColor: '#3D3F5C'`
  - `PlaceholderColor: '#A9ABC2'`

- [ ] T003 [P] Confirmar que `tailwind.config.ts` expone todos los colores de `DesignTokens.Colors`. Si los nuevos tokens no generan clases utilitarias, extender la sección `theme.extend.colors` con sus valores.

---

## Fase 2 — Migración de rutas `/` y `/login`

**Objetivo**: Crear `app/login/page.tsx` con el Login y el banner de éxito; `app/page.tsx` queda libre para el Registro. Tests actuales del login deben seguir verdes.

- [ ] T004 Crear `app/login/page.tsx` (`'use client'`):
  - Importar `BrandPanel`, `LoginForm` y `useSearchParams` de `next/navigation`
  - Leer `const registered = searchParams.get('registered')`
  - Si `registered === 'true'`, renderizar antes del formulario:
    ```
    <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
      Cuenta creada exitosamente. Ahora puedes iniciar sesión.
    </div>
    ```
  - El resto del layout es idéntico al `app/page.tsx` actual (`BrandPanel` izquierda + Form Panel derecha)

- [ ] T005 [P] Verificar `components/LoginForm.tsx`: no debe tener referencias hardcodeadas a `'/'` en ningún `router.push`. Si las hay, cambiarlas a `'/login'`.

- [ ] T006 [P] Verificar `app/login.test.tsx`: los tests importan `LoginForm` directamente, no `app/page.tsx`, por lo que no requieren cambios. Ejecutar `npm run test -- --run app/login.test.tsx` y confirmar que pasan en verde antes de continuar.

---

## Fase 3 — HU1: Registro Exitoso 🎯 MVP

**Objetivo**: Flujo completo. Formulario válido → `AuthService.register()` → `router.push('/login?registered=true')` → banner visible.

### Tests unitarios del servicio de registro ⚠️ PRIMERO

- [ ] T007 [HU1] Añadir `describe('register')` en `lib/services/AuthService.test.ts`:

  > **B-5 aislamiento de estado**: el describe debe incluir `beforeEach` que llame a `resetMockUsers()` exportado desde `AuthService.ts`. Esta función reemplaza el contenido de `MOCK_USERS` con el array inicial `[{ Email: 'tucorreo@ejemplo.com', Password: 'password123' }]`. No usar `vi.resetModules()` — es costoso y cambia el modelo de aislamiento de módulos en Vitest.

  ```
  describe('register', () => {
    beforeEach(() => {
      resetMockUsers() // importar desde '../lib/services/AuthService'
    })

    it('registro exitoso retorna { Success: true }')
      → register({ FullName:'Diego', Email:'nuevo@ejemplo.com', Password:'Abc12345',
                   ConfirmPassword:'Abc12345', AcceptsTerms:true })
      → expect(result).toEqual({ Success: true })

    it('usuario registrado aparece en MOCK_USERS')
      → después del register exitoso, isEmailTaken('nuevo@ejemplo.com') === true

    it('correo duplicado retorna { Success: false, ErrorMessage: "Este correo ya está registrado" }')
      → register con Email: 'tucorreo@ejemplo.com' (ya existe en MOCK_USERS)

    it('isEmailTaken con correo existente retorna true')
      → isEmailTaken('tucorreo@ejemplo.com') === true

    it('isEmailTaken con correo nuevo retorna false')
      → isEmailTaken('nadie@ejemplo.com') === false
  })
  ```

### Tests de integración del flujo de registro ⚠️ PRIMERO

- [ ] T008 [P] [HU1] Crear `app/register.test.tsx` (patrón de `app/login.test.tsx`):

  ```
  const mockPush = vi.fn()
  vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))

  it('envío válido llama a router.push con "/login?registered=true"')
    → render(<RegisterForm />)
    → llenar FullName, Email, Password, ConfirmPassword con valores válidos
    → marcar checkbox AcceptsTerms
    → fireEvent.click(getByRole('button', { name: /crear cuenta/i }))
    → await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login?registered=true'))

  it('envío con correo duplicado muestra "Este correo ya está registrado"')
    → rellenar con Email: 'tucorreo@ejemplo.com'
    → esperar mensaje de error inline en el campo correo
  ```

### Implementación HU1

- [ ] T009 [HU1] Extender `lib/services/AuthService.ts`:
  - Añadir función local `const simulateHash = (p: string): string => btoa(p)`
  - Añadir a `IAuthService`: `isEmailTaken(email: string): boolean` y `register(credentials: RegisterCredentials): Promise<RegisterResult>`
  - Implementar `isEmailTaken`: busca en `MOCK_USERS` por `Email` (case-insensitive: `.toLowerCase()`)
  - Implementar `register` con la secuencia del contrato (`contracts/register-service.md`): validar duplicado → validar password → validar confirmación → validar nombre → validar términos → push `{ FullName, Email, Password: simulateHash(Password) }` → retornar `{ Success: true }`

- [ ] T010 [HU1] Crear `components/RegisterForm.tsx` (`'use client'`):
  - `import { useRouter } from 'next/navigation'`
  - `import { Input } from './ui/Input'` y `import { Button } from './ui/Button'`
  - `import { AuthService } from '../lib/services/AuthService'`
  - `import { validateEmail, validatePassword } from '../lib/utils/Validation'`
  - Estado: `fullName`, `email`, `password`, `confirmPassword` (`string`, init `''`); `acceptsTerms` (`boolean`, init `false`)
  - Errores: `fullNameError`, `emailError`, `passwordError`, `confirmPasswordError`, `termsError`, `submitError` (`string | null`, init `null`)
  - `handleSubmit(e)`: previene default, valida todos los campos en orden, si alguno falla setea error y `return`, llama `AuthService.register()`, si `Success` → `router.push('/login?registered=true')`, si `!Success` → `setSubmitError(result.ErrorMessage)`
  - JSX mínimo funcional: `<form>` con 4 `<Input>`, checkbox + label, `<Button>Crear cuenta</Button>` y mensaje de `submitError`

- [ ] T011 [HU1] Modificar `app/page.tsx`:
  - Reemplazar `import LoginForm from '@/components/LoginForm'` por `import RegisterForm from '@/components/RegisterForm'`
  - Reemplazar `<LoginForm />` por `<RegisterForm />`
  - El layout con `BrandPanel` permanece idéntico

> **Nota B-4**: T012 fue absorbido en T010 (la redirección post-registro es parte del `handleSubmit` de `RegisterForm`). La numeración salta intencionalmente de T011 a T013.

---

## Fase 4 — HU2: Validaciones Inline

**Objetivo**: Cada campo dispara su validación en `onBlur`; submit rechaza el envío si alguna falla.

### Tests unitarios de validaciones ⚠️ PRIMERO

- [ ] T013 [HU2] Añadir en `lib/utils/Validation.test.ts` los siguientes `describe`:

  ```
  describe('validateNotEmpty', () => {
    it('string vacío → false')         → validateNotEmpty('') === false
    it('solo espacios → false')        → validateNotEmpty('   ') === false
    it('string con contenido → true')  → validateNotEmpty('Diego') === true
  })

  describe('validateFullName', () => {
    it('nombre vacío → false')         → validateFullName('') === false
    it('solo espacios → false')        → validateFullName('   ') === false
    it('nombre válido → true')         → validateFullName('Diego Martínez') === true
  })

  describe('validateConfirmPassword', () => {
    it('passwords iguales → true')     → validateConfirmPassword('Abc12345','Abc12345') === true
    it('passwords distintas → false')  → validateConfirmPassword('Abc12345','distinto') === false
    it('segundo vacío → false')        → validateConfirmPassword('Abc12345','') === false
  })

  describe('validateTerms', () => {
    it('false → false')                → validateTerms(false) === false
    it('true → true')                  → validateTerms(true) === true
  })
  ```

### Tests de UI del RegisterForm ⚠️ PRIMERO

- [ ] T014 [HU2] Crear `components/RegisterForm.test.tsx` (patrón de `components/LoginForm.test.tsx`):

  Setup común:
  ```
  vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))
  vi.mock('../lib/services/AuthService', () => ({
    AuthService: { register: vi.fn(), isEmailTaken: vi.fn().mockReturnValue(false) }
  }))
  ```

  Tests de campos obligatorios y validación en dos pasos (C-1 + B-2):
  ```
  it('nombre vacío: blur → "Este campo es obligatorio"')
    → render(<RegisterForm />)
    → fireEvent.blur(getByLabelText(/nombre completo/i))
    → expect(getByText('Este campo es obligatorio')).toBeInTheDocument()

  it('nombre con solo espacios: blur → "Este campo es obligatorio"')
    → fireEvent.change(nameInput, { target: { value: '   ' } })
    → fireEvent.blur(nameInput)
    → expect(getByText('Este campo es obligatorio')).toBeInTheDocument()

  it('email vacío: blur → "Este campo es obligatorio"')
    → fireEvent.blur(emailInput)  // sin cambio previo (vacío)
    → expect(getByText('Este campo es obligatorio')).toBeInTheDocument()

  it('email inválido (no vacío): blur → "Ingresa un correo electrónico válido"')
    → fireEvent.change(emailInput, { target: { value: 'nodomain' } })
    → fireEvent.blur(emailInput)
    → expect(getByText('Ingresa un correo electrónico válido')).toBeInTheDocument()

  it('password vacío: blur → "Este campo es obligatorio"')
    → fireEvent.blur(passInput)  // sin cambio previo (vacío)
    → expect(getByText('Este campo es obligatorio')).toBeInTheDocument()

  it('password < 8 chars (no vacío): blur → "La contraseña debe tener al menos 8 caracteres"')
    → fireEvent.change(passInput, { target: { value: 'short' } })
    → fireEvent.blur(passInput)
    → expect(getByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument()

  it('confirmPassword vacío: blur → "Este campo es obligatorio"')
    → fireEvent.blur(confirmInput)  // sin cambio previo (vacío)
    → expect(getByText('Este campo es obligatorio')).toBeInTheDocument()

  it('confirmación distinta (no vacía): blur → "Las contraseñas no coinciden"')
    → password = 'Abc12345', confirmPassword = 'diferente'
    → fireEvent.blur(confirmInput)
    → expect(getByText('Las contraseñas no coinciden')).toBeInTheDocument()

  it('términos no aceptados en submit → "Debes aceptar los términos y condiciones"')
    → rellenar campos válidos, NO marcar checkbox
    → fireEvent.click(submitButton)
    → expect(getByText('Debes aceptar los términos y condiciones')).toBeInTheDocument()

  it('submit con errores NO llama a AuthService.register')
    → submit sin nombre
    → expect(AuthService.register).not.toHaveBeenCalled()

  it('submit válido llama a AuthService.register con los datos correctos')
    → AuthService.register.mockResolvedValue({ Success: true })
    → rellenar todos los campos válidos + checkbox
    → fireEvent.click(submitButton)
    → expect(AuthService.register).toHaveBeenCalledWith({
        FullName: 'Diego Martínez', Email: 'test@ejemplo.com',
        Password: 'Abc12345', ConfirmPassword: 'Abc12345', AcceptsTerms: true
      })
  ```

### Implementación HU2

- [ ] T015 [P] [HU2] Extender `lib/utils/Validation.ts`:
  ```
  export const validateNotEmpty = (value: string): boolean => value.trim() !== '';
  export const validateFullName = (name: string): boolean => validateNotEmpty(name);
  export const validateConfirmPassword = (password: string, confirm: string): boolean => password === confirm;
  export const validateTerms = (accepted: boolean): boolean => accepted === true;
  ```

- [ ] T016 [HU2] Actualizar `components/RegisterForm.tsx`: añadir `onBlur` a cada `<Input>` con **validación en dos pasos** (vacío primero, luego formato/longitud) para cumplir FR-012:
  - `fullName` onBlur → `validateFullName(fullName)` → si false: `setFullNameError('Este campo es obligatorio')`
  - `email` onBlur → si `!validateNotEmpty(email)`: `setEmailError('Este campo es obligatorio')`, else si `!validateEmail(email)`: `setEmailError('Ingresa un correo electrónico válido')`
  - `password` onBlur → si `!validateNotEmpty(password)`: `setPasswordError('Este campo es obligatorio')`, else si `!validatePassword(password)`: `setPasswordError('La contraseña debe tener al menos 8 caracteres')`
  - `confirmPassword` onBlur → si `!validateNotEmpty(confirmPassword)`: `setConfirmPasswordError('Este campo es obligatorio')`, else si `!validateConfirmPassword(password, confirmPassword)`: `setConfirmPasswordError('Las contraseñas no coinciden')`

- [ ] T017 [HU2] Actualizar `handleSubmit` en `components/RegisterForm.tsx` con **validación en dos pasos por campo** para cumplir FR-012 (campos vacíos → "Este campo es obligatorio") y FR-009/010/011 (formato/longitud/coincidencia):
  - Si `!validateFullName(fullName)` → `setFullNameError('Este campo es obligatorio'); return`
  - Si `!validateNotEmpty(email)` → `setEmailError('Este campo es obligatorio'); return`
  - Si `!validateEmail(email)` → `setEmailError('Ingresa un correo electrónico válido'); return`
  - Si `!validateNotEmpty(password)` → `setPasswordError('Este campo es obligatorio'); return`
  - Si `!validatePassword(password)` → `setPasswordError('La contraseña debe tener al menos 8 caracteres'); return`
  - Si `!validateNotEmpty(confirmPassword)` → `setConfirmPasswordError('Este campo es obligatorio'); return`
  - Si `!validateConfirmPassword(password, confirmPassword)` → `setConfirmPasswordError('Las contraseñas no coinciden'); return`
  - Si `!validateTerms(acceptsTerms)` → `setTermsError('Debes aceptar los términos y condiciones'); return`
  - Solo si todas pasan → llamar `AuthService.register()`

---

## Fase 5 — HU3: Fidelidad Visual Figma

**Objetivo**: Aplicar tokens exactos del frame "04 · Registro". Sin tests nuevos — verificación visual.

- [ ] T018 [P] [HU3] Aplicar estilos de inputs y botón en `components/RegisterForm.tsx`:
  - Cada `<Input>` debe recibir `className` con altura 52px (`h-[52px]`), radius 12px (`rounded-xl`), borde 1.5px `#D7D9E6` (`border-[1.5px] border-[#D7D9E6]`). Verificar que `Input.tsx` no sobreescribe estos valores; si lo hace, extender la prop `className`.
  - `<Button variant="primary">` debe tener altura 52px (`h-[52px]`, pasar `className="h-[52px]"`). El color `#FF6B3D` ya viene de `bg-brand-primary`.

- [ ] T019 [P] [HU3] Aplicar tipografía en `components/RegisterForm.tsx`:
  - Heading: `<h1 className="text-[30px] font-bold text-[#16182C]">Crea tu cuenta</h1>`
  - Subheading: `<p className="text-[16px] font-normal text-[#8A8BA8]">Completa tus datos para comenzar</p>`
  - Labels de `<Input>`: `className="text-[14px] font-medium text-[#3D3F5C]"` vía prop `label` o `className` del componente

- [ ] T020 [HU3] Auditoría responsive en `app/page.tsx`:
  - Verificar que `<BrandPanel />` está dentro de un contenedor con clase `hidden lg:block` o `hidden lg:flex`
  - En <1024px el Form Panel ocupa el 100% del ancho (`w-full`)
  - Probar visualmente en 375px (mobile) y 1440px (desktop referencia)

- [ ] T021 [P] [HU3] Toggle de visibilidad de contraseña en `components/RegisterForm.tsx`:
  - Añadir `const [showPassword, setShowPassword] = useState(false)` y `const [showConfirmPassword, setShowConfirmPassword] = useState(false)`
  - Pasar `type={showPassword ? 'text' : 'password'}` al `<Input>` de contraseña
  - Añadir `<button type="button" aria-label="Mostrar contraseña" onClick={() => setShowPassword(v => !v)}>` posicionado con `absolute right-4 top-1/2 -translate-y-1/2` dentro de un `<div className="relative">`

---

## Fase 6 — HU4: Botones Sociales y Navegación Secundaria

**Objetivo**: `SocialLogins` con alert exacto `"Próximamente"` y link footer a `/login`.

### Tests ⚠️ PRIMERO

- [ ] T022 [HU4] Añadir en `components/RegisterForm.test.tsx`:

  ```
  it('click en "Google" dispara alert con texto exacto "Próximamente"')
    → vi.spyOn(window, 'alert').mockImplementation(() => {})
    → render(<RegisterForm />)
    → fireEvent.click(getByRole('button', { name: /google/i }))
    → expect(window.alert).toHaveBeenCalledWith('Próximamente')

  it('click en "Apple" dispara alert con texto exacto "Próximamente"')
    → fireEvent.click(getByRole('button', { name: /apple/i }))
    → expect(window.alert).toHaveBeenCalledWith('Próximamente')

  it('link "Inicia sesión" apunta a /login')
    → expect(getByRole('link', { name: /inicia sesión/i })).toHaveAttribute('href', '/login')
  ```

### Implementación HU4

- [ ] T023 [HU4] Corregir `components/SocialLogins.tsx`: cambiar el texto del alert y actualizar la firma + llamadores:
  1. Cambiar `const handleComingSoon = (provider: string) => { alert(\`${provider} estará disponible próximamente.\`) }` por `const handleComingSoon = () => { alert('Próximamente') }`
  2. Actualizar los `onClick` del JSX de `onClick={() => handleComingSoon('Google')}` / `onClick={() => handleComingSoon('Apple')}` a `onClick={handleComingSoon}` en ambos botones

- [ ] T024 [HU4] Completar `components/RegisterForm.tsx`:
  - Añadir `import SocialLogins from './SocialLogins'` y `import Link from 'next/link'`
  - Añadir divisor entre el botón y los botones sociales:
    ```
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-[#D7D9E6]" />
      <span className="text-[13px] text-[#8A8BA8]">o regístrate con</span>
      <div className="flex-1 h-px bg-[#D7D9E6]" />
    </div>
    <SocialLogins />
    ```
  - Añadir footer:
    ```
    <p className="text-center text-[14px] text-[#8A8BA8]">
      ¿Ya tienes cuenta?{' '}
      <Link href="/login" className="font-semibold text-[#EF5226]">Inicia sesión</Link>
    </p>
    ```

---

## Fase 7 — Mensaje de éxito en Login

**Objetivo**: Verificar que el banner de éxito en `/login` se muestra cuando llega el parámetro `?registered=true`.

### Test ⚠️ PRIMERO

- [ ] T025 [HU1] Añadir en `app/login.test.tsx` — **prerequisito: T004 debe estar completado** (requiere que `app/login/page.tsx` exista):

  Añadir import al inicio del archivo:
  ```
  import LoginPage from '../app/login/page'
  ```

  Añadir tests dentro de un nuevo `describe('LoginPage banner de éxito', ...)` al final del archivo:
  ```
  it('muestra banner de éxito cuando searchParams registered=true')
    → vi.mock('next/navigation', () => ({
        useRouter: () => ({ push: mockPush }),
        useSearchParams: () => ({ get: (key) => key === 'registered' ? 'true' : null })
      }))
    → render(<LoginPage />)
    → expect(getByText('Cuenta creada exitosamente. Ahora puedes iniciar sesión.')).toBeInTheDocument()

  it('NO muestra banner cuando no hay parámetro registered')
    → useSearchParams: () => ({ get: () => null })
    → expect(queryByText(/cuenta creada/i)).not.toBeInTheDocument()
  ```

### Implementación

- [ ] T026 [HU1] Verificar `app/login/page.tsx` (creado en T004): que el banner de éxito usa el selector correcto para los tests anteriores. No debe añadir lógica nueva — solo confirmar que el test pasa.

---

## Fase 8 — Auditoría Final y Cierre

- [ ] T027 [P] Ejecutar suite completa: `npm run test -- --run`
  - Archivos esperados en verde: `AuthService.test.ts`, `Validation.test.ts`, `LoginForm.test.tsx`, `login.test.tsx`, `RegisterForm.test.tsx`, `register.test.tsx`
  - Tasa de éxito requerida: 100%

- [ ] T028 [P] Auditoría visual y funcional manual:
  - **Fidelidad Figma** (SC-002): en 1440×1024 verificar Brand Panel con gradiente, Card Mockup visible, inputs 400×52px radius 12px, botón #FF6B3D
  - **Above the fold** (SC-004, B-1): tras registro exitoso, el banner "Cuenta creada exitosamente..." debe ser visible en `/login` sin scroll en viewport 1440×1024
  - **Responsive** (FR-015/FR-016): 375px → solo Form Panel; 1024px → Brand Panel aparece; 1440px → Brand Panel 620px
  - **Navegación por teclado** (B-3, caso extremo spec): navegar con Tab por todos los campos y presionar Enter en "Crear cuenta" → verificar que se activan las validaciones inline correctamente y sin errores de consola

- [ ] T029 [P] Revisar `PascalCase` en todos los archivos nuevos y modificados

- [ ] T030 Commit y push: `git add -A && git commit -m "feat: implement Registro de Usuarios — routes / and /login"`

