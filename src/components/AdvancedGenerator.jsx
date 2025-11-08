import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
  Wand2, 
  Upload, 
  X, 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Edit2, 
  Check, 
  Crown,
  Lock,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon 
} from 'lucide-react';

// Importar datos
import { SHOT_TYPES, CAMERA_ANGLES, DEPTH_OF_FIELD } from '../data/shotTypesData';
import { Outfits_men } from '../data/Outfits_men';
import { Outfits_women } from '../data/Outfits_women';
import { ENVIRONMENTS_ARRAY } from '../data/environmentsData';
import { LIGHTING_SETUPS } from '../data/lightingData';
import { COLOR_GRADING_FILTERS } from '../data/colorGradingData';
import { getPosesByGender } from '../data/posesData';

// QUICK FEATURES (FREE)
const QUICK_FEATURES = [
  {
    id: 'professional-lighting',
    name: 'Iluminación Profesional',
    description: 'Rembrandt o Butterfly lighting',
    prompt: 'professional Rembrandt lighting setup with key light at 45 degrees'
  },
  {
    id: 'bokeh',
    name: 'Fondo Desenfocado',
    description: 'Shallow depth of field',
    prompt: 'shallow depth of field, creamy bokeh background, 85mm f/1.4'
  },
  {
    id: 'cinematic',
    name: 'Look Cinematográfico',
    description: 'Black Pro-Mist effect',
    prompt: 'cinematic Black Pro-Mist filter effect, soft halation, dreamy atmosphere'
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Luz cálida de atardecer',
    prompt: 'golden hour natural lighting, warm sunset glow, soft directional light'
  },
  {
    id: 'smooth-skin',
    name: 'Piel Suave',
    description: 'Retoque natural de piel',
    prompt: 'natural skin retouching, smooth even texture while maintaining pores, professional beauty lighting'
  },
  {
    id: 'teal-orange',
    name: 'Teal & Orange',
    description: 'Color grading cinematográfico',
    prompt: 'teal and orange color grading, cinematic color separation, complementary tones'
  }
];

