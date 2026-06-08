# Checklist de Calidad: Registro de Usuarios

**Propósito**: Validar la completitud y calidad de la especificación antes de proceder al plan de implementación
**Creado**: 2026-06-07
**Feature**: [specs/002-registro-enrique-conci/spec.md](spec.md)

## Calidad del Contenido

- [x] Sin detalles de implementación (lenguajes, frameworks, APIs)
- [x] Enfocado en el valor para el usuario y las necesidades del negocio
- [x] Redactado en términos comprensibles sin jerga técnica de implementación
- [x] Todas las secciones obligatorias completadas

## Completitud de Requisitos

- [x] No quedan marcadores `[NEEDS CLARIFICATION]` en ningún documento
- [x] Los requisitos son testeables y no ambiguos
- [x] Los criterios de éxito son medibles (SC-001 a SC-008)
- [x] Los criterios de éxito son agnósticos a la tecnología de implementación
- [x] Todos los escenarios de aceptación están definidos (HU1–HU4)
- [x] Los casos extremos están identificados (4 casos documentados)
- [x] El alcance está claramente delimitado (solo registro; sin perfil, sin recuperación de contraseña)
- [x] Las dependencias y suposiciones están identificadas (7 suposiciones documentadas)

## Cobertura Funcional

- [x] FR-001: Ruta `/` renderiza Registro (migración desde Login)
- [x] FR-002: Ruta `/login` renderiza Login existente sin cambios
- [x] FR-003: Formulario con los 4 campos requeridos
- [x] FR-004: Checkbox de términos y condiciones
- [x] FR-005: Botón "Crear cuenta" valida antes de enviar
- [x] FR-006: Botones sociales disparan `alert("Próximamente")`
- [x] FR-007: Enlace footer navega a `/login` sin recarga
- [x] FR-008: Registro exitoso redirige a `/login` con mensaje de éxito visible
- [x] FR-009: Validación de formato de correo electrónico
- [x] FR-010: Validación de contraseña mínimo 8 caracteres
- [x] FR-011: Validación de coincidencia entre contraseñas
- [x] FR-012: Validación de campos obligatorios no vacíos
- [x] FR-013: Validación de checkbox de términos marcado
- [x] FR-014: Validación de correo duplicado
- [x] FR-015: Layout de dos paneles en desktop (≥1024px)
- [x] FR-016: Solo Form Panel visible en mobile (<1024px)

## Alineación con la Constitución

- [x] **TDD**: La estrategia de tests está definida en `tasks.md` antes de la implementación (T007, T008, T013, T014)
- [x] **SOLID**: El diseño separa UI (`RegisterForm`), lógica (`AuthService`, `Validation`) y dominio (`Auth.ts`)
- [x] **Clean Architecture**: Las capas están claramente separadas con dependencias hacia adentro
- [x] **DRY & YAGNI**: Reutilización de `BrandPanel`, `SocialLogins`, `Button`, `Input`; sin código duplicado
- [x] **PascalCase**: Todos los nombres de entidades y componentes usan `PascalCase`
- [x] **Sin librerías externas**: Solo Next.js, React y Tailwind CSS como base
- [x] **Seguridad**: Validación de todas las entradas; contraseña como hash simulado (no texto plano)

## Fidelidad Visual (Figma)

- [x] Tokens de diseño del frame "04 · Registro" extraídos y documentados en `research.md` y `data-model.md`
- [x] Gradiente del Brand Panel especificado con valores exactos: `linear-gradient(60deg, rgba(255,138,101,1) 28%, rgba(239,82,38,1) 90%)`
- [x] Dimensiones de inputs documentadas: 400×52px, radius 12px, borde 1.5px `#D7D9E6`
- [x] Botón "Crear cuenta" especificado: 400×52px, fondo `#FF6B3D`, radius 12px, Inter SemiBold 16px blanco
- [x] Tokens nuevos identificados respecto al Login: `AccentOrange`, `LabelColor`, `PlaceholderColor`
- [x] Criterio de fidelidad visual medible: SC-002 (95% coincidencia con Figma)

## Preparación para la Feature

- [x] Todos los requisitos funcionales tienen criterios de aceptación claros
- [x] Los escenarios de usuario cubren los flujos primarios (P1) y secundarios (P2–P4)
- [x] La feature cumple los resultados medibles definidos en los Criterios de Éxito
- [x] No hay detalles de implementación en la especificación

## Notas

- Todos los ítems verificados. La especificación está lista para proceder a la fase de implementación.
- La migración de ruta `/` → `/login` es un impacto sobre la feature existente documentado en `plan.md` y `research.md`.
- Los tests existentes de la feature Login (`app/login.test.tsx`) deberán actualizarse en la Fase 2 de implementación (T006).
