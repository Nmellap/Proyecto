# Proyecto Contigo

Este proyecto separa el frontend y el backend en contenedores Docker.

## Estructura

- `frontend/`: aplicación web del cliente
- `backend/`: API backend
- `docker-compose.yml`: orquestación de frontend, backend y base de datos PostgreSQL

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

- El backend ofrece `GET /api/hello` como endpoint de prueba y `POST /api/contact` para los envíos del formulario.
- Cada parte vive en su propio contenedor y puede desarrollarse por separado.
- Los mensajes del formulario se guardan en PostgreSQL, en el volumen `postgres_data`.
- `contigo_dev_only` es la contraseña predeterminada para desarrollo local. Define `POSTGRES_PASSWORD` en el entorno antes de desplegarlo en un servidor.

## Consultar mensajes de contacto

```bash
docker compose exec db psql -U contigo -d contigo -c "SELECT first_name, last_name, email, message, created_at FROM contact_messages ORDER BY created_at DESC;"
```
