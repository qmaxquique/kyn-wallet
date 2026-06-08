# Research: Registro de Usuarios

## Análisis del Frame "04 · Registro" — Figma

**Archivo**: Billetera Virtual - Prototipos (`f7uDsv8sh6ZOtK2OitTqtg`)
**Nodo**: `31:2` | **Dimensiones del frame**: 1440×1024px

### Brand Panel (izquierda, 620×1024px)

| Elemento | Valor extraído de Figma |
|---|---|
| Fondo | `linear-gradient(60deg, rgba(255,138,101,1) 28%, rgba(239,82,38,1) 90%)` |
| Logo "KynWallet" | Inter Bold 26px, blanco `#FFFFFF`, posición x:78 y:70 |
| Logo dots | Ellipses: blanco sólido (10×28px) + blanco 55% (14×14px) |
| Headline "Comienza tu" | Inter Bold 44px, lineHeight 108%, blanco, posición y:400 |
| Headline "camino financiero." | Inter Bold 44px, lineHeight 108%, blanco, posición y:452 |
| Subtexto | Inter Regular 17px, lineHeight 150%, `rgba(255,255,255,0.85)`, posición y:510, width 500px |
| Card Mockup | 360×210px, fondo `rgba(255,255,255,0.16)`, borde 1px `rgba(255,255,255,0.35)`, radius 22px, posición y:750 |
| Card — "Kyn Card" | Inter SemiBold 15px, blanco |
| Card — Chip | 38×28px, `rgba(255,217,128,0.9)`, radius 6px |
| Card — Número | "5294  ••••  ••••  4827", Inter Medium 20px, blanco |
| Card — Titular | "STEVEN LUNA", Inter Medium 13px, `rgba(255,255,255,0.9)` |
| Card — Vencimiento | "12/29", Inter Medium 13px, `rgba(255,255,255,0.9)` |

### Form Panel (derecha, x:820, ancho efectivo ~400px de contenido)

| Elemento | Valor extraído de Figma |
|---|---|
| Heading "Crea tu cuenta" | Inter Bold 30px, `#16182C`, posición x:820 y:140 |
| Subheading | "Completa tus datos para comenzar", Inter Regular 16px, `#8A8BA8` |
| **Labels de campo** | Inter Medium 14px, `#3D3F5C` |
| **Inputs** | 400×52px, radius 12px, borde 1.5px `#D7D9E6`, fondo blanco |
| Placeholder color | `#A9ABC2` (Inter Regular 15px) |
| Campo 1 | "Nombre completo" → placeholder "Ej: Diego Martínez" |
| Campo 2 | "Correo electrónico" → placeholder "tucorreo@ejemplo.com" |
| Campo 3 | "Contraseña" → placeholder "••••••••" + eye icon (ellipse 20×12px, `rgba(169,171,194,0.5)`) |
| Campo 4 | "Confirmar contraseña" → placeholder "••••••••" + eye icon |
| Checkbox términos | 20×20px, borde 1.5px `#D7D9E6`, radius 6px |
| Texto checkbox | "Acepto los " (Inter Medium 14px, `#3D3F5C`) + "términos y condiciones" (Inter SemiBold 14px, `#EF5226`) |
| Botón "Crear cuenta" | 400×52px, fondo `#FF6B3D`, radius 12px, texto Inter SemiBold 16px blanco centrado |
| Divisor | "o regístrate con", Inter Regular 13px, `#8A8BA8`; líneas laterales `#D7D9E6` (1px height) |
| Botón Google | 192×48px, fondo blanco, borde 1.5px `#D7D9E6`, radius 12px, "Google" Inter SemiBold 15px `#16182C` |
| Botón Apple | 192×48px, fondo blanco, borde 1.5px `#D7D9E6`, radius 12px, "Apple" Inter SemiBold 15px `#16182C` |
| Footer — texto | "¿Ya tienes cuenta?" Inter Regular 14px `#8A8BA8` |
| Footer — link | "Inicia sesión" Inter SemiBold 14px `#EF5226`, posición y:798 |

---

## Análisis del Codebase Existente

### Estructura relevante (feature Login — `001-login-billetera`)

