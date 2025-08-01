# Frontend Products – Rodrigo Rodríguez

---
```
Este proyecto fue desarrollado como parte de una prueba técnica.
Se trata de una aplicación de gestión de productos, compuesta por:

Frontend: React + Next.js con arquitectura basada en Clean Architecture.

Backend: Node.js + Express (API REST) ubicado dentro de la carpeta backend/ del mismo repositorio.

Estructura del repositorio

frontend-products-rodrigo-rodriguez/
├─ backend/          # Backend Node.js (API REST)
│  ├─ package.json
│  ├─ src/
│  └─ ...
├─ src/              # Frontend Next.js
├─ package.json      # Dependencias frontend
└─ README.md         # Documentación del proyecto
⚡ Requisitos previos
Node.js 18+

npm o yarn

Git

Cómo levantar el proyecto

1️- Clonar el repositorio

git clone https://github.com/Rodriguezp809rd/frontend-products-rodrigo-rodriguez.git
cd frontend-products-rodrigo-rodriguez

2️- Levantar el Frontend (Next.js)

npm install
npm run dev
Luego abre http://localhost:3000 en tu navegador.

3️- Levantar el Backend (Node.js / Express)
El backend está ubicado dentro de la carpeta backend/ del proyecto.

cd backend
npm install
npm run dev

El backend quedará disponible en:
http://localhost:3002

4️- Subir cambios al backend (si realizas modificaciones)
Si realizas cambios en el backend y deseas subirlos a GitHub:


cd ..                          
git add backend/
git commit -m "chore: update backend"
git push origin main

Pruebas
Frontend:

npm run test


```
📄 Notas
La carpeta node_modules está ignorada por Git.

Si deseas usar variables de entorno, crea un archivo .env en backend/ basado en .env.example.

Para la entrega de la prueba, también se generó un archivo .zip del proyecto sin node_modules.
