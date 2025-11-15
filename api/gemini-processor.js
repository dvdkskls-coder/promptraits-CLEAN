import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  runtime: "edge",
};

// =================================================================
// ⚙️ CONFIGURACIÓN Y LLAMADA A LA API
// =================================================================
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

async function callGoogleAI(model, method, payload) {
  const url = `${BASE_URL}/models/${model}:${method}?key=${API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Google API Error (${response.status}): ${errorText}`);
    throw new Error(`Error de la API de Google: ${errorText}`);
  }
  return response.json();
}

const safetySettings = [
  {
    model: "gemini-1.5",
    safetySettings: {
      blocklist: {
        // Palabras o frases que activan el bloqueo
        phrases: [
          "violence",
          "self-harm",
          "hate speech",
          "sexual content",
          "drug use",
          "gambling",
          "malware",
          "spam",
          "scam",
          "phishing",
          "adult content",
          "offensive language",
          "abuse",
          "harassment",
          "threats",
          "intimidation",
          "thievery",
          "vandalism",
          "threatening behavior",
          "threatening language",
          "terroristic threats",
          "anarchist propaganda",
          "hate group propaganda",
          "extremist propaganda",
          "recruitment for terrorist organizations",
          "instructions for making explosives",
          "instructions for making weapons",
          "instructions for making drugs",
          "instructions for committing suicide",
          "instructions for self-harm",
          "doxxing",
          "swatting",
          "encouragement of illegal activities",
          "facilitation of illegal activities",
          "sale of illegal substances",
          "sale of regulated goods without proper authorization",
          "sale of firearms or ammunition",
          "sale of explosives",
          "sale of drugs",
          "sale of human organs",
          "sale of endangered species",
          "sale of stolen property",
          "sale of counterfeit goods",
          "sale of tobacco products to minors",
          "sale of alcohol to minors",
          "sale of gambling services without a license",
          "sale of lottery tickets without a license",
          "sale of raffle tickets without a license",
          "sale of securities without a license",
          "sale of real estate without a license",
          "sale of timeshares without a license",
          "sale of motor vehicles without a license",
          "sale of boats without a license",
          "sale of airplanes without a license",
          "sale of motorcycles without a license",
          "sale of recreational vehicles without a license",
          "sale of trailers without a license",
          "sale of snowmobiles without a license",
          "sale of off-road vehicles without a license",
          "sale of farm equipment without a license",
          "sale of construction equipment without a license",
          "sale of industrial equipment without a license",
          "sale of medical equipment without a license",
          "sale of dental equipment without a license",
          "sale of veterinary equipment without a license",
          "sale of laboratory equipment without a license",
          "sale of scientific equipment without a license",
          "sale of photographic equipment without a license",
          "sale of optical equipment without a license",
          "sale of audio equipment without a license",
          "sale of video equipment without a license",
          "sale of musical instruments without a license",
          "sale of sporting goods without a license",
          "sale of toys without a license",
          "sale of games without a license",
          "sale of books without a license",
          "sale of magazines without a license",
          "sale of newspapers without a license",
          "sale of other printed materials without a license",
          "sale of digital content without a license",
          "sale of software without a license",
          "sale of online courses without a license",
          "sale of e-books without a license",
          "sale of music without a license",
          "sale of videos without a license",
          "sale of podcasts without a license",
          "sale of other digital media without a license",
          "sale of access to paid services without authorization",
          "sale of access to premium features without authorization",
          "sale of access to exclusive content without authorization",
          "sale of access to members-only areas without authorization",
          "sale of access to private events without authorization",
          "sale of access to confidential information without authorization",
          "sale of access to trade secrets without authorization",
          "sale of access to proprietary information without authorization",
          "sale of access to restricted areas without authorization",
          "sale of access to secure areas without authorization",
          "sale of access to controlled areas without authorization",
          "sale of access to monitored areas without authorization",
          "sale of access to supervised areas without authorization",
          "sale of access to protected areas without authorization",
          "sale of access to endangered areas without authorization",
          "sale of access to sensitive areas without authorization",
          "sale of access to classified areas without authorization",
          "sale of access to secret areas without authorization",
          "sale of access to hidden areas without authorization",
          "sale of access to obscure areas without authorization",
          "sale of access to remote areas without authorization",
          "sale of access to isolated areas without authorization",
          "sale of access to inaccessible areas without authorization",
          "sale of access to unknown areas without authorization",
          "sale of access to uncharted areas without authorization",
          "sale of access to unexplored areas without authorization",
          "sale of access to unregulated areas without authorization",
          "sale of access to unrestricted areas without authorization",
          "sale of access to unlimited areas without authorization",
          "sale of access to infinite areas without authorization",
          "sale of access to eternal areas without authorization",
          "sale of access to timeless areas without authorization",
          "sale of access to spacetime without authorization",
          "sale of access to the multiverse without authorization",
          "sale of access to parallel universes without authorization",
          "sale of access to alternate realities without authorization",
          "sale of access to virtual realities without authorization",
          "sale of access to simulated realities without authorization",
          "sale of access to augmented realities without authorization",
          "sale of access to mixed realities without authorization",
          "sale of access to transdimensional spaces without authorization",
          "sale of access to interdimensional spaces without authorization",
          "sale of access to extradimensional spaces without authorization",
          "sale of access to subdimensional spaces without authorization",
          "sale of access to superdimensional spaces without authorization",
          "sale of access to hyperdimensional spaces without authorization",
          "sale of access to metadimensional spaces without authorization",
          "sale of access to omnidimensional spaces without authorization",
          "sale of access to pluridimensional spaces without authorization",
          "sale of access to multidimensional spaces without authorization",
          "sale of access to bidimensional spaces without authorization",
          "sale of access to tridimensional spaces without authorization",
          "sale of access to quadrimensional spaces without authorization",
          "sale of access to pentadimensional spaces without authorization",
          "sale of access to hexadimensional spaces without authorization",
          "sale of access to heptadimensional spaces without authorization",
          "sale of access to octadimensional spaces without authorization",
          "sale of access to nonadimensional spaces without authorization",
          "sale of access to dec dimensional spaces without authorization",
          "sale of access to undimensional spaces without authorization",
          "sale of access to zerodimensional spaces without authorization",
          "sale of access to onedimensional spaces without authorization",
          "sale of access to twodimensional spaces without authorization",
          "sale of access to threedimensional spaces without authorization",
          "sale of access to fourdimensional spaces without authorization",
          "sale of access to fivedimensional spaces without authorization",
          "sale of access to sixdimensional spaces without authorization",
          "sale of access to sevendimensional spaces without authorization",
          "sale of access to eightdimensional spaces without authorization",
          "sale of access to ninedimensional spaces without authorization",
          "sale of access to tendimensional spaces without authorization",
          "sale of access to elevendimensional spaces without authorization",
          "sale of access to twelfthedimensional spaces without authorization",
          "sale of access to thirteen dimensional spaces without authorization",
          "sale of access to fourteen dimensional spaces without authorization",
          "sale of access to fifteen dimensional spaces without authorization",
          "sale of access to sixteen dimensional spaces without authorization",
          "sale of access to seventeen dimensional spaces without authorization",
          "sale of access to eighteen dimensional spaces without authorization",
          "sale of access to nineteen dimensional spaces without authorization",
          "sale of access to twenty dimensional spaces without authorization",
          "sale of access to twentyone dimensional spaces without authorization",
          "sale of access to twentytwo dimensional spaces without authorization",
          "sale of access to twentythree dimensional spaces without authorization",
          "sale of access to twentyfour dimensional spaces without authorization",
          "sale of access to twentyfive dimensional spaces without authorization",
          "sale of access to twentysix dimensional spaces without authorization",
          "sale of access to twentyseven dimensional spaces without authorization",
          "sale of access to twentyeight dimensional spaces without authorization",
          "sale of access to twentynine dimensional spaces without authorization",
          "sale of access to thirty dimensional spaces without authorization",
          "sale of access to thirtyone dimensional spaces without authorization",
          "sale of access to thirtytwo dimensional spaces without authorization",
          "sale of access to thirtythree dimensional spaces without authorization",
          "sale of access to thirtyfour dimensional spaces without authorization",
          "sale of access to thirtyfive dimensional spaces without authorization",
          "sale of access to thirtysix dimensional spaces without authorization",
          "sale of access to thirtyseven dimensional spaces without authorization",
          "sale of access to thirtyeight dimensional spaces without authorization",
          "sale of access to thirtynine dimensional spaces without authorization",
          "sale of access to forty dimensional spaces without authorization",
          "sale of access to fortyone dimensional spaces without authorization",
          "sale of access to fortytwo dimensional spaces without authorization",
          "sale of access to fortythree dimensional spaces without authorization",
          "sale of access to fortyfour dimensional spaces without authorization",
          "sale of access to fortyfive dimensional spaces without authorization",
          "sale of access to fortysix dimensional spaces without authorization",
          "sale of access to fortyseven dimensional spaces without authorization",
          "sale of access to fortyeight dimensional spaces without authorization",
          "sale of access to fortynine dimensional spaces without authorization",
          "sale of access to fifty dimensional spaces without authorization",
          "sale of access to fiftyone dimensional spaces without authorization",
          "sale of access to fiftytwo dimensional spaces without authorization",
          "sale of access to fiftythree dimensional spaces without authorization",
          "sale of access to fiftyfour dimensional spaces without authorization",
          "sale of access to fiftyfive dimensional spaces without authorization",
          "sale of access to fiftysix dimensional spaces without authorization",
          "sale of access to fiftyseven dimensional spaces without authorization",
          "sale of access to fiftyeight dimensional spaces without authorization",
          "sale of access to fiftynine dimensional spaces without authorization",
          "sale of access to sixty dimensional spaces without authorization",
          "sale of access to sixtyone dimensional spaces without authorization",
          "sale of access to sixtytwo dimensional spaces without authorization",
          "sale of access to sixtythree dimensional spaces without authorization",
          "sale of access to sixtyfour dimensional spaces without authorization",
          "sale of access to sixtyfive dimensional spaces without authorization",
          "sale of access to sixtysix dimensional spaces without authorization",
          "sale of access to sixtyseven dimensional spaces without authorization",
          "sale of access to sixtyeight dimensional spaces without authorization",
          "sale of access to sixtynine dimensional spaces without authorization",
          "sale of access to seventy dimensional spaces without authorization",
          "sale of access to seventyone dimensional spaces without authorization",
          "sale of access to seventytwo dimensional spaces without authorization",
          "sale of access to seventythree dimensional spaces without authorization",
          "sale of access to seventyfour dimensional spaces without authorization",
          "sale of access to seventyfive dimensional spaces without authorization",
          "sale of access to seventy six dimensional spaces without authorization",
          "sale of access to seventyseven dimensional spaces without authorization",
          "sale of access to seventyeight dimensional spaces without authorization",
          "sale of access to seventynine dimensional spaces without authorization",
          "sale of access to eighty dimensional spaces without authorization",
          "sale of access to eightyone dimensional spaces without authorization",
          "sale of access to eightytwo dimensional spaces without authorization",
          "sale of access to eightythree dimensional spaces without authorization",
          "sale of access to eightyfour dimensional spaces without authorization",
          "sale of access to eightyfive dimensional spaces without authorization",
          "sale of access to eightysix dimensional spaces without authorization",
          "sale of access to eightyseven dimensional spaces without authorization",
          "sale of access to eightyeight dimensional spaces without authorization",
          "sale of access to eightynine dimensional spaces without authorization",
          "sale of access to ninety dimensional spaces without authorization",
          "sale of access to ninetyone dimensional spaces without authorization",
          "sale of access to ninetytwo dimensional spaces without authorization",
          "sale of access to ninetythree dimensional spaces without authorization",
          "sale of access to ninetyfour dimensional spaces without authorization",
          "sale of access to ninetyfive dimensional spaces without authorization",
          "sale of access to ninetysix dimensional spaces without authorization",
          "sale of access to ninetyseven dimensional spaces without authorization",
          "sale of access to ninetyeight dimensional spaces without authorization",
          "sale of access to ninetynine dimensional spaces without authorization",
        ],
      },
    },
  },
];

