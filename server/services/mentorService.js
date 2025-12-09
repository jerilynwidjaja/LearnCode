import { User, MentorMatch, ChatMessage } from '../models/index.js';
import { Op } from 'sequelize';

export class MentorService {
  static async getAvailableMentors(userId) {
    const mentors = await User.findAll({
      where: {
        id: { [Op.ne]: userId },
        joinMentorProgram: true,
        mentorRole: { [Op.in]: ['mentor', 'both'] }
      },
      attributes: [
        'id', 'firstName', 'lastName', 'bio', 'yearsOfExperience',
        'areasOfStrength', 'mentoringExperience', 'languagePreferences',
        'currentLocation', 'availability'
      ]
    });

    return mentors.map(mentor => ({
      ...mentor.toJSON(),
      matchScore: this.calculateMatchScore(mentor, userId)
    }));
  }

  static calculateMatchScore(mentor, userId) {
    // Simple scoring algorithm - can be enhanced with AI later
    let score = 50;
    
    // Experience level matching
    if (mentor.yearsOfExperience >= 3) score += 20;
    if (mentor.mentoringExperience === 'experienced') score += 15;
    else if (mentor.mentoringExperience === 'some experience') score += 10;
    
    // Random factor for demo
    score += Math.floor(Math.random() * 15);
    
    return Math.min(100, score);
  }

  static async getUserMatches(userId) {
    const matches = await MentorMatch.findAll({
      where: {
        [Op.or]: [
          { mentorId: userId },
          { menteeId: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'mentor',
          attributes: ['id', 'firstName', 'lastName', 'bio', 'areasOfStrength']
        },
        {
          model: User,
          as: 'mentee',
          attributes: ['id', 'firstName', 'lastName', 'bio', 'learningGoals']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return matches;
  }

  static async requestMentorship(menteeId, mentorId, message) {
    const existingMatch = await MentorMatch.findOne({
      where: {
        mentorId,
        menteeId,
        status: { [Op.in]: ['pending', 'accepted', 'active'] }
      }
    });

    if (existingMatch) {
      throw new Error('Mentorship request already exists');
    }

    const match = await MentorMatch.create({
      mentorId,
      menteeId,
      status: 'pending',
      requestMessage: message,
      matchScore: 85 // Calculate based on compatibility
    });

    return match;
  }

  static async respondToRequest(userId, matchId, status, message) {
    const match = await MentorMatch.findOne({
      where: {
        id: matchId,
        mentorId: userId
      }
    });

    if (!match) {
      throw new Error('Match not found or unauthorized');
    }

    await match.update({
      status,
      responseMessage: message,
      matchedAt: status === 'accepted' ? new Date() : null
    });

    return match;
  }

  static async getChatMessages(userId, matchId) {
    const match = await MentorMatch.findOne({
      where: {
        id: matchId,
        [Op.or]: [
          { mentorId: userId },
          { menteeId: userId }
        ]
      }
    });

    if (!match) {
      throw new Error('Unauthorized access to chat');
    }

    const messages = await ChatMessage.findAll({
      where: { matchId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    // Mark messages as read
    await ChatMessage.update(
      { isRead: true, readAt: new Date() },
      {
        where: {
          matchId,
          receiverId: userId,
          isRead: false
        }
      }
    );

    return messages;
  }

  static async sendMessage(senderId, matchId, message, messageType = 'text') {
    const match = await MentorMatch.findOne({
      where: {
        id: matchId,
        [Op.or]: [
          { mentorId: senderId },
          { menteeId: senderId }
        ]
      }
    });

    if (!match) {
      throw new Error('Unauthorized access to chat');
    }

    const receiverId = match.mentorId === senderId ? match.menteeId : match.mentorId;

    const chatMessage = await ChatMessage.create({
      senderId,
      receiverId,
      matchId,
      message,
      messageType
    });

    return chatMessage;
  }
}