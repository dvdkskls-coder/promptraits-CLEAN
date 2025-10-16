# Promptraits – Fix Pack

Este pack incluye:
- `vercel.json`: Fallback para SPA y rewrites de `/success` y `/cancel`.
- `api/stripe-webhook.js`: Webhook de Stripe con Supabase (service role) para sumar créditos y fijar plan.
- `PATCH_create-checkout-session.txt`: Cambios mínimos para guardar metadata en la suscripción.
- `supabase_schema.sql`: Tablas, políticas RLS y funciones RPC (`use_credit`, `grant_credits`) + trigger de perfil.

## Pasos (orden recomendado)

1) **Seguridad** (URGENTE)
- Deja de commitear `.env`, `.env.local`, `.vercel/` y `node_modules/`.
- Rota las claves expuestas (Stripe, Supabase, Gemini).
- Sube todas las variables a Vercel → Project Settings → Environment Variables:
  - Cliente: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_STRIPE_PRICE_*`.
  - Servidor: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

2) **Supabase**
- Abre el SQL editor y ejecuta `supabase_schema.sql`.
- Verifica que se crea `profiles` (con RLS) y la función `use_credit`.
- Opcional: usa `grant_credits` desde el webhook (requiere Service Role).

3) **Stripe Checkout**
- Aplica el parche de `PATCH_create-checkout-session.txt` en `api/create-checkout-session.js`.
- En Stripe Dashboard → Webhooks: añade endpoint `https://TU-DOMINIO.vercel.app/api/stripe-webhook` y copia el `STRIPE_WEBHOOK_SECRET` a Vercel.
- Crea los precios y pon sus IDs en `VITE_STRIPE_PRICE_PRO`, `VITE_STRIPE_PRICE_PREMIUM`, `VITE_STRIPE_PRICE_PACK_20/50/100`.

4) **Rutas de éxito/cancelación**
- Copia `vercel.json` a la raíz del proyecto. Así `/success` y `/cancel` reescriben a `index.html` (SPA).
- En tu `App.jsx`, añade un `useEffect` que lea `window.location.pathname` y muestre un banner si es `/success` o `/cancel` (y llama a `refreshProfile()` tras éxito).

   ```jsx
   React.useEffect(() => {
     if (window.location.pathname === '/success') {
       alert('✅ Pago completado. Créditos actualizados.')
       // Opcional: limpiar la URL
       window.history.replaceState({}, '', '/')
     }
     if (window.location.pathname === '/cancel') {
       alert('Pago cancelado.')
       window.history.replaceState({}, '', '/')
     }
   }, [])
   ```

5) **Desarrollo local**
- Para probar funciones `/api` en local, usa **`vercel dev`** (recomendado) en lugar de `vite`.
  - Alternativa: añade un proxy en `vite.config.js` hacia el puerto de `vercel dev`.

6) **Quitar actualización de créditos desde el cliente**
- Evita cualquier `update({ credits: supabase.raw('credits + 1') })` en el front. Deja todos los cambios de créditos al **RPC** o al **webhook**.

## Notas
- `api/gemini-processor.js` permite peticiones desde cualquier origen (`*`). Si quieres endurecer CORS, limita `Access-Control-Allow-Origin` a tu dominio.
- Crea páginas visuales para `/success` y `/cancel` si más adelante añades un router; por ahora el `vercel.json` + `useEffect` es suficiente.