// =================================================================
// 🧠 ACCIONES DE IA (LÓGICA DE NEGOCIO)
// =================================================================

/**
 * Genera texto a partir de un prompt.
 * @param {{ prompt: string }} body
 * @returns {Promise<{ text: string }>}
 */
async function generateTextAction({ prompt }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    prompt,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateText", payload);
  return { text: result.candidates[0].text };
}

/**
 * Analiza una imagen y devuelve un prompt de texto.
 * @param {{ imageBase64: string, prompt: string }} params
 * @returns {Promise<{ text: string }>}
 */
async function analyzeImageAction({ imageBase64, prompt }) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const payload = {
    image: { content: imageBase64 },
    prompt,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateText", payload);
  return { text: result.candidates[0].text };
}

/**
 * Genera una imagen a partir de un prompt de texto.
 * @param {{ prompt: string }} body
 * @returns {Promise<{ imageUrl: string }>}
 */
async function generateImageAction({ prompt }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    prompt,
    imageDimensions: { width: 512, height: 512 },
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateImage", payload);
  return { imageUrl: result.candidates[0].imageUrl };
}

/**
 * Mejora un texto dado.
 * @param {{ text: string }} body
 * @returns {Promise<{ improvedText: string }>}
 */
async function improveTextAction({ text }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    text,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "improveText", payload);
  return { improvedText: result.candidates[0].text };
}

