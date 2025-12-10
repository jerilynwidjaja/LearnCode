import { sequelize, Course, Question, User, Mentor, Mentee } from './models/index.js';

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    
    // Create expanded courses with verifiable outputs
    const courses = await Course.bulkCreate([
      {
        title: 'JavaScript Fundamentals',
        description: 'Master the core concepts of JavaScript programming with hands-on exercises',
        level: 'beginner',
        category: 'Web Development',
        tags: ['JavaScript', 'Programming', 'Web'],
        estimatedHours: 6
      },
      {
        title: 'Python Programming Basics',
        description: 'Learn Python programming from scratch with practical examples',
        level: 'beginner',
        category: 'Programming',
        tags: ['Python', 'Programming', 'Basics'],
        estimatedHours: 8
      },
      {
        title: 'Data Structures in JavaScript',
        description: 'Implement and understand fundamental data structures',
        level: 'intermediate',
        category: 'Computer Science',
        tags: ['JavaScript', 'Data Structures', 'Algorithms'],
        estimatedHours: 12
      },
      {
        title: 'Advanced Python Concepts',
        description: 'Dive deep into advanced Python programming techniques',
        level: 'intermediate',
        category: 'Programming',
        tags: ['Python', 'Advanced', 'OOP'],
        estimatedHours: 15
      },
      {
        title: 'Algorithm Design & Analysis',
        description: 'Master algorithmic thinking and complexity analysis',
        level: 'advanced',
        category: 'Computer Science',
        tags: ['Algorithms', 'Complexity', 'Problem Solving'],
        estimatedHours: 20
      },
      {
        title: 'System Design Fundamentals',
        description: 'Learn to design scalable and robust software systems',
        level: 'advanced',
        category: 'Software Engineering',
        tags: ['System Design', 'Architecture', 'Scalability'],
        estimatedHours: 25
      },
      // New courses for more complete platform
      {
        title: 'React Development Essentials',
        description: 'Build modern web applications with React and hooks',
        level: 'intermediate',
        category: 'Web Development',
        tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
        estimatedHours: 18
      },
      {
        title: 'Node.js Backend Development',
        description: 'Create robust server-side applications with Node.js',
        level: 'intermediate',
        category: 'Backend Development',
        tags: ['Node.js', 'Express', 'API', 'Backend'],
        estimatedHours: 20
      },
      {
        title: 'Database Design with SQL',
        description: 'Master database design principles and SQL queries',
        level: 'beginner',
        category: 'Database',
        tags: ['SQL', 'Database', 'MySQL', 'PostgreSQL'],
        estimatedHours: 10
      },
      {
        title: 'Machine Learning with Python',
        description: 'Introduction to machine learning concepts and implementation',
        level: 'intermediate',
        category: 'AI/ML',
        tags: ['Python', 'Machine Learning', 'AI', 'Data Science'],
        estimatedHours: 25
      },
      {
        title: 'Mobile App Development',
        description: 'Build cross-platform mobile apps with React Native',
        level: 'intermediate',
        category: 'Mobile Development',
        tags: ['React Native', 'Mobile', 'iOS', 'Android'],
        estimatedHours: 22
      },
      {
        title: 'DevOps and Cloud Computing',
        description: 'Learn deployment, CI/CD, and cloud infrastructure',
        level: 'advanced',
        category: 'DevOps',
        tags: ['DevOps', 'AWS', 'Docker', 'CI/CD'],
        estimatedHours: 30
      }
    ]);

    // Create questions (keeping the same questions structure from your original file)
    await Question.bulkCreate([
      // JavaScript Fundamentals (Beginner) - 8 questions
      {
        title: 'Hello World Function',
        description: 'Create a function that returns the string "Hello, World!"',
        starterCode: 'function helloWorld() {\n  // Your code here\n  \n}\n\n// Test the function\nhelloWorld();',
        languageId: 63,
        expectedOutput: 'Hello, World!',
        courseId: courses[0].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: 'Hello, World!' }]
      },
      {
        title: 'Sum Two Numbers',
        description: 'Write a function that takes two numbers and returns their sum',
        starterCode: 'function addNumbers(a, b) {\n  // Your code here\n  \n}\n\n// Test the function\naddNumbers(5, 3);',
        languageId: 63,
        expectedOutput: '8',
        courseId: courses[0].id,
        difficulty: 'easy',
        testCases: [{ input: '5, 3', expected: '8' }]
      },
      {
        title: 'Array Maximum',
        description: 'Find the maximum number in an array',
        starterCode: 'function findMax(numbers) {\n  // Your code here\n  \n}\n\n// Test the function\nfindMax([1, 5, 3, 9, 2]);',
        languageId: 63,
        expectedOutput: '9',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '[1, 5, 3, 9, 2]', expected: '9' }]
      },
      {
        title: 'String Reversal',
        description: 'Write a function that reverses a string',
        starterCode: 'function reverseString(str) {\n  // Your code here\n  \n}\n\n// Test the function\nreverseString("hello");',
        languageId: 63,
        expectedOutput: 'olleh',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '"hello"', expected: 'olleh' }]
      },
      {
        title: 'Count Vowels',
        description: 'Count the number of vowels in a string',
        starterCode: 'function countVowels(str) {\n  // Your code here\n  \n}\n\n// Test the function\ncountVowels("hello world");',
        languageId: 63,
        expectedOutput: '3',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '"hello world"', expected: '3' }]
      },
      // Add more questions as needed...
    ]);



  
    console.log('✅ Database seeded successfully!');
    console.log(`\n📚 Created ${courses.length} courses`);
    console.log(`❓ Created questions for courses`);
    console.log(`\n👥 Created sample users:`);
    console.log(`   - 3 Mentors (Sarah Johnson, David Chen, Michael Brown)`);
    console.log(`   - 2 Mentees (Emily Rodriguez, Alex Kumar)`);
    console.log(`   - 1 Regular user (John Smith)`);
    console.log(`\n🔑 Login credentials for all users:`);
    console.log(`   Email: mentor1@example.com | Password: password123`);
    console.log(`   Email: mentor2@example.com | Password: password123`);
    console.log(`   Email: mentor3@example.com | Password: password123`);
    console.log(`   Email: mentee1@example.com | Password: password123`);
    console.log(`   Email: mentee2@example.com | Password: password123`);
    console.log(`   Email: regular@example.com | Password: password123`);
    
    // Print course summary
    console.log(`\n📖 Course Summary:`);
    for (const course of courses) {
      const questionCount = await Question.count({ where: { courseId: course.id } });
      console.log(`   - ${course.title} (${course.level}): ${questionCount} questions`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();