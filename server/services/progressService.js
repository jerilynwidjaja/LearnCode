import { User, Course, Question, UserProgress } from '../models/index.js';
import { AIRecommendationService } from './aiRecommendationService.js';

export class ProgressService {
  static async getProgressFeedback(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get all courses with questions
    const allCourses = await Course.findAll({ include: [{ model: Question, as: 'questions' }] });
    const userProgress = await UserProgress.findAll({ where: { userId } });

    // Get recommended courses for this user
    const recommendedCoursesResult = await AIRecommendationService.generateRecommendations(
      user,
      allCourses,
      userProgress
    );

    const recommendedCourses = recommendedCoursesResult.recommendations;

    return await AIRecommendationService.generateProgressFeedback(
      user,
      userProgress,
      allCourses,
      recommendedCourses
    );
  }

  static async getLearningPath(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get all courses with questions
    const allCourses = await Course.findAll({ include: [{ model: Question, as: 'questions' }] });
    const userProgress = await UserProgress.findAll({ where: { userId } });

    // Get recommended courses for this user
    const recommendedCoursesResult = await AIRecommendationService.generateRecommendations(
      user,
      allCourses,
      userProgress
    );

    const recommendedCourses = recommendedCoursesResult.recommendations;

    return await AIRecommendationService.generateLearningPath(
      user,
      recommendedCourses,
      userProgress
    );
  }

  static async getSequentialPath(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get all courses with questions
    const allCourses = await Course.findAll({ include: [{ model: Question, as: 'questions' }] });
    const userProgress = await UserProgress.findAll({ where: { userId } });

    // Get recommended courses for this user
    const recommendedCoursesResult = await AIRecommendationService.generateRecommendations(
      user,
      allCourses,
      userProgress
    );

    const recommendedCourses = recommendedCoursesResult.recommendations;

    return await AIRecommendationService.generateSequentialLearningPath(
      user,
      recommendedCourses,
      userProgress
    );
  }

  static async getAnalytics(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get all courses with questions
    const allCourses = await Course.findAll({ include: [{ model: Question, as: 'questions' }] });
    const userProgress = await UserProgress.findAll({ where: { userId } });

    // Get recommended courses for this user
    const recommendedCoursesResult = await AIRecommendationService.generateRecommendations(
      user,
      allCourses,
      userProgress
    );

    const recommendedCourses = recommendedCoursesResult.recommendations;

    // Use AI service to generate analytics
    return await AIRecommendationService.generateAnalytics(
      recommendedCourses,
      userProgress
    );
  }

  static getPriorityColor(priority) {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  }
}