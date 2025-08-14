# Security Guidelines

## Environment Variables

### ⚠️ IMPORTANT: Never commit sensitive credentials to version control

### Setup Instructions:

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your actual credentials to `.env`:**
   - Replace placeholder values with your real Supabase credentials
   - Never share these credentials publicly

3. **Client Environment Variables:**
   Create `client/.env` with:
   ```
   VITE_SUPABASE_URL=your_actual_url
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key
   ```

4. **Server Environment Variables:**
   Create `server/.env` with:
   ```
   SUPABASE_URL=your_actual_url
   SUPABASE_ANON_KEY=your_actual_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_key
   PORT=3000
   ```

### Security Best Practices:

- ✅ Environment files are in `.gitignore`
- ✅ Use `VITE_` prefix for client-side variables
- ✅ Keep service role key server-side only
- ✅ Regularly rotate your keys
- ❌ Never hardcode credentials in source code
- ❌ Never commit `.env` files to git

### If Credentials Are Compromised:

1. Immediately regenerate keys in Supabase dashboard
2. Update all environment files
3. Restart your applications
4. Review git history for any exposed credentials