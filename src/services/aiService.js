import axios from 'axios';

// API Configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'groq'; // 'openai' or 'groq'

export const analyzeStudentWellbeing = async (userInput) => {
  // Use mock mode if USE_MOCK is true
  if (USE_MOCK) {
    return getMockAnalysis(userInput);
  }

  // Choose AI provider based on configuration and available keys
  if (AI_PROVIDER === 'groq' && GROQ_API_KEY) {
    return analyzeWithGroq(userInput);
  } else if (AI_PROVIDER === 'openai' && OPENAI_API_KEY) {
    return analyzeWithOpenAI(userInput);
  } else if (GROQ_API_KEY) {
    // Fallback to Groq if available
    return analyzeWithGroq(userInput);
  } else if (OPENAI_API_KEY) {
    // Fallback to OpenAI if available
    return analyzeWithOpenAI(userInput);
  } else {
    // No API keys available, use mock
    console.warn('No API keys configured, using mock mode');
    return getMockAnalysis(userInput);
  }
};

const analyzeWithGroq = async (userInput) => {
  const prompt = `You are a supportive student wellbeing assistant for Lancaster University. 
Analyze the following student input and provide a JSON response with these exact fields:
- mood: a single word describing their mood (e.g., stressed, anxious, motivated, overwhelmed, balanced)
- stressLevel: a number from 1-10 indicating stress level
- workloadLevel: a number from 1-10 indicating workload perception
- tags: an array of 3-5 relevant keywords (e.g., "exams", "social life", "sleep", "deadlines")
- recommendations: an array of exactly 3 specific, actionable recommendations to help them
- summary: a brief 1-2 sentence empathetic summary of their situation

Student input: "${userInput}"

Respond ONLY with valid JSON, no other text.`;

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile', // Using Groq's LLaMA 3.3 70B model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful student wellbeing assistant. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        }
      }
    );

    const content = response.data.choices[0].message.content.trim();
    
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const analysis = JSON.parse(jsonContent);
    
    console.group('Groq API Success');
    console.log('Model: llama-3.3-70b-versatile');
    console.log('Response:', analysis);
    console.groupEnd();
    
    return validateAndNormalizeAnalysis(analysis);
  } catch (error) {
    console.group('Groq API Error');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
    console.log('Falling back to intelligent mock mode');
    console.groupEnd();
    return getMockAnalysis(userInput);
  }
};

const analyzeWithOpenAI = async (userInput) => {
  const prompt = `You are a supportive student wellbeing assistant for Lancaster University. 
Analyze the following student input and provide a JSON response with these exact fields:
- mood: a single word describing their mood (e.g., stressed, anxious, motivated, overwhelmed, balanced)
- stressLevel: a number from 1-10 indicating stress level
- workloadLevel: a number from 1-10 indicating workload perception
- tags: an array of 3-5 relevant keywords (e.g., "exams", "social life", "sleep", "deadlines")
- recommendations: an array of exactly 3 specific, actionable recommendations to help them
- summary: a brief 1-2 sentence empathetic summary of their situation

Student input: "${userInput}"

Respond ONLY with valid JSON, no other text.`;

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful student wellbeing assistant. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const content = response.data.choices[0].message.content.trim();
    
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const analysis = JSON.parse(jsonContent);
    
    return validateAndNormalizeAnalysis(analysis);
  } catch (error) {
    console.group('OpenAI API Error');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
    console.log('Falling back to intelligent mock mode');
    console.groupEnd();
    
    // Handle rate limit - fall back to mock data silently
    if (error.response?.status === 429) {
      const errorMsg = error.response?.data?.error?.message || 'Rate limit exceeded';
      console.warn('Rate Limit Details:', errorMsg);
      console.warn('This usually means:');
      console.warn('   - Too many requests in a short time');
      console.warn('   - Free tier: 3 requests/minute, 200 requests/day');
      console.warn('   - Solution: Wait a minute or use mock mode');
      return getMockAnalysis(userInput);
    }
    
    // Handle invalid API key
    if (error.response?.status === 401) {
      console.warn('Invalid API key - falling back to mock mode');
      return getMockAnalysis(userInput);
    }
    
    // Handle JSON parsing errors
    if (error.message.includes('JSON')) {
      console.warn('Failed to parse AI response - using mock mode');
      return getMockAnalysis(userInput);
    }
    
    // For any other error, fall back to mock data
    console.warn('API error occurred - using mock mode:', error.message);
    return getMockAnalysis(userInput);
  }
};

