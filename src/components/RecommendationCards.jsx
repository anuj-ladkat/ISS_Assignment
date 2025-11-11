
const RecommendationCards = ({ recommendations }) => {
  const icons = ['💡', '🎯', '✨'];

  return (
    <div className="recommendations-section">
      <h2>Personalized Recommendations</h2>
      <div className="recommendations-grid">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="recommendation-card">
            <div className="card-icon">{icons[index % icons.length]}</div>
            <p>{recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationCards;
