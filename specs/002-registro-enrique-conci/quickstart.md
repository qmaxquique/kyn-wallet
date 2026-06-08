# Quickstart: Registro de Usuarios

## Rutas

| Ruta | Pantalla |
|---|---|
| `/` | Registro de Usuarios (esta feature) |
| `/login` | Inicio de Sesión (feature existente, migrada) |
| `/construction` | Pantalla post-login (placeholder, sin cambios) |

## Setup

1. Asegúrate de tener **Node.js 18+** instalado.
2. Clona el repositorio y navega a la raíz.
3. Instala las dependencias:
   ```bash
   npm install
   ```

## Desarrollo

- Inicia el servidor de desarrollo:
  ```bash
  npm run dev
  ```
- La pantalla de **Registro** estará disponible en `/`.
- La pantalla de **Login** estará disponible en `/login`.

## Datos de Prueba

Para probar el flujo de registro completo:

| Campo | Valor de ejemplo |
|---|---|
| Nombre completo | `Diego Martínez` |
| Correo electrónico | `test@ejemplo.com` |
| Contraseña | `Abc12345` |
| Confirmar contraseña | `Abc12345` |
| Términos | Marcado ✓ |

Tras el registro exitoso, serás redirigido a `/login` con el mensaje:
> "Cuenta creada exitosamente. Ahora puedes iniciar sesión."

Para probar el **Login** con las credenciales pre-existentes:
- Correo: `tucorreo@ejemplo.com`
- Contraseña: `password123`

## Tests

- Ejecuta todos los tests unitarios e integración con Vitest:
  ```bash
  npm run test
  ```
- Para modo watch:
  ```bash
  npm run test:watch
  ```

## Guía de Estilos

- Usa los componentes de `components/ui/` (`Button`, `Input`) para mantener consistencia con los tokens de Figma.
- Los nuevos tokens `AccentOrange`, `LabelColor` y `PlaceholderColor` están en `lib/constants/DesignTokens.ts`.
- Todas las estructuras de datos y componentes deben seguir el estándar `PascalCase`.
