// 📸 TIPOS DE PLANO Y ÁNGULOS DE CÁMARA
// Sistema completo para control preciso de composición fotográfica

// ============================================================================
// TIPOS DE PLANO (SHOT TYPES)
// ============================================================================

export const SHOT_TYPES = {
  "A. By Frame Size": [
    {
      id: "panoramic",
      name: "Panoramic Shot",
      description:
        "Shows a very wide landscape or environment, the human subject is minimal or non-existent.",
    },
    {
      id: "extreme_long_shot",
      name: "Extreme Long Shot (ELS)",
      description:
        "Shows the subject completely within a very large environment, the setting dominates.",
    },
    {
      id: "long_shot",
      name: "Long Shot (LS)",
      description:
        "Shows the subject from head to toe, with surrounding space to show context.",
    },
    {
      id: "group_shot",
      name: "Group Shot",
      description:
        "Includes several full-body characters, showing their spatial relationship.",
    },
    {
      id: "full_shot",
      name: "Full Shot / Figure Shot",
      description:
        "Shows a single subject from head to toe, occupying most of the frame.",
    },
    {
      id: "cowboy_shot",
      name: "American Shot (Cowboy Shot)",
      description: "Frames from the head to about the knees or thighs.",
    },
    {
      id: "medium_long_shot",
      name: "Medium Long Shot (MLS)",
      description: "Frames from the head to just below the waist or thighs.",
    },
    {
      id: "medium_shot",
      name: "Medium Shot (MS)",
      description:
        "Frames from the head to the waist, common for conversational portraits.",
    },
    {
      id: "medium_close_up",
      name: "Medium Close-Up (MCU)",
      description:
        "Frames from the head to the chest, emphasizing facial expression.",
    },
    {
      id: "close_up",
      name: "Close-Up (CU)",
      description:
        "Frames the face, prioritizing emotion and eliminating the environment.",
    },
    {
      id: "extreme_close_up",
      name: "Extreme Close-Up (ECU)",
      description:
        "Shows only a part of the face or an object, like eyes or a mouth.",
    },
    {
      id: "detail_shot",
      name: "Detail Shot (Insert)",
      description:
        "A tight shot of a small detail with narrative intent (hands, a button).",
    },
    {
      id: "texture_shot",
      name: "Texture Shot / Macro Texture",
      description:
        "An extreme close-up on patterns, skin, or surfaces, becoming almost abstract.",
    },
    {
      id: "master_shot",
      name: "Master Shot",
      description:
        "A wide shot showing all the main action of a scene for spatial reference.",
    },
    {
      id: "establishing_shot",
      name: "Establishing Shot",
      description:
        "A wide shot at the beginning of a scene to establish location.",
    },
  ],
  "B. By Number of Subjects": [
    {
      id: "one_shot",
      name: "One-Shot",
      description: "A single character in the frame.",
    },
    {
      id: "two_shot",
      name: "Two-Shot",
      description:
        "Two characters sharing the frame with compositional balance.",
    },
    {
      id: "three_shot",
      name: "Three-Shot",
      description: "Three characters visible in the frame.",
    },
    {
      id: "group_shot_multiple",
      name: "Group Shot",
      description:
        "More than three characters, prioritizing their relationship in the space.",
    },
    {
      id: "reaction_shot",
      name: "Reaction Shot",
      description:
        "Shows a character's reaction to something happening off-screen or on-screen.",
    },
    {
      id: "cutaway_shot",
      name: "Cutaway Shot",
      description:
        "A brief shot of a secondary element used for editing or emphasis.",
    },
  ],
  "C. Vertical Angulation": [
    {
      id: "eye_level",
      name: "Eye-Level Shot",
      description:
        "Camera is at the subject's eye level, creating a neutral feel.",
    },
    {
      id: "slight_high_angle",
      name: "Slight High Angle",
      description:
        "Camera is slightly above the subject, suggesting a sense of inferiority.",
    },
    {
      id: "high_angle",
      name: "High Angle Shot",
      description:
        "Camera is clearly above the subject, making them appear smaller or weaker.",
    },
    {
      id: "low_angle",
      name: "Low Angle Shot",
      description:
        "Camera is below the subject, making them appear powerful or threatening.",
    },
    {
      id: "slight_low_angle",
      name: "Slight Low Angle",
      description:
        "A gentle low angle that gives the subject importance without exaggeration.",
    },
    {
      id: "birds_eye_view",
      name: "Bird's Eye View (Top-Down)",
      description:
        "Camera is directly above the subject, perpendicular to the ground.",
    },
    {
      id: "worms_eye_view",
      name: "Worm's Eye View (Nadir)",
      description:
        "Camera is directly below the subject looking up, creating a sense of monumentality.",
    },
  ],
  "D. Horizontal Angulation": [
    {
      id: "front_angle",
      name: "Frontal Shot",
      description: "Camera is directly in front of the subject.",
    },
    {
      id: "three_quarter_view",
      name: "Three-Quarter (3/4) View",
      description: "Subject is turned about 45° to the camera, showing volume.",
    },
    {
      id: "profile_shot",
      name: "Profile Shot",
      description: "Camera shows the subject from the side.",
    },
    {
      id: "from_behind_shot",
      name: "From Behind Shot",
      description: "Subject has their back to the camera, creating mystery.",
    },
    {
      id: "over_the_shoulder",
      name: "Over-the-Shoulder (OTS)",
      description:
        "Camera is behind one character, showing their shoulder, looking at another.",
    },
    {
      id: "reverse_shot",
      name: "Reverse Shot",
      description: "The opposite shot from the previous one in a dialogue.",
    },
    {
      id: "side_shot",
      name: "Lateral Shot",
      description: "Camera is perpendicular to the subject's movement.",
    },
    {
      id: "foreshortening_shot",
      name: "Foreshortening Shot",
      description:
        "Part of the body is closer to the camera, creating depth and dynamism.",
    },
  ],
  "E. Special Angles & Composition": [
    {
      id: "dutch_angle",
      name: "Dutch Angle / Canted Angle",
      description:
        "The camera is tilted relative to the horizon, creating tension or instability.",
    },
    {
      id: "oblique_angle",
      name: "Oblique Angle",
      description:
        "Similar to Dutch angle but with a gentler tilt, adding dynamism.",
    },
    {
      id: "pov_shot",
      name: "Point of View (POV) Shot",
      description: "The camera shows exactly what a character would see.",
    },
    {
      id: "objective_shot",
      name: "Objective Shot",
      description: "The camera remains a neutral observer.",
    },
    {
      id: "semi_subjective_shot",
      name: "Semi-Subjective Shot",
      description:
        "A mix of objective and subjective, showing part of the character's body.",
    },
    {
      id: "mirror_shot",
      name: "Mirror Shot",
      description: "The subject is seen through their reflection in a mirror.",
    },
    {
      id: "reflection_shot",
      name: "Reflection Shot",
      description:
        "The main scene is viewed through reflections in water, glass, etc.",
    },
    {
      id: "shot_through_object",
      name: "Shot Through Obstacles",
      description:
        "Framing the subject through doorways, leaves, etc., to create layers.",
    },
    {
      id: "natural_framing",
      name: "Natural Framing",
      description:
        "Using environmental elements to frame the subject within the shot.",
    },
  ],
  "F. By Movement & Duration": [
    {
      id: "static_shot",
      name: "Static Shot",
      description: "The camera remains completely still.",
    },
    {
      id: "pan_shot",
      name: "Pan Shot",
      description: "The camera rotates on its horizontal axis.",
    },
    {
      id: "tilt_shot",
      name: "Tilt Shot",
      description: "The camera rotates on its vertical axis (up or down).",
    },
    {
      id: "tracking_shot",
      name: "Tracking Shot (Dolly)",
      description: "The camera physically moves through the space.",
    },
    {
      id: "dolly_zoom",
      name: "Dolly In / Dolly Out",
      description: "The camera moves forward or backward.",
    },
    {
      id: "zoom",
      name: "Zoom In / Zoom Out",
      description: "The focal length changes without physical camera movement.",
    },
    {
      id: "sequence_shot",
      name: "Sequence Shot (Long Take)",
      description: "A long shot with no visible cuts.",
    },
    {
      id: "handheld_shot",
      name: "Handheld Shot",
      description: "Camera is held by hand, creating a natural, urgent feel.",
    },
    {
      id: "shaky_cam",
      name: "Shaky Cam",
      description: "Very agitated handheld to emphasize chaos or stress.",
    },
    {
      id: "slow_motion",
      name: "Slow Motion Shot",
      description: "The action is recorded or played back at a slower speed.",
    },
    {
      id: "time_lapse",
      name: "Time-Lapse Shot",
      description: "Condenses a long period of time into a few seconds.",
    },
  ],
  "G. Macro & Proximity Shots": [
    {
      id: "macro_close_up",
      name: "Macro Close-Up",
      description:
        "An extreme close-up of a small object, full of fine detail.",
    },
    {
      id: "macro_1_1",
      name: "1:1 Macro (Life-Size)",
      description:
        "The subject's size on the sensor equals its real-life size.",
    },
    {
      id: "extreme_macro",
      name: "Extreme Macro / Super Macro",
      description:
        "Magnification greater than 1:1, showing structures invisible to the naked eye.",
    },
    {
      id: "macro_detail",
      name: "Macro Detail Shot",
      description:
        "A macro shot focused on a specific detail like edges or fibers.",
    },
    {
      id: "abstract_macro",
      name: "Abstract Macro",
      description:
        "So close the subject becomes unrecognizable, prioritizing form and color.",
    },
    {
      id: "close_up_lens_shot",
      name: "Close-Up Lens Shot",
      description:
        "Macro achieved with a filter that reduces minimum focus distance.",
    },
    {
      id: "split_diopter_shot",
      name: "Split-Diopter Shot",
      description:
        "Half the frame is focused very close, the other half on the background.",
    },
  ],
  "H. Contextual & Functional Shots": [
    {
      id: "insert_shot",
      name: "Insert Shot",
      description: "A very brief shot of a detail to be emphasized.",
    },
    {
      id: "cutaway",
      name: "Cutaway",
      description:
        "A shot inserted to cut away from the main action to show something related.",
    },
    {
      id: "transition_shot",
      name: "Transition Shot",
      description:
        "A shot used to move from one scene to another (sky, facade, etc.).",
    },
    {
      id: "motivated_shot",
      name: "Motivated Shot",
      description:
        "A shot whose angle or movement is justified by something in the scene.",
    },
    {
      id: "follow_shot",
      name: "Follow Shot",
      description: "The camera follows a subject as it moves.",
    },
    {
      id: "static_establishing",
      name: "Static Establishing Shot",
      description: "A motionless shot used only to establish the setting.",
    },
  ],
};

// ============================================================================
// FUNCIONES HELPER
// ============================================================================

export const getShotTypeById = (id) => {
  return SHOT_TYPES_DATA.find((shot) => shot.id === id) || null;
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  SHOT_TYPES_DATA,
  getShotTypeById,
};
