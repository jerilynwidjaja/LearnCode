import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

console.log('Initializing OpenAI client...');
console.log('API Key present:', !!process.env.OPENAI_API_KEY);
console.log('API Key length:', process.env.OPENAI_API_KEY?.length || 0);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('OpenAI client initialized successfully');


export class AIRecommendationService {
  static async generateRecommendations(user, allCourses, userProgress) {
    try {
      console.log('=== Starting AI Recommendations ===');
      
      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        console.warn('⚠️ OpenAI API key not configured, using fallback recommendations');
        return AIRecommendationService.fallbackRecommendations(user, allCourses, userProgress);
      }
      
      console.log('✓ OpenAI API key found');

      const userProfile = {
        level: user.level || 'beginner',
        careerStage: user.careerStage || 'student',
        skills: user.skills || [],
        learningGoals: user.learningGoals || [],
        timeAvailability: user.timeAvailability || '1-3'
      };

      const performanceMetrics = AIRecommendationService.calculatePerformanceMetrics(allCourses, userProgress);

      const courseData = allCourses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        category: course.category,
        tags: course.tags || [],
        estimatedHours: course.estimatedHours,
        totalQuestions: course.questions.length,
        userProgress: performanceMetrics.courseProgress[course.id] || {
          completed: 0,
          total: course.questions.length,
          completionRate: 0
        }
      }));

      const prompt = AIRecommendationService.createRecommendationPrompt(userProfile, courseData, performanceMetrics);

      console.log('✓ Prompt created, calling OpenAI API...');

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert educational AI that provides personalized course recommendations. Analyze user profiles and learning patterns to suggest the most suitable courses. Always respond with valid JSON format. Limit recommendations to exactly 4 courses maximum."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      console.log('✓ OpenAI API call successful');
      console.log('Response content:', completion.choices[0].message.content.substring(0, 200) + '...');
      
      const aiResponse = JSON.parse(completion.choices[0].message.content);
      console.log('✓ JSON parsed successfully');
      console.log('Number of recommendations:', aiResponse.recommendations?.length);
      
      const result = AIRecommendationService.processAIRecommendations(aiResponse, allCourses, userProgress);
      console.log('✓ AI Recommendations processed successfully');
      console.log('=== AI Recommendations Complete ===');
      
      return result;

    } catch (error) {
      console.error('❌ AI Recommendation Error:', error.name);
      console.error('Error message:', error.message);
      if (error.response) {
        console.error('API Response status:', error.response.status);
        console.error('API Response data:', error.response.data);
      }
      if (error.stack) {
        console.error('Stack trace:', error.stack.split('\n').slice(0, 3).join('\n'));
      }
      console.log('→ Falling back to mathematical recommendations');
      return AIRecommendationService.fallbackRecommendations(user, allCourses, userProgress);
    }
  }

  static async generateProgressFeedback(user, userProgress, allCourses, recommendedCourses) {
    try {
      const performanceMetrics = AIRecommendationService.calculatePerformanceMetrics(recommendedCourses, userProgress);
      
      const progressData = {
        overallStats: {
          totalQuestions: performanceMetrics.totalQuestions,
          completedQuestions: performanceMetrics.completedQuestions,
          completionRate: performanceMetrics.overallCompletionRate,
          averageAttempts: performanceMetrics.averageAttempts,
          learningVelocity: performanceMetrics.learningVelocity
        },
        categoryPerformance: performanceMetrics.categoryPerformance,
        recentActivity: performanceMetrics.recentActivity,
        strugglingAreas: performanceMetrics.strugglingAreas,
        strengths: performanceMetrics.strongestCategories
      };

      const feedbackPrompt = AIRecommendationService.createAdvancedFeedbackPrompt(user, progressData);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an advanced AI learning coach with deep expertise in educational psychology, learning science, and personalized instruction. Provide highly sophisticated, data-driven feedback that demonstrates advanced AI capabilities including pattern recognition, predictive analytics, and adaptive learning strategies. Your analysis should be comprehensive, insightful, and clearly AI-generated."
          },
          {
            role: "user",
            content: feedbackPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      });

      return JSON.parse(completion.choices[0].message.content);

    } catch (error) {
      console.error('AI Feedback Error:', error);
      return AIRecommendationService.fallbackDataAnalyticsFeedback(user, userProgress, recommendedCourses);
    }
  }

  static async generateLearningPath(user, recommendedCourses, userProgress) {
    try {
      const performanceMetrics = AIRecommendationService.calculatePerformanceMetrics(recommendedCourses, userProgress);
      
      const pathPrompt = AIRecommendationService.createLearningPathPrompt(user, recommendedCourses, performanceMetrics);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert curriculum designer that creates personalized learning paths. Design structured, progressive learning journeys that build skills systematically using only the provided recommended courses."
          },
          {
            role: "user",
            content: pathPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return JSON.parse(completion.choices[0].message.content);

    } catch (error) {
      console.error('AI Learning Path Error:', error);
      return AIRecommendationService.fallbackMathematicalLearningPath(user, recommendedCourses, userProgress);
    }
  }

  static async generateSequentialLearningPath(user, recommendedCourses, userProgress) {
    try {
      const performanceMetrics = AIRecommendationService.calculatePerformanceMetrics(recommendedCourses, userProgress);
      
      const sequentialPrompt = AIRecommendationService.createSequentialPathPrompt(user, recommendedCourses, performanceMetrics);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert curriculum designer that creates sequential learning paths. Design a step-by-step course sequence that builds knowledge progressively, ensuring each course prepares the student for the next one. Use only the provided recommended courses."
          },
          {
            role: "user",
            content: sequentialPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2500
      });

      return JSON.parse(completion.choices[0].message.content);

    } catch (error) {
      console.error('AI Sequential Learning Path Error:', error);
      return AIRecommendationService.fallbackMathematicalSequentialPath(user, recommendedCourses, userProgress);
    }
  }

  static async generateAnalytics(recommendedCourses, userProgress) {
    try {
      const performanceMetrics = AIRecommendationService.calculatePerformanceMetrics(recommendedCourses, userProgress);
      
      // Calculate category breakdown
      const categoryBreakdown = {};
      recommendedCourses.forEach(course => {
        const courseProgress = userProgress.filter(p => p.courseId === course.id);
        const completed = courseProgress.filter(p => p.completed).length;
        const total = course.questions.length;
        
        if (!categoryBreakdown[course.category]) {
          categoryBreakdown[course.category] = { completed: 0, total: 0 };
        }
        categoryBreakdown[course.category].completed += completed;
        categoryBreakdown[course.category].total += total;
      });

      // Calculate difficulty breakdown
      const difficultyBreakdown = { easy: { completed: 0, total: 0 }, medium: { completed: 0, total: 0 }, hard: { completed: 0, total: 0 } };
      recommendedCourses.forEach(course => {
        course.questions.forEach(question => {
          const difficulty = question.difficulty || 'medium';
          const questionProgress = userProgress.find(p => p.questionId === question.id);
          
          if (difficultyBreakdown[difficulty]) {
            difficultyBreakdown[difficulty].total += 1;
            if (questionProgress && questionProgress.completed) {
              difficultyBreakdown[difficulty].completed += 1;
            }
          }
        });
      });

      // Get recent activity
      const recentActivity = userProgress
        .filter(p => p.completedAt || p.attempts > 0)
        .sort((a, b) => {
          const dateA = new Date(a.completedAt || a.updatedAt || 0);
          const dateB = new Date(b.completedAt || b.updatedAt || 0);
          return dateB - dateA;
        })
        .slice(0, 10)
        .map(progress => {
          const course = recommendedCourses.find(c => c.id === progress.courseId);
          const question = course?.questions.find(q => q.id === progress.questionId);
          return {
            questionTitle: question?.title || 'Unknown Question',
            courseTitle: course?.title || 'Unknown Course',
            completed: progress.completed || false,
            attempts: progress.attempts || 0,
            date: progress.completedAt || progress.updatedAt || new Date().toISOString()
          };
        });

      // Calculate learning streak
      const learningStreak = AIRecommendationService.calculateLearningStreak(userProgress);

      return {
        completionRate: performanceMetrics.overallCompletionRate,
        completedQuestions: performanceMetrics.completedQuestions,
        totalQuestions: performanceMetrics.totalQuestions,
        averageAttempts: performanceMetrics.averageAttempts,
        learningStreak,
        categoryBreakdown,
        difficultyBreakdown,
        recentActivity
      };

    } catch (error) {
      console.error('Analytics Generation Error:', error);
      return AIRecommendationService.fallbackAnalytics(recommendedCourses, userProgress);
    }
  }

  static calculateLearningStreak(userProgress) {
    const completedDates = userProgress
      .filter(p => p.completedAt)
      .map(p => new Date(p.completedAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b) - new Date(a));

    if (completedDates.length === 0) return 0;

    let streak = 1;
    for (let i = 0; i < completedDates.length - 1; i++) {
      const current = new Date(completedDates[i]);
      const next = new Date(completedDates[i + 1]);
      const diffDays = Math.floor((current - next) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  static createAdvancedFeedbackPrompt(user, progressData) {
    return `
As an advanced AI learning coach, perform a comprehensive analysis of this student's learning patterns and provide sophisticated, data-driven feedback:

STUDENT PROFILE:
- Level: ${user.level || 'beginner'}
- Career Stage: ${user.careerStage || 'student'}
- Learning Goals: ${(user.learningGoals || []).join(', ') || 'General programming'}

ADVANCED ANALYTICS:
- Completion Rate: ${progressData.overallStats.completionRate}% (Recommended courses only)
- Questions Mastered: ${progressData.overallStats.completedQuestions}/${progressData.overallStats.totalQuestions}
- Learning Efficiency: ${progressData.overallStats.averageAttempts} avg attempts per question
- Learning Velocity: ${progressData.overallStats.learningVelocity}

PERFORMANCE PATTERNS:
${progressData.categoryPerformance.map(cat => `- ${cat.category}: ${cat.rate}% mastery rate`).join('\n')}

COGNITIVE STRENGTHS: ${progressData.strengths.join(', ')}
LEARNING CHALLENGES: ${progressData.strugglingAreas.join(', ')}

Provide advanced AI feedback in this JSON format:
{
  "aiAnalysis": {
    "learningPatternRecognition": "Advanced pattern analysis of learning behavior",
    "cognitiveLoadAssessment": "Analysis of mental processing capacity and optimization",
    "adaptiveLearningRecommendations": "AI-driven personalization strategies"
  },
  "predictiveInsights": {
    "learningTrajectory": "Predicted learning path based on current patterns",
    "potentialChallenges": ["AI-identified future learning obstacles"],
    "optimizationOpportunities": ["Data-driven improvement suggestions"]
  },
  "personalizedStrategies": {
    "cognitiveApproach": "Tailored learning methodology based on cognitive profile",
    "timeOptimization": "AI-calculated optimal study scheduling",
    "difficultyProgression": "Intelligent difficulty scaling recommendations"
  },
  "motivationalPsychology": {
    "intrinsicMotivators": ["Identified internal motivation drivers"],
    "achievementFramework": "Personalized goal-setting strategy",
    "confidenceBuilding": "Targeted confidence enhancement approach"
  },
  "dataInsights": {
    "learningEfficiencyScore": "Quantified learning effectiveness rating",
    "progressPrediction": "AI forecast of future learning outcomes",
    "recommendedAdjustments": ["Specific algorithmic recommendations"]
  },
  "encouragement": "Sophisticated, personalized motivational message demonstrating AI understanding"
}

Make the feedback clearly demonstrate advanced AI capabilities including:
- Pattern recognition across multiple data dimensions
- Predictive analytics and forecasting
- Cognitive load theory application
- Adaptive learning algorithm insights
- Personalized psychological profiling
- Data-driven optimization strategies
`;
  }

  static createRecommendationPrompt(userProfile, courseData, performanceMetrics) {
    return `
Analyze this user's learning profile and recommend exactly 4 courses maximum:

USER PROFILE:
- Level: ${userProfile.level}
- Career Stage: ${userProfile.careerStage}
- Current Skills: ${userProfile.skills.join(', ') || 'None specified'}
- Learning Goals: ${userProfile.learningGoals.join(', ') || 'None specified'}
- Time Availability: ${userProfile.timeAvailability} hours/week

PERFORMANCE METRICS:
- Overall Completion Rate: ${performanceMetrics.overallCompletionRate}%
- Strongest Categories: ${performanceMetrics.strongestCategories.join(', ')}
- Areas for Improvement: ${performanceMetrics.improvementAreas.join(', ')}
- Learning Velocity: ${performanceMetrics.learningVelocity}

AVAILABLE COURSES:
${JSON.stringify(courseData, null, 2)}

Please recommend exactly 4 courses and respond in this JSON format:
{
  "recommendations": [
    {
      "courseId": 1,
      "score": 95,
      "reasoning": "Detailed explanation of why this course is recommended",
      "factors": {
        "goalAlignment": 90,
        "levelMatch": 85,
        "skillBuilding": 95,
        "progressOptimization": 80,
        "timeCommitment": 75
      },
      "learningPath": "Explanation of how this fits into their learning journey"
    }
  ],
  "overallStrategy": "Brief explanation of the recommended learning strategy"
}

IMPORTANT: Recommend exactly 4 courses maximum, prioritizing quality over quantity.
`;
  }

  static createLearningPathPrompt(user, recommendedCourses, performanceMetrics) {
    return `
Create a personalized learning path using ONLY the recommended courses:

STUDENT PROFILE:
- Level: ${user.level || 'beginner'}
- Career Stage: ${user.careerStage || 'student'}
- Skills: ${(user.skills || []).join(', ') || 'None specified'}
- Learning Goals: ${(user.learningGoals || []).join(', ') || 'General programming'}
- Time Availability: ${user.timeAvailability || '1-3'} hours/week

RECOMMENDED COURSES ONLY:
${recommendedCourses.map(course => `- ${course.title} (${course.level}, ${course.category}, ${course.estimatedHours}h)`).join('\n')}

CURRENT PROGRESS:
${Object.entries(performanceMetrics.courseProgress).map(([courseId, progress]) => {
  const course = recommendedCourses.find(c => c.id == courseId);
  return `- ${course?.title || 'Unknown'}: ${progress.completionRate}%`;
}).join('\n')}

Create a learning path using ONLY these recommended courses in this JSON format:
{
  "pathTitle": "Descriptive title for the learning path",
  "description": "Brief description of the learning journey",
  "estimatedDuration": "Total estimated time to complete",
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase title",
      "description": "What this phase covers",
      "duration": "Estimated time for this phase",
      "courses": [
        {
          "courseId": 1,
          "title": "Course title",
          "priority": "high/medium/low",
          "reasoning": "Why this course is included in this phase"
        }
      ],
      "learningObjectives": ["What they'll learn in this phase"],
      "prerequisites": ["What they need before starting this phase"]
    }
  ],
  "tips": ["General tips for following this learning path"],
  "milestones": ["Key milestones to track progress"]
}

Use ONLY the provided recommended courses. Design a progressive path that builds skills systematically.
`;
  }

  static createSequentialPathPrompt(user, recommendedCourses, performanceMetrics) {
    return `
Create a sequential learning path using ONLY the recommended courses:

STUDENT PROFILE:
- Level: ${user.level || 'beginner'}
- Career Stage: ${user.careerStage || 'student'}
- Skills: ${(user.skills || []).join(', ') || 'None specified'}
- Learning Goals: ${(user.learningGoals || []).join(', ') || 'General programming'}
- Time Availability: ${user.timeAvailability || '1-3'} hours/week

RECOMMENDED COURSES ONLY:
${recommendedCourses.map(course => `- ID: ${course.id}, Title: "${course.title}", Level: ${course.level}, Category: ${course.category}, Hours: ${course.estimatedHours}, Questions: ${course.questions.length}`).join('\n')}

CURRENT PROGRESS:
${Object.entries(performanceMetrics.courseProgress).map(([courseId, progress]) => {
  const course = recommendedCourses.find(c => c.id == courseId);
  return `- ${course?.title || 'Unknown'}: ${progress.completionRate}% complete`;
}).join('\n')}

Create a sequential learning path using ONLY these recommended courses in this JSON format:
{
  "pathTitle": "Personalized Sequential Learning Journey",
  "description": "A step-by-step course sequence tailored to your goals",
  "totalEstimatedDuration": "Total time to complete all courses",
  "difficultyProgression": "How difficulty increases through the sequence",
  "courseSequence": [
    {
      "step": 1,
      "courseId": 1,
      "courseTitle": "Course Name",
      "level": "beginner",
      "category": "Programming",
      "estimatedHours": 6,
      "priority": "high",
      "reasoning": "Why this course comes first in the sequence",
      "prerequisites": ["What knowledge is needed before starting"],
      "learningOutcomes": ["What you'll achieve after completing this course"],
      "preparesFor": ["Which subsequent courses this enables"],
      "keySkills": ["Main skills developed in this course"],
      "currentProgress": 0
    }
  ],
  "learningStrategy": "Overall approach and methodology for this path",
  "milestones": [
    {
      "afterCourse": 1,
      "achievement": "What you'll have accomplished",
      "nextSteps": "What becomes possible next"
    }
  ],
  "tips": ["Study tips for following this sequential path"],
  "timeManagement": {
    "weeklySchedule": "Recommended weekly time distribution",
    "pacing": "How to pace through the courses",
    "breaks": "When to take breaks between courses"
  }
}

IMPORTANT: Use ONLY the provided recommended courses. Order them logically from foundational to advanced.
`;
  }

  static calculatePerformanceMetrics(courses, userProgress) {
    const categoryPerformance = {};
    let totalQuestions = 0;
    let completedQuestions = 0;
    let totalAttempts = 0;
    const courseProgress = {};
    const strugglingAreas = [];

    courses.forEach(course => {
      const courseProgressData = userProgress.filter(p => p.courseId === course.id);
      const completed = courseProgressData.filter(p => p.completed).length;
      const total = course.questions.length;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;
      const attempts = courseProgressData.reduce((sum, p) => sum + p.attempts, 0);

      courseProgress[course.id] = { completed, total, completionRate, attempts };
      totalQuestions += total;
      completedQuestions += completed;
      totalAttempts += attempts;

      if (course.category) {
        if (!categoryPerformance[course.category]) {
          categoryPerformance[course.category] = { completed: 0, total: 0, attempts: 0 };
        }
        categoryPerformance[course.category].completed += completed;
        categoryPerformance[course.category].total += total;
        categoryPerformance[course.category].attempts += attempts;
      }

      if (attempts > completed * 3 && completed > 0) {
        strugglingAreas.push(course.category);
      }
    });

    const categoryRates = Object.entries(categoryPerformance).map(([category, data]) => ({
      category,
      rate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      avgAttempts: data.completed > 0 ? data.attempts / data.completed : 0
    }));

    const strongestCategories = categoryRates
      .filter(c => c.rate >= 60)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 3)
      .map(c => c.category);

    const improvementAreas = categoryRates
      .filter(c => c.rate < 40 && c.rate > 0)
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 3)
      .map(c => c.category);

    const recentProgress = userProgress
      .filter(p => p.completedAt && new Date(p.completedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .length;

    return {
      overallCompletionRate: totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0,
      strongestCategories,
      improvementAreas,
      learningVelocity: AIRecommendationService.calculateLearningVelocity(userProgress),
      courseProgress,
      categoryPerformance: categoryRates,
      totalQuestions,
      completedQuestions,
      averageAttempts: completedQuestions > 0 ? Math.round(totalAttempts / completedQuestions * 10) / 10 : 0,
      recentActivity: recentProgress,
      strugglingAreas: [...new Set(strugglingAreas)]
    };
  }

  static calculateLearningVelocity(userProgress) {
    const recentProgress = userProgress
      .filter(p => p.completedAt && new Date(p.completedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .length;
    
    if (recentProgress >= 10) return 'High';
    if (recentProgress >= 5) return 'Medium';
    return 'Low';
  }

  static processAIRecommendations(aiResponse, allCourses, userProgress) {
    const recommendations = aiResponse.recommendations.slice(0, 4).map(rec => {
      const course = allCourses.find(c => c.id === rec.courseId);
      if (!course) return null;

      const courseProgress = userProgress.filter(p => p.courseId === course.id);
      const totalQuestions = course.questions.length;
      const completedQuestions = courseProgress.filter(p => p.completed).length;
      const progressPercentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

      const processedCourse = {
        ...course.toJSON(),
        progress: {
          completed: completedQuestions,
          total: totalQuestions,
          percentage: progressPercentage
        },
        // Flatten recommendation data to course level for frontend
        aiScore: rec.score,
        aiReasoning: rec.reasoning,
        aiLearningPath: rec.learningPath,
        // Extract specific factor insights
        aiGoalAlignment: `${rec.factors.goalAlignment}% match with your learning goals`,
        aiSkillAlignment: `${rec.factors.skillBuilding}% skill development potential`,
        aiCareerImpact: `${rec.factors.levelMatch}% appropriate for your ${course.level} level`,
        aiExpectedOutcome: rec.learningPath,
        // Keep full recommendation object for backward compatibility
        recommendation: {
          score: rec.score,
          reasoning: rec.reasoning,
          factors: Object.entries(rec.factors).map(([name, score]) => ({
            name: name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            score,
            weight: AIRecommendationService.getFactorWeight(name)
          })),
          learningPath: rec.learningPath,
          aiGenerated: true
        }
      };
      
      console.log(`Course ${course.id} recommendation:`, {
        title: course.title,
        score: rec.score,
        hasAiScore: !!processedCourse.aiScore,
        aiScore: processedCourse.aiScore
      });
      
      return processedCourse;
    }).filter(Boolean);

    console.log('✓ Total recommendations processed:', recommendations.length);
    console.log('Sample recommendation structure:', recommendations[0] ? {
      id: recommendations[0].id,
      title: recommendations[0].title,
      hasAiScore: !!recommendations[0].aiScore,
      aiScore: recommendations[0].aiScore,
      hasRecommendation: !!recommendations[0].recommendation
    } : 'No recommendations');

    return {
      recommendations,
      strategy: aiResponse.overallStrategy,
      metadata: {
        aiUsed: true,
        algorithm: 'OpenAI GPT-3.5 Turbo',
        generatedAt: new Date().toISOString(),
        model: 'AI-Powered Personalized Learning'
      }
    };
  }

  static getFactorWeight(factorName) {
    const weights = {
      goalAlignment: 35,
      levelMatch: 25,
      skillBuilding: 20,
      progressOptimization: 15,
      timeCommitment: 5
    };
    return weights[factorName] || 10;
  }

  static fallbackMathematicalSequentialPath(user, recommendedCourses, userProgress) {
    const sortedCourses = recommendedCourses.sort((a, b) => {
      const levelOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
      const levelDiff = levelOrder[a.level] - levelOrder[b.level];
      if (levelDiff !== 0) return levelDiff;
      return a.estimatedHours - b.estimatedHours;
    });

    const courseSequence = sortedCourses.map((course, index) => {
      const courseProgress = userProgress.filter(p => p.courseId === course.id);
      const completedQuestions = courseProgress.filter(p => p.completed).length;
      const totalQuestions = course.questions.length;
      const currentProgress = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

      return {
        step: index + 1,
        courseId: course.id,
        courseTitle: course.title,
        level: course.level,
        category: course.category,
        estimatedHours: course.estimatedHours,
        priority: index < 2 ? 'high' : index < 3 ? 'medium' : 'low',
        reasoning: `Step ${index + 1} in your learning journey - builds ${index === 0 ? 'foundational' : 'progressive'} skills for subsequent courses`,
        prerequisites: index === 0 ? ['Basic computer literacy'] : [`Complete "${sortedCourses[index - 1].title}"`],
        learningOutcomes: [
          `Master ${course.category} concepts at ${course.level} level`,
          'Build problem-solving skills',
          'Apply learned concepts to real-world scenarios'
        ],
        preparesFor: index < sortedCourses.length - 1 
          ? [`"${sortedCourses[index + 1].title}"`, 'More advanced topics']
          : ['Advanced projects', 'Professional development'],
        keySkills: course.tags || [course.category, course.level + ' programming'],
        currentProgress
      };
    });

    const totalHours = sortedCourses.reduce((sum, c) => sum + c.estimatedHours, 0);
    const milestones = [];
    
    if (sortedCourses.length > 0) {
      milestones.push({
        afterCourse: 1,
        achievement: `Programming fundamentals mastered - ${sortedCourses[0].category} basics complete`,
        nextSteps: sortedCourses.length > 1 ? `Ready for "${sortedCourses[1].title}"` : 'Apply skills to projects'
      });
    }
    
    if (sortedCourses.length > 1) {
      const midPoint = Math.floor(sortedCourses.length / 2);
      milestones.push({
        afterCourse: midPoint + 1,
        achievement: `Intermediate concepts understood - ${sortedCourses[midPoint].category} proficiency achieved`,
        nextSteps: sortedCourses.length > midPoint + 1 ? 'Advanced topics ahead' : 'Ready for complex projects'
      });
    }
    
    if (sortedCourses.length > 2) {
      milestones.push({
        afterCourse: sortedCourses.length,
        achievement: 'Complete learning path - ready for professional development',
        nextSteps: 'Build portfolio projects, contribute to open source, pursue certifications'
      });
    }

    return {
      pathTitle: "Your Personalized Sequential Learning Journey",
      description: `A carefully structured progression through ${sortedCourses.length} recommended courses, designed to build your skills from foundational to advanced concepts`,
      totalEstimatedDuration: `${totalHours} hours (approximately ${Math.ceil(totalHours / (parseFloat(user.timeAvailability) || 2))} weeks)`,
      difficultyProgression: "Progressive: Beginner foundations → Intermediate concepts → Advanced mastery",
      courseSequence,
      learningStrategy: "Follow the sequential order to build skills progressively. Each course prepares you for the next, ensuring a solid foundation before advancing to complex topics.",
      milestones,
      tips: [
        "Complete courses in order - each builds on previous knowledge",
        "Practice consistently - aim for daily coding sessions",
        "Build small projects after each course to reinforce learning",
        "Join coding communities for support and collaboration",
        "Review previous concepts periodically to maintain retention"
      ],
      timeManagement: {
        weeklySchedule: `Dedicate ${user.timeAvailability || '2-3'} hours per week - consistency is key`,
        pacing: "Complete one course fully before starting the next to maintain focus and depth",
        breaks: "Take 1-2 days break between courses to review and consolidate learning"
      }
    };
  }

  static fallbackMathematicalLearningPath(user, recommendedCourses, userProgress) {
    const beginnerCourses = recommendedCourses.filter(c => c.level === 'beginner');
    const intermediateCourses = recommendedCourses.filter(c => c.level === 'intermediate');
    const advancedCourses = recommendedCourses.filter(c => c.level === 'advanced');
    
    const phases = [];
    
    if (beginnerCourses.length > 0) {
      phases.push({
        phaseNumber: 1,
        title: "Foundation Building",
        description: "Master the basics with recommended beginner courses - establish core programming concepts",
        duration: `${beginnerCourses.length * 2}-${beginnerCourses.length * 3} weeks`,
        courses: beginnerCourses.map(course => ({
          courseId: course.id,
          title: course.title,
          priority: "high",
          reasoning: `Essential foundation in ${course.category} - builds core skills needed for advancement`
        })),
        learningObjectives: [
          "Master basic syntax and programming constructs",
          "Develop fundamental problem-solving skills",
          "Build confidence through hands-on practice"
        ],
        prerequisites: ["Basic computer literacy", "Willingness to learn"]
      });
    }
    
    if (intermediateCourses.length > 0) {
      phases.push({
        phaseNumber: phases.length + 1,
        title: "Skill Development",
        description: "Build intermediate skills and deepen understanding of core concepts",
        duration: `${intermediateCourses.length * 3}-${intermediateCourses.length * 4} weeks`,
        courses: intermediateCourses.map(course => ({
          courseId: course.id,
          title: course.title,
          priority: "medium",
          reasoning: `Intermediate ${course.category} skills - bridges fundamentals to advanced topics`
        })),
        learningObjectives: [
          "Apply advanced programming concepts",
          "Solve real-world problems with code",
          "Develop algorithmic thinking"
        ],
        prerequisites: [`Complete Phase ${phases.length}`, "Strong foundation in basics"]
      });
    }
    
    if (advancedCourses.length > 0) {
      phases.push({
        phaseNumber: phases.length + 1,
        title: "Advanced Mastery",
        description: "Master advanced concepts and prepare for professional development",
        duration: `${advancedCourses.length * 4}-${advancedCourses.length * 5} weeks`,
        courses: advancedCourses.map(course => ({
          courseId: course.id,
          title: course.title,
          priority: "low",
          reasoning: `Advanced ${course.category} mastery - professional-level expertise`
        })),
        learningObjectives: [
          "Master expert-level concepts",
          "Solve complex programming challenges",
          "Prepare for professional roles"
        ],
        prerequisites: ["Complete all previous phases", "Strong intermediate skills"]
      });
    }

    const totalEstimatedWeeks = phases.reduce((sum, phase) => {
      const match = phase.duration.match(/(\d+)-(\d+)/);
      return sum + (match ? parseInt(match[2]) : 4);
    }, 0);

    return {
      pathTitle: "Your Structured Learning Path",
      description: `A systematic ${phases.length}-phase approach to mastering programming with ${recommendedCourses.length} carefully selected courses`,
      estimatedDuration: `${Math.floor(totalEstimatedWeeks / 4)}-${Math.ceil(totalEstimatedWeeks / 4)} months`,
      phases,
      tips: [
        "Follow phases sequentially for optimal learning progression",
        "Practice regularly - consistency beats intensity",
        "Build projects to apply what you learn",
        "Join study groups or coding communities",
        "Review and revisit earlier concepts periodically"
      ],
      milestones: [
        "Complete Phase 1: Programming fundamentals mastered",
        `Complete Phase ${Math.min(2, phases.length)}: Intermediate proficiency achieved`,
        `Complete all phases: Ready for professional development`
      ]
    };
  }

  static fallbackDataAnalyticsFeedback(user, userProgress, recommendedCourses) {
    const performanceMetrics = AIRecommendationService.calculatePerformanceMetrics(recommendedCourses, userProgress);
    const totalQuestions = performanceMetrics.totalQuestions;
    const completedQuestions = performanceMetrics.completedQuestions;
    const completionRate = performanceMetrics.overallCompletionRate;
    const avgAttempts = performanceMetrics.averageAttempts;
    const recentProgress = performanceMetrics.recentActivity;

    const strongCategories = performanceMetrics.strongestCategories;
    const weakCategories = performanceMetrics.improvementAreas;

    return {
      aiAnalysis: {
        learningPatternRecognition: `Data analysis shows ${completionRate}% completion rate with ${avgAttempts} average attempts per question, indicating ${avgAttempts < 2 ? 'efficient' : avgAttempts < 3 ? 'moderate' : 'developing'} learning patterns. Your approach demonstrates ${avgAttempts < 2.5 ? 'strong analytical skills' : 'steady progress with room for optimization'}.`,
        cognitiveLoadAssessment: `Based on attempt patterns, cognitive load appears ${avgAttempts < 2 ? 'optimal - you grasp concepts quickly' : avgAttempts < 4 ? 'manageable with good comprehension' : 'challenging - consider breaking down complex topics'}. ${avgAttempts > 3 ? 'Adjusting difficulty progression may help.' : 'Current pace supports effective learning.'}`,
        adaptiveLearningRecommendations: `Analytics suggest ${recentProgress > 5 ? 'maintaining your excellent pace' : recentProgress > 2 ? 'continuing steady progress' : 'increasing study frequency'} for optimal learning outcomes. ${strongCategories.length > 0 ? `Leverage your strength in ${strongCategories[0]} to tackle related challenges.` : 'Focus on building consistent practice habits.'}`
      },
      predictiveInsights: {
        learningTrajectory: `Current trajectory suggests ${completionRate > 70 ? 'excellent' : completionRate > 50 ? 'good' : completionRate > 25 ? 'developing' : 'early-stage'} progress toward mastery. ${completionRate > 60 ? 'You\'re on track to achieve your learning goals ahead of schedule.' : 'Consistent effort will accelerate your progress significantly.'}`,
        potentialChallenges: weakCategories.length > 0 
          ? [`Building proficiency in ${weakCategories.join(' and ')}`, 'Maintaining consistency as complexity increases']
          : ["Maintaining momentum as topics advance", "Balancing breadth and depth of learning"],
        optimizationOpportunities: [
          weakCategories.length > 0 ? `Focus additional practice on ${weakCategories[0]} concepts` : 'Explore advanced topics in your strong areas',
          avgAttempts > 3 ? 'Break down complex problems into smaller steps' : 'Challenge yourself with harder problems',
          recentProgress < 3 ? 'Increase practice frequency for better retention' : 'Maintain current learning rhythm'
        ]
      },
      personalizedStrategies: {
        cognitiveApproach: avgAttempts > 3 
          ? "Break complex problems into smaller, manageable steps. Use pseudocode before coding. Review fundamentals regularly."
          : avgAttempts > 2
          ? "Continue your analytical approach. Add more challenging problems to deepen understanding."
          : "Your efficient problem-solving is excellent. Ready for more advanced concepts.",
        timeOptimization: `Based on current pace, ${recentProgress < 3 ? 'allocate 30-45 minutes daily' : recentProgress < 6 ? 'maintain 20-30 minutes daily' : 'continue your excellent routine'} for consistent progress. ${recentProgress > 5 ? 'Your frequency is ideal for retention.' : 'More frequent practice will boost retention significantly.'}`,
        difficultyProgression: completionRate > 80 
          ? "Ready for more challenging content - consider advanced courses"
          : completionRate > 60
          ? "Solid progress - mix current level with occasional harder challenges"
          : "Consolidate current level concepts before advancing"
      },
      motivationalPsychology: {
        intrinsicMotivators: strongCategories.length > 0 
          ? [`Success in ${strongCategories.join(' and ')}`, "Problem-solving achievements", "Skill mastery progress"]
          : ["Learning new concepts", "Overcoming challenges", "Building programming skills"],
        achievementFramework: `Target ${Math.min(completionRate + 20, 95)}% completion rate over the next ${completionRate < 50 ? '4-6' : '2-4'} weeks. ${completionRate > 50 ? 'You\'re making excellent progress!' : 'Consistent effort will show rapid improvement.'}`,
        confidenceBuilding: strongCategories.length > 0 
          ? `Build on your demonstrated strengths in ${strongCategories[0]}. Apply these skills to new challenges for confidence growth.`
          : "Focus on incremental wins. Each solved problem builds your capability and confidence."
      },
      dataInsights: {
        learningEfficiencyScore: `${Math.max(20, Math.min(100, Math.round(100 - (avgAttempts - 1) * 15)))}/100`,
        progressPrediction: totalQuestions > completedQuestions
          ? `Projected to complete current courses in ${Math.ceil((totalQuestions - completedQuestions) / Math.max(1, recentProgress / 7))} weeks at current pace`
          : "All current courses complete - ready for new challenges!",
        recommendedAdjustments: avgAttempts > 3 
          ? ["Review fundamentals before tackling new problems", "Use more examples and practice problems", "Consider video tutorials for complex topics"]
          : avgAttempts > 2
          ? ["Maintain current approach", "Add occasional harder challenges"]
          : ["Excellent efficiency - ready for advanced material", "Consider mentoring others to deepen understanding"]
      },
      encouragement: completionRate > 70
        ? `Outstanding progress at ${completionRate}%! ${strongCategories.length > 0 ? `Your mastery of ${strongCategories[0]} is impressive.` : 'Your dedication is paying off!'} You're well on your way to achieving your programming goals. Keep up this excellent momentum!`
        : completionRate > 40
        ? `Solid progress at ${completionRate}%! ${strongCategories.length > 0 ? `You're excelling in ${strongCategories[0]} - great work!` : 'You\'re building strong foundations!'} Stay consistent, and you'll see continued improvement. You've got this!`
        : `You're building your foundation with ${completionRate}% progress. ${strongCategories.length > 0 ? `Your ${strongCategories[0]} skills are developing well!` : 'Every problem solved is progress!'} Consistent practice will accelerate your growth. Keep pushing forward - breakthrough moments are ahead!`
    };
  }

  static fallbackAnalytics(recommendedCourses, userProgress) {
    const performanceMetrics = AIRecommendationService.calculatePerformanceMetrics(recommendedCourses, userProgress);
    
    const categoryBreakdown = {};
    recommendedCourses.forEach(course => {
      const courseProgress = userProgress.filter(p => p.courseId === course.id);
      const completed = courseProgress.filter(p => p.completed).length;
      const total = course.questions.length;
      
      if (!categoryBreakdown[course.category]) {
        categoryBreakdown[course.category] = { completed: 0, total: 0 };
      }
      categoryBreakdown[course.category].completed += completed;
      categoryBreakdown[course.category].total += total;
    });

    const difficultyBreakdown = { easy: { completed: 0, total: 0 }, medium: { completed: 0, total: 0 }, hard: { completed: 0, total: 0 } };
    recommendedCourses.forEach(course => {
      course.questions.forEach(question => {
        const difficulty = question.difficulty || 'medium';
        const questionProgress = userProgress.find(p => p.questionId === question.id);
        
        if (difficultyBreakdown[difficulty]) {
          difficultyBreakdown[difficulty].total += 1;
          if (questionProgress && questionProgress.completed) {
            difficultyBreakdown[difficulty].completed += 1;
          }
        }
      });
    });

    const recentActivity = userProgress
      .filter(p => p.completedAt || p.attempts > 0)
      .sort((a, b) => {
        const dateA = new Date(a.completedAt || a.updatedAt || 0);
        const dateB = new Date(b.completedAt || b.updatedAt || 0);
        return dateB - dateA;
      })
      .slice(0, 10)
      .map(progress => {
        const course = recommendedCourses.find(c => c.id === progress.courseId);
        const question = course?.questions.find(q => q.id === progress.questionId);
        return {
          questionTitle: question?.title || 'Unknown Question',
          courseTitle: course?.title || 'Unknown Course',
          completed: progress.completed || false,
          attempts: progress.attempts || 0,
          date: progress.completedAt || progress.updatedAt || new Date().toISOString()
        };
      });

    return {
      completionRate: performanceMetrics.overallCompletionRate,
      completedQuestions: performanceMetrics.completedQuestions,
      totalQuestions: performanceMetrics.totalQuestions,
      averageAttempts: performanceMetrics.averageAttempts,
      learningStreak: AIRecommendationService.calculateLearningStreak(userProgress),
      categoryBreakdown,
      difficultyBreakdown,
      recentActivity
    };
  }

  static fallbackRecommendations(user, allCourses, userProgress) {
    const scoredCourses = allCourses.map(course => {
      let score = 50;
      
      if (user.level === course.level) score += 25;
      else if (user.level === 'beginner' && course.level === 'intermediate') score += 10;
      else if (user.level === 'intermediate' && course.level === 'advanced') score += 10;
      
      if (user.learningGoals) {
        const goalMatch = user.learningGoals.some(goal => 
          course.title.toLowerCase().includes(goal.toLowerCase()) ||
          course.category.toLowerCase().includes(goal.toLowerCase())
        );
        if (goalMatch) score += 20;
      }

      if (user.skills) {
        const skillMatch = user.skills.some(skill =>
          course.tags?.includes(skill) || course.title.toLowerCase().includes(skill.toLowerCase())
        );
        if (skillMatch) score += 15;
      }

      const courseProgress = userProgress.filter(p => p.courseId === course.id);
      const completionRate = course.questions.length > 0 ? 
        courseProgress.filter(p => p.completed).length / course.questions.length : 0;
      
      if (completionRate === 0) score += 10;
      if (completionRate === 1) score -= 40;
      if (completionRate > 0 && completionRate < 1) score += 5;

      const timeMap = { '1-3': 1, '4-6': 2, '7-10': 3, '10+': 4 };
      const userTime = timeMap[user.timeAvailability] || 2;
      const courseTime = course.estimatedHours <= 6 ? 1 : course.estimatedHours <= 12 ? 2 : course.estimatedHours <= 20 ? 3 : 4;
      
      if (Math.abs(userTime - courseTime) <= 1) score += 10;

      return { course, score: Math.min(100, Math.max(0, score)) };
    });

    const recommendations = scoredCourses
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ course, score }) => {
        const courseProgress = userProgress.filter(p => p.courseId === course.id);
        const totalQuestions = course.questions.length;
        const completedQuestions = courseProgress.filter(p => p.completed).length;
        const progressPercentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

        const levelMatchScore = Math.round(score * 0.8);
        const goalAlignmentScore = Math.round(score * 0.9);
        const skillBuildingScore = Math.round(score * 0.7);

        return {
          ...course.toJSON(),
          progress: {
            completed: completedQuestions,
            total: totalQuestions,
            percentage: progressPercentage
          },
          // Flatten recommendation data to course level for frontend
          aiScore: Math.round(score),
          aiReasoning: `Recommended based on your ${user.level} level and ${user.learningGoals?.[0] || 'programming'} goals. This course matches your profile and learning objectives.`,
          aiLearningPath: `This course builds foundational skills that align with your career path in ${user.careerStage || 'software development'}.`,
          aiGoalAlignment: `${goalAlignmentScore}% match with your learning goals`,
          aiSkillAlignment: `${skillBuildingScore}% skill development potential`,
          aiCareerImpact: `${levelMatchScore}% appropriate for your ${user.level || 'current'} level`,
          aiExpectedOutcome: `Complete this course to strengthen your ${course.category} skills and prepare for more advanced topics.`,
          // Keep full recommendation object for backward compatibility
          recommendation: {
            score: Math.round(score),
            reasoning: `Recommended based on your ${user.level} level and ${user.learningGoals?.[0] || 'programming'} goals`,
            factors: [
              { name: 'Level Match', score: levelMatchScore, weight: 50 },
              { name: 'Goal Alignment', score: goalAlignmentScore, weight: 30 },
              { name: 'Progress Optimization', score: skillBuildingScore, weight: 20 }
            ],
            aiGenerated: false
          }
        };
      });

    return {
      recommendations,
      strategy: "Recommendations based on your learning preferences, current level, and progress patterns",
      metadata: {
        aiUsed: false,
        algorithm: 'Mathematical Scoring (Fallback)',
        generatedAt: new Date().toISOString(),
        model: 'Rule-Based Recommendation'
      }
    };
  }
}