const getMockAnalysis = (userInput) => {
  const lowerInput = userInput.toLowerCase();
  
  let mood = 'stressed';
  let stressLevel = 7;
  let workloadLevel = 7;
  let tags = ['studying', 'university', 'assignments'];
  
  // Detect high stress indicators
  if (lowerInput.includes('overwhelmed') || lowerInput.includes('too much') || lowerInput.includes('can\'t cope')) {
    mood = 'overwhelmed';
    stressLevel = 9;
    workloadLevel = 9;
    tags = ['overwhelmed', 'deadlines', 'pressure', 'burnout'];
  } else if (lowerInput.includes('anxious') || lowerInput.includes('worried') || lowerInput.includes('nervous')) {
    mood = 'anxious';
    stressLevel = 8;
    workloadLevel = 7;
    tags = ['anxiety', 'worry', 'exams', 'stress'];
  } else if (lowerInput.includes('exam') || lowerInput.includes('test')) {
    mood = 'stressed';
    stressLevel = 8;
    workloadLevel = 8;
    tags = ['exams', 'revision', 'academic pressure', 'deadlines'];
  } else if (lowerInput.includes('sleep') || lowerInput.includes('tired') || lowerInput.includes('exhausted')) {
    mood = 'tired';
    stressLevel = 7;
    workloadLevel = 8;
    tags = ['sleep deprivation', 'fatigue', 'rest', 'health'];
  } else if (lowerInput.includes('lonely') || lowerInput.includes('homesick') || lowerInput.includes('friends')) {
    mood = 'lonely';
    stressLevel = 6;
    workloadLevel = 5;
    tags = ['social', 'homesickness', 'isolation', 'support'];
  } else if (lowerInput.includes('happy') || lowerInput.includes('good') || lowerInput.includes('great')) {
    mood = 'motivated';
    stressLevel = 3;
    workloadLevel = 5;
    tags = ['positive', 'progress', 'balanced', 'wellbeing'];
  }
  
  const recommendations = [
    `Break your tasks into smaller, manageable chunks. Try the Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break. This helps maintain productivity without burnout.`,
    `Reach out to Lancaster's Student Wellbeing Service or your personal tutor. They're here to help and can provide support, extensions, or guidance tailored to your situation.`,
    `Prioritize self-care: ensure you get 7-8 hours of sleep, take regular breaks, and engage in activities you enjoy. Your mental health is just as important as your academic performance.`
  ];
  
  const summary = `Based on your input, you're experiencing ${mood === 'overwhelmed' ? 'significant' : 'moderate'} stress. Remember that it's completely normal to feel this way during university, and there are resources and strategies available to help you manage effectively.`;
  
  return validateAndNormalizeAnalysis({
    mood,
    stressLevel,
    workloadLevel,
    tags,
    recommendations,
    summary
  });
};

export const validateAndNormalizeAnalysis = (analysis) => {
  const parseAndClamp = (value, defaultValue = 5) => {
    const parsed = parseInt(value);
    if (isNaN(parsed)) return defaultValue;
    return Math.min(Math.max(parsed, 1), 10);
  };

  return {
    mood: analysis.mood || 'neutral',
    stressLevel: parseAndClamp(analysis.stressLevel),
    workloadLevel: parseAndClamp(analysis.workloadLevel),
    tags: Array.isArray(analysis.tags) ? analysis.tags.slice(0, 5) : [],
    recommendations: Array.isArray(analysis.recommendations) 
      ? analysis.recommendations.slice(0, 3) 
      : ['Take regular breaks', 'Stay organized', 'Reach out for support'],
    summary: analysis.summary || 'Analysis complete.'
  };
};

export const getStressColor = (level) => {
  if (level <= 3) return '#4caf50'; // Green - low stress
  if (level <= 6) return '#ff9800'; // Orange - moderate stress
  return '#f44336'; // Red - high stress
};

export const getMoodColor = (mood) => {
  const moodColors = {
    happy: '#4caf50',
    motivated: '#2196f3',
    balanced: '#4caf50',
    neutral: '#9e9e9e',
    stressed: '#ff9800',
    anxious: '#ff5722',
    overwhelmed: '#f44336',
    tired: '#795548',
    worried: '#ff9800'
  };
  
  const lowerMood = mood.toLowerCase();
  return moodColors[lowerMood] || '#9e9e9e';
};