/**
 * Resume un texto dado.
 * @param {{ text: string }} body
 * @returns {Promise<{ summary: string }>}
 */
async function summarizeTextAction({ text }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    text,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "summarizeText", payload);
  return { summary: result.candidates[0].text };
}

/**
 * Traduce un texto a otro idioma.
 * @param {{ text: string, targetLanguage: string }} body
 * @returns {Promise<{ translatedText: string }>}
 */
async function translateTextAction({ text, targetLanguage }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    text,
    targetLanguage,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "translateText", payload);
  return { translatedText: result.candidates[0].text };
}

/**
 * Responde a una pregunta dada un contexto.
 * @param {{ question: string, context: string }} body
 * @returns {Promise<{ answer: string }>}
 */
async function answerQuestionAction({ question, context }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    question,
    context,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "answerQuestion", payload);
  return { answer: result.candidates[0].text };
}

/**
 * Genera un código a partir de una descripción.
 * @param {{ description: string }} body
 * @returns {Promise<{ code: string }>}
 */
async function generateCodeAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateCode", payload);
  return { code: result.candidates[0].text };
}

/**
 * Explica un código dado.
 * @param {{ code: string }} body
 * @returns {Promise<{ explanation: string }>}
 */
async function explainCodeAction({ code }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    code,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "explainCode", payload);
  return { explanation: result.candidates[0].text };
}

