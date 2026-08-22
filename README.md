# 🎫 NxS — FundaQR

Aplicación web (SPA) construida con **React + TypeScript + Vite** para la generación, verificación y validación de **códigos QR** vinculados a un backend de **Supabase**. Diseñada como una herramienta ligera para gestión de asistencia/acceso a eventos y credenciales digitales.

> Nombre interno del paquete: **`fundaqr`**.

---

## ✨ Características

- 📷 Generación de códigos QR únicos por usuario/entrada.
- ✅ Verificación en tiempo real contra Supabase.
- 💾 Persistencia offline con **IndexedDB** (`idb`) para consultas rápidas.
- 🔐 Endpoint serverless `/api/verify` (desplegado en Vercel) para validar QR.
- 🧭 Enrutamiento con **React Router v7**.
- ⚡ Build ultra-rápido con **Vite 7** y HMR.

---

## 🛠️ Stack

- **Frontend:** React 19 · TypeScript 5.9 · Vite 7
- **Estilos:** CSS módulos (carpeta `styles/`)
- **Enrutamiento:** react-router-dom v7
- **Backend / DB:** Supabase (`@supabase/supabase-js`)
- **HTTP:** Axios
- **QR:** `qrcode`
- **Offline cache:** IndexedDB (`idb`)
- **Deploy:** Vercel (edge/serverless functions en `/api`)

---

## 🚀 Puesta en marcha

```bash
# Clonar
git clone https://github.com/DarkSack/NxS.git
cd NxS

# Instalar dependencias
npm install

# Modo desarrollo
npm run dev            # http://localhost:5173

# Build de producción
npm run build

# Previsualizar el build
npm run preview

# Lint
npm run lint
```

---

## 🔐 Variables de entorno

Crea un archivo `.env` (ver también `vercel.json` para producción):

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

## 📁 Estructura

```
NxS/
├── api/
│   └── verify.ts         # Serverless function para validar QR
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── pages/            # Vistas de la SPA
│   ├── routes/           # Definición de rutas
│   └── assets/
├── lib/                  # Cliente Supabase, helpers
├── styles/               # Estilos globales
├── public/
├── vercel.json           # Configuración de deploy
├── vite.config.ts
└── tsconfig.json
```

---

## ☁️ Deploy

Configurado para **Vercel**:

```bash
vercel --prod
```

Las funciones bajo `/api` se despliegan automáticamente como serverless functions.

---

## 🤝 Contribución

PRs bienvenidos. Abre un issue si tienes una idea o encuentras un bug.

---

Hecho con ❤️ por **Sack**.
