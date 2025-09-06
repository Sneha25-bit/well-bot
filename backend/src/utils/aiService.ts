// AI Service for generating health recommendations using Google Gemini API
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export interface SymptomAnalysis {
  symptoms: string[];
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  suggestedMedications: string[];
  emergencyAdvice?: string;
}

export interface HealthPlan {
  title: string;
  description: string;
  duration: number;
  tasks: {
    task: string;
    priority: 'high' | 'medium' | 'low';
    timeOfDay: 'morning' | 'afternoon' | 'night';
    category: 'medication' | 'exercise' | 'diet' | 'rest' | 'monitoring' | 'other';
  }[];
}

// Symptom database for basic analysis
const symptomDatabase: Record<string, any> = {
  headache: {
    severity: 'medium',
    recommendations: [
      'Stay hydrated - drink plenty of water',
      'Rest in a quiet, dark room',
      'Apply a cold or warm compress',
      'Consider over-the-counter pain relief'
    ],
    medications: ['Paracetamol', 'Ibuprofen'],
    emergency: 'If headache is severe, sudden, or accompanied by fever, vision changes, or neck stiffness, seek immediate medical attention'
  },
  fever: {
    severity: 'high',
    recommendations: [
      'Monitor your temperature regularly',
      'Stay hydrated with water and clear fluids',
      'Rest and avoid strenuous activity',
      'Use fever reducers as directed'
    ],
    medications: ['Paracetamol', 'Ibuprofen'],
    emergency: 'Seek immediate medical attention if fever exceeds 103°F (39.4°C), or if you experience difficulty breathing, chest pain, or severe symptoms'
  },
  fatigue: {
    severity: 'medium',
    recommendations: [
      'Get adequate rest and sleep',
      'Eat iron-rich foods',
      'Stay hydrated',
      'Light exercise can help boost energy'
    ],
    medications: ['Iron supplement', 'Vitamin B12'],
    emergency: 'If fatigue is severe and persistent, consult a healthcare professional'
  },
  nausea: {
    severity: 'medium',
    recommendations: [
      'Eat small, frequent meals',
      'Avoid spicy or greasy foods',
      'Stay hydrated with clear fluids',
      'Try ginger tea or ginger candies'
    ],
    medications: ['Antacids', 'Ginger supplements'],
    emergency: 'If nausea is severe and persistent, or accompanied by severe abdominal pain, seek medical attention'
  },
  cough: {
    severity: 'low',
    recommendations: [
      'Stay hydrated',
      'Use a humidifier',
      'Avoid irritants like smoke',
      'Try honey and warm water'
    ],
    medications: ['Cough syrup', 'Throat lozenges'],
    emergency: 'If cough is severe, persistent, or accompanied by blood, seek medical attention'
  }
};

// Analyze symptoms and provide recommendations
export const analyzeSymptoms = (symptoms: string[]): SymptomAnalysis => {
  const analysis: SymptomAnalysis = {
    symptoms,
    severity: 'low',
    recommendations: [],
    suggestedMedications: []
  };

  let maxSeverity: 'low' | 'medium' | 'high' = 'low';
  const allRecommendations: string[] = [];
  const allMedications: string[] = [];
  const emergencyAdvice: string[] = [];

  symptoms.forEach(symptom => {
    const symptomData = symptomDatabase[symptom.toLowerCase()];
    if (symptomData) {
      // Update severity
      if (symptomData.severity === 'high') {
        maxSeverity = 'high';
      } else if (symptomData.severity === 'medium' && maxSeverity !== 'high') {
        maxSeverity = 'medium';
      }

      // Collect recommendations and medications
      allRecommendations.push(...symptomData.recommendations);
      allMedications.push(...symptomData.medications);
      
      if (symptomData.emergency) {
        emergencyAdvice.push(symptomData.emergency);
      }
    }
  });

  analysis.severity = maxSeverity;
  analysis.recommendations = [...new Set(allRecommendations)]; // Remove duplicates
  analysis.suggestedMedications = [...new Set(allMedications)]; // Remove duplicates
  
  if (emergencyAdvice.length > 0) {
    analysis.emergencyAdvice = emergencyAdvice.join(' ');
  }

  return analysis;
};

