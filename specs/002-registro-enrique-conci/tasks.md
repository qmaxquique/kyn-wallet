# Tareas: Registro de Usuarios

**Entrada**: Documentos de diseño de `/specs/002-registro-enrique-conci/`
**Prerrequisitos**: plan.md (requerido), spec.md (requerido para historias de usuario), research.md, data-model.md, contracts/

## Formato: `[ID] [P?] [HU?] Descripción`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias)
- **[HU]**: Historia de usuario a la que pertenece la tarea (ej. HU1, HU2, HU3, HU4)
- Incluir rutas de archivo exactas en las descripciones

---

## Fase 1: Preparación (Infraestructura Compartida)

**Objetivo**: Extensión del dominio y los tokens antes de cualquier UI.

- [ ] T001 Extender `lib/types/Auth.ts` con los tipos `RegisterCredentials`, `RegisterResult` y `ValidationError`
- [ ] T002 [P] Extender `lib/constants/DesignTokens.ts` con los tokens `AccentOrange` (`#EF5226`), `LabelColor` (`#3D3F5C`) y `PlaceholderColor` (`#A9ABC2`)
- [ ] T003 [P] Actualizar `tailwind.config.ts` para incluir los nuevos tokens de Fase 1

---

## Fase 2: Migración de Ruta (Prerrequisito Bloqueante)

**Objetivo**: Liberar la ruta `/` para Registro y mover el Login a `/login`.

- [ ] T004 Crear `app/login/page.tsx` moviendo el contenido actual de `app/page.tsx` (Layout Login con `BrandPanel` + `LoginForm`)
- [ ] T005 [P] Actualizar las referencias internas de navegación en `components/LoginForm.tsx` si apuntan a `/` (ajustar a `/login`)
- [ ] T006 [P] Actualizar `app/login.test.tsx` para referenciar la nueva ruta `/login` en lugar de `/`

---

## Fase 3: Historia de Usuario 1 — Registro Exitoso (Prioridad: P1) 🎯 MVP

**Objetivo**: Flujo completo de registro con redirección a `/login` y mensaje de éxito.

**Prueba independiente**: Ingresar datos válidos, hacer clic en "Crear cuenta", verificar redirección a `/login` con mensaje de éxito.

### Tests para Historia de Usuario 1 (OBLIGATORIO — TDD) ⚠️

- [ ] T007 [P] [HU1] Crear tests unitarios para `AuthService.register()` en `lib/services/AuthService.test.ts`: registro exitoso, correo duplicado, hash simulado
- [ ] T008 [P] [HU1] Crear tests de integración del flujo de registro en `app/register.test.tsx`: envío válido → redirección `/login` → mensaje de éxito visible

### Implementación para Historia de Usuario 1

- [ ] T009 [HU1] Extender `lib/services/AuthService.ts` con el método `register(credentials: RegisterCredentials): Promise<RegisterResult>`
- [ ] T010 [HU1] Crear `components/RegisterForm.tsx` con estructura básica de formulario (4 campos, checkbox, botón "Crear cuenta") conectado a `AuthService.register()`
- [ ] T011 [HU1] Reemplazar el contenido de `app/page.tsx` con el layout de Registro: `BrandPanel` (izquierda) + `RegisterForm` (derecha)
- [ ] T012 [HU1] Implementar redirección a `/login` con mensaje de éxito usando parámetros de URL o estado de sesión tras registro exitoso en `RegisterForm.tsx`

---

## Fase 4: Historia de Usuario 2 — Validaciones Inline (Prioridad: P2)

**Objetivo**: Retroalimentación inmediata en cada campo del formulario.

**Prueba independiente**: Ingresar correo inválido, salir del campo, verificar error inline en ≤300ms.

### Tests para Historia de Usuario 2 (TDD) ⚠️

- [ ] T013 [P] [HU2] Crear tests unitarios para las nuevas funciones de validación en `lib/utils/Validation.test.ts`: `validateFullName`, `validateConfirmPassword`, `validateTerms`, `validateEmailNotDuplicate`
- [ ] T014 [HU2] Crear tests de UI para mensajes de error inline en `components/RegisterForm.test.tsx`: cada campo con valor inválido muestra el mensaje correcto

