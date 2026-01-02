# 💻 Azure AI Roadmap - Frontend (React)

Este es el cliente web desarrollado en **React + Vite** para el asistente técnico de Azure. La interfaz permite una interacción fluida con el sistema RAG (Retrieval-Augmented Generation) del backend, ofreciendo una experiencia de chat moderna, con soporte para Markdown y visualización de fuentes bibliográficas en tiempo real.

## ✨ Características Principales

* **Renderizado de Markdown**: Soporte completo para negritas, listas, títulos y bloques de código en las respuestas del bot.
* **Visualización de Fuentes**: Sección dedicada dentro de cada mensaje para mostrar los documentos técnicos consultados en Azure AI Search.
* **Interfaz Responsiva**: Diseño limpio y moderno construido con **Tailwind CSS**.
* **Gestión de Estado Persistente**: Uso de `thread_id` único por sesión para mantener el contexto de la conversación.
* **Indicadores de Carga**: Feedback visual durante la generación de respuestas del LLM.


## 🛠️ Tecnologías Utilizadas

* **React**: Biblioteca principal para la interfaz de usuario.
* **Tailwind CSS**: Framework de estilos para un diseño rápido y responsivo.
* **@tailwindcss/typography**: Plugin para el formateo elegante de contenido Markdown.
* **React Markdown**: Componente para transformar el string de respuesta del LLM en HTML enriquecido.
* **Lucide React / Heroicons**: Iconografía clara para la interfaz.

## 📁 Estructura del Proyecto

El código sigue una organización modular basada en componentes y hooks personalizados:

```sh
FRONTEND_ROADMAP/
├── src/
│   ├── assets/         # Recursos estáticos (imágenes, logos)
│   ├── components/
│   │   └── chat/       # Componentes atómicos del chat
│   │       ├── ChatHeader.jsx
│   │       ├── ChatInput.jsx
│   │       ├── ChatMessage.jsx   <-- Renderiza Markdown y Sources
│   │       ├── EmptyState.jsx
│   │       └── ChatInterface.jsx <-- Orquestador principal
│   ├── hooks/
│   │   └── useChat.js  # Lógica de consumo de la API de FastAPI
│   ├── App.jsx         # Componente raíz
│   └── main.jsx        # Punto de entrada
├── tailwind.config.js  # Configuración de estilos y tipografía
└── package.json        # Dependencias y scripts
```

# 🚀 Instalación y uso

* Requisitos previos

Node.js (versión 18 o superior)

Backend de FastAPI en ejecución (puerto 8000 por defecto)

* Instalación de Dependencias

```sh
npm install
```

* Inoiciar Aplicacion:

```sh
npm run dev
```

### Notas finales para que todo funcione:

* **Dependencias**: Asegúrate de que tu `package.json` incluya `react-markdown` y `@tailwindcss/typography`.
* **Tailwind**: Recuerda que el plugin `typography` debe estar en el array de `plugins` de tu `tailwind.config.js` para que las listas y negritas se vean bien.

