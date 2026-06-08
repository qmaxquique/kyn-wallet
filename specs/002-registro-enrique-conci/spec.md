# Especificación de Funcionalidad: Registro de Usuarios

**Feature Branch**: `feature/registro-enrique-conci`
**Creado**: 2026-06-07
**Estado**: Borrador
**Entrada**: "Crear la especificación para la feature 'Registro de Usuarios' de KynWallet. Formulario con nombre completo, correo electrónico, contraseña y confirmar contraseña. Checkbox de aceptación de términos y condiciones. Botón 'Crear cuenta' que valida todos los campos antes de enviar. Botones de Google y Apple con alert exacto 'Próximamente'. Link '¿Ya tienes cuenta? Inicia sesión' hacia /login. Registro exitoso redirige a /login con mensaje de éxito visible. Validaciones inline. Responsive: desktop con 2 paneles y mobile solo formulario. La pantalla principal / muestra Registro."

## Escenarios de Usuario y Pruebas *(obligatorio)*

<!--
  Historias ordenadas por importancia. Cada una es independientemente testeable
  y entrega valor por sí sola como MVP incremental.
-->

### Historia de Usuario 1 - Registro Exitoso de Nueva Cuenta (Prioridad: P1)

Como nuevo usuario, quiero completar el formulario de registro con mis datos válidos y aceptar los términos para crear mi cuenta en KynWallet, y ser redirigido al login con un mensaje de confirmación visible.

**Por qué esta prioridad**: Es el flujo crítico de incorporación. Sin él no existe producto mínimo viable para esta feature.

**Prueba Independiente**: Ingresar nombre "Diego Martínez", correo "test@ejemplo.com", contraseña "Abc12345", confirmación "Abc12345", marcar el checkbox de términos, hacer clic en "Crear cuenta". Verificar redirección a `/login` y presencia del mensaje "Cuenta creada exitosamente. Ahora puedes iniciar sesión."

**Escenarios de Aceptación**:

1. **Dado** que el usuario está en `/` (pantalla de Registro), **Cuando** completa todos los campos con datos válidos, acepta los términos y hace clic en "Crear cuenta", **Entonces** el sistema registra la cuenta y redirige a `/login` mostrando el mensaje "Cuenta creada exitosamente. Ahora puedes iniciar sesión."
2. **Dado** que el usuario fue redirigido a `/login` tras el registro exitoso, **Cuando** observa la pantalla, **Entonces** el mensaje de éxito es visible sin necesidad de scroll (above the fold) y es visualmente distinguible del formulario de login.
3. **Dado** que el usuario accede directamente a `/login`, **Cuando** observa la pantalla, **Entonces** ve el formulario de inicio de sesión y no el formulario de registro.

---

### Historia de Usuario 2 - Validaciones Inline del Formulario (Prioridad: P2)

Como usuario que está completando el formulario de registro, quiero recibir retroalimentación inmediata sobre errores en cada campo para corregirlos antes de intentar enviar el formulario.

**Por qué esta prioridad**: Sin validaciones el flujo es inseguro y frustrante; es requisito constitucional (§Validación de Entradas).

**Prueba Independiente**: Ingresar "nodomain" en el campo "Correo electrónico" y salir del campo. Verificar que aparece el mensaje "Ingresa un correo electrónico válido" debajo del campo, sin que el formulario se envíe.

**Escenarios de Aceptación**:

