import { describe, expect, it } from 'vitest';
import {
    getMoodColor,
    getStressColor,
    validateAndNormalizeAnalysis,
} from '../services/aiService';

describe('aiService', () => {
  describe('validateAndNormalizeAnalysis', () => {
    it('should validate and normalize a complete analysis object', () => {
      const input = {
        mood: 'stressed',
        stressLevel: 8,
        workloadLevel: 9,
        tags: ['exams', 'deadlines', 'sleep'],
        recommendations: [
          'Take regular breaks',
          'Practice mindfulness',
          'Talk to someone',
        ],
        summary: 'You seem to be experiencing high stress.',
      };

      const result = validateAndNormalizeAnalysis(input);

      expect(result).toEqual(input);
    });

    it('should handle missing fields with defaults', () => {
      const input = {};

      const result = validateAndNormalizeAnalysis(input);

      expect(result.mood).toBe('neutral');
      expect(result.stressLevel).toBe(5);
      expect(result.workloadLevel).toBe(5);
      expect(result.tags).toEqual([]);
      expect(result.recommendations).toHaveLength(3);
      expect(result.summary).toBe('Analysis complete.');
    });

    it('should normalize stress level to be between 1 and 10', () => {
      const input1 = { stressLevel: 0 };
      const result1 = validateAndNormalizeAnalysis(input1);
      expect(result1.stressLevel).toBe(1);

      const input2 = { stressLevel: 15 };
      const result2 = validateAndNormalizeAnalysis(input2);
      expect(result2.stressLevel).toBe(10);

      const input3 = { stressLevel: 5 };
      const result3 = validateAndNormalizeAnalysis(input3);
      expect(result3.stressLevel).toBe(5);
    });

    it('should normalize workload level to be between 1 and 10', () => {
      const input1 = { workloadLevel: -5 };
      const result1 = validateAndNormalizeAnalysis(input1);
      expect(result1.workloadLevel).toBe(1);

      const input2 = { workloadLevel: 20 };
      const result2 = validateAndNormalizeAnalysis(input2);
      expect(result2.workloadLevel).toBe(10);
    });

    it('should limit tags to maximum of 5 items', () => {
      const input = {
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7'],
      };

      const result = validateAndNormalizeAnalysis(input);

      expect(result.tags).toHaveLength(5);
      expect(result.tags).toEqual(['tag1', 'tag2', 'tag3', 'tag4', 'tag5']);
    });

    it('should limit recommendations to maximum of 3 items', () => {
      const input = {
        recommendations: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5'],
      };

      const result = validateAndNormalizeAnalysis(input);

      expect(result.recommendations).toHaveLength(3);
      expect(result.recommendations).toEqual(['rec1', 'rec2', 'rec3']);
    });

    it('should handle non-array tags gracefully', () => {
      const input = {
        tags: 'not an array',
      };

      const result = validateAndNormalizeAnalysis(input);

      expect(result.tags).toEqual([]);
    });

    it('should handle non-array recommendations gracefully', () => {
      const input = {
        recommendations: 'not an array',
      };

      const result = validateAndNormalizeAnalysis(input);

      expect(result.recommendations).toHaveLength(3);
      expect(result.recommendations).toEqual([
        'Take regular breaks',
        'Stay organized',
        'Reach out for support',
      ]);
    });
  });

  describe('getStressColor', () => {
    it('should return green for low stress levels (1-3)', () => {
      expect(getStressColor(1)).toBe('#4caf50');
      expect(getStressColor(2)).toBe('#4caf50');
      expect(getStressColor(3)).toBe('#4caf50');
    });

    it('should return orange for moderate stress levels (4-6)', () => {
      expect(getStressColor(4)).toBe('#ff9800');
      expect(getStressColor(5)).toBe('#ff9800');
      expect(getStressColor(6)).toBe('#ff9800');
    });

    it('should return red for high stress levels (7-10)', () => {
      expect(getStressColor(7)).toBe('#f44336');
      expect(getStressColor(8)).toBe('#f44336');
      expect(getStressColor(9)).toBe('#f44336');
      expect(getStressColor(10)).toBe('#f44336');
    });
  });

  describe('getMoodColor', () => {
    it('should return correct colors for positive moods', () => {
      expect(getMoodColor('happy')).toBe('#4caf50');
      expect(getMoodColor('motivated')).toBe('#2196f3');
      expect(getMoodColor('balanced')).toBe('#4caf50');
    });

    it('should return correct colors for negative moods', () => {
      expect(getMoodColor('stressed')).toBe('#ff9800');
      expect(getMoodColor('anxious')).toBe('#ff5722');
      expect(getMoodColor('overwhelmed')).toBe('#f44336');
    });

    it('should return gray for neutral or unknown moods', () => {
      expect(getMoodColor('neutral')).toBe('#9e9e9e');
      expect(getMoodColor('unknown')).toBe('#9e9e9e');
      expect(getMoodColor('randomMood')).toBe('#9e9e9e');
    });

    it('should be case-insensitive', () => {
      expect(getMoodColor('HAPPY')).toBe('#4caf50');
      expect(getMoodColor('Stressed')).toBe('#ff9800');
      expect(getMoodColor('AnXiOuS')).toBe('#ff5722');
    });
  });
});
