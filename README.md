# NxS — Certificado de autenticidad para fundas de teléfono

NxS es un **sistema de verificación de originalidad** para fundas de móvil de la marca **NxS / Case-Nova**. Cada funda que sale de fábrica lleva pegado un código QR único. El cliente lo escanea con la cámara del teléfono y en menos de un segundo ve si su funda es **auténtica** y las especificaciones exactas del producto que compró (modelo, material, protección, compatibilidad).

---

## Cómo se usa

### 👤 Para el cliente

1. Escaneas el QR pegado a la funda con la cámara del teléfono.
2. Se abre `https://nx-s.vercel.app/verify/<código>`.
3. La app te muestra:
   - ✅ **Producto verificado** → tarjeta verde con las 4 especificaciones de tu funda.
   - ⚠️ **No verificado** → tarjeta roja: el código no existe en la base de datos, probablemente es una falsificación.
   - 🔍 **Sin código** → mensaje de ayuda para escanear el QR correctamente.

### 🛠 Para el admin (fábrica / operador NxS)

1. Entra a `https://nx-s.vercel.app/adminpage` e inicia sesión.
2. Formulario de nueva funda: `Modelo`, `Material`, `Protección`, `Compatibilidad`.
3. Al enviar, NxS genera un UUID único, lo registra en Supabase y produce un **QR en alta resolución (800×800, corrección H)** apuntando a la URL de verificación de esa funda.
4. Descargas el PNG del QR para imprimirlo o pegarlo en la funda física.
5. Puedes seguir creando fundas en la misma sesión ("Nueva funda") o cerrar sesión.

---

## Rutas

| Ruta                    | Público    | Función                                          |
| ----------------------- | ---------- | ------------------------------------------------ |
| `/verify/:codigo`       | Cliente    | Verifica un código QR y muestra la ficha         |
| `/adminpage`            | Interno    | Login + alta de fundas + generación de QR        |

---

## Bajo el capó

- **Frontend:** React 19 + TypeScript + Vite 7, con **React Router** y estilos inline (glassmorphism, dark).
- **Base de datos:** tabla `fundas` en **Supabase** con `codigo` como clave única.
- **QR:** librería `qrcode` en el navegador, PNG data-URL descargable.
- **Fuente:** Sedgwick Ave Display + Montserrat (Google Fonts).
- **Deploy:** Vercel (proyecto `nx-s`), con una serverless function opcional en `api/verify.ts`.

---

## Setup local

```bash
git clone https://github.com/DarkSack/NxS.git
cd NxS
npm install

cp .env.example .env    # rellena las variables
npm run dev             # http://localhost:5173
```

### Variables de entorno

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### Tabla `fundas`

```sql
create table public.fundas (
  codigo text primary key,
  modelo text not null,
  material text,
  proteccion text,
  compatibilidad text,
  creadaEn timestamptz not null default now()
);
```

---

## Estructura

```
NxS/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── pages/
│   │   ├── Verify.tsx      # /verify/:codigo (público)
│   │   ├── AdminPage.tsx   # /adminpage (login + alta + QR)
│   │   └── BackgroundMusic.tsx
│   └── routes/routes.tsx
├── api/
│   └── verify.ts           # helpers Supabase (saveFunda, verifyQR)
├── lib/supabase.ts
└── public/NxS.png          # imagen de fondo del panel
```

---

Hecho con ❤️ por **Sack**.