### Implementación para Historia de Usuario 2

- [ ] T015 [P] [HU2] Extender `lib/utils/Validation.ts` con: `validateFullName` (no vacío, no solo espacios), `validateConfirmPassword` (coincidencia), `validateTerms` (debe ser `true`)
- [ ] T016 [HU2] Integrar validaciones inline en `components/RegisterForm.tsx`: trigger en evento `blur` por campo y en submit general; mostrar `ValidationError.Message` debajo de cada campo en color `#EF4444`
- [ ] T017 [HU2] Implementar bloqueo del envío en `RegisterForm.tsx` cuando alguna validación falla (botón "Crear cuenta" no ejecuta `register()`)

---

## Fase 5: Historia de Usuario 3 — Fidelidad Visual Figma (Prioridad: P3)

**Objetivo**: Layout de dos paneles y estilos exactos del frame "04 · Registro".

**Prueba independiente**: Inspección visual en 1440×1024 — Brand Panel con gradiente, Card Mockup visible, inputs 400×52px con radius 12px.

### Implementación para Historia de Usuario 3

- [ ] T018 [P] [HU3] Aplicar tokens de diseño completos en `components/RegisterForm.tsx`: inputs (400×52px, radius 12px, borde 1.5px `#D7D9E6`), botón (400×52px, fondo `#FF6B3D`, radius 12px, Inter SemiBold 16px)
- [ ] T019 [P] [HU3] Aplicar estilos tipográficos en `components/RegisterForm.tsx`: heading Inter Bold 30px `#16182C`, subheading Inter Regular 16px `#8A8BA8`, labels Inter Medium 14px `#3D3F5C`
- [ ] T020 [HU3] Implementar comportamiento responsive en `app/page.tsx`: Brand Panel oculto en <1024px (clase `hidden lg:flex` o equivalente); Form Panel visible en todos los viewports
- [ ] T021 [P] [HU3] Implementar icono de ojo (toggle de visibilidad) en los campos "Contraseña" y "Confirmar contraseña" en `components/RegisterForm.tsx`

---

## Fase 6: Historia de Usuario 4 — Botones Sociales y Navegación Secundaria (Prioridad: P4)

**Objetivo**: Botones Google/Apple con "Próximamente" y enlace a `/login`.

**Prueba independiente**: Click en "Google" → `alert("Próximamente")`; click en "Inicia sesión" → navegación a `/login`.

### Implementación para Historia de Usuario 4

- [ ] T022 [P] [HU4] Incluir `SocialLogins.tsx` en `components/RegisterForm.tsx` con el divisor "o regístrate con" (texto Inter Regular 13px `#8A8BA8`, líneas `#D7D9E6`)
- [ ] T023 [HU4] Verificar que `SocialLogins.tsx` dispara `alert("Próximamente")` al hacer clic en Google o Apple (comportamiento ya implementado; validar que aplica sin cambios)
- [ ] T024 [HU4] Implementar el footer de `RegisterForm.tsx` con "¿Ya tienes cuenta?" (Inter Regular 14px `#8A8BA8`) y enlace "Inicia sesión" (Inter SemiBold 14px `#EF5226`) que navega a `/login`

---

## Fase 7: Pulido y Verificación Final

**Objetivo**: Calidad final y documentación de cierre.

- [ ] T025 [P] Ejecutar todos los tests (`npm run test`) y garantizar tasa de éxito del 100%
- [ ] T026 [P] Verificar comportamiento responsive en viewports: 375px (mobile), 768px (tablet), 1024px (breakpoint), 1440px (desktop referencia)
- [ ] T027 [P] Revisar cumplimiento de `PascalCase` en todos los archivos nuevos y modificados
- [ ] T028 Actualizar `specs/002-registro-enrique-conci/quickstart.md` con las nuevas rutas y credenciales de prueba
- [ ] T029 [P] Revisión final contra checklist `specs/002-registro-enrique-conci/checklists/requirements.md`