/**
 * Traduce un código a otro lenguaje.
 * @param {{ code: string, targetLanguage: string }} body
 * @returns {Promise<{ translatedCode: string }>}
 */
async function translateCodeAction({ code, targetLanguage }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    code,
    targetLanguage,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "translateCode", payload);
  return { translatedCode: result.candidates[0].text };
}

/**
 * Genera un test a partir de un código dado.
 * @param {{ code: string }} body
 * @returns {Promise<{ test: string }>}
 */
async function generateTestAction({ code }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    code,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateTest", payload);
  return { test: result.candidates[0].text };
}

/**
 * Mejora un código dado.
 * @param {{ code: string }} body
 * @returns {Promise<{ improvedCode: string }>}
 */
async function improveCodeAction({ code }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    code,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "improveCode", payload);
  return { improvedCode: result.candidates[0].text };
}

/**
 * Analiza un código y sugiere mejoras.
 * @param {{ code: string }} body
 * @returns {Promise<{ analysis: string }>}
 */
async function analyzeCodeAction({ code }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    code,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "analyzeCode", payload);
  return { analysis: result.candidates[0].text };
}

/**
 * Genera un diagrama a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ diagramUrl: string }>}
 */
async function generateDiagramAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateDiagram", payload);
  return { diagramUrl: result.candidates[0].imageUrl };
}

/**
 * Genera un flujo de trabajo a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ workflow: string }>}
 */
async function generateWorkflowAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateWorkflow", payload);
  return { workflow: result.candidates[0].text };
}

/**
 * Genera un plan de proyecto a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ projectPlan: string }>}
 */
async function generateProjectPlanAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateProjectPlan", payload);
  return { projectPlan: result.candidates[0].text };
}

