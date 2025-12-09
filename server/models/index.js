import { Sequelize } from 'sequelize';
import UserModel from './User.js';
import CourseModel from './Course.js';
import QuestionModel from './Question.js';
import UserProgressModel from './UserProgress.js';
import MentorMatchModel from './MentorMatch.js';
import ChatMessageModel from './ChatMessage.js';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const User = UserModel(sequelize, Sequelize.DataTypes);
const Course = CourseModel(sequelize, Sequelize.DataTypes);
const Question = QuestionModel(sequelize, Sequelize.DataTypes);
const UserProgress = UserProgressModel(sequelize, Sequelize.DataTypes);
const MentorMatch = MentorMatchModel(sequelize, Sequelize.DataTypes);
const ChatMessage = ChatMessageModel(sequelize, Sequelize.DataTypes);

// Define associations
Course.hasMany(Question, { foreignKey: 'courseId', as: 'questions' });
Question.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

User.hasMany(UserProgress, { foreignKey: 'userId', as: 'progress' });
UserProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Course.hasMany(UserProgress, { foreignKey: 'courseId', as: 'userProgress' });
UserProgress.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Question.hasMany(UserProgress, { foreignKey: 'questionId', as: 'userProgress' });
UserProgress.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

// Mentor-Mentee associations
User.hasMany(MentorMatch, { foreignKey: 'mentorId', as: 'mentorMatches' });
User.hasMany(MentorMatch, { foreignKey: 'menteeId', as: 'menteeMatches' });
MentorMatch.belongsTo(User, { foreignKey: 'mentorId', as: 'mentor' });
// Chat associations
User.hasMany(ChatMessage, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(ChatMessage, { foreignKey: 'receiverId', as: 'receivedMessages' });
ChatMessage.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
ChatMessage.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
MentorMatch.hasMany(ChatMessage, { foreignKey: 'matchId', as: 'messages' });
ChatMessage.belongsTo(MentorMatch, { foreignKey: 'matchId', as: 'match' });
MentorMatch.belongsTo(User, { foreignKey: 'menteeId', as: 'mentee' });

export { sequelize, User, Course, Question, UserProgress, MentorMatch, ChatMessage };