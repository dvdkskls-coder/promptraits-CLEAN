// posesData.js - Poses profesionales para retrato
// Basado en: Guía Completa de Poses en Fotografía de Retrato Profesional

export const POSES = {
  masculine: [
    {
      id: "power_stance",
      name: "Postura de Poder",
      category: "formal",
      description: "De pie, espalda recta, mirando directamente a cámara con expresión segura",
      keywords: "standing upright, straight posture, confident expression, arms crossed or hands in pockets, authoritative stance",
      context: ["studio", "corporate", "editorial"]
    },
    {
      id: "casual_standing",
      name: "De Pie Casual",
      category: "casual",
      description: "Peso en una pierna, una mano en bolsillo, postura relajada",
      keywords: "relaxed standing pose, weight on one leg, one hand in pocket, casual demeanor, leaning against wall",
      context: ["lifestyle", "outdoor", "editorial"]
    },
    {
      id: "seated_style",
      name: "Sentado con Estilo",
      category: "elegant",
      description: "Sentado en taburete o silla, ligeramente de lado, brazo en respaldo",
      keywords: "sitting on stool, side angle, arm on backrest, composed posture, stylish seated position",
      context: ["studio", "editorial", "portrait"]
    },
    {
      id: "back_to_camera",
      name: "De Espaldas",
      category: "artistic",
      description: "De espaldas a cámara, girando solo el rostro hacia el objetivo",
      keywords: "back to camera, face turned toward lens, mysterious silhouette, over-shoulder glance",
      context: ["artistic", "fashion", "creative"]
    },
    {
      id: "explorer",
      name: "El Explorador",
      category: "lifestyle",
      description: "De pie en entorno amplio, mirando hacia el paisaje, postura relajada",
      keywords: "standing in landscape, gazing at scenery, contemplative stance, integrated with environment",
      context: ["outdoor", "environmental", "documentary"]
    },
    {
      id: "walking_confident",
      name: "Caminando con Confianza",
      category: "dynamic",
      description: "Caminando hacia cámara, manteniendo vista al frente",
      keywords: "walking toward camera, confident stride, forward motion, leadership energy",
      context: ["outdoor", "urban", "editorial"]
    },
    {
      id: "leaning_casual",
      name: "Apoyado Casualmente",
      category: "casual",
      description: "Apoyado en elemento del entorno (pared, barandilla, árbol)",
      keywords: "leaning against wall, casual support on railing, relaxed outdoor pose",
      context: ["outdoor", "lifestyle", "urban"]
    },
    {
      id: "sitting_carefree",
      name: "Sentado Despreocupado",
      category: "casual",
      description: "Sentado en escaleras, bordillo o banco, brazos sobre rodillas",
      keywords: "sitting on stairs, arms resting on knees, carefree seated position, bench sitting",
      context: ["outdoor", "lifestyle", "street"]
    },
    {
      id: "editorial_standing",
      name: "Modelo Editorial",
      category: "fashion",
      description: "De pie, pies separados, peso en cadera, pecho abierto, actitud firme",
      keywords: "editorial standing pose, feet shoulder-width apart, weight on hip, open chest, fashion model stance",
      context: ["fashion", "studio", "editorial"]
    },
    {
      id: "gentleman_coat",
      name: "Caballero con Abrigo",
      category: "elegant",
      description: "Saco o chaqueta colgado sobre hombro, cuerpo girado hacia cámara",
      keywords: "jacket over shoulder, sophisticated gentleman pose, coat draped elegantly, refined stance",
      context: ["fashion", "elegant", "editorial"]
    },
    {
      id: "the_model",
      name: "El Modelo",
      category: "artistic",
      description: "Sentado, antebrazo sobre mesa, otra mano sostiene cabeza, pensativo",
      keywords: "seated with arm on table, hand supporting head, thoughtful artistic pose, sophisticated position",
      context: ["editorial", "artistic", "creative"]
    },
    {
      id: "fashion_movement",
      name: "Movimiento Fashion",
      category: "dynamic",
      description: "En movimiento, caminando, pequeño salto, interactuando con accesorios",
      keywords: "walking motion, slight jump, dynamic movement, interacting with accessories, action frozen",
      context: ["fashion", "editorial", "dynamic"]
    },
    {
      id: "daily_walk",
      name: "Caminata Cotidiana",
      category: "lifestyle",
      description: "Andando por la calle con naturalidad, mirando entorno",
      keywords: "walking naturally on street, everyday moment, candid walking shot, observing surroundings",
      context: ["lifestyle", "street", "documentary"]
    },
    {
      id: "hobbies_action",
      name: "Aficiones en Acción",
      category: "lifestyle",
      description: "Haciendo actividad que le gusta (leyendo, tocando instrumento, trabajando)",
      keywords: "engaged in hobby, reading book, playing instrument, working on laptop, activity-based pose",
      context: ["lifestyle", "documentary", "personal"]
    },
    {
      id: "laughter_spontaneity",
      name: "Risa Espontánea",
      category: "natural",
      description: "Riendo abiertamente o sonriendo con naturalidad",
      keywords: "genuine laughter, spontaneous smile, authentic expression, candid joy",
      context: ["lifestyle", "portrait", "natural"]
    },
    {
      id: "executive_standing",
      name: "Postura Ejecutiva",
      category: "corporate",
      description: "De pie, pies firmes, cuerpo erguido, brazos cruzados o manos en bolsillos",
      keywords: "executive standing pose, upright posture, arms crossed, professional authority stance",
      context: ["corporate", "business", "headshot"]
    },
    {
      id: "relaxed_corporate",
      name: "Corporativo Relajado",
      category: "corporate",
      description: "De pie con ligera inclinación hacia adelante, accesible",
      keywords: "leaning slightly forward, approachable corporate pose, relaxed professional stance",
      context: ["corporate", "business", "professional"]
    },
    {
      id: "seated_corporate",
      name: "Sentado Corporativo",
      category: "corporate",
      description: "Sentado con espalda recta, cuerpo inclinado hacia adelante, interés",
      keywords: "seated professional, straight back, leaning forward slightly, engaged posture",
      context: ["corporate", "executive", "headshot"]
    },
    {
      id: "dramatic_artist",
      name: "Artista Dramático",
      category: "artistic",
      description: "Sentado en entorno artístico, expresión intensa, mirando distancia",
      keywords: "dramatic artistic pose, intense expression, seated in creative environment, passionate gaze",
      context: ["artistic", "creative", "editorial"]
    },
    {
      id: "light_shadow_play",
      name: "Juego de Luces y Sombras",
      category: "artistic",
      description: "En haz de luz contra fondo oscuro, sombras proyectadas creativas",
      keywords: "dramatic lighting, shadows on face, chiaroscuro effect, artistic light contrast",
      context: ["artistic", "dramatic", "creative"]
    },
    {
      id: "expressive_movement",
      name: "Movimiento Expresivo",
      category: "artistic",
      description: "Bailando, saltando, movimiento deportivo, energía creativa",
      keywords: "dancing motion, jumping action, athletic movement, creative energy frozen",
      context: ["artistic", "dynamic", "creative"]
    }
  ],

  feminine: [
    {
      id: "classic_beauty",
      name: "Belleza Clásica",
      category: "elegant",
      description: "De pie, postura elegante, mano en cadera, mirada directa o ligera",
      keywords: "elegant standing pose, hand on hip, classic beauty stance, graceful posture",
      context: ["studio", "fashion", "portrait"]
    },
    {
      id: "s_curve",
      name: "Curva en S",
      category: "fashion",
      description: "Cuerpo formando curva, peso en pie trasero, creando líneas elegantes",
      keywords: "S-curve body shape, weight on back foot, elegant body lines, fashion stance",
      context: ["fashion", "editorial", "glamour"]
    },
    {
      id: "sitting_elegance",
      name: "Sentada con Elegancia",
      category: "elegant",
      description: "Sentada de lado, piernas cruzadas, postura refinada",
      keywords: "seated sideways, crossed legs, refined sitting position, elegant pose",
      context: ["studio", "portrait", "elegant"]
    },
    {
      id: "over_shoulder",
      name: "Mirada sobre el Hombro",
      category: "romantic",
      description: "De espaldas, girando cabeza y hombros hacia cámara con mirada suave",
      keywords: "looking over shoulder, turned back pose, soft romantic gaze, shoulder glance",
      context: ["portrait", "romantic", "fashion"]
    },
    {
      id: "hands_in_hair",
      name: "Manos en el Cabello",
      category: "glamour",
      description: "Una o ambas manos en el cabello, jugando con mechones",
      keywords: "hands in hair, playing with hair, glamour pose, feminine gesture",
      context: ["glamour", "beauty", "fashion"]
    },
    {
      id: "leaning_wall",
      name: "Apoyada en Pared",
      category: "casual",
      description: "Recargada en pared, postura relajada, una pierna cruzada",
      keywords: "leaning against wall, relaxed stance, one leg crossed, casual lean",
      context: ["lifestyle", "urban", "casual"]
    },
    {
      id: "dress_twirl",
      name: "Giro de Vestido",
      category: "dynamic",
      description: "Girando para que el vestido o falda vuele, movimiento capturado",
      keywords: "dress twirl, skirt spinning, flowing fabric motion, dynamic feminine pose",
      context: ["fashion", "romantic", "dynamic"]
    },
    {
      id: "sitting_floor",
      name: "Sentada en el Suelo",
      category: "casual",
      description: "Sentada en suelo, piernas hacia un lado, brazos apoyados",
      keywords: "sitting on floor, legs to side, casual ground pose, relaxed sitting",
      context: ["lifestyle", "casual", "intimate"]
    },
    {
      id: "walking_grace",
      name: "Caminata Elegante",
      category: "fashion",
      description: "Caminando con gracia, brazo balanceándose, movimiento fluido",
      keywords: "graceful walking, arm swinging naturally, fluid motion, runway walk",
      context: ["fashion", "editorial", "dynamic"]
    },
    {
      id: "reclining",
      name: "Reclinada",
      category: "glamour",
      description: "Recostada de lado, apoyada en codo, postura sensual pero elegante",
      keywords: "reclining on side, propped on elbow, sensual elegant pose, lying position",
      context: ["glamour", "boudoir", "artistic"]
    },
    {
      id: "candid_laugh",
      name: "Risa Candida",
      category: "natural",
      description: "Riendo naturalmente, expresión genuina de felicidad",
      keywords: "candid laughter, genuine happy expression, natural smile, authentic joy",
      context: ["lifestyle", "portrait", "natural"]
    },
    {
      id: "wind_blown",
      name: "Movida por el Viento",
      category: "romantic",
      description: "Cabello y ropa movidos por viento, mirada al horizonte",
      keywords: "wind-blown hair, fabric flowing in breeze, gazing into distance, ethereal mood",
      context: ["outdoor", "romantic", "editorial"]
    },
    {
      id: "frame_face",
      name: "Enmarcando el Rostro",
      category: "beauty",
      description: "Manos suavemente alrededor del rostro, dedos cerca de mejillas",
      keywords: "hands framing face, fingers near cheeks, beauty pose, delicate hand placement",
      context: ["beauty", "portrait", "glamour"]
    },
    {
      id: "profile_shot",
      name: "Perfil Clásico",
      category: "elegant",
      description: "De perfil puro, cuello estirado, barbilla ligeramente elevada",
      keywords: "profile shot, neck extended, chin slightly raised, classic silhouette",
      context: ["portrait", "elegant", "artistic"]
    },
    {
      id: "flower_interaction",
      name: "Interacción con Flores",
      category: "romantic",
      description: "Sosteniendo flores, oliendo bouquet, entre flores naturales",
      keywords: "holding flowers, smelling bouquet, among flowers, romantic floral interaction",
      context: ["romantic", "outdoor", "lifestyle"]
    },
    {
      id: "strong_stance",
      name: "Postura Fuerte",
      category: "editorial",
      description: "Pose poderosa, piernas firmes, mirada intensa, actitud confiada",
      keywords: "powerful stance, strong legs, intense gaze, confident attitude, editorial power",
      context: ["editorial", "fashion", "corporate"]
    },
    {
      id: "sitting_chair",
      name: "Sentada en Silla",
      category: "elegant",
      description: "Sentada en silla, piernas cruzadas elegantemente, postura erguida",
      keywords: "seated on chair, elegantly crossed legs, upright posture, poised sitting",
      context: ["portrait", "corporate", "elegant"]
    },
    {
      id: "dancing_movement",
      name: "Movimiento de Baile",
      category: "dynamic",
      description: "Postura de baile congelada, brazos en posición grácil",
      keywords: "frozen dance pose, graceful arm position, ballet-inspired stance, artistic movement",
      context: ["artistic", "dynamic", "creative"]
    },
    {
      id: "intimate_close",
      name: "Primer Plano Íntimo",
      category: "beauty",
      description: "Muy cerca, enfoque en rostro y expresión, mano visible parcialmente",
      keywords: "intimate close-up, focus on face, partial hand visible, beauty portrait",
      context: ["beauty", "portrait", "glamour"]
    },
    {
      id: "bohemian_free",
      name: "Libre Bohemia",
      category: "artistic",
      description: "Postura libre y artística, brazos extendidos o interactuando con telas",
      keywords: "free bohemian pose, artistic stance, flowing fabrics, expressive arms",
      context: ["artistic", "bohemian", "creative"]
    }
  ],

  couple: [
    {
      id: "embrace_from_behind",
      name: "Abrazo por Detrás",
      category: "romantic",
      description: "Una persona detrás, brazos envolviendo a la otra, cercanía íntima",
      keywords: "@img2 stands behind @img1, arms wrapped around @img1's shoulders or waist, intimate embrace, close connection",
      context: ["romantic", "engagement", "lifestyle"]
    },
    {
      id: "forehead_touch",
      name: "Toque de Frentes",
      category: "intimate",
      description: "Frentes tocándose, ojos cerrados o mirándose, momento íntimo",
      keywords: "@img1 and @img2 foreheads touching, eyes closed or gazing at each other, intimate moment",
      context: ["romantic", "wedding", "intimate"]
    },
    {
      id: "walking_together",
      name: "Caminando Juntos",
      category: "lifestyle",
      description: "Caminando lado a lado o tomados de la mano, movimiento natural",
      keywords: "@img1 and @img2 walking side by side, holding hands, natural motion together",
      context: ["lifestyle", "outdoor", "documentary"]
    },
    {
      id: "looking_each_other",
      name: "Mirándose",
      category: "romantic",
      description: "De frente, mirándose a los ojos, conexión emocional",
      keywords: "@img1 facing @img2, gazing into each other's eyes, emotional connection, face to face",
      context: ["romantic", "engagement", "intimate"]
    },
    {
      id: "side_by_side",
      name: "Lado a Lado",
      category: "casual",
      description: "Uno al lado del otro, hombros tocándose o brazos enlazados",
      keywords: "@img1 and @img2 side by side, shoulders touching, arms linked casually",
      context: ["portrait", "lifestyle", "casual"]
    },
    {
      id: "piggyback",
      name: "Caballito",
      category: "playful",
      description: "Una persona cargando a la otra en la espalda, diversión",
      keywords: "@img2 giving @img1 a piggyback ride, playful moment, fun couple pose",
      context: ["lifestyle", "playful", "outdoor"]
    },
    {
      id: "dipping_pose",
      name: "Pose de Baile (Dip)",
      category: "romantic",
      description: "Una persona inclinando a la otra hacia atrás, como en baile",
      keywords: "@img2 dipping @img1 backwards, romantic dance pose, elegant bend",
      context: ["romantic", "wedding", "editorial"]
    },
    {
      id: "sitting_together",
      name: "Sentados Juntos",
      category: "casual",
      description: "Sentados cerca, uno recargado en el otro, cercanía cómoda",
      keywords: "@img1 and @img2 sitting close, @img1 leaning on @img2, comfortable closeness",
      context: ["lifestyle", "casual", "intimate"]
    },
    {
      id: "kiss_forehead",
      name: "Beso en la Frente",
      category: "tender",
      description: "Una persona besando la frente de la otra, gesto tierno",
      keywords: "@img2 kissing @img1's forehead, tender gesture, protective affection",
      context: ["romantic", "intimate", "wedding"]
    },
    {
      id: "back_to_back",
      name: "Espalda con Espalda",
      category: "editorial",
      description: "De espaldas el uno al otro, postura simétrica o asimétrica",
      keywords: "@img1 and @img2 back to back, symmetrical or asymmetrical stance, editorial couple pose",
      context: ["editorial", "artistic", "fashion"]
    },
    {
      id: "one_sitting_standing",
      name: "Uno Sentado, Otro de Pie",
      category: "versatile",
      description: "Una persona sentada, la otra de pie cerca, interacción natural",
      keywords: "@img1 sitting while @img2 stands nearby, natural height variation, versatile interaction",
      context: ["portrait", "lifestyle", "editorial"]
    },
    {
      id: "holding_hands_apart",
      name: "Tomados de Mano (Separados)",
      category: "romantic",
      description: "Tomados de la mano pero con espacio entre ellos, conexión visual",
      keywords: "@img1 and @img2 holding hands with space between, visual connection despite distance",
      context: ["romantic", "outdoor", "editorial"]
    },
    {
      id: "laughing_together",
      name: "Riendo Juntos",
      category: "natural",
      description: "Ambos riendo genuinamente, momento de complicidad",
      keywords: "@img1 and @img2 laughing together, genuine shared joy, candid moment",
      context: ["lifestyle", "natural", "documentary"]
    },
    {
      id: "silhouette_sunset",
      name: "Silueta al Atardecer",
      category: "romantic",
      description: "Siluetas contra cielo colorido, abrazados o besándose",
      keywords: "@img1 and @img2 silhouettes against colorful sky, embracing or kissing, sunset romance",
      context: ["romantic", "outdoor", "artistic"]
    },
    {
      id: "lying_together",
      name: "Acostados Juntos",
      category: "intimate",
      description: "Acostados cerca, mirándose o mirando hacia arriba",
      keywords: "@img1 and @img2 lying close together, looking at each other or gazing upward, intimate ground pose",
      context: ["intimate", "lifestyle", "romantic"]
    }
  ]
};

// Función para obtener poses por género y contexto
export function getPosesByGender(gender, context = null) {
  let poses = [];
  
  if (gender === "masculine") {
    poses = POSES.masculine;
  } else if (gender === "feminine") {
    poses = POSES.feminine;
  } else if (gender === "couple") {
    poses = POSES.couple;
  } else {
    // Si no se especifica, devolver todas
    poses = [...POSES.masculine, ...POSES.feminine, ...POSES.couple];
  }
  
  if (context) {
    poses = poses.filter(pose => pose.context.includes(context));
  }
  
  return poses;
}

// Función para obtener pose aleatoria
export function getRandomPose(gender = null) {
  let allPoses = [];
  
  if (gender === "masculine") {
    allPoses = POSES.masculine;
  } else if (gender === "feminine") {
    allPoses = POSES.feminine;
  } else if (gender === "couple") {
    allPoses = POSES.couple;
  } else {
    allPoses = [...POSES.masculine, ...POSES.feminine];
  }
  
  return allPoses[Math.floor(Math.random() * allPoses.length)];
}

// Obtener todas las categorías
export function getAllPoseCategories() {
  const categories = new Set();
  Object.values(POSES).flat().forEach(pose => categories.add(pose.category));
  return Array.from(categories);
}