/**
 * Genera una lista de tareas a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ taskList: string }>}
 */
async function generateTaskListAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateTaskList", payload);
  return { taskList: result.candidates[0].text };
}

/**
 * Genera un cronograma a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ schedule: string }>}
 */
async function generateScheduleAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateSchedule", payload);
  return { schedule: result.candidates[0].text };
}

/**
 * Genera un presupuesto a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ budget: string }>}
 */
async function generateBudgetAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateBudget", payload);
  return { budget: result.candidates[0].text };
}

/**
 * Genera un análisis FODA a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ swotAnalysis: string }>}
 */
async function generateSwotAnalysisAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateSwotAnalysis", payload);
  return { swotAnalysis: result.candidates[0].text };
}

/**
 * Genera una presentación a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ presentationUrl: string }>}
 */
async function generatePresentationAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generatePresentation", payload);
  return { presentationUrl: result.candidates[0].imageUrl };
}

/**
 * Genera un video a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ videoUrl: string }>}
 */
async function generateVideoAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateVideo", payload);
  return { videoUrl: result.candidates[0].imageUrl };
}

/**
 * Genera un audio a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ audioUrl: string }>}
 */
async function generateAudioAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateAudio", payload);
  return { audioUrl: result.candidates[0].imageUrl };
}

/**
 * Genera un podcast a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ podcastUrl: string }>}
 */
async function generatePodcastAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generatePodcast", payload);
  return { podcastUrl: result.candidates[0].imageUrl };
}

/**
 * Genera un juego a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ gameUrl: string }>}
 */
async function generateGameAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateGame", payload);
  return { gameUrl: result.candidates[0].imageUrl };
}

/**
 * Genera una historia a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ story: string }>}
 */
async function generateStoryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateStory", payload);
  return { story: result.candidates[0].text };
}

/**
 * Genera un poema a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ poem: string }>}
 */
async function generatePoemAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generatePoem", payload);
  return { poem: result.candidates[0].text };
}

/**
 * Genera una canción a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ song: string }>}
 */
async function generateSongAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateSong", payload);
  return { song: result.candidates[0].text };
}

/**
 * Genera un chiste a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ joke: string }>}
 */
async function generateJokeAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateJoke", payload);
  return { joke: result.candidates[0].text };
}

/**
 * Genera un acertijo a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ riddle: string }>}
 */
async function generateRiddleAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateRiddle", payload);
  return { riddle: result.candidates[0].text };
}

/**
 * Genera un trabalenguas a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ tongueTwister: string }>}
 */
async function generateTongueTwisterAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateTongueTwister", payload);
  return { tongueTwister: result.candidates[0].text };
}

/**
 * Genera una adivinanza a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ riddle: string }>}
 */
async function generateRiddleAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateRiddle", payload);
  return { riddle: result.candidates[0].text };
}

/**
 * Genera una historia de terror a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ horrorStory: string }>}
 */
async function generateHorrorStoryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateHorrorStory", payload);
  return { horrorStory: result.candidates[0].text };
}

/**
 * Genera una historia de ciencia ficción a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ sciFiStory: string }>}
 */
async function generateSciFiStoryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateSciFiStory", payload);
  return { sciFiStory: result.candidates[0].text };
}

/**
 * Genera una historia romántica a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ romanceStory: string }>}
 */
async function generateRomanceStoryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateRomanceStory", payload);
  return { romanceStory: result.candidates[0].text };
}

/**
 * Genera una historia de aventuras a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ adventureStory: string }>}
 */
async function generateAdventureStoryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateAdventureStory", payload);
  return { adventureStory: result.candidates[0].text };
}

/**
 * Genera una historia de misterio a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ mysteryStory: string }>}
 */
async function generateMysteryStoryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateMysteryStory", payload);
  return { mysteryStory: result.candidates[0].text };
}

/**
 * Genera una historia de fantasía a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ fantasyStory: string }>}
 */
async function generateFantasyStoryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateFantasyStory", payload);
  return { fantasyStory: result.candidates[0].text };
}

/**
 * Genera una historia épica a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ epicStory: string }>}
 */
