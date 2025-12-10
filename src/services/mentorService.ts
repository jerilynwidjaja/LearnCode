import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

export class MentorService {
  static async getAvailableMentors() {
    const response = await axios.get(`${API_BASE_URL}/mentors/available`);
    return response.data.mentors;
  }

  static async getUserMatches() {
    const response = await axios.get(`${API_BASE_URL}/mentors/matches`);
    return response.data.matches;
  }

  static async requestMentorship(mentorId: number, message: string) {
    const response = await axios.post(`${API_BASE_URL}/mentors/request`, {
      mentorId,
      message
    });
    return response.data.match;
  }

  static async respondToRequest(matchId: number, status: string, message: string) {
    const response = await axios.post(`${API_BASE_URL}/mentors/respond`, {
      matchId,
      status,
      message
    });
    return response.data.match;
  }

  static async getChatMessages(matchId: number) {
    const response = await axios.get(`${API_BASE_URL}/mentors/chat/${matchId}`);
    return response.data.messages;
  }

  static async sendMessage(matchId: number, message: string, messageType = 'text') {
    const response = await axios.post(`${API_BASE_URL}/mentors/chat/${matchId}`, {
      message,
      messageType
    });
    return response.data.message;
  }
}