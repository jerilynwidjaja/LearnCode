export default (sequelize, DataTypes) => {
    const Mentee = sequelize.define('Mentee', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      careerStage: {
        type: DataTypes.STRING,
        allowNull: true,
        // e.g., 'student', 'early-career', 'mid-career', 'career-change'
      },
      skills: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        // Array of current skills
      },
      learningGoals: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        // Array of what they want to learn
      },
      interests: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        // Array of interests/topics they're passionate about
      },
      timeAvailability: {
        type: DataTypes.STRING,
        allowNull: true,
        // e.g., 'weekly', 'bi-weekly', 'monthly', 'flexible'
      },
      preferredMeetingFormat: {
        type: DataTypes.STRING,
        allowNull: true,
        // e.g., 'video-call', 'phone', 'in-person', 'chat', 'flexible'
      },
      level: {
        type: DataTypes.STRING,
        allowNull: true,
        // e.g., 'beginner', 'intermediate', 'advanced'
      },
      languagePreferences: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        // Array of preferred languages
      },
      currentLocation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      timezone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
        // Personal introduction/background
      },
      goalDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        // Detailed description of what they hope to achieve
      },
      currentChallenges: {
        type: DataTypes.TEXT,
        allowNull: true,
        // Current obstacles or challenges they're facing
      },
      linkedinUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      githubUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      portfolioUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        // Whether actively seeking mentorship
      },
      matchPreferences: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
        // Specific preferences for mentor matching
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  
    Mentee.associate = (models) => {
      // Association with User
      Mentee.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE'
      });
  
      // Association with MentorMatch (as mentee)
      Mentee.hasMany(models.MentorMatch, {
        foreignKey: 'menteeId',
        as: 'matches'
      });
    };
  
    return Mentee;
  };