async function generateEpicStoryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateEpicStory", payload);
  return { epicStory: result.candidates[0].text };
}

/**
 * Genera una historia de no ficción a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ nonFictionStory: string }>}
 */
async function generateNonFictionStoryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateNonFictionStory", payload);
  return { nonFictionStory: result.candidates[0].text };
}

/**
 * Genera una biografía a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ biography: string }>}
 */
async function generateBiographyAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateBiography", payload);
  return { biography: result.candidates[0].text };
}

/**
 * Genera un perfil profesional a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ professionalProfile: string }>}
 */
async function generateProfessionalProfileAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateProfessionalProfile", payload);
  return { professionalProfile: result.candidates[0].text };
}

/**
 * Genera un resumen ejecutivo a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ executiveSummary: string }>}
 */
async function generateExecutiveSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateExecutiveSummary", payload);
  return { executiveSummary: result.candidates[0].text };
}

/**
 * Genera un análisis DAFO a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ dafoAnalysis: string }>}
 */
async function generateDafoAnalysisAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateDafoAnalysis", payload);
  return { dafoAnalysis: result.candidates[0].text };
}

/**
 * Genera un mapa mental a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ mindMapUrl: string }>}
 */
async function generateMindMapAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateMindMap", payload);
  return { mindMapUrl: result.candidates[0].imageUrl };
}

/**
 * Genera un esquema a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ outline: string }>}
 */
async function generateOutlineAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateOutline", payload);
  return { outline: result.candidates[0].text };
}

/**
 * Genera un guion a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ script: string }>}
 */
async function generateScriptAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateScript", payload);
  return { script: result.candidates[0].text };
}

/**
 * Genera un diálogo a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ dialogue: string }>}
 */
async function generateDialogueAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateDialogue", payload);
  return { dialogue: result.candidates[0].text };
}

/**
 * Genera una letra de canción a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ songLyrics: string }>}
 */
async function generateSongLyricsAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateSongLyrics", payload);
  return { songLyrics: result.candidates[0].text };
}

/**
 * Genera un eslogan a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ slogan: string }>}
 */
async function generateSloganAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateSlogan", payload);
  return { slogan: result.candidates[0].text };
}

/**
 * Genera un nombre de producto a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ productName: string }>}
 */
async function generateProductNameAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateProductName", payload);
  return { productName: result.candidates[0].text };
}

/**
 * Genera un nombre de empresa a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ companyName: string }>}
 */
async function generateCompanyNameAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateCompanyName", payload);
  return { companyName: result.candidates[0].text };
}

/**
 * Genera un nombre de dominio a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ domainName: string }>}
 */
async function generateDomainNameAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateDomainName", payload);
  return { domainName: result.candidates[0].text };
}

/**
 * Genera un lema a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ motto: string }>}
 */
async function generateMottoAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateMotto", payload);
  return { motto: result.candidates[0].text };
}

/**
 * Genera un título a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ title: string }>}
 */
async function generateTitleAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateTitle", payload);
  return { title: result.candidates[0].text };
}

/**
 * Genera un subtítulo a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ subtitle: string }>}
 */
async function generateSubtitleAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateSubtitle", payload);
  return { subtitle: result.candidates[0].text };
}

/**
 * Genera un encabezado a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ header: string }>}
 */
async function generateHeaderAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateHeader", payload);
  return { header: result.candidates[0].text };
}

/**
 * Genera un pie de página a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ footer: string }>}
 */
async function generateFooterAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateFooter", payload);
  return { footer: result.candidates[0].text };
}

/**
 * Genera un comentario a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ comment: string }>}
 */
async function generateCommentAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateComment", payload);
  return { comment: result.candidates[0].text };
}

/**
 * Genera una reseña a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ review: string }>}
 */
async function generateReviewAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateReview", payload);
  return { review: result.candidates[0].text };
}

/**
 * Genera un análisis a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ analysis: string }>}
 */
async function generateAnalysisAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateAnalysis", payload);
  return { analysis: result.candidates[0].text };
}

/**
 * Genera una evaluación a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ evaluation: string }>}
 */
async function generateEvaluationAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateEvaluation", payload);
  return { evaluation: result.candidates[0].text };
}