| Archivo | Relevancia para Registro |
|---|---|
| `lib/constants/DesignTokens.ts` | Tokens de diseño ya definidos; los de Registro son idénticos o extensión de los del Login |
| `lib/services/AuthService.ts` | Servicio simulado de autenticación; debe extenderse con método `register()` |
| `lib/utils/Validation.ts` | Lógica de validación existente; debe extenderse con reglas de registro (confirmación de contraseña, nombre, checkbox) |
| `lib/types/Auth.ts` | Tipos de dominio; debe añadir `RegisterCredentials`, `RegisterResult` y `ValidationError` |
| `components/ui/Button.tsx` | Botón base reutilizable; compatible con botón "Crear cuenta" |
| `components/ui/Input.tsx` | Input base reutilizable; compatible con los 4 campos del formulario |
| `components/BrandPanel.tsx` | Brand Panel del Login; el frame de Registro tiene Brand Panel idéntico (misma estructura, mismo gradiente) |
| `components/SocialLogins.tsx` | Botones Google/Apple del Login; reutilizables directamente |
| `app/page.tsx` | Actualmente renderiza Login; debe migrar a renderizar Registro |
| `app/login.test.tsx` | Tests del Login en `/`; deben actualizarse para la nueva ruta `/login` |

### Decisiones Técnicas Heredadas

- **Test runner**: Vitest + React Testing Library + JSDOM (decisión de `001-login-billetera/research.md`)
- **Tokens de diseño**: Centralizados en `lib/constants/DesignTokens.ts` importados en `tailwind.config.ts`
- **Arquitectura**: Clean Architecture — separación estricta de UI (`components/`), lógica (`lib/services/`, `lib/utils/`) y rutas (`app/`)
- **Sin librerías externas**: Solo Next.js, React y Tailwind CSS como base

### Tokens de Diseño — Compatibilidad con Registro

Los tokens existentes (`DesignTokens.ts`) cubren todos los valores visuales del frame de Registro. No se requieren nuevos tokens; solo nuevas aplicaciones de los existentes:

| Token existente | Valor | Uso en Registro |
|---|---|---|
| `BrandPrimary` | `#FF6B3D` | Botón "Crear cuenta" |
| `BrandGradientStart` | `rgb(255,138,101)` | Brand Panel |
| `BrandGradientEnd` | `rgb(239,82,38)` | Brand Panel |
| `Neutral900` | `#16182C` | Heading del formulario, textos botones sociales |
| `Neutral500` | `#8A8BA8` | Subheading, footer, texto del divisor |
| `Neutral300` | `#D7D9E6` | Bordes de inputs, botones sociales, líneas del divisor |
| `BorderRadiusLg` | `12px` | Inputs, botones, botones sociales |
| `BorderRadiusMd` | `6px` | Checkbox de términos |

**Token adicional identificado** (no en los tokens del Login, presente en Registro):

| Nuevo Token | Valor | Uso |
|---|---|---|
| `AccentOrange` | `#EF5226` | Link "términos y condiciones", link "Inicia sesión" en footer |
| `LabelColor` | `#3D3F5C` | Labels de campos del formulario |
| `PlaceholderColor` | `#A9ABC2` | Texto placeholder de inputs |

---

## Decisión: Reutilización del Brand Panel

- **Decisión**: El componente `BrandPanel.tsx` existente es reutilizable directamente para la pantalla de Registro. El frame "04 · Registro" tiene el mismo Brand Panel que el Login (mismo gradiente, mismos textos de marca, mismo Card Mockup).
- **Rationale**: El Brand Panel de Registro tiene estructura y valores visuales idénticos al del Login; no hay diferencias en el frame de Figma. Reutilizarlo cumple con DRY.
- **Alternativa rechazada**: Crear un `BrandPanelRegister.tsx` separado. Rechazado por violar el principio DRY sin justificación funcional.

## Decisión: Migración de Ruta `/` → `/login`

- **Decisión**: El contenido actual de `app/page.tsx` (Login) se mueve a `app/login/page.tsx`; `app/page.tsx` pasa a renderizar el formulario de Registro.
- **Rationale**: El requisito explícito establece que `/` muestra Registro y `/login` muestra el Login existente.
- **Impacto**: Los tests existentes en `app/login.test.tsx` y `components/LoginForm.test.tsx` deben actualizarse para referenciar la nueva ruta `/login`.
