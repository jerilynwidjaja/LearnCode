export default (sequelize, DataTypes) => {
    const Mentor = sequelize.define('Mentor', {
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
      yearsOfExperience: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      areasOfStrength: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        // Array of expertise areas
      },
      areasOfExpertise: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        // More detailed expertise breakdown
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: true,
        // Current or primary industry
      },
      currentRole: {
        type: DataTypes.STRING,
        allowNull: true,
        // Current job title
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
        // Current company
      },
      mentoringExperience: {
        type: DataTypes.TEXT,
        allowNull: true,
        // Description of previous mentoring experience
      },
      availability: {
        type: DataTypes.STRING,
        allowNull: true,
        // e.g., 'weekly', 'bi-weekly', 'monthly', 'flexible'
      },
      preferredMeetingFormat: {
        type: DataTypes.STRING,
        allowNull: true,
        // e.g., 'video-call', 'phone', 'in-person', 'chat', 'flexible'
      },
      maxMentees: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 3,
        // Maximum number of mentees they can handle
      },
      currentMenteeCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      languagePreferences: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
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
        // Professional biography
      },
      mentoringPhilosophy: {
        type: DataTypes.TEXT,
        allowNull: true,
        // Their approach to mentoring
      },
      idealMentee: {
        type: DataTypes.TEXT,
        allowNull: true,
        // Description of who they'd like to mentor
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
        // Whether currently accepting new mentees
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        // Whether the mentor profile has been verified
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        // Average rating from mentees
      },
      totalReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
  
    Mentor.associate = (models) => {
      // Association with User
      Mentor.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE'
      });
  
      // Association with MentorMatch (as mentor)
      Mentor.hasMany(models.MentorMatch, {
        foreignKey: 'mentorId',
        as: 'matches'
      });
    };
  
    return Mentor;
  };