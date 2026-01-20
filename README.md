# 💻 Arquitecto Azure AI - Frontend

Este es el cliente web desarrollado en **React + Vite** para el asistente técnico de Azure. La interfaz permite una interacción fluida con el sistema RAG (Retrieval-Augmented Generation) del backend, ofreciendo una experiencia de chat moderna, con soporte para Markdown y visualización de fuentes bibliográficas en tiempo real.

## ✨ Características principales

* **Renderizado de Markdown**: Soporte completo para negritas, listas, títulos y bloques de código en las respuestas del bot.
* **Visualización de fuentes**: Sección dedicada dentro de cada mensaje para mostrar los documentos técnicos consultados en Azure AI Search.
* **Interfaz responsiva**: Diseño limpio y moderno construido con **Tailwind CSS**.
* **Autenticación con Google**: Flujo de login, refresh y logout con tokens almacenados en el navegador.
* **Gestión de estado**: Uso de `threadId` único por sesión para mantener el contexto de la conversación.
* **Indicadores de carga**: Feedback visual durante la generación de respuestas del LLM.


## 🛠️ Tecnologías utilizadas

* **React 19 + Vite**: Base del proyecto y tooling.
* **React Router**: Enrutamiento de `/chat` y `/auth/callback`.
* **Tailwind CSS v4**: Estilos y UI utilitaria.
* **@tailwindcss/typography**: Tipografias ricas para Markdown.
* **React Markdown**: Renderizado de respuestas del LLM.

## 📁 Estructura del proyecto

El código sigue una organización modular basada en componentes y hooks personalizados:

```sh
FRONTEND_ROADMAP/
├── src/
│   ├── assets/         # Recursos estáticos (imágenes, logos)
│   ├── components/
│   │   ├── chat/       # Componentes atómicos del chat
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ChatMessage.jsx   <-- Renderiza Markdown y Sources
│   │   │   └── EmptyState.jsx
│   │   ├── ChatInterface.jsx     # Orquestador principal
│   │   └── LoginButton.tsx       # Botón de login con Google
│   ├── hooks/
│   │   └── useChat.js  # Lógica de consumo de la API de FastAPI
│   ├── pages/
│   │   └── AuthCallback.tsx       # Callback del proveedor de auth
│   ├── services/
│   │   ├── api.ts                 # Wrapper de API (chat)
│   │   └── auth.ts                # Login / refresh / revoke
│   ├── App.jsx         # Componente raíz
│   └── main.jsx        # Punto de entrada
├── tailwind.config.js  # Configuración de estilos y tipografía
└── package.json        # Dependencias y scripts
```

## 🚀 Instalación y uso

### Requisitos previos

* Node.js (versión 18 o superior)
* Backend de FastAPI en ejecución (puerto 8000 por defecto)

### Instalación de dependencias

```sh
npm install
```

### Iniciar la aplicación

```sh
npm run dev
```

### Variables de entorno

Define `VITE_API_BASE` si tu backend no corre en `http://localhost:8000`:

```sh
VITE_API_BASE=http://localhost:8000
```

### Docker

Construir y ejecutar:

```sh
docker build -t azure-ai-frontend .
docker run --rm -p 5173:5173 azure-ai-frontend
```

### Notas finales para que todo funcione

* **Dependencias**: Asegúrate de que tu `package.json` incluya `react-markdown` y `@tailwindcss/typography`.
* **Tailwind**: Recuerda que el plugin `typography` debe estar en el array de `plugins` de tu `tailwind.config.js` para que las listas y negritas se vean bien.

