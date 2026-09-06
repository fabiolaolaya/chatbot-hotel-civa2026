# 🏨 Agente Conversacional Hotelero Multilingüe (CIVA 2026)

**Universidad Nacional Experimental de Guayana (UNEG)**  
**Unidad Curricular:** Ingeniería de Software I (CIVA 2026)  
**Profesora:** Ing. Dubraska Roca  
**Autora:** Fabiola Olaya  

![Status](https://img.shields.io/badge/Status-Completado-success)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)

## 📌 Descripción del Proyecto
Solución de software desarrollada para el sector hotelero que implementa un agente conversacional 24/7 con soporte multilingüe automático (Español, Inglés, Portugués, Francés e Italiano). El chatbot automatiza la atención al cliente, gestiona consultas de disponibilidad de habitaciones en tiempo real, procesa reservas de restaurante y canaliza alertas automáticas para el equipo de mantenimiento.

🔗 **Deploy Público (En Vivo):** [https://chatbot-hotel-civa2026.vercel.app/](https://chatbot-hotel-civa2026.vercel.app/)

---

## 🛠️ Stack Tecnológico

*   **Frontend:** Next.js (App Router) + Tailwind CSS + React.
*   **Backend / Base de Datos:** Supabase (PostgreSQL).
*   **Automatización:** n8n Cloud (Webhooks & Email Nodes).
*   **Despliegue:** Vercel.
*   **Control de Versiones:** Git + GitHub.

---

## 🏗️ Arquitectura del Sistema

El sistema sigue una arquitectura basada en eventos y micro-servicios integrados:
1.  **Capa de Presentación (Frontend):** Interfaz desarrollada en Next.js que captura el *input* del usuario y procesa la detección de intención e idioma localmente.
2.  **Capa de Datos (Backend):** Conexión directa vía `@supabase/supabase-js` para consultas (`SELECT` habitaciones) e inserciones (`INSERT` reservas y mantenimiento).
3.  **Capa de Automatización (Middleware):** Al registrarse un ticket de mantenimiento o reserva de restaurante, Next.js dispara un `POST` a un Webhook en n8n Cloud. El nodo `Switch` clasifica el evento y los nodos `EmailSend` emiten alertas inmediatas a los departamentos correspondientes.

---

## 🗄️ Documentación de Base de Datos (Supabase)

El modelo de datos relacional en PostgreSQL consta de 5 tablas principales, configuradas para la gestión integral del hotel y la escritura directa desde el agente:

**1. Tabla: `habitaciones`**
*   `id` (int8): Primary Key.
*   `tipo` (text): Sencilla, Doble, Suite, etc.
*   `precio_noche` (numeric): Costo.
*   `capacidad` (int2): Límite de personas.
*   `estado` (text): 'disponible' o 'ocupada'.

**2. Tabla: `huespedes`**
*   `id` (serial): Primary Key.
*   `nombre` (text): Nombre completo del huésped.
*   `email` (text): Correo electrónico de contacto.
*   `telefono` (text): Número de teléfono.

**3. Tabla: `reservas`**
*   `id` (serial): Primary Key.
*   `huesped_id` (integer): Relación con la tabla huéspedes.
*   `habitacion_id` (integer): Relación con la tabla habitaciones.
*   `fecha_entrada` (date): Fecha de check-in programada.
*   `fecha_salida` (date): Fecha de check-out.
*   `estado` (text): 'confirmada', 'cancelada' o 'completada'.

**4. Tabla: `restaurante_reservas`**
*   `id` (serial): Primary Key.
*   `nombre_huesped` (text): Nombre capturado por el bot.
*   `cantidad_personas` (integer): Cantidad de comensales.
*   `fecha_hora` (timestamp): Momento exacto de la solicitud.
*   `estado` (text): Default 'pendiente'.

**5. Tabla: `mantenimiento_tickets`**
*   `id` (serial): Primary Key.
*   `numero_habitacion` (text): Habitación afectada reportada.
*   `descripcion_problema` (text): Reporte descriptivo del usuario.
*   `estado` (text): Default 'abierto'.
*   `fecha_solicitud` (timestamp): Fecha de registro automático.

---

## ⚙️ Configuración Inicial (Setup Local)

Para ejecutar este proyecto en un entorno local, sigue estos pasos:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/fabiolaolaya/chatbot-hotel-civa2026.git](https://github.com/fabiolaolaya/chatbot-hotel-civa2026.git)