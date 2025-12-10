import { Sequelize } from 'sequelize';
import UserModel from './User.js';
import CourseModel from './Course.js';
import QuestionModel from './Question.js';
import UserProgressModel from './UserProgress.js';
import MentorMatchModel from './MentorMatch.js';
import ChatMessageModel from './ChatMessage.js';
import MentorModel from './Mentor.js';
import MenteeModel from './Mentee.js';

// Simple SQLite configuration for development
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
const Mentor = MentorModel(sequelize, Sequelize.DataTypes);
const Mentee = MenteeModel(sequelize, Sequelize.DataTypes);

// Course and Question associations
Course.hasMany(Question, { foreignKey: 'courseId', as: 'questions' });
Question.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// User Progress associations
User.hasMany(UserProgress, { foreignKey: 'userId', as: 'progress' });
UserProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Course.hasMany(UserProgress, { foreignKey: 'courseId', as: 'userProgress' });
UserProgress.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Question.hasMany(UserProgress, { foreignKey: 'questionId', as: 'userProgress' });
UserProgress.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

// User - Mentor/Mentee associations
User.hasOne(Mentor, { foreignKey: 'userId', as: 'mentorProfile', onDelete: 'CASCADE' });
Mentor.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });

User.hasOne(Mentee, { foreignKey: 'userId', as: 'menteeProfile', onDelete: 'CASCADE' });
Mentee.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });

// Mentor-Mentee Match associations
Mentor.hasMany(MentorMatch, { foreignKey: 'mentorId', as: 'matches' });
MentorMatch.belongsTo(Mentor, { foreignKey: 'mentorId', as: 'mentor' });

Mentee.hasMany(MentorMatch, { foreignKey: 'menteeId', as: 'matches' });
MentorMatch.belongsTo(Mentee, { foreignKey: 'menteeId', as: 'mentee' });

// User - MentorMatch associations (for backwards compatibility if needed)
User.hasMany(MentorMatch, { foreignKey: 'mentorId', as: 'mentorMatches' });
User.hasMany(MentorMatch, { foreignKey: 'menteeId', as: 'menteeMatches' });

// Chat associations
User.hasMany(ChatMessage, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(ChatMessage, { foreignKey: 'receiverId', as: 'receivedMessages' });
ChatMessage.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
ChatMessage.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

MentorMatch.hasMany(ChatMessage, { foreignKey: 'matchId', as: 'messages' });
ChatMessage.belongsTo(MentorMatch, { foreignKey: 'matchId', as: 'match' });

export { 
  sequelize, 
  User, 
  Course, 
  Question, 
  UserProgress, 
  MentorMatch, 
  ChatMessage,
  Mentor,
  Mentee
};