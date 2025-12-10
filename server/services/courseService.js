import { Course, Question, UserProgress, User } from '../models/index.js';
import { AIRecommendationService } from './aiRecommendationService.js';
import { DatabaseService } from './databaseService.js';

export class CourseService {
  static courseVideos = {
    'JavaScript Fundamentals': [
      {
        id: 1,
        title: 'Introduction to JavaScript',
        description: 'Learn the basics of JavaScript syntax and how to get started with programming',
        thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '12:45',
        order: 1
      },
      {
        id: 2,
        title: 'Variables and Data Types',
        description: 'Understand different data types and how to work with variables effectively',
        thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '15:30',
        order: 2
      },
      {
        id: 3,
        title: 'Functions and Scope',
        description: 'Master function creation, scope, and closures in JavaScript',
        thumbnail: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '18:20',
        order: 3
      },
      {
        id: 4,
        title: 'Objects and Arrays',
        description: 'Deep dive into objects, arrays, and modern JavaScript features',
        thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '22:15',
        order: 4
      },
      {
        id: 5,
        title: 'ES6+ Features',
        description: 'Explore ES6+ syntax including arrow functions, destructuring, and modules',
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '16:40',
        order: 5
      },
      {
        id: 6,
        title: 'Debugging and Best Practices',
        description: 'Learn debugging techniques and JavaScript best practices',
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '14:25',
        order: 6
      }
    ],
    'Python Programming Basics': [
      {
        id: 1,
        title: 'Python Setup and Basics',
        description: 'Set up your Python environment and write your first program',
        thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '13:20',
        order: 1
      },
      {
        id: 2,
        title: 'Control Flow and Loops',
        description: 'Master if statements, loops, and control flow in Python',
        thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '17:45',
        order: 2
      },
      {
        id: 3,
        title: 'Functions and Modules',
        description: 'Create reusable functions and organize code with modules',
        thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '19:30',
        order: 3
      },
      {
        id: 4,
        title: 'Data Structures in Python',
        description: 'Work with lists, dictionaries, and other Python data structures',
        thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '21:10',
        order: 4
      },
      {
        id: 5,
        title: 'File Handling',
        description: 'Learn to read from and write to files in Python',
        thumbnail: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '15:55',
        order: 5
      },
      {
        id: 6,
        title: 'Error Handling',
        description: 'Handle errors gracefully with try-except blocks',
        thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '12:35',
        order: 6
      }
    ],
    'Data Structures in JavaScript': [
      {
        id: 1,
        title: 'Arrays and Objects Deep Dive',
        description: 'Master arrays and objects for efficient data organization',
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '20:15',
        order: 1
      },
      {
        id: 2,
        title: 'Stacks and Queues Implementation',
        description: 'Implement stack and queue data structures from scratch',
        thumbnail: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '18:40',
        order: 2
      },
      {
        id: 3,
        title: 'Trees and Binary Search',
        description: 'Understand tree structures and binary search algorithms',
        thumbnail: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '25:30',
        order: 3
      },
      {
        id: 4,
        title: 'Hash Tables and Maps',
        description: 'Learn hash tables and efficient data lookup techniques',
        thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '22:20',
        order: 4
      },
      {
        id: 5,
        title: 'Graph Algorithms',
        description: 'Implement graph algorithms for complex data relationships',
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '28:45',
        order: 5
      },
      {
        id: 6,
        title: 'Performance Analysis',
        description: 'Analyze time and space complexity of different approaches',
        thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '16:50',
        order: 6
      }
    ],
    'Advanced Python Concepts': [
      {
        id: 1,
        title: 'Object-Oriented Programming',
        description: 'Master classes, inheritance, and object-oriented design principles',
        thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '24:15',
        order: 1
      },
      {
        id: 2,
        title: 'Decorators and Generators',
        description: 'Learn decorators, generators, and advanced function concepts',
        thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '19:30',
        order: 2
      },
      {
        id: 3,
        title: 'Context Managers',
        description: 'Understand context managers and the with statement',
        thumbnail: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '17:45',
        order: 3
      },
      {
        id: 4,
        title: 'Async Programming',
        description: 'Explore asynchronous programming with async/await',
        thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '26:20',
        order: 4
      },
      {
        id: 5,
        title: 'Testing with pytest',
        description: 'Write comprehensive tests using pytest framework',
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '21:40',
        order: 5
      },
      {
        id: 6,
        title: 'Performance Optimization',
        description: 'Optimize Python code for better performance',
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '23:10',
        order: 6
      }
    ],
    'Algorithm Design & Analysis': [
      {
        id: 1,
        title: 'Big O Notation Explained',
        description: 'Understand time and space complexity analysis fundamentals',
        thumbnail: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '18:30',
        order: 1
      },
      {
        id: 2,
        title: 'Sorting Algorithms Comparison',
        description: 'Compare different sorting algorithms and their trade-offs',
        thumbnail: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '22:45',
        order: 2
      },
      {
        id: 3,
        title: 'Search Algorithms',
        description: 'Master binary search and other efficient search techniques',
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '20:15',
        order: 3
      },
      {
        id: 4,
        title: 'Dynamic Programming',
        description: 'Solve complex problems using dynamic programming',
        thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '28:20',
        order: 4
      },
      {
        id: 5,
        title: 'Graph Algorithms',
        description: 'Implement graph traversal and shortest path algorithms',
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '25:40',
        order: 5
      },
      {
        id: 6,
        title: 'Algorithm Optimization',
        description: 'Learn techniques for optimizing algorithm performance',
        thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '19:55',
        order: 6
      }
    ],
    'System Design Fundamentals': [
      {
        id: 1,
        title: 'Scalability Principles',
        description: 'Learn the principles of designing scalable systems',
        thumbnail: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '21:30',
        order: 1
      },
      {
        id: 2,
        title: 'Database Design Patterns',
        description: 'Design efficient database schemas and query patterns',
        thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '24:15',
        order: 2
      },
      {
        id: 3,
        title: 'Caching Strategies',
        description: 'Implement caching strategies for improved performance',
        thumbnail: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '19:45',
        order: 3
      },
      {
        id: 4,
        title: 'Load Balancing',
        description: 'Understand load balancing and traffic distribution',
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '22:20',
        order: 4
      },
      {
        id: 5,
        title: 'Microservices Architecture',
        description: 'Design microservices and distributed system architectures',
        thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '26:40',
        order: 5
      },
      {
        id: 6,
        title: 'System Monitoring',
        description: 'Monitor and maintain large-scale systems effectively',
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '18:35',
        order: 6
      }
    ]
  };

