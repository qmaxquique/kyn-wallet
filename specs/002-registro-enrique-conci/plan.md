# Plan de Implementación: Registro de Usuarios

**Branch**: `feature/registro-enrique-conci` | **Fecha**: 2026-06-07 | **Spec**: [specs/002-registro-enrique-conci/spec.md](spec.md)
**Entrada**: Especificación de funcionalidad desde `specs/002-registro-enrique-conci/spec.md`

## Resumen

Implementar la pantalla de Registro de Usuarios en la ruta `/`, migrando el Login existente a `/login`. El formulario captura nombre completo, correo, contraseña y confirmación, con validaciones inline y redirección a `/login` con mensaje de éxito tras registro exitoso. El diseño sigue el frame "04 · Registro" de Figma con layout de dos paneles (Brand + Form). Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, sin librerías externas adicionales.

## Contexto Técnico

**Lenguaje/Versión**: TypeScript / Next.js 14 (App Router)
**Dependencias primarias**: React 18, Next.js 14, Tailwind CSS 3.x
**Almacenamiento**: En memoria (array de usuarios en `AuthService`)
**Testing**: Vitest + React Testing Library + JSDOM (decisión heredada de `001-login-billetera`)
**Plataforma objetivo**: Web (Responsive — breakpoint 1024px)
**Restricciones**: Sin librerías externas de UI, `PascalCase` estricto en nombres
**Alcance**: Feature de Registro con migración de ruta del Login existente

## Verificación de Constitución

*PUERTA: Debe pasar antes de iniciar la Fase 0. Re-verificar después de la Fase 1.*

- [x] **TDD**: ¿Está la estrategia de tests definida antes de la implementación? (Vitest + RTL, pruebas escritas antes del código)
- [x] **SOLID**: ¿El diseño aplica principios SOLID? (Separación UI/Lógica/Dominio; SRP en cada componente y servicio)
- [x] **Clean Architecture**: ¿Las capas están estrictamente separadas con dependencias hacia adentro? (`app/` rutas, `components/` UI, `lib/` lógica de negocio)
- [x] **DRY & YAGNI**: ¿El diseño evita duplicación y complejidad innecesaria? (`BrandPanel`, `SocialLogins`, `Button` y `Input` reutilizados del Login)
- [x] **Naming**: ¿El plan respeta `PascalCase` en todas las estructuras? (Mandatorio en todos los componentes y tipos)
- [x] **Dependencias**: ¿La solución es libre de librerías externas? (Solo Next.js/Tailwind como base)
- [x] **Seguridad**: ¿Todas las entradas son validadas y las contraseñas no se almacenan en texto plano? (Validación en FR-009 a FR-014; hash simulado)

## Estructura del Proyecto

### Documentación (esta feature)

```text
specs/002-registro-enrique-conci/
├── spec.md              # Especificación de funcionalidad
├── plan.md              # Este archivo
├── research.md          # Análisis Figma + codebase
├── data-model.md        # Entidades de datos
├── quickstart.md        # Guía de inicio rápido
├── tasks.md             # Desglose de tareas TDD
├── checklists/
│   └── requirements.md  # Checklist de calidad del spec
└── contracts/
    └── register-service.md  # Contrato del RegisterService
```

### Código Fuente — Cambios en el Repositorio

```text
app/
├── page.tsx             # MODIFICAR: reemplazar Login por RegisterForm
├── login/
│   └── page.tsx         # CREAR: mover Login existente aquí
└── construction/
    └── page.tsx         # Sin cambios

components/
├── BrandPanel.tsx       # REUTILIZAR sin cambios (mismo frame)
├── RegisterForm.tsx     # CREAR: formulario de registro completo
├── SocialLogins.tsx     # REUTILIZAR sin cambios
└── ui/
    ├── Button.tsx       # REUTILIZAR sin cambios
    └── Input.tsx        # REUTILIZAR sin cambios

lib/
├── constants/
│   └── DesignTokens.ts  # EXTENDER: añadir AccentOrange, LabelColor, PlaceholderColor
├── services/
│   ├── AuthService.ts   # EXTENDER: añadir método register()
│   └── AuthService.test.ts  # EXTENDER: tests para register()
├── types/
│   └── Auth.ts          # EXTENDER: añadir RegisterCredentials, RegisterResult, ValidationError
└── utils/
    ├── Validation.ts    # EXTENDER: añadir validateFullName, validateConfirmPassword, validateTerms
    └── Validation.test.ts  # EXTENDER: tests para nuevas validaciones
```

**Decisión de estructura**: Reutilización máxima del código existente. Solo se crea `RegisterForm.tsx` como componente nuevo. Los servicios y utilidades se extienden, no se duplican.

## Seguimiento de Complejidad

| Excepción | Razón | Alternativa más simple rechazada porque |
|---|---|---|
| Next.js / Tailwind | Directiva explícita del usuario que reemplaza la restricción estricta de "sin librerías externas" para el framework base. | Construir un SSR personalizado y un parser CSS está fuera del alcance. |
| Migración de ruta `/` → `/login` | Requisito funcional explícito: `/` debe mostrar Registro. | Mantener el Login en `/` y poner el Registro en `/register` contradice directamente la spec. |
