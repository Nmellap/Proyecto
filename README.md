# Proyecto Contigo

Este proyecto separa el frontend y el backend en contenedores Docker.

## Estructura

- `frontend/`: aplicación web del cliente
- `backend/`: API backend
- `docker-compose.yml`: orquestación de contenedores

## Ejecutar

```bash
docker compose up --build
```

Luego abrir:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api/hello

## Guardar en GitHub

```bash
git init
git add .
git commit -m "Inicial"
git branch -M main
git remote add origin <URL_DE_TU_REPO>
git push -u origin main
```

## Notas

- El frontend consume la API del backend en `http://localhost:3001/api/hello`.
- Cada parte vive en su propio contenedor y puede desarrollarse por separado.
