# 📔 Guía Maestra de la API - FinanceFlow

Esta documentación técnica está diseñada para desarrolladores que integran la API de FinanceFlow. Cubre desde la autenticación hasta la lógica interna del backend y estrategias de integración para el frontend.

---

## 🚀 1. Configuración de Integración

### URL Base
- **Producción**: `https://rastreador-finanzar-backend.onrender.com/api/v1`
- **Documentación Interactiva (Swagger)**: `https://rastreador-finanzar-backend.onrender.com/api-docs`

### Configuración del Cliente Frontend (Axios)
Para una integración fluida, se recomienda configurar un cliente de Axios con interceptores:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rastreador-finanzar-backend.onrender.com/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para inyectar Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🔐 2. Módulo de Autenticación (Deep Dive)

La API utiliza **JWT (JSON Web Tokens)** con una estrategia de dos tokens: `accessToken` (corta duración) y `refreshToken` (larga duración).

### A. Registro Local (`POST /auth/register`)
- **Payload**: `{ email, password, name }`
- **Lógica**: Crea el usuario, hashea la contraseña con **Bcrypt** (12 rounds) y genera el set de tokens inicial.

### B. Login Local (`POST /auth/login`)
- **Payload**: `{ email, password }`
- **Respuesta**:
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "uuid", "email": "...", "name": "..." },
      "tokens": { "accessToken": "...", "refreshToken": "..." }
    }
  }
  ```

### C. Google OAuth 2.0
1. **Inicio**: El frontend redirige a `GET /auth/google`.
2. **Procesamiento**: El backend usa **Passport.js** para validar con Google. Si el usuario no existe, se crea automáticamente.
3. **Retorno**: Actualmente devuelve JSON con los tokens. En una integración completa, el backend redirigirá al frontend pasando los tokens en la URL (o mediante Cookies seguras).

---

## 🏦 3. Lógica de Cuentas y Transacciones

### Gestión Atómica de Saldos
El backend garantiza la integridad de los datos mediante **Transacciones de Base de Datos (Prisma $transaction)**.

1.  **Registro de Movimientos (`POST /transactions`)**:
    - Se registra el movimiento en la tabla `transactions`.
    - Se actualiza **atónicamente** el `balance` de la cuenta asociada en la tabla `accounts`.
    - Si el movimiento es `EXPENSE`, el saldo resta; si es `INCOME`, el saldo suma.

2.  **Transferencias entre Cuentas (`POST /transactions/transfer`)**:
    - Operación triple atómica: Registro de salida (Cuenta A) + Registro de entrada (Cuenta B) + Actualización de ambos saldos. Si un paso falla, nada se guarda.

3.  **Soft Delete**: Al eliminar una cuenta o transacción, no se borra físicamente. Se marca como `is_active = false`, permitiendo auditorías y recuperación de datos.

---

## 📊 4. Funcionalidades Core del Ecosistema

- **Categorías**: Clasificación jerárquica. La API ofrece categorías globales (predeterminadas) y personalizadas por usuario.
- **Presupuestos (Budgets)**: Motor de vigilancia. El backend calcula en tiempo real el `spent` sumando las transacciones del periodo y categoría correspondiente.
- **Metas (Goals)**: Sistema de ahorro. Permite rastrear el avance hacia un objetivo financiero específico.
- **Exportación**: Generación de archivos dinámica usando `pdfkit` (PDF) y `exceljs` (Excel).

---

## ⚠️ 5. Manejo de Errores y Seguridad

### Estructura de Error Estándar
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación",
    "details": [{ "field": "email", "message": "Email inválido" }]
  }
}
```

### Tabla de Códigos
| Código | HTTP | Descripción |
|--------|------|-------------|
| `UNAUTHORIZED` | 401 | Token expirado o credenciales incorrectas. |
| `FORBIDDEN` | 403 | El recurso existe pero no pertenece a tu usuario. |
| `NOT_FOUND` | 404 | El ID proporcionado no existe en el sistema. |
| `VALIDATION_ERROR` | 422 | Fallo en la estructura del JSON (Validadas por **Zod**). |
| `DUPLICATE_ENTRY` | 409 | Intento de registrar un email ya existente. |

### Seguridad de Capa
- **Helmet**: Protege contra ataques web comunes (XSS, Clickjacking).
- **Rate Limit**: Protege contra fuerza bruta (máximo 100 peticiones cada 15 min por IP).
- **CORS**: Configurado estrictamente para permitir solo el dominio oficial del frontend.
