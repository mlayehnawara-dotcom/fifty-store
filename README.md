# Fifty Store

Premium Tunisian tech ecommerce website.

## Acces rapide

### Frontend

```bash
cd "C:\Users\LENOVO\Downloads\fifty store\project"
npm install
npm run dev
```

Open: `http://localhost:5173`

### Backend Supabase

Le backend doit utiliser un projet Supabase dedie a **Fifty Store**. Ne reutilise pas la base Medismart.

1. Cree un nouveau projet Supabase pour Fifty Store.
2. Lance le schema SQL: `project/supabase/fifty-store-schema.sql`.
3. Cree `project/.env` avec les valeurs du nouveau projet:

```env
VITE_SUPABASE_URL=your_fifty_store_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_fifty_store_anon_key
VITE_ADMIN_EMAIL=admin@fiftystore.tn
VITE_ADMIN_LOCAL_PASSWORD=Admin@12345
```

La base doit contenir `app_settings.store_slug = fifty-store`; sinon l'app refuse d'utiliser Supabase et passe en local fallback.

### Acces Admin

- Route login: `http://localhost:5173/login`
- Email admin: `admin@fiftystore.tn`
- Mot de passe admin: `Admin@12345`
