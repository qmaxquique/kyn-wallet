# Comandos y prompts usados

### Switch para usar copilot
```
specify integration switch copilot --script sh --refresh-shared-infra
```

### Spec
```
/speckit.specify GIT_BRANCH_NAME=feature/registro-enrique-conci

Crear la especificación para la feature "Registro de Usuarios" de KynWallet.

Usa el MCP de Figma para extraer el contexto visual del frame "04 · Registro":
https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual--Prototipos?node-id=31-2&t=UqXziRdbvr7Ri2f6-4

No implementar código todavía.

Requisitos funcionales:
- Formulario con nombre completo, correo electrónico, contraseña y confirmar contraseña.
- Checkbox de aceptación de términos y condiciones.
- Botón "Crear cuenta" que valida todos los campos antes de enviar.
- Botones de Google y Apple con alert exacto "Próximamente".
- Link "¿Ya tienes cuenta? Inicia sesión" hacia /login.
- Registro exitoso redirige a /login con mensaje de éxito visible.
- Validaciones inline: correo válido, contraseña mínimo 8 caracteres, contraseñas coinciden, campos obligatorios y términos aceptados.
- Responsive: desktop con 2 paneles y mobile solo formulario.

La pantalla principal / debe mostrar Registro, y el login existente debe quedar disponible en /login.

La spec debe estar en español, sin detalles de implementación, alineada con .specify/memory/constitution.md y con criterios medibles de fidelidad visual, funcionalidad y responsive.
```

### Revision secundaria de Spec
```
Revisa la spec generada contra el frame de Figma y la constitution. No escribas código.

Verificá que no quede ningún [NEEDS CLARIFICATION], que los requisitos sean testeables, que / muestre Registro, que /login quede para iniciar sesión, y que el checklist de requirements quede completo. Si hay brechas, corregí solo los documentos SDD.
```

### Plan
```
/speckit.plan

Planificar la implementación con el stack actual del repo: Next.js 14 App Router, TypeScript, Tailwind, Vitest y React Testing Library.

Respetar la constitution:
- TDD obligatorio.
- No agregar librerías externas.
- Clean Architecture.
- Reutilizar patrones existentes de components/LoginForm.tsx, components/ui/Input.tsx, components/ui/Button.tsx, lib/services/AuthService.ts y lib/utils/Validation.ts.
- Mantener verdes los tests actuales de login.

El plan debe contemplar RegisterForm, servicio de registro simulado, tipos de registro, validaciones reutilizables, ruta / para registro, ruta /login para el login existente y mensaje de éxito al volver desde registro.
```

```
/speckit.commit 
```

### Tasks
El plan ya las habia generado, pero lo mismo las llamo con el comando de speckit.tasks

```
/speckit.tasks

Genera o actualiza las tasks ejecutables y ordenadas por historias de usuario. Como el proyecto exige TDD, cada historia debe tener primero tareas de tests y después implementación.

Incluí rutas y archivos exactos. Debe haber tareas para:
- Tests unitarios de validaciones de registro.
- Tests del servicio de registro.
- Tests de RegisterForm: campos obligatorios, email inválido, password corta, confirmación distinta, términos no aceptados, éxito, social alerts y link a /login.
- Implementación de RegisterForm.
- Servicio y tipos de registro.
- Ajuste de rutas / y /login.
- Mensaje de éxito en login.
- Auditoría responsive y visual contra Figma.
- Ejecutar npm run test -- --run.
```

```
/speckit.commit 
```

### Análisis
```
/speckit.analyze

Haz un análisis read-only de consistencia entre spec.md, plan.md y tasks.md. Reportá brechas de cobertura, conflictos con la constitution o requisitos sin tasks. No modifiques archivos en este paso.
```

### Correccion de desviaciones
```
Toma el reporte de /speckit.analyze y corrige las desviaciones encontradas

Reglas:
- No cambies el alcance funcional aprobado.
- No agregues nuevas features.
- No modifiques código si la desviación es solo documental.
- Si una corrección requiere código, primero actualiza/crea tests según la constitution.
- Manten la feature en la rama feature/enrique-daniel-conci.
- Preserva / como Registro y /login como Login.
- Al final ejecuta npm run test -- --run, npm run lint y npm run build.
```

### Analisis y correcciones adicionales

```
/speckit.analyze
```
```
Corrige los residuos encontrados
```


