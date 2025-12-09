import React, { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { AuthService, UserPreferences } from '../services/authService';

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<UserPreferences>({
    careerStage: '',
    skills: [],
    learningGoals: [],
    timeAvailability: '',
    level: '',
    yearsOfExperience: 0,
    areasOfStrength: [],
    mentoringExperience: '',
    languagePreferences: [],
    currentLocation: '',
    joinMentorProgram: false,
    mentorRole: '',
    bio: '',
    availability: ''
  });
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();

  const toggleArrayItem = (item: string, field: 'skills' | 'learningGoals' | 'areasOfStrength' | 'languagePreferences') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthService.updatePreferences(formData);
      updateUser({ hasPreferences: true });
      toast.success('Preferences saved successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Set Up Your Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Career Stage
            </label>
            <select
              value={formData.careerStage}
              onChange={(e) => setFormData({ ...formData, careerStage: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select your career stage</option>
              <option value="student">Student</option>
              <option value="early">Early Career</option>
              <option value="mid">Mid Career</option>
              <option value="senior">Senior/Lead</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Years of Coding Experience
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Skills
            </label>
            <div className="space-y-2">
              {['JavaScript', 'Python', 'SQL', 'React', 'Node.js', 'Java', 'C++', 'Machine Learning', 'DevOps'].map((skill) => (
                <label key={skill} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => toggleArrayItem(skill, 'skills')}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Areas of Strength
            </label>
            <div className="space-y-2">
              {['Frontend Development', 'Backend Development', 'Full Stack', 'Mobile Development', 'Machine Learning', 'DevOps', 'Database Design', 'System Design'].map((area) => (
                <label key={area} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.areasOfStrength.includes(area)}
                    onChange={() => toggleArrayItem(area, 'areasOfStrength')}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{area}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Learning Level
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select your level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Learning Goals
            </label>
            <div className="space-y-2">
              {['Web Development', 'Data Science', 'AI/ML', 'Cloud Computing', 'Mobile Development', 'DevOps', 'System Design', 'Database'].map((goal) => (
                <label key={goal} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.learningGoals.includes(goal)}
                    onChange={() => toggleArrayItem(goal, 'learningGoals')}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Availability (per week)
            </label>
            <select
              value={formData.timeAvailability}
              onChange={(e) => setFormData({ ...formData, timeAvailability: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select time commitment</option>
              <option value="1-3">1-3 hours/week</option>
              <option value="4-6">4-6 hours/week</option>
              <option value="7-10">7-10 hours/week</option>
              <option value="10+">10+ hours/week</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language Preferences
            </label>
            <div className="space-y-2">
              {['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Portuguese'].map((lang) => (
                <label key={lang} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.languagePreferences.includes(lang)}
                    onChange={() => toggleArrayItem(lang, 'languagePreferences')}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{lang}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Location
            </label>
            <input
              type="text"
              value={formData.currentLocation}
              onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          {/* Mentor Program Section */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mentor-Mentee Program</h3>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.joinMentorProgram}
                  onChange={(e) => setFormData({ ...formData, joinMentorProgram: e.target.checked })}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  I want to join the mentor-mentee matching program
                </span>
              </label>
            </div>

            {formData.joinMentorProgram && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role Preference
                  </label>
                  <select
                    value={formData.mentorRole}
                    onChange={(e) => setFormData({ ...formData, mentorRole: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select your role</option>
                    <option value="mentor">I want to be a mentor</option>
                    <option value="mentee">I want to be a mentee</option>
                    <option value="both">I'm open to both roles</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mentoring Experience
                  </label>
                  <select
                    value={formData.mentoringExperience}
                    onChange={(e) => setFormData({ ...formData, mentoringExperience: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select your experience</option>
                    <option value="first time">First time</option>
                    <option value="some experience">Some experience</option>
                    <option value="experienced">Experienced mentor</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio (Optional)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Tell others about yourself and your coding journey..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Availability
                  </label>
                  <input
                    type="text"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Weekends and evenings"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserPreferencesModal;