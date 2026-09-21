# MERN Blog (No Tailwind, No Vite)

Features:
- Post blogs with image & category
- All blogs on home with search, category filter, pagination
- Like, comment, save-for-later
- Blog detail view with interactions
- Dark/Light toggle, subtle transitions
- User profile with own blogs & saved items
- No admin panel
- Professional UI using plain CSS

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env
# edit .env to your Mongo connection & client origin
npm install
npm run dev
```

### Frontend (Create React App, not Vite)
```bash
cd frontend
npm install
npm start
```

Ensure the backend runs on http://localhost:5000 and frontend on http://localhost:3000.

## API Overview
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me
- GET  /api/blogs?search=&category=&page=&limit=
- GET  /api/blogs/:id
- POST /api/blogs (multipart/form-data: title, content, category, image) [auth]
- POST /api/blogs/:id/like [auth]
- POST /api/blogs/:id/save [auth]
- POST /api/blogs/:id/comments { text } [auth]
- DELETE /api/blogs/:id/comments/:commentId [auth, owner]
- GET  /api/users/:id
- GET  /api/users/:id/blogs
- GET  /api/users/:id/saved