// Generate personalized health plan using Gemini AI
export const generateHealthPlan = async (symptoms: string[], planType: string = 'recovery', userContext?: any): Promise<HealthPlan> => {
  try {
    const prompt = `Generate a personalized health plan for someone with these symptoms: ${symptoms.join(', ')}.
    
Plan type: ${planType}
${userContext ? `User context: ${JSON.stringify(userContext)}` : ''}

Please create a structured health plan with:
1. A descriptive title
2. A helpful description
3. Duration in days (3-7 days based on severity)
4. Specific tasks with:
   - Task description
   - Priority (high/medium/low)
   - Time of day (morning/afternoon/night)
   - Category (medication/exercise/diet/rest/monitoring/other)

Format the response as a JSON object with this structure:
{
  "title": "string",
  "description": "string", 
  "duration": number,
  "tasks": [
    {
      "task": "string",
      "priority": "high|medium|low",
      "timeOfDay": "morning|afternoon|night",
      "category": "medication|exercise|diet|rest|monitoring|other"
    }
  ]
}

Make the plan practical, actionable, and focused on recovery and wellness.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse the JSON response
    try {
      const planData = JSON.parse(text);
      return planData as HealthPlan;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      // Fall back to the original implementation
      return generateHealthPlanFallback(symptoms, planType);
    }
  } catch (error) {
    console.error('Error generating health plan with Gemini:', error);
    // Fall back to the original implementation
    return generateHealthPlanFallback(symptoms, planType);
  }
};

// Fallback health plan generation (original implementation)
const generateHealthPlanFallback = (symptoms: string[], planType: string = 'recovery'): HealthPlan => {
  const analysis = analyzeSymptoms(symptoms);
  
  const plan: HealthPlan = {
    title: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan for ${symptoms.join(', ')}`,
    description: `Personalized health plan based on your symptoms: ${symptoms.join(', ')}. This plan is designed to help you recover and maintain good health.`,
    duration: analysis.severity === 'high' ? 7 : analysis.severity === 'medium' ? 5 : 3,
    tasks: []
  };

  // Generate tasks based on symptoms and severity
  const taskId = 1;
  let currentTaskId = taskId;

  // Medication tasks
  if (analysis.suggestedMedications.length > 0) {
    analysis.suggestedMedications.forEach(medication => {
      plan.tasks.push({
        task: `Take ${medication} as prescribed`,
        priority: analysis.severity === 'high' ? 'high' : 'medium',
        timeOfDay: 'morning',
        category: 'medication'
      });
    });
  }

  // General health tasks
  plan.tasks.push(
    {
      task: 'Stay hydrated - drink 8 glasses of water',
      priority: 'high',
      timeOfDay: 'morning',
      category: 'diet'
    },
    {
      task: 'Get adequate rest and sleep',
      priority: analysis.severity === 'high' ? 'high' : 'medium',
      timeOfDay: 'night',
      category: 'rest'
    },
    {
      task: 'Monitor symptoms and track progress',
      priority: 'medium',
      timeOfDay: 'afternoon',
      category: 'monitoring'
    }
  );

  // Add specific recommendations as tasks
  analysis.recommendations.slice(0, 3).forEach((recommendation, index) => {
    const timeOfDay = index === 0 ? 'morning' : index === 1 ? 'afternoon' : 'night';
    plan.tasks.push({
      task: recommendation,
      priority: 'medium',
      timeOfDay,
      category: 'other'
    });
  });

  return plan;
};

// Generate chat response using Gemini AI
export const generateChatResponse = async (userMessage: string, sessionType: string = 'general', userContext?: any): Promise<string> => {
  try {
    const prompt = `You are a helpful health assistant for a wellness bot application. You provide general health information, symptom guidance, and wellness advice. 

IMPORTANT DISCLAIMERS:
- Always remind users that you provide general information only
- For serious symptoms or emergencies, advise immediate medical consultation
- Never provide specific medical diagnoses
- Always recommend consulting healthcare professionals for personalized advice

User message: "${userMessage}"
Session type: ${sessionType}
${userContext ? `User context: ${JSON.stringify(userContext)}` : ''}

Please provide a helpful, empathetic response that:
1. Acknowledges the user's concern
2. Provides general health information if appropriate
3. Includes relevant recommendations
4. Reminds about consulting healthcare professionals
5. Keeps the response concise but informative

Format your response in a friendly, supportive tone suitable for a health companion app.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating chat response with Gemini:', error);
    
    // Fallback to basic responses if Gemini API fails
    const message = userMessage.toLowerCase();
    
    if (message.includes('headache') || message.includes('head')) {
      return "I understand you're experiencing a headache. Here are some general suggestions:\n\n• Stay hydrated - drink plenty of water\n• Rest in a quiet, dark room\n• Apply a cold or warm compress\n• Consider over-the-counter pain relief\n\nIf your headache is severe, sudden, or accompanied by fever, vision changes, or neck stiffness, please consult a healthcare professional immediately.";
    }
    
    if (message.includes('fever') || message.includes('temperature')) {
      return "Fever can be concerning. Here's what I recommend:\n\n• Monitor your temperature regularly\n• Stay hydrated with water and clear fluids\n• Rest and avoid strenuous activity\n• Use fever reducers as directed\n\nSeek immediate medical attention if fever exceeds 103°F (39.4°C), or if you experience difficulty breathing, chest pain, or severe symptoms.";
    }
    
    if (message.includes('first aid') || message.includes('emergency')) {
      return "I can guide you through various first aid scenarios:\n\n• Cuts and wounds\n• Burns\n• Choking\n• Fainting\n\nFor life-threatening emergencies, call emergency services immediately. Which type of first aid guidance do you need?";
    }
    
    if (message.includes('medicine') || message.includes('medication')) {
      return "I can help you with medication management:\n\n• Set up medication reminders\n• Track your medication schedule\n• Provide information about common medications\n• Help you remember to take your medicines\n\nWhat specific medication help do you need?";
    }
    
    if (message.includes('period') || message.includes('menstrual')) {
      return "I can help you with period tracking and management:\n\n• Track your menstrual cycle\n• Predict your next period\n• Monitor symptoms and mood\n• Provide health insights\n\nWould you like to start tracking your period or get cycle predictions?";
    }
    
    // Default response
    return "Thank you for sharing that with me. While I can provide general health information, I recommend consulting with a healthcare professional for personalized medical advice. Is there anything specific you'd like to know about your symptoms or general health practices?";
  }
};
