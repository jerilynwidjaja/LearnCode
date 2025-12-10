export default (sequelize, DataTypes) => {
  const MentorMatch = sequelize.define('MentorMatch', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mentorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Mentors',
        key: 'id'
      }
    },
    menteeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Mentees',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending', // pending, accepted, declined, active, completed
    },
    matchScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    requestMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    responseMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    matchedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return MentorMatch;
};