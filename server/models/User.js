export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    careerStage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('skills');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('skills', JSON.stringify(value));
      }
    },
    learningGoals: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('learningGoals');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('learningGoals', JSON.stringify(value));
      }
    },
    timeAvailability: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Mentor-Mentee System Fields
    yearsOfExperience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    areasOfStrength: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('areasOfStrength');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('areasOfStrength', JSON.stringify(value));
      }
    },
    mentoringExperience: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    languagePreferences: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('languagePreferences');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('languagePreferences', JSON.stringify(value));
      }
    },
    currentLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    joinMentorProgram: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mentorRole: {
      type: DataTypes.STRING, // 'mentor', 'mentee', 'both'
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    availability: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return User;
};