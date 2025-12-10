import { User, Mentor, Mentee, MentorMatch, ChatMessage } from '../models/index.js';
import { Op } from 'sequelize';

export class MentorService {
  /**
   * Get all available mentors (excluding the current user)
   */
  static async getAvailableMentors(userId) {
    try {
      const mentors = await Mentor.findAll({
        where: {
          userId: { [Op.ne]: userId },
          isActive: true
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            required: true
          }
        ]
      });
    
      console.log(`Found ${mentors.length} available mentors`);
    
      return mentors.map(mentor => ({
        id: mentor.id,
        userId: mentor.userId,
        firstName: mentor.user?.firstName || 'Unknown',
        lastName: mentor.user?.lastName || 'User',
        bio: mentor.bio || '',
        yearsOfExperience: mentor.yearsOfExperience || 0,
        areasOfStrength: mentor.areasOfStrength || [],
        areasOfExpertise: mentor.areasOfExpertise || [],
        mentoringExperience: mentor.mentoringExperience || '',
        languagePreferences: mentor.languagePreferences || [],
        currentLocation: mentor.currentLocation || '',
        availability: mentor.availability || '',
        industry: mentor.industry || '',
        currentRole: mentor.currentRole || '',
        company: mentor.company || '',
        rating: mentor.rating || null,
        totalReviews: mentor.totalReviews || 0,
        currentMenteeCount: mentor.currentMenteeCount || 0,
        maxMentees: mentor.maxMentees || 3,
        matchScore: this.calculateMatchScore(mentor, userId),
        user: {
          firstName: mentor.user?.firstName || 'Unknown',
          lastName: mentor.user?.lastName || 'User',
          email: mentor.user?.email || ''
        }
      }));
    } catch (error) {
      console.error('Error fetching mentors:', error);
      throw error;
    }
  }

  /**
   * Calculate match score between mentor and potential mentee
   */
  static calculateMatchScore(mentor, userId) {
    let score = 50;
    
    // Experience level matching
    if (mentor.yearsOfExperience >= 5) score += 20;
    else if (mentor.yearsOfExperience >= 3) score += 15;
    else if (mentor.yearsOfExperience >= 1) score += 10;
    
    // Mentoring experience
    if (mentor.mentoringExperience) {
      if (mentor.mentoringExperience.includes('experienced')) score += 15;
      else if (mentor.mentoringExperience.includes('some')) score += 10;
      else if (mentor.mentoringExperience.includes('first')) score += 5;
    }
    
    // Areas of strength bonus
    if (mentor.areasOfStrength && mentor.areasOfStrength.length > 0) {
      score += Math.min(mentor.areasOfStrength.length * 2, 10);
    }

    // Bio completeness
    if (mentor.bio && mentor.bio.length > 50) score += 5;
    
    // Availability check
    if (mentor.currentMenteeCount < mentor.maxMentees) score += 10;
    else score -= 20;
    
    // Random factor for variety
    score += Math.floor(Math.random() * 10);
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Get all matches for a user (both as mentor and mentee)
   */
  static async getUserMatches(userId) {
    try {
      // Find user's mentor and mentee profiles
      const userAsMentor = await Mentor.findOne({ where: { userId } });
      const userAsMentee = await Mentee.findOne({ where: { userId } });

      const whereConditions = [];
      
      if (userAsMentor) {
        whereConditions.push({ mentorId: userAsMentor.id });
      }
      
      if (userAsMentee) {
        whereConditions.push({ menteeId: userAsMentee.id });
      }

      if (whereConditions.length === 0) {
        return [];
      }

      const matches = await MentorMatch.findAll({
        where: {
          [Op.or]: whereConditions
        },
        include: [
          {
            model: Mentor,
            as: 'mentor',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email']
              }
            ]
          },
          {
            model: Mentee,
            as: 'mentee',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      console.log('Matches found:', matches.length);
      
      return matches.map(match => {
        const matchData = {
          id: match.id,
          status: match.status,
          matchScore: match.matchScore,
          requestMessage: match.requestMessage,
          responseMessage: match.responseMessage,
          matchedAt: match.matchedAt,
          completedAt: match.completedAt,
          createdAt: match.createdAt,
          mentor: {
            id: match.mentor.id,
            userId: match.mentor.userId,
            firstName: match.mentor.user.firstName,
            lastName: match.mentor.user.lastName,
            bio: match.mentor.bio,
            areasOfStrength: match.mentor.areasOfStrength,
            yearsOfExperience: match.mentor.yearsOfExperience,
            user: {
              firstName: match.mentor.user.firstName,
              lastName: match.mentor.user.lastName,
              email: match.mentor.user.email
            }
          },
          mentee: {
            id: match.mentee.id,
            userId: match.mentee.userId,
            firstName: match.mentee.user.firstName,
            lastName: match.mentee.user.lastName,
            bio: match.mentee.bio || '',
            learningGoals: match.mentee.learningGoals,
            careerStage: match.mentee.careerStage,
            user: {
              firstName: match.mentee.user.firstName,
              lastName: match.mentee.user.lastName,
              email: match.mentee.user.email
            }
          }
        };
        
        console.log('Match mapping:', {
          matchId: match.id,
          mentorUserId: matchData.mentor.userId,
          mentorName: `${matchData.mentor.firstName} ${matchData.mentor.lastName}`,
          menteeUserId: matchData.mentee.userId,
          menteeName: `${matchData.mentee.firstName} ${matchData.mentee.lastName}`
        });
        
        return matchData;
      });
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  /**
   * Request mentorship - mentee sends request to mentor
   * @param {number} menteeUserId - The user ID of the mentee
   * @param {number} mentorUserId - The user ID of the mentor
   * @param {string} message - Request message
   */
  static async requestMentorship(menteeUserId, mentorUserId, message) {
    try {
      // Get the mentee record
      const mentee = await Mentee.findOne({ where: { userId: menteeUserId } });
      if (!mentee) {
        throw new Error('Mentee profile not found. Please complete your profile first.');
      }

      // Get the mentor record
      const mentor = await Mentor.findOne({ where: { userId: mentorUserId } });
      if (!mentor) {
        throw new Error('Mentor not found');
      }

      // Check if mentor is accepting new mentees
      if (mentor.currentMenteeCount >= mentor.maxMentees) {
        throw new Error('Mentor has reached maximum mentee capacity');
      }

      // Check for existing match
      const existingMatch = await MentorMatch.findOne({
        where: {
          mentorId: mentor.id,
          menteeId: mentee.id,
          status: { [Op.in]: ['pending', 'accepted', 'active'] }
        }
      });

      if (existingMatch) {
        throw new Error('A mentorship request already exists between you and this mentor');
      }

      // Calculate match score
      const matchScore = this.calculateMatchScore(mentor, menteeUserId);

      const match = await MentorMatch.create({
        mentorId: mentor.id,
        menteeId: mentee.id,
        status: 'pending',
        requestMessage: message,
        matchScore
      });

      return match;
    } catch (error) {
      console.error('Error requesting mentorship:', error);
      throw error;
    }
  }

  /**
   * Mentor responds to a mentorship request
   */
  static async respondToRequest(mentorUserId, matchId, status, message) {
    try {
      // Get mentor record
      const mentor = await Mentor.findOne({ where: { userId: mentorUserId } });
      if (!mentor) {
        throw new Error('Mentor profile not found');
      }

      const match = await MentorMatch.findOne({
        where: {
          id: matchId,
          mentorId: mentor.id,
          status: 'pending'
        }
      });

      if (!match) {
        throw new Error('Match not found, already responded to, or unauthorized');
      }

      // Update match status
      const updateData = {
        status,
        responseMessage: message
      };

      if (status === 'accepted') {
        updateData.matchedAt = new Date();
        // Increment mentor's mentee count
        await mentor.increment('currentMenteeCount');
      }

      await match.update(updateData);

      return match;
    } catch (error) {
      console.error('Error responding to request:', error);
      throw error;
    }
  }

  /**
   * Get chat messages for a match
   */
  static async getChatMessages(userId, matchId) {
    try {
      // Check if user is part of this match
      const userAsMentor = await Mentor.findOne({ where: { userId } });
      const userAsMentee = await Mentee.findOne({ where: { userId } });

      const whereConditions = [];
      
      if (userAsMentor) {
        whereConditions.push({ mentorId: userAsMentor.id });
      }
      
      if (userAsMentee) {
        whereConditions.push({ menteeId: userAsMentee.id });
      }

      const match = await MentorMatch.findOne({
        where: {
          id: matchId,
          [Op.or]: whereConditions,
          status: { [Op.in]: ['accepted', 'active'] }
        }
      });

      if (!match) {
        throw new Error('Unauthorized access to chat or match not accepted');
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
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  }

  /**
   * Send a chat message
   */
  static async sendMessage(senderId, matchId, message, messageType = 'text') {
    try {
      // Check if user is part of this match
      const userAsMentor = await Mentor.findOne({ where: { userId: senderId } });
      const userAsMentee = await Mentee.findOne({ where: { userId: senderId } });

      const whereConditions = [];
      
      if (userAsMentor) {
        whereConditions.push({ mentorId: userAsMentor.id });
      }
      
      if (userAsMentee) {
        whereConditions.push({ menteeId: userAsMentee.id });
      }

      const match = await MentorMatch.findOne({
        where: {
          id: matchId,
          [Op.or]: whereConditions,
          status: { [Op.in]: ['accepted', 'active'] }
        },
        include: [
          {
            model: Mentor,
            as: 'mentor',
            attributes: ['userId']
          },
          {
            model: Mentee,
            as: 'mentee',
            attributes: ['userId']
          }
        ]
      });

      if (!match) {
        throw new Error('Unauthorized access to chat or match not accepted');
      }

      // Determine receiver (the other person in the match)
      const receiverId = match.mentor.userId === senderId 
        ? match.mentee.userId 
        : match.mentor.userId;

      const chatMessage = await ChatMessage.create({
        senderId,
        receiverId,
        matchId,
        message,
        messageType,
        isRead: false
      });

      // Update match to active status if it's the first message
      if (match.status === 'accepted') {
        await match.update({ status: 'active' });
      }

      return chatMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Complete/end a mentorship
   */
  static async completeMentorship(userId, matchId) {
    try {
      const userAsMentor = await Mentor.findOne({ where: { userId } });
      const userAsMentee = await Mentee.findOne({ where: { userId } });

      const whereConditions = [];
      
      if (userAsMentor) {
        whereConditions.push({ mentorId: userAsMentor.id });
      }
      
      if (userAsMentee) {
        whereConditions.push({ menteeId: userAsMentee.id });
      }

      const match = await MentorMatch.findOne({
        where: {
          id: matchId,
          [Op.or]: whereConditions
        },
        include: [
          {
            model: Mentor,
            as: 'mentor'
          }
        ]
      });

      if (!match) {
        throw new Error('Match not found or unauthorized');
      }

      await match.update({
        status: 'completed',
        completedAt: new Date()
      });

      // Decrement mentor's mentee count
      if (match.mentor) {
        await match.mentor.decrement('currentMenteeCount');
      }

      return match;
    } catch (error) {
      console.error('Error completing mentorship:', error);
      throw error;
    }
  }
}