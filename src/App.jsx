import { useState } from 'react';
import './App.css';
import MoodGauge from './components/MoodGauge';
import RecommendationCards from './components/RecommendationCards';
import TagCloud from './components/TagCloud';
import { analyzeStudentWellbeing } from './services/aiService';

function App() {
  const [userInput, setUserInput] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) {
      setError('Please enter how you\'re feeling or what\'s on your mind.');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const result = await analyzeStudentWellbeing(userInput);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUserInput('');
    setAnalysis(null);
    setError('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Lancaster Student Wellbeing Assistant</h1>
        <p>Share how you're feeling, and get personalized support and recommendations</p>
      </header>

      <main className="app-main">
        <div className="input-section">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="userInput">
                How are you feeling? What's on your mind?
              </label>
              <textarea
                id="userInput"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="e.g., I have three assignments due next week and I'm feeling really overwhelmed. I haven't been sleeping well and I'm worried about my grades..."
                rows="5"
                disabled={loading}
              />
            </div>

            <div className="button-group">
              <button 
                type="submit" 
                disabled={loading}
                className="submit-button"
              >
                {loading ? 'Analyzing...' : 'Get Support & Recommendations'}
              </button>
              {analysis && (
                <button 
                  type="button" 
                  onClick={handleReset}
                  className="reset-button"
                >
                  Start Over
                </button>
              )}
            </div>
          </form>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Analyzing your wellbeing...</p>
            </div>
          )}
        </div>

        {analysis && !loading && (
          <div className="results-section">
            <div className="summary-box">
              <h3>Summary</h3>
              <p>{analysis.summary}</p>
            </div>

            <MoodGauge
              mood={analysis.mood}
              stressLevel={analysis.stressLevel}
              workloadLevel={analysis.workloadLevel}
            />

            <TagCloud tags={analysis.tags} />

            <RecommendationCards recommendations={analysis.recommendations} />

            <div className="support-resources">
              <h3>Additional Support</h3>
              <p>Remember, you're not alone! Lancaster University offers:</p>
              <ul>
                <li>Student Wellbeing Service</li>
                <li>Academic Skills Team</li>
                <li>Peer Support Network</li>
                <li>24/7 Crisis Support Line</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built for Lancaster University Students</p>
        <p className="privacy-note">Your data is processed securely and not stored.</p>
      </footer>
    </div>
  );
}

export default App;