const AdvancedGenerator = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [qualityAnalysis, setQualityAnalysis] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState('');
  
  // Estados del generador
  const [userPrompt, setUserPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState(null);
  
  // Quick Features
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  
  // PRO Tools estados
  const [showProTools, setShowProTools] = useState(false);
  const [gender, setGender] = useState('');
  const [shotType, setShotType] = useState('');
  const [cameraAngle, setCameraAngle] = useState('');
  const [outfit, setOutfit] = useState('');
  const [environment, setEnvironment] = useState('');
  const [lighting, setLighting] = useState('');
  const [colorGrading, setColorGrading] = useState('');
  const [pose, setPose] = useState('');
  const [dof, setDof] = useState('');
  
  // Estados de generación de imagen
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('1:1');

  // Aspect ratios disponibles
  const ASPECT_RATIOS = [
    { value: '1:1', label: '1:1 (Cuadrado)', width: 1024, height: 1024 },
    { value: '16:9', label: '16:9 (Horizontal)', width: 1280, height: 720 },
    { value: '9:16', label: '9:16 (Vertical)', width: 720, height: 1280 },
    { value: '4:3', label: '4:3 (Clásico)', width: 1024, height: 768 },
    { value: '3:4', label: '3:4 (Retrato)', width: 768, height: 1024 }
  ];

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      console.log('🔍 Iniciando checkUser...');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('❌ Error al obtener usuario:', userError);
        navigate('/');
        return;
      }
      
      if (!user) {
        console.log('⚠️ No hay usuario autenticado');
        navigate('/');
        return;
      }
      
      console.log('✅ Usuario autenticado:', user.email);
      setUser(user);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('❌ Error al obtener perfil:', profileError);
        return;
      }
      
      if (!profileData) {
        console.error('❌ No se encontró el perfil');
        return;
      }
      
      console.log('✅ Perfil cargado:', profileData);
      console.log('💰 Créditos disponibles:', profileData.credits);
      console.log('📦 Plan del usuario:', profileData.plan);
      
      setProfile(profileData);
    } catch (error) {
      console.error('❌ Error en checkUser:', error);
    }
  };

  const isPro = profile?.plan === 'pro' || profile?.plan === 'premium';

  // Generar preview del prompt basado en las selecciones
  const getPromptPreview = () => {
    let preview = [];

    // Quick Features
    if (selectedFeatures.length > 0) {
      const features = selectedFeatures.map(id => {
        const feature = QUICK_FEATURES.find(f => f.id === id);
        return feature ? feature.name : '';
      });
      preview.push(`📸 ${features.join(', ')}`);
    }

    // PRO Tools (solo si están activos)
    if (showProTools && isPro) {
      if (shotType) {
        const shot = SHOT_TYPES.find(s => s.id === shotType);
        if (shot) preview.push(`🎥 ${shot.name}`);
      }
      if (cameraAngle) {
        const angle = CAMERA_ANGLES.find(a => a.id === cameraAngle);
        if (angle) preview.push(`📐 ${angle.name}`);
      }
      if (lighting) {
        const light = LIGHTING_SETUPS.find(l => l.id === lighting);
        if (light) preview.push(`💡 ${light.name}`);
      }
      if (colorGrading) {
        const grading = COLOR_GRADING_FILTERS.find(g => g.id === colorGrading);
        if (grading) preview.push(`🎨 ${grading.name}`);
      }
      if (outfit) preview.push(`👔 Outfit personalizado`);
      if (environment) {
        const env = ENVIRONMENTS_ARRAY.find(e => e.id === environment);
        if (env) preview.push(`🌍 ${env.name}`);
      }
      if (pose) preview.push(`🧍 Pose personalizada`);
      if (dof) {
        const depth = DEPTH_OF_FIELD.find(d => d.id === dof);
        if (depth) preview.push(`📷 ${depth.name}`);
      }
    }

    return preview.length > 0 ? '\n\n' + preview.join('\n') : '';
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setReferenceImage(null);
    setReferenceImagePreview(null);
  };

  const toggleFeature = (featureId) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
    // Al usar Quick Features, limpiar PRO Tools
    if (!selectedFeatures.includes(featureId)) {
      setShowProTools(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Iniciando generación de prompt...');
    
    if (!userPrompt.trim() && !referenceImage) {
      alert('Por favor, escribe algo o sube una imagen de referencia');
      return;
    }

    // DEBUG: Verificar estado del perfil
    console.log('🔍 Verificando créditos...');
    console.log('Profile:', profile);
    console.log('Profile credits:', profile?.credits);
    console.log('Tipo de credits:', typeof profile?.credits);

    // Validar que el perfil esté cargado
    if (!profile) {
      console.error('❌ El perfil no está cargado');
      alert('Cargando información de usuario... Intenta de nuevo en un momento.');
      return;
    }

    // Validar créditos
    const creditsAvailable = Number(profile.credits) || 0;
    console.log('💰 Créditos disponibles:', creditsAvailable);
    
    if (creditsAvailable < 1) {
      console.error(`❌ Créditos insuficientes: ${creditsAvailable}`);
      alert(`No tienes créditos suficientes. Tienes ${creditsAvailable} créditos y necesitas al menos 1.`);
      return;
    }

    console.log('✅ Validación de créditos pasada. Generando prompt...');
    
    setLoading(true);
    setGeneratedPrompt('');
    setGeneratedImageUrl(null);

    try {
      const formData = new FormData();
      formData.append('userPrompt', userPrompt);
      
      // Quick Features
      formData.append('quickFeatures', JSON.stringify(selectedFeatures));
      
      // PRO Tools (solo si está activo)
      if (showProTools && isPro) {
        formData.append('gender', gender);
        formData.append('shotType', shotType);
        formData.append('cameraAngle', cameraAngle);
        formData.append('outfit', outfit);
        formData.append('environment', environment);
        formData.append('lighting', lighting);
        formData.append('colorGrading', colorGrading);
        formData.append('pose', pose);
        formData.append('dof', dof);
      }
      
      if (referenceImage) {
        formData.append('referenceImage', referenceImage);
      }

      const response = await fetch('/api/gemini-processor', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al generar el prompt');
      }

      const data = await response.json();
      setGeneratedPrompt(data.prompt);
      
      // Guardar análisis de calidad si existe
      if (data.qualityAnalysis) {
        setQualityAnalysis(data.qualityAnalysis);
      }

      console.log('✅ Prompt generado exitosamente');
      console.log('💳 Descontando 1 crédito...');
      console.log('Créditos actuales:', profile.credits);

      // DESCONTAR 1 CRÉDITO después de generar el prompt exitosamente
      const newCredits = profile.credits - 1;
      const { error: creditError } = await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', user.id);

      if (creditError) {
        console.error('❌ Error al descontar crédito:', creditError);
      } else {
        console.log('✅ Crédito descontado. Nuevos créditos:', newCredits);
      }

      // Actualizar estado local de créditos
      setProfile({ ...profile, credits: newCredits });
      
      // RECARGAR PERFIL para asegurar sincronización
      await checkUser();

      // Guardar en historial
      const { error: historyError } = await supabase
        .from('prompt_history')
        .insert({
          user_id: user.id,
          prompt_text: data.prompt,
          platform: 'nano-banana',
          generated_at: new Date().toISOString()
        });

      if (historyError) {
        console.error('Error al guardar en historial:', historyError);
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el prompt. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!generatedPrompt) {
      alert('Primero genera un prompt');
      return;
    }

    console.log('🖼️ Iniciando generación de imagen...');
    console.log('Profile:', profile);
    console.log('Credits:', profile?.credits);
    
    // Validar que el perfil esté cargado
    if (!profile) {
      console.error('❌ El perfil no está cargado');
      alert('Cargando información de usuario... Intenta de nuevo en un momento.');
      return;
    }

    // Validar créditos ANTES de generar imagen
    const creditsAvailable = Number(profile.credits) || 0;
    console.log('💰 Créditos disponibles para imagen:', creditsAvailable);
    
    if (creditsAvailable < 1) {
      console.error(`❌ Créditos insuficientes: ${creditsAvailable}`);
      alert(`No tienes créditos suficientes. Tienes ${creditsAvailable} créditos y necesitas 1 crédito adicional para generar la imagen.`);
      return;
    }

    console.log('✅ Validación pasada. Generando imagen...');

    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);

    try {
      const selectedRatio = ASPECT_RATIOS.find(r => r.value === aspectRatio);
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: generatedPrompt,
          userId: user.id,
          aspectRatio: aspectRatio,
          width: selectedRatio.width,
          height: selectedRatio.height
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al generar la imagen');
      }

      const data = await response.json();
      
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        
        console.log('✅ Imagen generada exitosamente');
        console.log('💳 Descontando 1 crédito por imagen...');
        console.log('Créditos actuales:', profile.credits);
        
        // DESCONTAR 1 CRÉDITO adicional
        const newCredits = profile.credits - 1;
        const { error: creditError } = await supabase
          .from('profiles')
          .update({ credits: newCredits })
          .eq('id', user.id);

        if (creditError) {
          console.error('❌ Error al descontar crédito por imagen:', creditError);
        } else {
          console.log('✅ Crédito descontado. Nuevos créditos:', newCredits);
        }

        setProfile({ ...profile, credits: newCredits });
        
        // RECARGAR PERFIL para asegurar sincronización
        await checkUser();
      }

    } catch (error) {
      console.error('Error generando imagen:', error);
      alert(error.message || 'Error al generar la imagen. Por favor, intenta de nuevo.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = isEditing ? editedPrompt : generatedPrompt;
    navigator.clipboard.writeText(textToCopy);
    alert('Prompt copiado al portapapeles');
  };

  const startEditing = () => {
    setEditedPrompt(generatedPrompt);
    setIsEditing(true);
  };

  const saveEdit = () => {
    setGeneratedPrompt(editedPrompt);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditedPrompt('');
    setIsEditing(false);
  };

  const outfitOptions = gender === 'male' ? Outfits_men : 
                        gender === 'female' ? Outfits_women : [];
  
  const poseOptions = gender ? getPosesByGender(gender) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d] pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Generador de Prompts <span className="text-[var(--primary)]">PRO</span>
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            Describe lo que quieres generar o sube una foto de referencia
          </p>
          <p className="text-sm text-gray-500">
            Utiliza las herramientas PRO para tener más control
          </p>
          {profile && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[var(--border)] rounded-lg">
              <Sparkles className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-white font-medium">{profile.credits} créditos disponibles</span>
            </div>
          )}
        </div>

        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Principal + Upload */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-[4]">
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Describe tu idea... (ej: 'un hombre elegante en un café urbano')"
                className="w-full h-32 px-4 py-3 bg-[#1a1a1a] border border-[var(--border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              />
              {(selectedFeatures.length > 0 || (showProTools && isPro && (shotType || lighting || colorGrading || environment || outfit || pose || dof || cameraAngle))) && (
                <div className="mt-2 p-3 bg-[#0d0d0d] border border-[var(--primary)]/30 rounded-lg">
                  <p className="text-xs text-[var(--primary)] font-medium mb-1">✨ Se agregará al prompt:</p>
                  <p className="text-xs text-gray-400 whitespace-pre-line">{getPromptPreview()}</p>
                </div>
              )}
            </div>

            <div className="flex-[1]">
              {!referenceImagePreview ? (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[var(--border)] rounded-lg cursor-pointer hover:border-[var(--primary)] transition-colors bg-[#1a1a1a]">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">Foto referencia</span>
                  <span className="text-xs text-gray-500 mt-1">(opcional)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative h-32">
                  <img
                    src={referenceImagePreview}
                    alt="Reference"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* LAYOUT DE DOS COLUMNAS: FREE + PRO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* COLUMNA IZQUIERDA: Quick Features (FREE) */}
            <div className="space-y-4">
              <div className="bg-[#1a1a1a] border border-[var(--border)] rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">
                  ⚡ Características Rápidas (FREE)
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {QUICK_FEATURES.map((feature) => (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => toggleFeature(feature.id)}
                      disabled={showProTools}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedFeatures.includes(feature.id)
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-white'
                          : showProTools
                          ? 'border-[#2D2D2D] bg-[#06060C]/30 text-[#666] cursor-not-allowed'
                          : 'border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[var(--primary)]/50'
                      }`}
                    >
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{feature.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: Herramientas PRO */}
            <div>
              {!isPro ? (
                <div className="p-6 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/5 border border-[var(--primary)]/30 rounded-lg text-center">
                  <Crown className="w-12 h-12 text-[var(--primary)] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Herramientas PRO
                  </h3>
                  <p className="text-[#C1C1C1] mb-4">
                    Accede a control completo sobre iluminación, poses, vestuario, planos y más
                  </p>
                  <a
                    href="/planes"
                    className="inline-block px-6 py-3 bg-[var(--primary)] hover:bg-[#C4B66D] rounded-lg font-medium transition-colors text-black"
                  >
                    Actualizar a PRO
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        Herramientas PRO
                      </h3>
                      <p className="text-xs text-[#C1C1C1]">
                        Control profesional completo
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProTools(!showProTools);
                        if (!showProTools) {
                          setSelectedFeatures([]);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        showProTools
                          ? 'border-[var(--primary)] bg-[var(--primary)]/20 text-white'
                          : 'border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1]'
                      }`}
                    >
                      {showProTools ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {showProTools && (
                    <div className="bg-[#1a1a1a] border border-[var(--border)] rounded-lg p-6 space-y-6 max-h-[600px] overflow-y-auto">
                      {/* 1. GÉNERO */}
                      <div>
                        <label className="block text-gray-300 font-medium mb-3">Género</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setGender('male')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              gender === 'male'
                                ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                                : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                            }`}
                          >
                            <div className="text-white font-medium">MASCULINO</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setGender('female')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              gender === 'female'
                                ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                                : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                            }`}
                          >
                            <div className="text-white font-medium">FEMENINO</div>
                          </button>
                        </div>
                      </div>

                      {/* 2. TIPO DE PLANO */}
                      <div>
                        <label className="block text-gray-300 font-medium mb-3">Tipo de Plano</label>
                        <select
                          value={shotType}
                          onChange={(e) => setShotType(e.target.value)}
                          className="w-full px-4 py-3 bg-[#252525] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                          <option value="">Selecciona un plano</option>
                          {SHOT_TYPES.map((shot) => (
                            <option key={shot.id} value={shot.id}>
                              {shot.name.toUpperCase()} :: {shot.description}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 3. ÁNGULO DE CÁMARA */}
                      <div>
                        <label className="block text-gray-300 font-medium mb-3">Ángulo de Cámara</label>
                        <select
                          value={cameraAngle}
                          onChange={(e) => setCameraAngle(e.target.value)}
                          className="w-full px-4 py-3 bg-[#252525] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                          <option value="">Selecciona un ángulo</option>
                          {CAMERA_ANGLES.map((angle) => (
                            <option key={angle.id} value={angle.id}>
                              {angle.name.toUpperCase()} :: {angle.description}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 4. VESTUARIO */}
                      {gender && outfitOptions.length > 0 && (
                        <div>
                          <label className="block text-gray-300 font-medium mb-3">Estilo de Vestuario</label>
                          <select
                            value={outfit}
                            onChange={(e) => setOutfit(e.target.value)}
                            className="w-full px-4 py-3 bg-[#252525] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                          >
                            <option value="">Selecciona un estilo</option>
                            {outfitOptions.map((style) => (
                              <option key={style.id} value={style.id}>
                                {style.name.toUpperCase()} :: {style.description}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* 5. ENTORNO */}
                      <div>
                        <label className="block text-gray-300 font-medium mb-3">Entorno</label>
                        <select
                          value={environment}
                          onChange={(e) => setEnvironment(e.target.value)}
                          className="w-full px-4 py-3 bg-[#252525] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                          <option value="">Selecciona un entorno</option>
                          {ENVIRONMENTS_ARRAY.map((env) => (
                            <option key={env.id} value={env.id}>
                              {env.name.toUpperCase()} :: {env.description}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 6. ILUMINACIÓN */}
                      <div>
                        <label className="block text-gray-300 font-medium mb-3">Iluminación</label>
                        <select
                          value={lighting}
                          onChange={(e) => setLighting(e.target.value)}
                          className="w-full px-4 py-3 bg-[#252525] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                          <option value="">Selecciona iluminación</option>
                          {LIGHTING_SETUPS.map((light) => (
                            <option key={light.id} value={light.id}>
                              {light.name.toUpperCase()} :: {light.description}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 7. COLOR GRADING */}
                      <div>
                        <label className="block text-gray-300 font-medium mb-3">Color Grading</label>
                        <select
                          value={colorGrading}
                          onChange={(e) => setColorGrading(e.target.value)}
                          className="w-full px-4 py-3 bg-[#252525] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                          <option value="">Selecciona color grading</option>
                          {COLOR_GRADING_FILTERS.map((filter) => (
                            <option key={filter.id} value={filter.id}>
                              {filter.name.toUpperCase()} :: {filter.description}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 8. POSE */}
                      {gender && poseOptions.length > 0 && (
                        <div>
                          <label className="block text-gray-300 font-medium mb-3">Pose</label>
                          <select
                            value={pose}
                            onChange={(e) => setPose(e.target.value)}
                            className="w-full px-4 py-3 bg-[#252525] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                          >
                            <option value="">Selecciona una pose</option>
                            {poseOptions.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name.toUpperCase()} :: {p.description}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* 9. DEPTH OF FIELD */}
                      <div>
                        <label className="block text-gray-300 font-medium mb-3">Profundidad de Campo</label>
                        <select
                          value={dof}
                          onChange={(e) => setDof(e.target.value)}
                          className="w-full px-4 py-3 bg-[#252525] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                          <option value="">Selecciona DOF</option>
                          {DEPTH_OF_FIELD.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name.toUpperCase()} :: {d.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Botón Generar */}
          <button
            type="submit"
            disabled={loading || (!userPrompt.trim() && !referenceImage)}
            className="w-full py-4 bg-gradient-to-r from-[var(--primary)] to-amber-500 text-black font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generando prompt...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generar Prompt (1 crédito)
              </>
            )}
          </button>
        </form>

        {/* Resultado */}
        {generatedPrompt && (
          <div className="mt-8 space-y-4">
            {/* Prompt y Análisis - Lado a lado en desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Prompt Generado */}
              <div className="bg-[#1a1a1a] border border-[var(--border)] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                    Prompt Generado
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
                      title="Copiar"
                    >
                      <Copy className="w-5 h-5 text-[var(--primary)]" />
                    </button>
                    {!isEditing ? (
                      <button
                        onClick={startEditing}
                        className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5 text-[var(--primary)]" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={saveEdit}
                          className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
                          title="Guardar"
                        >
                          <Check className="w-5 h-5 text-green-500" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
                          title="Cancelar"
                        >
                          <X className="w-5 h-5 text-red-500" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {isEditing ? (
                  <textarea
                    value={editedPrompt}
                    onChange={(e) => setEditedPrompt(e.target.value)}
                    className="w-full h-64 px-4 py-3 bg-[#252525] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  />
                ) : (
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                    {generatedPrompt}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-sm text-gray-400">
                    Caracteres: {generatedPrompt.length}
                  </p>
                </div>
              </div>

              {/* Análisis de Calidad */}
              {qualityAnalysis && (
                <div className="bg-[#1a1a1a] border border-[var(--border)] rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary)]">
                      <path d="M9 11l3 3L22 4"></path>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    Análisis de Calidad
                  </h3>
                  
                  <div className="space-y-4 text-sm">
                    {/* Puntuación General */}
                    {qualityAnalysis.score && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">Puntuación General</span>
                          <span className="text-[var(--primary)] font-bold text-lg">{qualityAnalysis.score}/10</span>
                        </div>
                        <div className="w-full bg-[#252525] rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-[var(--primary)] to-amber-500 h-2 rounded-full transition-all"
                            style={{ width: `${(qualityAnalysis.score / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Fortalezas */}
                    {qualityAnalysis.strengths && qualityAnalysis.strengths.length > 0 && (
                      <div>
                        <h4 className="text-green-400 font-medium mb-2">✓ Fortalezas:</h4>
                        <ul className="space-y-1 text-gray-300">
                          {qualityAnalysis.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Áreas de Mejora */}
                    {qualityAnalysis.improvements && qualityAnalysis.improvements.length > 0 && (
                      <div>
                        <h4 className="text-amber-400 font-medium mb-2">⚡ Puede mejorar:</h4>
                        <ul className="space-y-1 text-gray-300">
                          {qualityAnalysis.improvements.map((improvement, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Elementos Técnicos */}
                    {qualityAnalysis.technical && (
                      <div className="pt-3 border-t border-[var(--border)]">
                        <h4 className="text-gray-400 font-medium mb-2">📷 Aspectos Técnicos:</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {qualityAnalysis.technical.lighting && (
                            <div className="bg-[#252525] p-2 rounded">
                              <span className="text-gray-500">Iluminación:</span>
                              <span className="text-white ml-1">{qualityAnalysis.technical.lighting}</span>
                            </div>
                          )}
                          {qualityAnalysis.technical.composition && (
                            <div className="bg-[#252525] p-2 rounded">
                              <span className="text-gray-500">Composición:</span>
                              <span className="text-white ml-1">{qualityAnalysis.technical.composition}</span>
                            </div>
                          )}
                          {qualityAnalysis.technical.style && (
                            <div className="bg-[#252525] p-2 rounded">
                              <span className="text-gray-500">Estilo:</span>
                              <span className="text-white ml-1">{qualityAnalysis.technical.style}</span>
                            </div>
                          )}
                          {qualityAnalysis.technical.detail && (
                            <div className="bg-[#252525] p-2 rounded">
                              <span className="text-gray-500">Detalle:</span>
                              <span className="text-white ml-1">{qualityAnalysis.technical.detail}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Generación de Imagen */}
            <div className="bg-[#1a1a1a] border border-[var(--border)] rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[var(--primary)]" />
                Generar Imagen con Gemini
              </h3>

              <div className="mb-4">
                <label className="block text-gray-300 font-medium mb-3">Aspecto de la imagen</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.value}
                      type="button"
                      onClick={() => setAspectRatio(ratio.value)}
                      className={`p-3 rounded-lg border-2 transition-all text-sm ${
                        aspectRatio === ratio.value
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-white'
                          : 'border-[var(--border)] text-gray-400 hover:border-[var(--primary)]/50'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || !generatedPrompt}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isGeneratingImage ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generando imagen...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" />
                    Generar Imagen (1 crédito adicional)
                  </>
                )}
              </button>

              {generatedImageUrl && (
                <div className="mt-6">
                  <img
                    src={generatedImageUrl}
                    alt="Generated"
                    className="w-full rounded-lg shadow-2xl"
                  />
                  <a
                    href={generatedImageUrl}
                    download
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Descargar Imagen
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedGenerator;
