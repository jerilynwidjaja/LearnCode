import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, Play, Trophy, Star, Sparkles, Brain, Target, Briefcase, TrendingUp, Award, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { Course, CourseService } from '../../services/courseService';
import ProgressBar from './ProgressBar';

interface CourseCardProps {
  course: Course;
  isRecommended?: boolean;
  onShowRecommendationDetails?: (courseId: number) => void;
  showRecommendationDetails?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  isRecommended = false,
  onShowRecommendationDetails,
  showRecommendationDetails = false
}) => {
  const navigate = useNavigate();

  const getScoreBadge = (score?: number) => {
    if (!score) return null;
    if (score >= 90) return '🎯 Perfect Match';
    if (score >= 80) return '⭐ Excellent Match';
    if (score >= 70) return '👍 Good Match';
    return '✅ Suitable';
  };

  // Safely get question count from multiple possible sources
  const questionCount = course.questions?.length || course.progress?.total || 0;

  return (
    <div className="relative h-full">
      <div
        onClick={() => navigate(`/course/${course.id}`)}
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group h-full flex flex-col ${
          isRecommended && course.aiScore
            ? 'border-purple-300 dark:border-purple-600 ring-2 ring-purple-100 dark:ring-purple-900/30'
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
        }`}
      >
        {/* AI Score Header Badge */}
        {isRecommended && course.aiScore && (
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 text-white mr-2" />
              <span className="text-white font-semibold text-sm">
                {getScoreBadge(course.aiScore)}
              </span>
            </div>
            <span className="text-2xl font-bold text-white">
              {course.aiScore}/100
            </span>
          </div>
        )}

        {/* Course Thumbnail */}
        {course.thumbnail && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-3">
                <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            {/* Level Badge */}
            <div className="absolute top-3 left-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${CourseService.getLevelColor(course.level)}`}>
                {course.level}
              </span>
            </div>
            
            {/* Recommendation Badge */}
            {isRecommended && course.aiScore && (
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <div className="bg-purple-500 text-white rounded-full p-1.5 shadow-lg">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
            )}
            
            {/* Completion Badge */}
            {course.progress?.percentage === 100 && (
              <div className="absolute bottom-3 right-3">
                <div className="bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                  <Trophy className="h-4 w-4" />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 flex-1">
              {course.title}
            </h3>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
            {course.description}
          </p>
          
          {/* Progress Section */}
          {course.progress && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {course.progress.completed}/{course.progress.total} ({course.progress.percentage}%)
                </span>
              </div>
              <ProgressBar percentage={course.progress.percentage} />
            </div>
          )}
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              {course.estimatedHours && (
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {course.estimatedHours}h
                </div>
              )}
            </div>
            
            <div className="flex items-center text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <BookOpen className="h-3 w-3 mr-1" />
              <span className="text-sm">{questionCount} questions</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>

          {/* AI Recommendation Details */}
          {isRecommended && course.aiScore && (
            <div className="mt-4 pt-4 border-t-2 border-purple-200 dark:border-purple-700">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowRecommendationDetails?.(course.id);
                }}
                className="w-full flex items-center justify-between text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 font-medium text-sm transition-colors"
              >
                <span className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Recommendation Details
                </span>
                {showRecommendationDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {showRecommendationDetails && (
                <div 
                  className="mt-4 space-y-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Why Recommended */}
                  {course.aiReasoning && (
                    <div>
                      <div className="flex items-start">
                        <Award className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                            💡 Why Recommended
                          </p>
                          <p className="text-xs text-purple-800 dark:text-purple-300 leading-relaxed">
                            {course.aiReasoning}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Goal Alignment */}
                  {course.aiGoalAlignment && (
                    <div>
                      <div className="flex items-start">
                        <Target className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1">
                            🎯 Goal Alignment
                          </p>
                          <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                            {course.aiGoalAlignment}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Skill Alignment */}
                  {course.aiSkillAlignment && (
                    <div>
                      <div className="flex items-start">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-green-900 dark:text-green-200 mb-1">
                            📊 Skill Match
                          </p>
                          <p className="text-xs text-green-800 dark:text-green-300 leading-relaxed">
                            {course.aiSkillAlignment}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Career Impact */}
                  {course.aiCareerImpact && (
                    <div>
                      <div className="flex items-start">
                        <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                            💼 Career Impact
                          </p>
                          <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                            {course.aiCareerImpact}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Expected Outcome */}
                  {course.aiExpectedOutcome && (
                    <div>
                      <div className="flex items-start">
                        <Trophy className="h-4 w-4 text-pink-600 dark:text-pink-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-pink-900 dark:text-pink-200 mb-1">
                            🏆 Expected Outcome
                          </p>
                          <p className="text-xs text-pink-800 dark:text-pink-300 leading-relaxed">
                            {course.aiExpectedOutcome}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Powered Footer */}
                  <div className="pt-3 border-t border-purple-200 dark:border-purple-700">
                    <div className="flex items-center justify-center text-xs text-purple-600 dark:text-purple-400">
                      <Sparkles className="h-3 w-3 mr-1" />
                      <span className="font-medium">Powered by OpenAI GPT-3.5 Turbo</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;