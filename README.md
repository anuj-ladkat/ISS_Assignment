# Lancaster Student Wellbeing Assistant

An AI-powered web application designed to support student wellbeing at Lancaster University by analyzing student concerns, visualizing their mental state, and providing personalized recommendations.

## What It Does

The Lancaster Student Wellbeing Assistant addresses a critical challenge in the student journey: **mental health and stress management**. University life often brings overwhelming workloads, exam pressure, social challenges, and adjustment difficulties. Many students struggle to articulate their feelings or don't know where to turn for support.

This application provides:

1. **Instant AI-powered analysis** of student concerns and emotional states
2. **Visual representation** of stress levels, workload perception, and mood through interactive gauges and charts
3. **Personalized, actionable recommendations** tailored to each student's unique situation
4. **Connections to university support resources** to encourage help-seeking behavior

The app creates a safe, judgment-free space where students can express their feelings and receive immediate, empathetic support—a crucial first step in managing wellbeing.

## How It Uses AI

The application integrates **Groq's LLaMA 3.3 70B model** to:

- **Analyze student input** using natural language processing to understand emotions, stress indicators, and contextual concerns
- **Extract structured insights** including mood classification, stress/workload levels (1-10 scale), and relevant topic tags
- **Generate personalized recommendations** based on the specific challenges mentioned by the student
- **Provide empathetic summaries** that validate student feelings and offer understanding

**Why Groq?**

- **Fast responses** - Lightning-fast inference
- **Generous rate limits** - 30 requests/minute (14,400/day)
- **No CORS issues** - Works perfectly in browsers
- **Powerful model** - LLaMA 3.3 70B provides excellent quality responses

The AI acts as a supportive first-line assistant, using its training to recognize common student stressors and suggest evidence-based coping strategies, study techniques, and wellness practices.

## Benefits to the Student Journey

### Immediate Support

- **24/7 availability** - Students can access support anytime, crucial during late-night study sessions or exam periods
- **No wait times** - Instant analysis and recommendations without appointment scheduling

### Self-Awareness & Reflection

- **Visualized insights** help students understand their stress patterns and emotional states
- **Named emotions** - Sometimes students struggle to articulate feelings; the AI helps identify and name what they're experiencing

### Actionable Guidance

- **Specific, practical recommendations** rather than generic advice
- **Personalized to context** - Suggestions consider the student's specific situation (exams, social issues, workload, etc.)

### Gateway to Further Support

- **Reduces stigma** around mental health by normalizing help-seeking
- **Signposts to university resources** like counseling, academic skills support, and peer networks
- **Empowers informed decisions** about when and where to seek professional help

### Privacy & Comfort

- **Anonymous and judgment-free** - Students can be honest without fear
- **No data storage** - Conversations are processed securely and not retained

This tool complements Lancaster University's existing wellbeing services by providing an accessible, low-barrier entry point to support, especially valuable for students who might hesitate to reach out directly.

---

## Getting Started

### Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **Groq API key** (FREE - Get one at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone or download this repository**

```bash
cd student-wellbeing-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` and configure:

**Option A: Use Groq API (Recommended - FREE & Fast)**

```bash
# Get your FREE API key from: https://console.groq.com/keys
VITE_AI_PROVIDER=groq
VITE_GROQ_API_KEY=gsk_your-actual-api-key-here
VITE_USE_MOCK=false
```

**Option B: Use OpenAI API (Paid)**

```bash
# If you prefer OpenAI (has rate limits)
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
VITE_USE_MOCK=false
```

**Option C: Use Mock Mode (Demo/Testing - No API Key Needed)**

```bash
# Set to true to use intelligent mock data
VITE_USE_MOCK=true
```

**How to Get FREE Groq API Key (2 minutes):**

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for free (no credit card required)
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy your key (starts with `gsk_`)
6. Paste it in your `.env` file

**Note**: Mock mode provides intelligent contextual responses based on keyword analysis, perfect for testing and demos without using API credits.

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to `http://localhost:5173` (or the URL shown in your terminal)

---

## How to Use

1. **Start the app** (it's ready to use immediately in mock mode!)
2. **Share your feelings**

   - Type how you're feeling in the text area
   - Be as specific or general as you like
   - Examples:
     - "I have three assignments due next week and I'm feeling really overwhelmed"
     - "I'm homesick and finding it hard to make friends"
     - "Exams are coming up and I can't sleep well"
3. **Get instant support**

   - Click "Get Support & Recommendations"
   - The AI analyzes your input in seconds
4. **Review your results**

   - See your mood classification and stress/workload gauges
   - Read key topics extracted from your concerns
   - Get three personalized recommendations
   - View links to additional university support services
5. **Start over** anytime with the "Start Over" button

---

## Example Input & Output

### Example Input

```
I have three assignments due this week, two exams next week, and I'm working 
part-time. I barely get 5 hours of sleep and I'm constantly worried about 
failing. I feel like I can't keep up with everything.
```

### Example Output

**Mood:** Overwhelmed (displayed with red badge)

**Stress Level:** 9/10 (shown in red gauge)

**Workload Level:** 10/10 (shown in blue gauge)

**Key Topics:**

- assignments
- exams
- sleep deprivation
- work-life balance
- academic pressure

**Personalized Recommendations:**

1. 💡 Break down your tasks into smaller, manageable chunks and prioritize the most urgent assignments. Use the Pomodoro Technique (25-minute focused work sessions) to maintain productivity without burnout.
2. 🎯 Reach out to your tutors about assignment extensions if possible—they're often more understanding than you think. Lancaster's Academic Skills Team can also help you create a realistic study schedule.
3. ✨ Prioritize sleep—even 6-7 hours will dramatically improve your focus and retention. Consider if you can temporarily reduce work hours or speak to Student Support about financial hardship options.

**Summary:**
You're experiencing severe stress from juggling multiple academic deadlines, work commitments, and sleep deprivation. Your feelings of being overwhelmed are valid, and it's important to seek support and prioritize your wellbeing alongside your studies.

---

## 🧪 Running Tests

The application includes comprehensive unit tests for data transformation and validation functions.

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui
```

---

## Project Structure

```
student-wellbeing-app/
├── src/
│   ├── components/
│   │   ├── MoodGauge.jsx          # Visual stress & workload gauges
│   │   ├── RecommendationCards.jsx # Display AI recommendations
│   │   └── TagCloud.jsx            # Show extracted topics
│   ├── services/
│   │   ├── aiService.js            # OpenAI API integration
│   │   └── aiService.test.js       # Unit tests
│   ├── App.jsx                     # Main application component
│   ├── App.css                     # Styling
│   ├── main.jsx                    # Entry point
│   └── setupTests.js               # Test configuration
├── package.json
├── vite.config.js
└── README.md
```

---

## Technologies Used

- **React 19** - Modern UI framework with latest features
- **Vite** - Fast build tool and dev server with hot module replacement
- **Axios** - HTTP client for API calls
- **Recharts** - Data visualization library for interactive gauges
- **Groq API** - Free, fast AI inference with LLaMA 3.3 70B model
- **OpenAI API** - Alternative AI provider (GPT-3.5 Turbo)
- **Vitest** - Lightning-fast unit testing framework
- **React Testing Library** - Component testing utilities

## AI Integration Features

### Supported AI Providers

| Provider            | Cost   | Rate Limit | Speed     | Browser Support |
| ------------------- | ------ | ---------- | --------- | --------------- |
| **Groq**      | FREE   | 30/min     | Very Fast | Yes             |
| **OpenAI**    | Paid  | 3/min      | Fast      | Yes             |
| **Mock Mode** | FREE   | Unlimited  | Instant   | Yes             |

### Why Groq is Recommended

- **Zero cost** - Perfect for students and development
- **Better rate limits** - 10x more requests than OpenAI free tier
- **Fast inference** - Optimized hardware for lightning-fast responses
- **No CORS issues** - Works seamlessly in browser environments
- **Great quality** - LLaMA 3.3 70B provides excellent responses

### Intelligent Fallback System

The app automatically handles API failures:

1. Tries your configured AI provider (Groq or OpenAI)
2. Falls back to alternative provider if available
3. Uses intelligent mock mode as final fallback
4. Never shows errors to users - always provides helpful responses

---

## Privacy & Security

- **No data storage**: User inputs and AI responses are not stored in any database
- **Client-side processing**: The app runs entirely in your browser
- **Secure API calls**: All communications with OpenAI are encrypted (HTTPS)
- **API key safety**: Keys are stored only in your browser session

**Note**: This is a demo application for educational purposes. For real deployment handling sensitive student data, additional security measures, data protection compliance (GDPR), and professional counseling oversight would be required.

---

## Support Resources

If you're experiencing serious mental health concerns, please reach out to:

- **Lancaster University Student Wellbeing Service**: [lancaster.ac.uk/wellbeing](https://www.lancaster.ac.uk/wellbeing)
- **NHS Crisis Support**: Call 111 (select mental health option)
- **Samaritans 24/7 Helpline**: 116 123
- **Student Minds**: [studentminds.org.uk](https://www.studentminds.org.uk)

---

## Future Enhancements

Potential improvements for a production version:

- **Mood tracking over time** - Allow students to log check-ins and visualize wellbeing trends
- **Resource matching** - AI-powered recommendations of specific campus services, workshops, or support groups
- **Peer community** - Anonymous forums for shared experiences and peer support
- **Integration with university systems** - Direct booking of counseling appointments
- **Multilingual support** - Serve international students in their native languages
- **Voice input** - Alternative input method for accessibility
- **Mobile app** - Native iOS/Android versions for on-the-go access

---

## Acknowledgments

- Lancaster University for inspiring student-focused innovation
- OpenAI for providing accessible AI technology
- The student wellbeing community for highlighting these important challenges
