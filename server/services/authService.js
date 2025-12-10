import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Mentor, Mentee } from '../models/index.js';

export class AuthService {
  static async registerUser(userData) {
    const { email, password, firstName, lastName, role } = userData;
    
    // Validate role
    if (!role || !['mentor', 'mentee', 'none'].includes(role)) {
      throw new Error('Valid role (mentor, mentee, or none) is required');
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role
    });

    // Create corresponding mentor or mentee record based on role
    if (role === 'mentor') {
      await Mentor.create({
        userId: user.id,
        yearsOfExperience: 0,
        areasOfStrength: [],
        areasOfExpertise: [],
        mentoringExperience: '',
        availability: '',
        bio: '',
        isActive: true,
        currentMenteeCount: 0,
        maxMentees: 3
      });
    } else if (role === 'mentee') {
      await Mentee.create({
        userId: user.id,
        careerStage: '',
        learningGoals: [],
        skills: [],
        timeAvailability: '',
        level: '',
        isActive: true
      });
    }

    // Generate token
    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        hasPreferences: false
      }
    };
  }

  static async loginUser(credentials) {
    const { email, password } = credentials;
  
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }
  
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }
  
    let mentorProfile = null;
    let menteeProfile = null;
    let hasPreferences = false;
    
    if (user.role === 'mentor' || user.role === 'both') {
      const mentor = await Mentor.findOne({ where: { userId: user.id } });
      if (mentor) {
        mentorProfile = mentor.toJSON();
        hasPreferences = !!(mentor.yearsOfExperience > 0 && 
          mentor.areasOfStrength?.length > 0 && mentor.bio);
      }
    }
    
    if (user.role === 'mentee' || user.role === 'both') {
      const mentee = await Mentee.findOne({ where: { userId: user.id } });
      if (mentee) {
        menteeProfile = mentee.toJSON();
        const menteeHasPreferences = !!(mentee.careerStage && 
          mentee.skills?.length > 0 && mentee.learningGoals?.length > 0);
        hasPreferences = hasPreferences || menteeHasPreferences;
      }
    }
  
    const token = this.generateToken(user.id);
  
    return {
      token,
      user: {
        id: user.id,           // ← Keep User ID
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        mentorProfile,         // ← Nested
        menteeProfile,         // ← Nested
        hasPreferences
      }
    };
  }

  static async changePassword(userId, passwordData) {
    const { currentPassword, newPassword } = passwordData;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await user.update({ password: hashedPassword });

    return { message: 'Password changed successfully' };
  }

  static async updateUserPreferences(userId, preferences) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    let hasPreferences = false;

    // Update preferences based on user role
    if (user.role === 'mentor') {
      const mentor = await Mentor.findOne({ where: { userId } });
      if (!mentor) {
        throw new Error('Mentor profile not found');
      }
      
      const updateData = {};
      if (preferences.yearsOfExperience !== undefined) updateData.yearsOfExperience = preferences.yearsOfExperience;
      if (preferences.areasOfStrength !== undefined) updateData.areasOfStrength = preferences.areasOfStrength;
      if (preferences.areasOfExpertise !== undefined) updateData.areasOfExpertise = preferences.areasOfExpertise;
      if (preferences.mentoringExperience !== undefined) updateData.mentoringExperience = preferences.mentoringExperience;
      if (preferences.availability !== undefined) updateData.availability = preferences.availability;
      if (preferences.bio !== undefined) updateData.bio = preferences.bio;
      if (preferences.languagePreferences !== undefined) updateData.languagePreferences = preferences.languagePreferences;
      if (preferences.currentLocation !== undefined) updateData.currentLocation = preferences.currentLocation;
      if (preferences.industry !== undefined) updateData.industry = preferences.industry;
      if (preferences.currentRole !== undefined) updateData.currentRole = preferences.currentRole;
      if (preferences.company !== undefined) updateData.company = preferences.company;

      await mentor.update(updateData);
      await mentor.reload();

      hasPreferences = !!(mentor.yearsOfExperience > 0 && 
        mentor.areasOfStrength?.length > 0 && mentor.bio);

    } else if (user.role === 'mentee') {
      const mentee = await Mentee.findOne({ where: { userId } });
      if (!mentee) {
        throw new Error('Mentee profile not found');
      }
      
      const updateData = {};
      if (preferences.careerStage !== undefined) updateData.careerStage = preferences.careerStage;
      if (preferences.skills !== undefined) updateData.skills = preferences.skills;
      if (preferences.learningGoals !== undefined) updateData.learningGoals = preferences.learningGoals;
      if (preferences.timeAvailability !== undefined) updateData.timeAvailability = preferences.timeAvailability;
      if (preferences.level !== undefined) updateData.level = preferences.level;
      if (preferences.languagePreferences !== undefined) updateData.languagePreferences = preferences.languagePreferences;
      if (preferences.currentLocation !== undefined) updateData.currentLocation = preferences.currentLocation;
      if (preferences.interests !== undefined) updateData.interests = preferences.interests;
      if (preferences.bio !== undefined) updateData.bio = preferences.bio;

      await mentee.update(updateData);
      await mentee.reload();

      hasPreferences = !!(mentee.careerStage && 
        mentee.skills?.length > 0 && mentee.learningGoals?.length > 0);
    }

    // Also update common user fields if provided
    const userUpdateData = {};
    if (preferences.firstName) userUpdateData.firstName = preferences.firstName;
    if (preferences.lastName) userUpdateData.lastName = preferences.lastName;
    
    if (Object.keys(userUpdateData).length > 0) {
      await user.update(userUpdateData);
    }

    return {
      message: 'Preferences updated successfully',
      user: {
        ...user.toJSON(),
        hasPreferences
      }
    };
  }

  static async getUserProfile(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
  
    let mentorProfile = null;
    let menteeProfile = null;
    let hasPreferences = false;
  
    if (user.role === 'mentor' || user.role === 'both') {
      const mentor = await Mentor.findOne({ where: { userId } });
      if (mentor) {
        mentorProfile = mentor.toJSON();
        hasPreferences = !!(mentor.yearsOfExperience > 0 && 
          mentor.areasOfStrength?.length > 0 && mentor.bio);
      }
    }
    
    if (user.role === 'mentee' || user.role === 'both') {
      const mentee = await Mentee.findOne({ where: { userId } });
      if (mentee) {
        menteeProfile = mentee.toJSON();
        const menteeHasPreferences = !!(mentee.careerStage && 
          mentee.skills?.length > 0 && mentee.learningGoals?.length > 0);
        hasPreferences = hasPreferences || menteeHasPreferences;
      }
    }
  
    // DON'T spread roleSpecificData - keep it nested!
    return {
      id: user.id,              // ← Keep User ID as 'id'
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      mentorProfile,            // ← Nested, won't overwrite 'id'
      menteeProfile,            // ← Nested, won't overwrite 'id'
      hasPreferences
    };
  }

  static generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );
  }
}