  static async getAllCoursesWithProgress(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const courses = await Course.findAll({
      include: [{
        model: Question,
        as: 'questions'
      }]
    });

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        if (!course || !course.id) {
          console.error('Course missing ID:', course);
          return {
            ...(course ? course.toJSON() : {}),
            id: null,
            title: 'Unknown Course',
            progress: { completed: 0, total: 0, percentage: 0 }
          };
        }
        
        console.log('Processing course:', course.id, course.title);
        const progress = await this.calculateCourseProgress(course.id, userId);
        return {
          ...course.toJSON(),
          progress
        };
      })
    );

    return coursesWithProgress.filter(course => course.id !== null);
  }

  static async getRecommendedCourses(userId, forceRefresh = false) {
    try {
      // Get user and all courses
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const allCourses = await Course.findAll({
        include: [{
          model: Question,
          as: 'questions'
        }]
      });

      console.log('Found courses for recommendations:', allCourses.map(c => ({ id: c.id, title: c.title })));
      const userProgress = await UserProgress.findAll({
        where: { userId }
      });

      // Get AI recommendations
      const result = await AIRecommendationService.generateRecommendations(
        user, 
        allCourses, 
        userProgress,
        forceRefresh
      );

      // Add progress to recommended courses
      const coursesWithProgress = await Promise.all(
        result.recommendations.map(async (course) => {
          if (!course || !course.id) {
            console.error('Invalid course in recommendations:', course);
            return null;
          }
          const progress = await this.calculateCourseProgress(course.id, userId);
          return {
            ...course,
            progress
          };
        })
      );

      return {
        courses: coursesWithProgress.filter(Boolean),
        metadata: result.metadata,
        aiResponse: result.aiResponse,
        rawAiResponse: result.rawAiResponse
      };

    } catch (error) {
      console.error('Course recommendation error:', error);
      throw error;
    }
  }

  static async getCourseByIdWithProgress(courseId, userId) {
    const course = await Course.findByPk(courseId, {
      include: [{
        model: Question,
        as: 'questions'
      }]
    });

    if (!course) {
      throw new Error('Course not found');
    }

    const progress = await this.calculateCourseProgress(courseId, userId);
    
    if (!user || !user.id) {
      throw new Error('Valid user object with ID is required');
    }

    if (!Array.isArray(allCourses)) {
      throw new Error('allCourses must be an array');
    }

    // Add progress to each question
    const questionsWithProgress = await Promise.all(
      course.questions.map(async (question) => {
        const questionProgress = await UserProgress.findOne({
          where: { userId, questionId: question.id }
        });

        return {
          ...question.toJSON(),
          completed: questionProgress?.completed || false,
          attempts: questionProgress?.attempts || 0,
          lastAttemptAt: questionProgress?.lastAttemptAt
        };
      })
    );

    return {
      ...course.toJSON(),
      questions: questionsWithProgress,
      progress,
      videos: this.courseVideos[course.title] || []
    };
  }

  static async calculateCourseProgress(courseId, userId) {
    // Validate inputs
    if (courseId === undefined || courseId === null || !userId) {
      console.error('calculateCourseProgress: Missing required parameters', { courseId, userId });
      return {
        completed: 0,
        total: 0,
        percentage: 0
      };
    }

    // Convert courseId to number if it's a string
    const validCourseId = typeof courseId === 'string' ? parseInt(courseId, 10) : courseId;
    
    if (isNaN(validCourseId) || validCourseId <= 0) {
      console.error('calculateCourseProgress: Invalid courseId', { courseId, validCourseId });
      return {
        completed: 0,
        total: 0,
        percentage: 0
      };
    }

    const totalQuestions = await Question.count({
      where: { courseId: validCourseId }
    });

    const completedQuestions = await UserProgress.count({
      where: { 
        courseId: validCourseId,
        completed: true 
      }
    });

    const percentage = totalQuestions > 0 ? 
      Math.round((completedQuestions / totalQuestions) * 100) : 0;

    return {
      completed: completedQuestions,
      total: totalQuestions,
      percentage
    };
  }
}