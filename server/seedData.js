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

    // Create questions for all courses
    await Question.bulkCreate([
      // ========================================
      // JavaScript Fundamentals (Course 1) - 8 questions
      // ========================================
      {
        title: 'Hello World Function',
        description: 'Create a function that returns the string "Hello, World!"',
        starterCode: 'function helloWorld() {\n  // Your code here\n  \n}\n\nconsole.log(helloWorld());',
        languageId: 63,
        expectedOutput: 'Hello, World!',
        courseId: courses[0].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: 'Hello, World!' }]
      },
      {
        title: 'Sum Two Numbers',
        description: 'Write a function that takes two numbers and returns their sum',
        starterCode: 'function addNumbers(a, b) {\n  // Your code here\n  \n}\n\nconsole.log(addNumbers(5, 3));',
        languageId: 63,
        expectedOutput: '8',
        courseId: courses[0].id,
        difficulty: 'easy',
        testCases: [{ input: '5, 3', expected: '8' }]
      },
      {
        title: 'Array Maximum',
        description: 'Find the maximum number in an array',
        starterCode: 'function findMax(numbers) {\n  // Your code here\n  \n}\n\nconsole.log(findMax([1, 5, 3, 9, 2]));',
        languageId: 63,
        expectedOutput: '9',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '[1, 5, 3, 9, 2]', expected: '9' }]
      },
      {
        title: 'String Reversal',
        description: 'Write a function that reverses a string',
        starterCode: 'function reverseString(str) {\n  // Your code here\n  \n}\n\nconsole.log(reverseString("hello"));',
        languageId: 63,
        expectedOutput: 'olleh',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '"hello"', expected: 'olleh' }]
      },
      {
        title: 'Count Vowels',
        description: 'Count the number of vowels in a string',
        starterCode: 'function countVowels(str) {\n  // Your code here\n  \n}\n\nconsole.log(countVowels("hello world"));',
        languageId: 63,
        expectedOutput: '3',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '"hello world"', expected: '3' }]
      },
      {
        title: 'Palindrome Checker',
        description: 'Check if a string is a palindrome',
        starterCode: 'function isPalindrome(str) {\n  // Your code here\n  \n}\n\nconsole.log(isPalindrome("racecar"));',
        languageId: 63,
        expectedOutput: 'true',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '"racecar"', expected: 'true' }]
      },
      {
        title: 'FizzBuzz',
        description: 'Print numbers 1 to 15, but for multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both print "FizzBuzz"',
        starterCode: 'function fizzBuzz() {\n  // Your code here\n  \n}\n\nfizzBuzz();',
        languageId: 63,
        expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
        courseId: courses[0].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' }]
      },
      {
        title: 'Factorial Calculator',
        description: 'Calculate the factorial of a number',
        starterCode: 'function factorial(n) {\n  // Your code here\n  \n}\n\nconsole.log(factorial(5));',
        languageId: 63,
        expectedOutput: '120',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '5', expected: '120' }]
      },

      // ========================================
      // Python Programming Basics (Course 2) - 8 questions
      // ========================================
      {
        title: 'Python Hello World',
        description: 'Create a function that returns "Hello, Python!"',
        starterCode: 'def hello_python():\n    # Your code here\n    pass\n\nprint(hello_python())',
        languageId: 71,
        expectedOutput: 'Hello, Python!',
        courseId: courses[1].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: 'Hello, Python!' }]
      },
      {
        title: 'List Sum',
        description: 'Calculate the sum of all numbers in a list',
        starterCode: 'def sum_list(numbers):\n    # Your code here\n    pass\n\nprint(sum_list([1, 2, 3, 4, 5]))',
        languageId: 71,
        expectedOutput: '15',
        courseId: courses[1].id,
        difficulty: 'easy',
        testCases: [{ input: '[1, 2, 3, 4, 5]', expected: '15' }]
      },
      {
        title: 'Even or Odd',
        description: 'Check if a number is even or odd',
        starterCode: 'def even_or_odd(n):\n    # Your code here\n    pass\n\nprint(even_or_odd(7))',
        languageId: 71,
        expectedOutput: 'odd',
        courseId: courses[1].id,
        difficulty: 'easy',
        testCases: [{ input: '7', expected: 'odd' }]
      },
      {
        title: 'List Reversal',
        description: 'Reverse a list without using built-in reverse',
        starterCode: 'def reverse_list(lst):\n    # Your code here\n    pass\n\nprint(reverse_list([1, 2, 3, 4, 5]))',
        languageId: 71,
        expectedOutput: '[5, 4, 3, 2, 1]',
        courseId: courses[1].id,
        difficulty: 'medium',
        testCases: [{ input: '[1, 2, 3, 4, 5]', expected: '[5, 4, 3, 2, 1]' }]
      },
      {
        title: 'Count Characters',
        description: 'Count the frequency of each character in a string',
        starterCode: 'def count_chars(s):\n    # Your code here\n    pass\n\nprint(count_chars("hello"))',
        languageId: 71,
        expectedOutput: "{'h': 1, 'e': 1, 'l': 2, 'o': 1}",
        courseId: courses[1].id,
        difficulty: 'medium',
        testCases: [{ input: '"hello"', expected: "{'h': 1, 'e': 1, 'l': 2, 'o': 1}" }]
      },
      {
        title: 'Prime Number Checker',
        description: 'Check if a number is prime',
        starterCode: 'def is_prime(n):\n    # Your code here\n    pass\n\nprint(is_prime(17))',
        languageId: 71,
        expectedOutput: 'True',
        courseId: courses[1].id,
        difficulty: 'medium',
        testCases: [{ input: '17', expected: 'True' }]
      },
      {
        title: 'Fibonacci Sequence',
        description: 'Generate the first n numbers in the Fibonacci sequence',
        starterCode: 'def fibonacci(n):\n    # Your code here\n    pass\n\nprint(fibonacci(7))',
        languageId: 71,
        expectedOutput: '[0, 1, 1, 2, 3, 5, 8]',
        courseId: courses[1].id,
        difficulty: 'medium',
        testCases: [{ input: '7', expected: '[0, 1, 1, 2, 3, 5, 8]' }]
      },
      {
        title: 'Remove Duplicates',
        description: 'Remove duplicate elements from a list',
        starterCode: 'def remove_duplicates(lst):\n    # Your code here\n    pass\n\nprint(remove_duplicates([1, 2, 2, 3, 4, 4, 5]))',
        languageId: 71,
        expectedOutput: '[1, 2, 3, 4, 5]',
        courseId: courses[1].id,
        difficulty: 'easy',
        testCases: [{ input: '[1, 2, 2, 3, 4, 4, 5]', expected: '[1, 2, 3, 4, 5]' }]
      },

      // ========================================
      // Data Structures in JavaScript (Course 3) - 8 questions
      // ========================================
      {
        title: 'Implement a Stack',
        description: 'Create a Stack class with push, pop, and peek methods',
        starterCode: 'class Stack {\n  constructor() {\n    // Your code here\n  }\n  \n  push(item) {\n    // Your code here\n  }\n  \n  pop() {\n    // Your code here\n  }\n  \n  peek() {\n    // Your code here\n  }\n}\n\nconst stack = new Stack();\nstack.push(1);\nstack.push(2);\nconsole.log(stack.peek());',
        languageId: 63,
        expectedOutput: '2',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [{ input: 'push(1), push(2), peek()', expected: '2' }]
      },
      {
        title: 'Implement a Queue',
        description: 'Create a Queue class with enqueue and dequeue methods',
        starterCode: 'class Queue {\n  constructor() {\n    // Your code here\n  }\n  \n  enqueue(item) {\n    // Your code here\n  }\n  \n  dequeue() {\n    // Your code here\n  }\n}\n\nconst queue = new Queue();\nqueue.enqueue(1);\nqueue.enqueue(2);\nconsole.log(queue.dequeue());',
        languageId: 63,
        expectedOutput: '1',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [{ input: 'enqueue(1), enqueue(2), dequeue()', expected: '1' }]
      },
      {
        title: 'Linked List - Add Node',
        description: 'Add a node to the end of a linked list',
        starterCode: 'class Node {\n  constructor(data) {\n    this.data = data;\n    this.next = null;\n  }\n}\n\nclass LinkedList {\n  constructor() {\n    this.head = null;\n  }\n  \n  add(data) {\n    // Your code here\n  }\n  \n  print() {\n    let current = this.head;\n    let result = [];\n    while(current) {\n      result.push(current.data);\n      current = current.next;\n    }\n    return result.join(" -> ");\n  }\n}\n\nconst list = new LinkedList();\nlist.add(1);\nlist.add(2);\nlist.add(3);\nconsole.log(list.print());',
        languageId: 63,
        expectedOutput: '1 -> 2 -> 3',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [{ input: 'add(1), add(2), add(3)', expected: '1 -> 2 -> 3' }]
      },
      {
        title: 'Binary Search',
        description: 'Implement binary search on a sorted array',
        starterCode: 'function binarySearch(arr, target) {\n  // Your code here\n  \n}\n\nconsole.log(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9], 5));',
        languageId: 63,
        expectedOutput: '4',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [{ input: '[1, 2, 3, 4, 5, 6, 7, 8, 9], 5', expected: '4' }]
      },
      {
        title: 'Hash Table - Basic Implementation',
        description: 'Implement basic hash table set and get methods',
        starterCode: 'class HashTable {\n  constructor() {\n    this.table = {};\n  }\n  \n  set(key, value) {\n    // Your code here\n  }\n  \n  get(key) {\n    // Your code here\n  }\n}\n\nconst ht = new HashTable();\nht.set("name", "John");\nconsole.log(ht.get("name"));',
        languageId: 63,
        expectedOutput: 'John',
        courseId: courses[2].id,
        difficulty: 'easy',
        testCases: [{ input: 'set("name", "John"), get("name")', expected: 'John' }]
      },
      {
        title: 'Tree Traversal - Inorder',
        description: 'Implement inorder traversal of a binary tree',
        starterCode: 'class TreeNode {\n  constructor(val) {\n    this.val = val;\n    this.left = null;\n    this.right = null;\n  }\n}\n\nfunction inorderTraversal(root) {\n  // Your code here\n  \n}\n\nconst root = new TreeNode(1);\nroot.right = new TreeNode(2);\nroot.right.left = new TreeNode(3);\nconsole.log(inorderTraversal(root));',
        languageId: 63,
        expectedOutput: '[1, 3, 2]',
        courseId: courses[2].id,
        difficulty: 'hard',
        testCases: [{ input: 'Tree: 1->null,2->3,null', expected: '[1, 3, 2]' }]
      },
      {
        title: 'Valid Parentheses',
        description: 'Check if a string of parentheses is valid using a stack',
        starterCode: 'function isValidParentheses(s) {\n  // Your code here\n  \n}\n\nconsole.log(isValidParentheses("()[]{}"));',
        languageId: 63,
        expectedOutput: 'true',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [{ input: '"()[]{}"', expected: 'true' }]
      },
      {
        title: 'Merge Sorted Arrays',
        description: 'Merge two sorted arrays into one sorted array',
        starterCode: 'function mergeSortedArrays(arr1, arr2) {\n  // Your code here\n  \n}\n\nconsole.log(mergeSortedArrays([1, 3, 5], [2, 4, 6]));',
        languageId: 63,
        expectedOutput: '[1, 2, 3, 4, 5, 6]',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [{ input: '[1, 3, 5], [2, 4, 6]', expected: '[1, 2, 3, 4, 5, 6]' }]
      },

      // ========================================
      // Advanced Python Concepts (Course 4) - 8 questions
      // ========================================
      {
        title: 'Class Inheritance',
        description: 'Create a base Animal class and a Dog class that inherits from it',
        starterCode: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def speak(self):\n        pass\n\nclass Dog(Animal):\n    def speak(self):\n        # Your code here\n        pass\n\ndog = Dog("Buddy")\nprint(dog.speak())',
        languageId: 71,
        expectedOutput: 'Woof!',
        courseId: courses[3].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'Woof!' }]
      },
      {
        title: 'Decorator Function',
        description: 'Create a decorator that logs function calls',
        starterCode: 'def log_decorator(func):\n    # Your code here\n    pass\n\n@log_decorator\ndef greet(name):\n    return f"Hello, {name}"\n\nprint(greet("Alice"))',
        languageId: 71,
        expectedOutput: 'Calling greet\nHello, Alice',
        courseId: courses[3].id,
        difficulty: 'hard',
        testCases: [{ input: '"Alice"', expected: 'Calling greet\nHello, Alice' }]
      },
      {
        title: 'Generator Function',
        description: 'Create a generator that yields squares of numbers',
        starterCode: 'def square_generator(n):\n    # Your code here\n    pass\n\nfor num in square_generator(5):\n    print(num)',
        languageId: 71,
        expectedOutput: '0\n1\n4\n9\n16',
        courseId: courses[3].id,
        difficulty: 'medium',
        testCases: [{ input: '5', expected: '0\n1\n4\n9\n16' }]
      },
      {
        title: 'Context Manager',
        description: 'Implement a context manager class',
        starterCode: 'class FileManager:\n    def __init__(self, filename):\n        self.filename = filename\n    \n    def __enter__(self):\n        # Your code here\n        pass\n    \n    def __exit__(self, exc_type, exc_val, exc_tb):\n        # Your code here\n        pass\n\nwith FileManager("test.txt") as f:\n    print("File opened")',
        languageId: 71,
        expectedOutput: 'Opening test.txt\nFile opened\nClosing test.txt',
        courseId: courses[3].id,
        difficulty: 'hard',
        testCases: [{ input: '', expected: 'Opening test.txt\nFile opened\nClosing test.txt' }]
      },
      {
        title: 'Property Decorator',
        description: 'Use @property decorator to create a computed attribute',
        starterCode: 'class Circle:\n    def __init__(self, radius):\n        self.radius = radius\n    \n    @property\n    def area(self):\n        # Your code here\n        pass\n\ncircle = Circle(5)\nprint(circle.area)',
        languageId: 71,
        expectedOutput: '78.5',
        courseId: courses[3].id,
        difficulty: 'medium',
        testCases: [{ input: 'radius=5', expected: '78.5' }]
      },
      {
        title: 'List Comprehension with Filter',
        description: 'Use list comprehension to filter even numbers',
        starterCode: 'def filter_evens(numbers):\n    # Your code here using list comprehension\n    pass\n\nprint(filter_evens([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))',
        languageId: 71,
        expectedOutput: '[2, 4, 6, 8, 10]',
        courseId: courses[3].id,
        difficulty: 'easy',
        testCases: [{ input: '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]', expected: '[2, 4, 6, 8, 10]' }]
      },
      {
        title: 'Lambda Functions',
        description: 'Sort a list of tuples by the second element using lambda',
        starterCode: 'def sort_by_second(tuples):\n    # Your code here using lambda\n    pass\n\nprint(sort_by_second([(1, 3), (2, 1), (3, 2)]))',
        languageId: 71,
        expectedOutput: '[(2, 1), (3, 2), (1, 3)]',
        courseId: courses[3].id,
        difficulty: 'medium',
        testCases: [{ input: '[(1, 3), (2, 1), (3, 2)]', expected: '[(2, 1), (3, 2), (1, 3)]' }]
      },
      {
        title: 'Exception Handling',
        description: 'Handle division by zero with try-except',
        starterCode: 'def safe_divide(a, b):\n    # Your code here\n    pass\n\nprint(safe_divide(10, 0))',
        languageId: 71,
        expectedOutput: 'Error: Division by zero',
        courseId: courses[3].id,
        difficulty: 'easy',
        testCases: [{ input: '10, 0', expected: 'Error: Division by zero' }]
      },

      // ========================================
      // Algorithm Design & Analysis (Course 5) - 8 questions
      // ========================================
      {
        title: 'Bubble Sort',
        description: 'Implement the bubble sort algorithm',
        starterCode: 'function bubbleSort(arr) {\n  // Your code here\n  \n}\n\nconsole.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));',
        languageId: 63,
        expectedOutput: '[11, 12, 22, 25, 34, 64, 90]',
        courseId: courses[4].id,
        difficulty: 'medium',
        testCases: [{ input: '[64, 34, 25, 12, 22, 11, 90]', expected: '[11, 12, 22, 25, 34, 64, 90]' }]
      },
      {
        title: 'Quick Sort',
        description: 'Implement the quick sort algorithm',
        starterCode: 'function quickSort(arr) {\n  // Your code here\n  \n}\n\nconsole.log(quickSort([10, 7, 8, 9, 1, 5]));',
        languageId: 63,
        expectedOutput: '[1, 5, 7, 8, 9, 10]',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: '[10, 7, 8, 9, 1, 5]', expected: '[1, 5, 7, 8, 9, 10]' }]
      },
      {
        title: 'Binary Search Recursive',
        description: 'Implement binary search using recursion',
        starterCode: 'function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {\n  // Your code here\n  \n}\n\nconsole.log(binarySearchRecursive([1, 2, 3, 4, 5, 6, 7], 4));',
        languageId: 63,
        expectedOutput: '3',
        courseId: courses[4].id,
        difficulty: 'medium',
        testCases: [{ input: '[1, 2, 3, 4, 5, 6, 7], 4', expected: '3' }]
      },
      {
        title: 'Merge Sort',
        description: 'Implement the merge sort algorithm',
        starterCode: 'function mergeSort(arr) {\n  // Your code here\n  \n}\n\nconsole.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));',
        languageId: 63,
        expectedOutput: '[3, 9, 10, 27, 38, 43, 82]',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: '[38, 27, 43, 3, 9, 82, 10]', expected: '[3, 9, 10, 27, 38, 43, 82]' }]
      },
      {
        title: 'Find Duplicates',
        description: 'Find all duplicate elements in an array in O(n) time',
        starterCode: 'function findDuplicates(arr) {\n  // Your code here\n  \n}\n\nconsole.log(findDuplicates([1, 2, 3, 2, 4, 5, 3]));',
        languageId: 63,
        expectedOutput: '[2, 3]',
        courseId: courses[4].id,
        difficulty: 'medium',
        testCases: [{ input: '[1, 2, 3, 2, 4, 5, 3]', expected: '[2, 3]' }]
      },
      {
        title: 'Longest Common Subsequence',
        description: 'Find the length of the longest common subsequence',
        starterCode: 'function lcs(str1, str2) {\n  // Your code here\n  \n}\n\nconsole.log(lcs("ABCDGH", "AEDFHR"));',
        languageId: 63,
        expectedOutput: '3',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: '"ABCDGH", "AEDFHR"', expected: '3' }]
      },
      {
        title: 'Coin Change Problem',
        description: 'Find minimum number of coins needed to make a given amount',
        starterCode: 'function coinChange(coins, amount) {\n  // Your code here\n  \n}\n\nconsole.log(coinChange([1, 2, 5], 11));',
        languageId: 63,
        expectedOutput: '3',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: '[1, 2, 5], 11', expected: '3' }]
      },
      {
        title: 'Graph DFS',
        description: 'Implement depth-first search for a graph',
        starterCode: 'function dfs(graph, start) {\n  // Your code here\n  // Return visited nodes in order\n}\n\nconst graph = {\n  A: ["B", "C"],\n  B: ["D"],\n  C: ["E"],\n  D: [],\n  E: []\n};\n\nconsole.log(dfs(graph, "A"));',
        languageId: 63,
        expectedOutput: '["A", "B", "D", "C", "E"]',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: 'graph, "A"', expected: '["A", "B", "D", "C", "E"]' }]
      },

      // ========================================
      // System Design Fundamentals (Course 6) - 6 questions
      // ========================================
      {
        title: 'Rate Limiter - Token Bucket',
        description: 'Implement a simple token bucket rate limiter',
        starterCode: 'class RateLimiter {\n  constructor(capacity, refillRate) {\n    // Your code here\n  }\n  \n  allowRequest() {\n    // Your code here\n    // Return true if request is allowed, false otherwise\n  }\n}\n\nconst limiter = new RateLimiter(10, 1);\nconsole.log(limiter.allowRequest());',
        languageId: 63,
        expectedOutput: 'true',
        courseId: courses[5].id,
        difficulty: 'hard',
        testCases: [{ input: '', expected: 'true' }]
      },
      {
        title: 'LRU Cache',
        description: 'Implement a Least Recently Used (LRU) cache',
        starterCode: 'class LRUCache {\n  constructor(capacity) {\n    // Your code here\n  }\n  \n  get(key) {\n    // Your code here\n  }\n  \n  put(key, value) {\n    // Your code here\n  }\n}\n\nconst cache = new LRUCache(2);\ncache.put(1, 1);\ncache.put(2, 2);\nconsole.log(cache.get(1));',
        languageId: 63,
        expectedOutput: '1',
        courseId: courses[5].id,
        difficulty: 'hard',
        testCases: [{ input: 'put(1,1), put(2,2), get(1)', expected: '1' }]
      },
      {
        title: 'Consistent Hashing',
        description: 'Implement basic consistent hashing for load balancing',
        starterCode: 'class ConsistentHashing {\n  constructor(servers) {\n    this.servers = servers;\n  }\n  \n  getServer(key) {\n    // Your code here\n    // Return server index\n  }\n}\n\nconst ch = new ConsistentHashing(["server1", "server2", "server3"]);\nconsole.log(ch.getServer("user123"));',
        languageId: 63,
        expectedOutput: '1',
        courseId: courses[5].id,
        difficulty: 'hard',
        testCases: [{ input: '"user123"', expected: '1' }]
      },
      {
        title: 'Circuit Breaker Pattern',
        description: 'Implement a circuit breaker for fault tolerance',
        starterCode: 'class CircuitBreaker {\n  constructor(threshold, timeout) {\n    this.threshold = threshold;\n    this.timeout = timeout;\n    this.failures = 0;\n    this.state = "CLOSED"; // CLOSED, OPEN, HALF_OPEN\n  }\n  \n  call(operation) {\n    // Your code here\n  }\n}\n\nconst cb = new CircuitBreaker(3, 5000);\nconsole.log(cb.state);',
        languageId: 63,
        expectedOutput: 'CLOSED',
        courseId: courses[5].id,
        difficulty: 'hard',
        testCases: [{ input: '', expected: 'CLOSED' }]
      },
      {
        title: 'Load Balancer - Round Robin',
        description: 'Implement a round-robin load balancer',
        starterCode: 'class LoadBalancer {\n  constructor(servers) {\n    // Your code here\n  }\n  \n  getNextServer() {\n    // Your code here\n  }\n}\n\nconst lb = new LoadBalancer(["server1", "server2", "server3"]);\nconsole.log(lb.getNextServer());\nconsole.log(lb.getNextServer());',
        languageId: 63,
        expectedOutput: 'server1\nserver2',
        courseId: courses[5].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'server1\nserver2' }]
      },
      {
        title: 'Bloom Filter',
        description: 'Implement a simple Bloom filter for set membership',
        starterCode: 'class BloomFilter {\n  constructor(size) {\n    this.size = size;\n    this.bits = new Array(size).fill(false);\n  }\n  \n  add(item) {\n    // Your code here\n  }\n  \n  contains(item) {\n    // Your code here\n  }\n}\n\nconst bf = new BloomFilter(100);\nbf.add("test");\nconsole.log(bf.contains("test"));',
        languageId: 63,
        expectedOutput: 'true',
        courseId: courses[5].id,
        difficulty: 'hard',
        testCases: [{ input: 'add("test"), contains("test")', expected: 'true' }]
      },

      // ========================================
      // React Development Essentials (Course 7) - 6 questions
      // ========================================
      {
        title: 'Counter Component',
        description: 'Create a counter component with increment and decrement',
        starterCode: 'function Counter() {\n  // Your code here\n  // Use useState hook\n  \n  return (\n    <div>\n      <button>-</button>\n      <span>0</span>\n      <button>+</button>\n    </div>\n  );\n}',
        languageId: 63,
        expectedOutput: 'Component renders with counter',
        courseId: courses[6].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: 'Component renders' }]
      },
      {
        title: 'Todo List Component',
        description: 'Create a todo list with add and delete functionality',
        starterCode: 'function TodoList() {\n  // Your code here\n  // Use useState for managing todos\n  \n  return (\n    <div>\n      <input type="text" />\n      <button>Add</button>\n      <ul></ul>\n    </div>\n  );\n}',
        languageId: 63,
        expectedOutput: 'Todo list component',
        courseId: courses[6].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'Component renders' }]
      },
      {
        title: 'useEffect Hook',
        description: 'Use useEffect to fetch data on component mount',
        starterCode: 'function DataFetcher() {\n  // Your code here\n  // Use useEffect to fetch data\n  \n  return <div>Loading...</div>;\n}',
        languageId: 63,
        expectedOutput: 'Component with useEffect',
        courseId: courses[6].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'Component renders' }]
      },
      {
        title: 'Custom Hook',
        description: 'Create a custom useLocalStorage hook',
        starterCode: 'function useLocalStorage(key, initialValue) {\n  // Your code here\n  // Return [value, setValue]\n}',
        languageId: 63,
        expectedOutput: 'Custom hook implementation',
        courseId: courses[6].id,
        difficulty: 'hard',
        testCases: [{ input: '', expected: 'Hook works' }]
      },
      {
        title: 'Context API',
        description: 'Implement theme context provider',
        starterCode: 'const ThemeContext = React.createContext();\n\nfunction ThemeProvider({ children }) {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: 'Context provider',
        courseId: courses[6].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'Context works' }]
      },
      {
        title: 'Form Handling',
        description: 'Create a form with controlled inputs',
        starterCode: 'function LoginForm() {\n  // Your code here\n  // Handle form submission\n  \n  return (\n    <form>\n      <input type="email" />\n      <input type="password" />\n      <button>Submit</button>\n    </form>\n  );\n}',
        languageId: 63,
        expectedOutput: 'Form component',
        courseId: courses[6].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: 'Form renders' }]
      },

      // ========================================
      // Node.js Backend Development (Course 8) - 6 questions
      // ========================================
      {
        title: 'Express Server Setup',
        description: 'Create a basic Express server',
        starterCode: 'const express = require("express");\nconst app = express();\n\n// Your code here\n// Create a GET route at "/" that returns "Hello World"\n\napp.listen(3000);',
        languageId: 63,
        expectedOutput: 'Server setup complete',
        courseId: courses[7].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: 'Server runs' }]
      },
      {
        title: 'REST API - CRUD Operations',
        description: 'Implement CRUD endpoints for a resource',
        starterCode: '// Create GET, POST, PUT, DELETE routes for /users\n// Your code here',
        languageId: 63,
        expectedOutput: 'CRUD endpoints',
        courseId: courses[7].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'Endpoints work' }]
      },
      {
        title: 'Middleware Function',
        description: 'Create authentication middleware',
        starterCode: 'function authMiddleware(req, res, next) {\n  // Your code here\n  // Check for authorization header\n}',
        languageId: 63,
        expectedOutput: 'Middleware function',
        courseId: courses[7].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'Middleware works' }]
      },
      {
        title: 'Error Handling',
        description: 'Implement global error handling middleware',
        starterCode: 'function errorHandler(err, req, res, next) {\n  // Your code here\n}',
        languageId: 63,
        expectedOutput: 'Error handler',
        courseId: courses[7].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'Error handling works' }]
      },
      {
        title: 'JWT Authentication',
        description: 'Generate and verify JWT tokens',
        starterCode: 'const jwt = require("jsonwebtoken");\n\nfunction generateToken(user) {\n  // Your code here\n}\n\nfunction verifyToken(token) {\n  // Your code here\n}',
        languageId: 63,
        expectedOutput: 'JWT functions',
        courseId: courses[7].id,
        difficulty: 'hard',
        testCases: [{ input: '', expected: 'JWT works' }]
      },
      {
        title: 'File Upload',
        description: 'Handle file uploads with multer',
        starterCode: 'const multer = require("multer");\n\n// Your code here\n// Configure multer for file uploads',
        languageId: 63,
        expectedOutput: 'File upload handler',
        courseId: courses[7].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'Upload works' }]
      },

      // ========================================
      // Database Design with SQL (Course 9) - 6 questions
      // ========================================
      {
        title: 'Create Table',
        description: 'Create a users table with appropriate columns',
        starterCode: '-- Your SQL code here\nCREATE TABLE users (\n  -- Add columns\n);',
        languageId: 82,
        expectedOutput: 'Table created',
        courseId: courses[8].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: 'Table created' }]
      },
      {
        title: 'SELECT Query',
        description: 'Write a query to find all active users',
        starterCode: '-- Your SQL code here\nSELECT * FROM users WHERE status = "active";',
        languageId: 82,
        expectedOutput: 'Query result',
        courseId: courses[8].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: 'Query works' }]
      },
      {
        title: 'JOIN Operation',
        description: 'Join users and orders tables',
        starterCode: '-- Your SQL code here\n-- Join users with their orders',
        languageId: 82,
        expectedOutput: 'Join result',
        courseId: courses[8].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'Join works' }]
      },
      {
        title: 'Aggregate Functions',
        description: 'Calculate total sales per user',
        starterCode: '-- Your SQL code here\n-- Use GROUP BY and SUM',
        languageId: 82,
        expectedOutput: 'Aggregation result',
        courseId: courses[8].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'Aggregation works' }]
      },
      {
        title: 'Subquery',
        description: 'Find users with above-average orders',
        starterCode: '-- Your SQL code here\n-- Use subquery to find average',
        languageId: 82,
        expectedOutput: 'Subquery result',
        courseId: courses[8].id,
        difficulty: 'hard',
        testCases: [{ input: '', expected: 'Subquery works' }]
      },
      {
        title: 'Index Creation',
        description: 'Create an index on email column',
        starterCode: '-- Your SQL code here\nCREATE INDEX idx_email ON users(email);',
        languageId: 82,
        expectedOutput: 'Index created',
        courseId: courses[8].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: 'Index created' }]
      },

      // ========================================
      // Machine Learning with Python (Course 10) - 6 questions
      // ========================================
      {
        title: 'Linear Regression',
        description: 'Implement simple linear regression',
        starterCode: 'import numpy as np\n\ndef linear_regression(X, y):\n    # Your code here\n    pass\n\nX = np.array([1, 2, 3, 4, 5])\ny = np.array([2, 4, 6, 8, 10])\nprint(linear_regression(X, y))',
        languageId: 71,
        expectedOutput: 'slope=2.0, intercept=0.0',
        courseId: courses[9].id,
        difficulty: 'medium',
        testCases: [{ input: 'X=[1,2,3,4,5], y=[2,4,6,8,10]', expected: 'slope=2.0' }]
      },
      {
        title: 'K-Means Clustering',
        description: 'Implement K-means clustering algorithm',
        starterCode: 'def kmeans(data, k):\n    # Your code here\n    pass',
        languageId: 71,
        expectedOutput: 'Clusters formed',
        courseId: courses[9].id,
        difficulty: 'hard',
        testCases: [{ input: 'k=3', expected: 'Clusters' }]
      },
      {
        title: 'Decision Tree',
        description: 'Build a simple decision tree classifier',
        starterCode: 'def decision_tree(X, y):\n    # Your code here\n    pass',
        languageId: 71,
        expectedOutput: 'Tree built',
        courseId: courses[9].id,
        difficulty: 'hard',
        testCases: [{ input: '', expected: 'Tree works' }]
      },
      {
        title: 'Data Normalization',
        description: 'Normalize data using min-max scaling',
        starterCode: 'def normalize(data):\n    # Your code here\n    pass\n\nprint(normalize([1, 2, 3, 4, 5]))',
        languageId: 71,
        expectedOutput: '[0.0, 0.25, 0.5, 0.75, 1.0]',
        courseId: courses[9].id,
        difficulty: 'easy',
        testCases: [{ input: '[1,2,3,4,5]', expected: '[0.0, 0.25, 0.5, 0.75, 1.0]' }]
      },
      {
        title: 'Train-Test Split',
        description: 'Split data into training and testing sets',
        starterCode: 'def train_test_split(X, y, test_size=0.2):\n    # Your code here\n    pass',
        languageId: 71,
        expectedOutput: 'Data split',
        courseId: courses[9].id,
        difficulty: 'medium',
        testCases: [{ input: 'test_size=0.2', expected: 'Split works' }]
      },
      {
        title: 'Confusion Matrix',
        description: 'Calculate confusion matrix for predictions',
        starterCode: 'def confusion_matrix(y_true, y_pred):\n    # Your code here\n    pass',
        languageId: 71,
        expectedOutput: 'Matrix calculated',
        courseId: courses[9].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'Matrix works' }]
      },

      // ========================================
      // Mobile App Development (Course 11) - 5 questions
      // ========================================
      {
        title: 'React Native Component',
        description: 'Create a simple mobile component',
        starterCode: 'import React from "react";\nimport { View, Text } from "react-native";\n\nfunction Welcome() {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: 'Component renders',
        courseId: courses[10].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: 'Component works' }]
      },
      {
        title: 'FlatList Implementation',
        description: 'Render a list with FlatList',
        starterCode: 'import { FlatList } from "react-native";\n\nfunction List({ data }) {\n  // Your code here\n}',
        languageId: 63,
        expectedOutput: 'List renders',
        courseId: courses[10].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'List works' }]
      },
      {
        title: 'Navigation Setup',
        description: 'Set up React Navigation',
        starterCode: '// Your code here\n// Configure stack navigator',
        languageId: 63,
        expectedOutput: 'Navigation configured',
        courseId: courses[10].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'Navigation works' }]
      },
      {
        title: 'AsyncStorage',
        description: 'Store and retrieve data with AsyncStorage',
        starterCode: 'import AsyncStorage from "@react-native-async-storage/async-storage";\n\nasync function storeData(key, value) {\n  // Your code here\n}',
        languageId: 63,
        expectedOutput: 'Storage works',
        courseId: courses[10].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'Storage works' }]
      },
      {
        title: 'Camera Integration',
        description: 'Integrate device camera',
        starterCode: '// Your code here\n// Use expo-camera or react-native-camera',
        languageId: 63,
        expectedOutput: 'Camera integrated',
        courseId: courses[10].id,
        difficulty: 'hard',
        testCases: [{ input: '', expected: 'Camera works' }]
      },

      // ========================================
      // DevOps and Cloud Computing (Course 12) - 5 questions
      // ========================================
      {
        title: 'Dockerfile Creation',
        description: 'Write a Dockerfile for a Node.js application',
        starterCode: '# Your Dockerfile here\nFROM node:14\n# Add instructions',
        languageId: 89,
        expectedOutput: 'Dockerfile created',
        courseId: courses[11].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'Dockerfile works' }]
      },
      {
        title: 'Docker Compose',
        description: 'Create docker-compose.yml for multi-container setup',
        starterCode: '# Your docker-compose.yml here\nversion: "3.8"\nservices:\n  # Add services',
        languageId: 89,
        expectedOutput: 'Compose file created',
        courseId: courses[11].id,
        difficulty: 'medium',
        testCases: [{ input: '', expected: 'Compose works' }]
      },
      {
        title: 'CI/CD Pipeline',
        description: 'Write a GitHub Actions workflow',
        starterCode: '# .github/workflows/ci.yml\nname: CI\non: [push]\njobs:\n  # Your job here',
        languageId: 89,
        expectedOutput: 'Pipeline configured',
        courseId: courses[11].id,
        difficulty: 'hard',
        testCases: [{ input: '', expected: 'Pipeline works' }]
      },
      {
        title: 'Kubernetes Deployment',
        description: 'Create a Kubernetes deployment manifest',
        starterCode: '# Your deployment.yml here\napiVersion: apps/v1\nkind: Deployment\n# Add specifications',
        languageId: 89,
        expectedOutput: 'Deployment created',
        courseId: courses[11].id,
        difficulty: 'hard',
        testCases: [{ input: '', expected: 'Deployment works' }]
      },
      {
        title: 'Terraform Configuration',
        description: 'Write Terraform config for AWS EC2',
        starterCode: '# Your main.tf here\nprovider "aws" {\n  region = "us-east-1"\n}\n\n# Add resource',
        languageId: 89,
        expectedOutput: 'Terraform config',
        courseId: courses[11].id,
        difficulty: 'hard',
        testCases: [{ input: '', expected: 'Config works' }]
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`\n📚 Created ${courses.length} courses`);
    console.log(`❓ Created questions for all courses`);
    
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