/**
 * Genera una crítica a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ critique: string }>}
 */
async function generateCritiqueAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateCritique", payload);
  return { critique: result.candidates[0].text };
}

/**
 * Genera un resumen de libro a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ bookSummary: string }>}
 */
async function generateBookSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateBookSummary", payload);
  return { bookSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de artículo a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ articleSummary: string }>}
 */
async function generateArticleSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateArticleSummary", payload);
  return { articleSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de ensayo a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ essaySummary: string }>}
 */
async function generateEssaySummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateEssaySummary", payload);
  return { essaySummary: result.candidates[0].text };
}

/**
 * Genera un resumen de reporte a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ reportSummary: string }>}
 */
async function generateReportSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateReportSummary", payload);
  return { reportSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de investigación a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ researchSummary: string }>}
 */
async function generateResearchSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateResearchSummary", payload);
  return { researchSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de tesis a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ thesisSummary: string }>}
 */
async function generateThesisSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateThesisSummary", payload);
  return { thesisSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de disertación a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ dissertationSummary: string }>}
 */
async function generateDissertationSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateDissertationSummary", payload);
  return { dissertationSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de trabajo de curso a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ courseWorkSummary: string }>}
 */
async function generateCourseWorkSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateCourseWorkSummary", payload);
  return { courseWorkSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de proyecto a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ projectSummary: string }>}
 */
async function generateProjectSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateProjectSummary", payload);
  return { projectSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de presentación a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ presentationSummary: string }>}
 */
async function generatePresentationSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generatePresentationSummary", payload);
  return { presentationSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de video a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ videoSummary: string }>}
 */
async function generateVideoSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateVideoSummary", payload);
  return { videoSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de audio a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ audioSummary: string }>}
 */
async function generateAudioSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateAudioSummary", payload);
  return { audioSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de podcast a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ podcastSummary: string }>}
 */
async function generatePodcastSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generatePodcastSummary", payload);
  return { podcastSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de juego a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ gameSummary: string }>}
 */
async function generateGameSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateGameSummary", payload);
  return { gameSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de historia a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ storySummary: string }>}
 */
async function generateStorySummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateStorySummary", payload);
  return { storySummary: result.candidates[0].text };
}

/**
 * Genera un resumen de poema a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ poemSummary: string }>}
 */
async function generatePoemSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generatePoemSummary", payload);
  return { poemSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de canción a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ songSummary: string }>}
 */
async function generateSongSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateSongSummary", payload);
  return { songSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de chiste a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ jokeSummary: string }>}
 */
async function generateJokeSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateJokeSummary", payload);
  return { jokeSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de acertijo a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ riddleSummary: string }>}
 */
async function generateRiddleSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateRiddleSummary", payload);
  return { riddleSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de trabalenguas a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ tongueTwisterSummary: string }>}
 */
async function generateTongueTwisterSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateTongueTwisterSummary", payload);
  return { tongueTwisterSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de adivinanza a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ riddleSummary: string }>}
 */
async function generateRiddleSummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateRiddleSummary", payload);
  return { riddleSummary: result.candidates[0].text };
}

/**
 * Genera un resumen de historia de terror a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ horrorStorySummary: string }>}
 */
async function generateHorrorStorySummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateHorrorStorySummary", payload);
  return { horrorStorySummary: result.candidates[0].text };
}

/**
 * Genera un resumen de historia de ciencia ficción a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ sciFiStorySummary: string }>}
 */
async function generateSciFiStorySummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateSciFiStorySummary", payload);
  return { sciFiStorySummary: result.candidates[0].text };
}

/**
 * Genera un resumen de historia romántica a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ romanceStorySummary: string }>}
 */
async function generateRomanceStorySummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  };

  const result = await callGoogleAI(model, "generateRomanceStorySummary", payload);
  return { romanceStorySummary: result.candidates[0].text };
}

/**
 * Genera un resumen de historia de aventuras a partir de un texto descriptivo.
 * @param {{ description: string }} body
 * @returns {Promise<{ adventureStorySummary: string }>}
 */
async function generateAdventureStorySummaryAction({ description }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const payload = {
    description,
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presence