import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Configuración de planes (debe coincidir con stripe.js del frontend)
const STRIPE_CONFIG = {
  subscriptions: [
    "price_1SIP64IO8cBGyY9CC4BtGdhN",
    "price_1SIP6tIO8cBGyY9CyiW8Qwd0",
  ],
  packs: [
    "price_1SIP97IO8cBGyY9CLmnYtOwl",
    "price_1SIP9TIO8cBGyY9CBW1j64eb",
    "price_1SIP9yIO8cBGyY9CrndCyvTO",
  ],
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Leer todos los parámetros que envía el frontend
    const { priceId, userId, email, successUrl, cancelUrl } = await req.json();

    console.log("🛒 Creando checkout:", { priceId, userId, email });

    // Validar parámetros requeridos
    if (!priceId || !userId || !email) {
      throw new Error("Faltan parámetros requeridos: priceId, userId, email");
    }

    // Determinar si es suscripción o pago único
    const isSubscription = STRIPE_CONFIG.subscriptions.includes(priceId);
    const mode = isSubscription ? "subscription" : "payment";

    console.log(`📦 Modo de pago: ${mode}`);

    // Crear sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url:
        successUrl || `${req.headers.get("origin")}?checkout=success`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}?checkout=cancel`,
      metadata: {
        userId,
        priceId,
        mode,
      },
      allow_promotion_codes: true,
    });

    console.log("✅ Sesión creada:", session.id);
    console.log("🔗 URL:", session.url);

    // Devolver la URL de checkout
    return new Response(
      JSON.stringify({
        url: session.url,
        sessionId: session.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Error al crear checkout:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Error al procesar el pago",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
