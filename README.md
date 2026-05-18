# Fifty Store
Premium Tunisian tech ecommerce website.

## Acces rapide (Frontend / Backend / Admin)

### Frontend

```bash
cd "C:\Users\LENOVO\Downloads\fifty store\project"
npm install
npm run dev
```

Open:
- `http://localhost:5173`

### Backend (Supabase)

Le backend est sur Supabase (pas de serveur Node local dans ce projet).

1. Crée un fichier `.env` dans `project/`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=admin@fiftystore.tn
VITE_ADMIN_LOCAL_PASSWORD=Admin@12345
```

2. Ouvre Supabase Dashboard:
- `https://supabase.com/dashboard`

### Acces Admin (local/demo)

- Route login: `http://localhost:5173/login`
- Email admin: `admin@fiftystore.tn`
- Mot de passe admin: `Admin@12345`

Note:
- Si tu changes `VITE_ADMIN_EMAIL` ou `VITE_ADMIN_LOCAL_PASSWORD`, utilise les nouvelles valeurs.
