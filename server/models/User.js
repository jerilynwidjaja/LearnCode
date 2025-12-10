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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['mentor', 'mentee', 'both', 'none']]
      }
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

  User.associate = (models) => {
    User.hasOne(models.Mentor, {
      foreignKey: 'userId',
      as: 'mentorProfile',
      onDelete: 'CASCADE'
    });
    
    User.hasOne(models.Mentee, {
      foreignKey: 'userId',
      as: 'menteeProfile',
      onDelete: 'CASCADE'
    });

    // For chat messages
    User.hasMany(models.ChatMessage, {
      foreignKey: 'senderId',
      as: 'sentMessages'
    });
    
    User.hasMany(models.ChatMessage, {
      foreignKey: 'receiverId',
      as: 'receivedMessages'
    });
  };
  
  return User;
};