import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock de fetch global
global.fetch = vi.fn();

describe("gemini-processor API", () => {
  let handler;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock de variables de entorno
    process.env.GEMINI_API_KEY = "test_api_key_123";

    // Importar handler
    const module = await import("../gemini-processor.js?t=" + Date.now());
    handler = module.default;
  });

  describe("Configuración CORS", () => {
    it("debería configurar headers CORS correctamente", async () => {
      const mockRequest = {
        method: "OPTIONS",
      };

      const response = await handler(mockRequest);
      const headers = Object.fromEntries(response.headers.entries());

      expect(headers["access-control-allow-origin"]).toBe("*");
      expect(headers["access-control-allow-methods"]).toContain("POST");
      expect(headers["access-control-allow-headers"]).toContain("Content-Type");
    });

    it("debería manejar peticiones OPTIONS (preflight)", async () => {
      const mockRequest = {
        method: "OPTIONS",
      };

      const response = await handler(mockRequest);

      expect(response.status).toBe(200);
    });
  });

  describe("Validaciones básicas", () => {
    it("debería rechazar métodos que no sean POST u OPTIONS", async () => {
      const mockRequest = {
        method: "GET",
      };

      const response = await handler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data.error).toContain("POST");
    });

    it("debería rechazar si no hay prompt ni imagen", async () => {
      const mockRequest = {
        method: "POST",
        json: async () => ({}),
      };

      const response = await handler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeTruthy();
    });
  });

  describe("Procesamiento de prompts", () => {
    it("debería procesar prompt correctamente", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: "Prompt profesional generado" }],
              },
            },
          ],
        }),
      });

      const mockRequest = {
        method: "POST",
        json: async () => ({
          prompt: "Un retrato profesional",
          userTier: "free",
        }),
      };

      const response = await handler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.enhancedPrompt).toBe("Prompt profesional generado");
    });

    it("debería incluir preset si se proporciona", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: "Prompt con estilo cinematográfico" }],
              },
            },
          ],
        }),
      });

      const mockRequest = {
        method: "POST",
        json: async () => ({
          prompt: "Un retrato",
          preset: "cinematic",
          userTier: "free",
        }),
      };

      const response = await handler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(global.fetch).toHaveBeenCalled();
    });

    it("debería procesar imagen de referencia", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: "Prompt basado en imagen" }],
              },
            },
          ],
        }),
      });

      const mockRequest = {
        method: "POST",
        json: async () => ({
          prompt: "Analiza esta imagen",
          referenceImage: "data:image/png;base64,iVBORw0KGgo...",
          userTier: "free",
        }),
      };

      const response = await handler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.enhancedPrompt).toBeTruthy();
    });
  });

  describe("Funcionalidades PRO", () => {
    it("debería analizar calidad si es usuario PRO", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: "Prompt mejorado PRO" }],
              },
            },
          ],
        }),
      });

      const mockRequest = {
        method: "POST",
        json: async () => ({
          prompt: "Un retrato profesional",
          userTier: "pro",
          analyzeQuality: true,
        }),
      };

      const response = await handler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.enhancedPrompt).toBeTruthy();
    });

    it("debería aplicar sugerencias (modo PRO)", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: "Prompt con sugerencias aplicadas" }],
              },
            },
          ],
        }),
      });

      const mockRequest = {
        method: "POST",
        json: async () => ({
          prompt: "Un retrato",
          userTier: "pro",
          applySuggestions: true,
        }),
      };

      const response = await handler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.enhancedPrompt).toBeTruthy();
    });

    it("debería aplicar sliders si se proporcionan", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: "Prompt con ajustes de sliders" }],
              },
            },
          ],
        }),
      });

      const mockRequest = {
        method: "POST",
        json: async () => ({
          prompt: "Un retrato",
          userTier: "pro",
          sliders: {
            creativity: 0.8,
            detail: 0.9,
            mood: 0.7,
          },
        }),
      };

      const response = await handler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.enhancedPrompt).toBeTruthy();
    });
  });

  describe("Manejo de errores", () => {
    it("debería manejar errores de Gemini API", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: { message: "Internal server error" },
        }),
      });

      const mockRequest = {
        method: "POST",
        json: async () => ({
          prompt: "Un retrato",
          userTier: "free",
        }),
      };

      const response = await handler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeTruthy();
    });

    it("debería rechazar si no hay API key", async () => {
      delete process.env.GEMINI_API_KEY;

      const mockRequest = {
        method: "POST",
        json: async () => ({
          prompt: "Un retrato",
          userTier: "free",
        }),
      };

      const response = await handler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("API key");
    });
  });
});
