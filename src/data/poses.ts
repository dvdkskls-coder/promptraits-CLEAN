export interface Pose {
  id: string;
  name: string;
  description: string;
  gender: "masculine" | "feminine" | "unisex";
  prompt: string;
}

export const POSES: Pose[] = [
  {
    id: "confident-standing",
    name: "De Pie Confiado",
    description: "Postura erguida y segura",
    gender: "unisex",
    prompt:
      "confident standing pose, upright posture, direct gaze, powerful stance, assertive body language",
  },
  {
    id: "relaxed-sitting",
    name: "Sentado Relajado",
    description: "Sentado de forma natural y cómoda",
    gender: "unisex",
    prompt:
      "relaxed sitting pose, comfortable position, natural body language, casual demeanor",
  },
  {
    id: "leaning-wall",
    name: "Apoyado en Pared",
    description: "Recostado casualmente contra una pared",
    gender: "unisex",
    prompt:
      "leaning against wall, casual lean, relaxed pose, urban street style posing",
  },
  {
    id: "crossed-arms",
    name: "Brazos Cruzados",
    description: "Brazos cruzados con actitud",
    gender: "unisex",
    prompt:
      "arms crossed pose, confident stance, assertive body language, strong presence",
  },
  {
    id: "hands-pockets",
    name: "Manos en Bolsillos",
    description: "Manos en los bolsillos, relajado",
    gender: "unisex",
    prompt:
      "hands in pockets, casual relaxed pose, effortless style, comfortable stance",
  },
  {
    id: "elegant-sitting",
    name: "Sentada Elegante",
    description: "Postura sentada refinada",
    gender: "feminine",
    prompt:
      "elegant sitting pose, graceful posture, refined positioning, sophisticated body language",
  },
  {
    id: "dynamic-movement",
    name: "Movimiento Dinámico",
    description: "En movimiento, caminando",
    gender: "unisex",
    prompt:
      "dynamic movement, walking pose, motion captured, energetic and alive, candid action",
  },
  {
    id: "over-shoulder",
    name: "Mirando Sobre el Hombro",
    description: "Mirada hacia atrás sobre el hombro",
    gender: "unisex",
    prompt:
      "looking over shoulder, backward glance, mysterious pose, engaging eye contact",
  },
  {
    id: "profile-side",
    name: "Perfil Lateral",
    description: "Vista de perfil",
    gender: "unisex",
    prompt:
      "side profile pose, lateral view, strong silhouette, defined features, artistic angle",
  },
  {
    id: "laughing-candid",
    name: "Riendo Natural",
    description: "Risa espontánea y natural",
    gender: "unisex",
    prompt:
      "natural laughing pose, genuine smile, candid moment, joyful expression, authentic emotion",
  },
  {
    id: "thoughtful-looking-away",
    name: "Pensativo Mirando a lo Lejos",
    description: "Mirada contemplativa",
    gender: "unisex",
    prompt:
      "thoughtful pose looking away, contemplative gaze, introspective moment, pensive expression",
  },
  {
    id: "power-pose",
    name: "Pose de Poder",
    description: "Postura dominante y fuerte",
    gender: "unisex",
    prompt:
      "power pose, dominant stance, commanding presence, strong body language, leadership posture",
  },
  {
    id: "seated-forward-lean",
    name: "Sentado Inclinado Adelante",
    description: "Sentado con inclinación hacia adelante",
    gender: "unisex",
    prompt:
      "seated forward lean, engaged posture, attentive body language, focused positioning",
  },
  {
    id: "playful-pose",
    name: "Pose Juguetona",
    description: "Actitud divertida y desenfadada",
    gender: "feminine",
    prompt:
      "playful pose, fun and lighthearted, energetic body language, joyful expression",
  },
  {
    id: "serious-intense",
    name: "Serio e Intenso",
    description: "Expresión seria y penetrante",
    gender: "unisex",
    prompt:
      "serious intense pose, penetrating gaze, dramatic expression, powerful presence",
  },
];

export const getPosesByGender = (
  gender: "masculine" | "feminine" | "couple" | "animal" | "unisex"
) => {
  if (gender === "unisex" || gender === "couple" || gender === "animal") {
    return POSES.filter((pose) => pose.gender === "unisex");
  }
  return POSES.filter(
    (pose) => pose.gender === gender || pose.gender === "unisex"
  );
};

export const getPoseById = (id: string) => {
  return POSES.find((pose) => pose.id === id);
};