1. **Dado** que el campo "Correo electrónico" contiene un valor sin dominio válido (ej. "usuario@"), **Cuando** el usuario sale del campo, **Entonces** aparece el mensaje inline "Ingresa un correo electrónico válido" en el color de error definido (#EF4444).
2. **Dado** que el campo "Contraseña" contiene menos de 8 caracteres, **Cuando** el usuario sale del campo, **Entonces** aparece el mensaje inline "La contraseña debe tener al menos 8 caracteres".
3. **Dado** que "Contraseña" y "Confirmar contraseña" no coinciden, **Cuando** el usuario sale del campo "Confirmar contraseña", **Entonces** aparece el mensaje inline "Las contraseñas no coinciden".
4. **Dado** que el usuario hace clic en "Crear cuenta" con uno o más campos obligatorios vacíos, **Cuando** el sistema ejecuta la validación, **Entonces** cada campo vacío muestra el mensaje "Este campo es obligatorio" y el envío es bloqueado.
5. **Dado** que el usuario hace clic en "Crear cuenta" sin marcar el checkbox de términos, **Cuando** el sistema ejecuta la validación, **Entonces** aparece el mensaje "Debes aceptar los términos y condiciones" junto al checkbox y el envío es bloqueado.
6. **Dado** que el usuario intenta registrarse con un correo ya existente en el sistema, **Cuando** el sistema procesa el registro, **Entonces** muestra el mensaje inline en el campo de correo: "Este correo ya está registrado".

---

### Historia de Usuario 3 - Diseño Visual Fiel al Frame de Figma (Prioridad: P3)

Como usuario, quiero ver la pantalla de registro con el diseño de dos paneles que coincida con el frame "04 · Registro" de Figma, para experimentar la identidad visual de KynWallet desde el primer contacto.

**Por qué esta prioridad**: La fidelidad visual consolida la confianza en el producto; sin embargo, el flujo funcional es viable sin el diseño exacto.

**Prueba Independiente**: Inspección visual en viewport 1440×1024: el Brand Panel debe mostrar el degradado naranja, el Card Mockup y el texto "Comienza tu camino financiero."; el Form Panel debe mostrar inputs con radio 12px y botón con fondo `#FF6B3D`.

**Escenarios de Aceptación**:

1. **Dado** que el usuario accede a `/` en viewport ≥1024px, **Cuando** observa la pantalla, **Entonces** ve el Brand Panel (izquierda, 620px) con gradiente `linear-gradient(60deg, rgba(255,138,101,1) 28%, rgba(239,82,38,1) 90%)` y el Form Panel (derecha).
2. **Dado** que el usuario observa el Brand Panel, **Cuando** lo examina, **Entonces** ve el logo "KynWallet" (Inter Bold 26px, blanco), el título "Comienza tu camino financiero." (Inter Bold 44px, blanco), el subtexto (Inter Regular 17px, rgba(255,255,255,0.85)) y el Card Mockup con fondo `rgba(255,255,255,0.16)`, borde `rgba(255,255,255,0.35)` y radio 22px.
3. **Dado** que el usuario observa el Form Panel, **Cuando** examina los campos de entrada, **Entonces** cada input tiene dimensiones 400×52px, radio de borde 12px, borde 1.5px color `#D7D9E6`, color de placeholder `#A9ABC2` y el botón "Crear cuenta" tiene fondo `#FF6B3D`, texto blanco Inter SemiBold 16px.
4. **Dado** que el usuario observa los encabezados del formulario, **Cuando** los lee, **Entonces** el título "Crea tu cuenta" usa Inter Bold 30px color `#16182C` y el subtítulo "Completa tus datos para comenzar" usa Inter Regular 16px color `#8A8BA8`.
5. **Dado** que el usuario accede a `/` en viewport <1024px, **Cuando** observa la pantalla, **Entonces** el Brand Panel no está visible (no ocupa espacio en el layout); solo el Form Panel es visible.

---

### Historia de Usuario 4 - Accesos Sociales y Navegación Secundaria (Prioridad: P4)

Como usuario, quiero ver los botones de Google y Apple y el enlace "¿Ya tienes cuenta? Inicia sesión" para poder iniciar sesión si ya tengo una cuenta.

**Por qué esta prioridad**: Completa la interfaz del frame; la navegación hacia `/login` es un requisito funcional explícito. Las interacciones sociales son visuales en esta versión.

**Prueba Independiente**: Hacer clic en "Google" y verificar que aparece un `alert` con el texto exacto "Próximamente". Hacer clic en "Inicia sesión" y verificar navegación a `/login` sin recarga de página.

**Escenarios de Aceptación**:

1. **Dado** que el usuario hace clic en el botón "Google", **Cuando** el evento se dispara, **Entonces** el navegador muestra un `alert` con el texto exacto "Próximamente".
2. **Dado** que el usuario hace clic en el botón "Apple", **Cuando** el evento se dispara, **Entonces** el navegador muestra un `alert` con el texto exacto "Próximamente".
3. **Dado** que el usuario hace clic en el enlace "Inicia sesión" del footer, **Cuando** el evento se dispara, **Entonces** el sistema navega a `/login` usando navegación del lado del cliente (sin recarga de página completa).
4. **Dado** que el usuario observa el divisor entre el botón "Crear cuenta" y los botones sociales, **Cuando** lo lee, **Entonces** muestra el texto "o regístrate con" con líneas laterales en color `#D7D9E6`.

---

### Casos Extremos

- ¿Qué ocurre si el usuario ingresa únicamente espacios en blanco en el campo "Nombre completo"?
- ¿Cómo responde el sistema si el mismo correo electrónico intenta registrarse dos veces en la misma sesión?
- ¿Cómo se adapta el layout en viewports entre 768px y 1023px (rango tablet)?
- ¿Qué sucede si el usuario navega con teclado (Tab) por todos los campos y hace clic en "Crear cuenta"?

## Requisitos *(obligatorio)*

### Restricciones de Seguridad y Validación *(obligatorio)*

- **Restricción**: Todas las entradas del usuario DEBEN ser validadas rigurosamente antes del procesamiento para prevenir inyecciones y garantizar integridad (constitución §Validación de Entradas).
- **Restricción**: El uso de librerías externas para UI o lógica está estrictamente prohibido; solo se permite Next.js, React y Tailwind CSS como base del proyecto.
- **Restricción**: Todos los nombres de componentes, tipos, interfaces y estructuras DEBEN usar `PascalCase`.
- **Restricción**: Los datos de contraseña NUNCA deben almacenarse en texto plano; el almacenamiento en memoria debe usar una representación no reversible (hash simulado).

### Requisitos Funcionales

- **FR-001**: La ruta `/` DEBE renderizar la pantalla de Registro de Usuarios (la ruta actualmente asignada al Login debe migrar a `/login`).
- **FR-002**: La ruta `/login` DEBE renderizar la pantalla de Inicio de Sesión existente sin cambios funcionales.
- **FR-003**: El formulario de registro DEBE incluir los siguientes campos en orden: Nombre completo, Correo electrónico, Contraseña, Confirmar contraseña.
- **FR-004**: El formulario DEBE incluir un checkbox de aceptación de términos y condiciones ubicado entre el último campo y el botón "Crear cuenta".
- **FR-005**: El botón "Crear cuenta" DEBE ejecutar la validación completa de todos los campos antes de procesar el registro; si alguna validación falla, el envío es bloqueado y los errores son mostrados.
- **FR-006**: Los botones "Google" y "Apple" DEBEN disparar un `alert` nativo con el texto exacto "Próximamente" al ser presionados.
- **FR-007**: El enlace "Inicia sesión" del footer DEBE navegar a `/login` usando navegación del lado del cliente sin recarga de página completa.
- **FR-008**: Tras un registro exitoso, el sistema DEBE redirigir a `/login` y mostrar un mensaje de confirmación "Cuenta creada exitosamente. Ahora puedes iniciar sesión." visible sin scroll.
- **FR-009**: El campo "Correo electrónico" DEBE validar el formato mediante expresión regular estándar y mostrar error inline "Ingresa un correo electrónico válido" si el formato es inválido.
- **FR-010**: El campo "Contraseña" DEBE validar un mínimo de 8 caracteres y mostrar error inline "La contraseña debe tener al menos 8 caracteres" si no se cumple.
- **FR-011**: El campo "Confirmar contraseña" DEBE validar que su valor coincida exactamente con el campo "Contraseña" y mostrar error inline "Las contraseñas no coinciden" si difieren.
- **FR-012**: Todos los campos DEBEN validar que no estén vacíos ni contengan solo espacios en blanco; mostrar error inline "Este campo es obligatorio" en caso contrario.
- **FR-013**: El checkbox de términos DEBE validar que esté marcado al intentar enviar; mostrar error inline "Debes aceptar los términos y condiciones" si no está marcado.
- **FR-014**: Si el correo electrónico ya existe en el sistema simulado, el sistema DEBE mostrar el error inline "Este correo ya está registrado" en el campo correspondiente.
- **FR-015**: En viewport ≥1024px, el layout DEBE mostrar dos paneles: Brand Panel (izquierda, 620px) y Form Panel (derecha).
- **FR-016**: En viewport <1024px, el Brand Panel DEBE estar oculto; solo el Form Panel es visible.

### Entidades Clave

- **RegisterCredentials**: Datos capturados del formulario. Atributos: `FullName` (string), `Email` (string), `Password` (string), `ConfirmPassword` (string), `AcceptsTerms` (boolean).
- **RegisterResult**: Resultado del intento de registro. Atributos: `Success` (boolean), `ErrorMessage` (string, opcional).
- **ValidationError**: Error asociado a un campo del formulario. Atributos: `Field` (string), `Message` (string).

## Criterios de Éxito *(obligatorio)*

### Resultados Medibles

- **SC-001**: La ruta `/` renderiza la pantalla de Registro y la ruta `/login` renderiza el Login existente; verificable mediante navegación directa a cada ruta.
- **SC-002**: La interfaz de registro coincide visualmente en un 95% con el frame "04 · Registro" de Figma, incluyendo colores exactos de fondo, tipografía Inter, dimensiones de inputs (400×52px) y botones.
- **SC-003**: Todos los mensajes de error inline aparecen dentro de los 300ms posteriores al evento `blur` del campo o al intento de envío fallido.
- **SC-004**: El mensaje de éxito tras el registro es visible en `/login` en el área superior de la página (above the fold) en viewport 1440×1024.
- **SC-005**: Los `alert("Próximamente")` se disparan en ≤1 clic del usuario en cada botón social.
- **SC-006**: En viewport <1024px, el Brand Panel es completamente invisible (no ocupa espacio en el layout visible).
- **SC-007**: El 100% de las pruebas unitarias e de integración definidas en `tasks.md` pasan antes del merge a la rama principal.
- **SC-008**: No existen marcadores `[NEEDS CLARIFICATION]` en ningún documento de especificación de esta feature.

## Suposiciones

- El registro almacena los datos del nuevo usuario en el array en memoria de `AuthService`, consistente con el mecanismo de login existente.
- La contraseña se almacena como hash simulado (no texto plano) en el array en memoria.
- El texto "términos y condiciones" del checkbox es visualmente un enlace (color `#EF5226`) pero sin destino funcional en esta versión.
- La fuente "Inter" se carga a través del mecanismo existente en el proyecto (configuración de Next.js).
- El icono de ojo (toggle de visibilidad) en los campos de contraseña es un elemento visual del frame; su comportamiento funcional se define en las tareas de implementación.
- La pantalla `/construction` existente permanece sin cambios como destino post-login.
- Los botones sociales no realizan autenticación real en ninguna versión contemplada en esta spec.
