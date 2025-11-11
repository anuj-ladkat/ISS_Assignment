import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { getMoodColor, getStressColor } from '../services/aiService';

const MoodGauge = ({ mood, stressLevel, workloadLevel }) => {
  const stressData = [
    { name: 'Stress', value: stressLevel },
    { name: 'Calm', value: 10 - stressLevel }
  ];

  const workloadData = [
    { name: 'Workload', value: workloadLevel },
    { name: 'Capacity', value: 10 - workloadLevel }
  ];

  const stressColor = getStressColor(stressLevel);
  const moodColor = getMoodColor(mood);

  return (
    <div className="mood-gauge">
      <div className="mood-header">
        <h2>Your Current State</h2>
        <div className="mood-badge" style={{ backgroundColor: moodColor }}>
          {mood}
        </div>
      </div>

      <div className="gauge-container">
        <div className="gauge-item">
          <h3>Stress Level</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stressData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                <Cell fill={stressColor} />
                <Cell fill="#e0e0e0" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="gauge-value">{stressLevel}/10</div>
        </div>

        <div className="gauge-item">
          <h3>Workload Perception</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={workloadData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                <Cell fill="#2196f3" />
                <Cell fill="#e0e0e0" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="gauge-value">{workloadLevel}/10</div>
        </div>
      </div>
    </div>
  );
};

export default MoodGauge;
