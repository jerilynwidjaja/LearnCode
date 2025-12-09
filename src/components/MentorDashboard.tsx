import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Star, Clock, MapPin, Award, Send, User, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import { MentorService } from '../services/mentorService';

interface Mentor {
  id: number;
  firstName: string;
  lastName: string;
  bio: string;
  yearsOfExperience: number;
  areasOfStrength: string[];
  mentoringExperience: string;
  languagePreferences: string[];
  currentLocation: string;
  availability: string;
  matchScore: number;
}

interface Match {
  id: number;
  status: string;
  requestMessage: string;
  responseMessage: string;
  matchScore: number;
  mentor: {
    id: number;
    firstName: string;
    lastName: string;
    bio: string;
    areasOfStrength: string[];
  };
  mentee: {
    id: number;
    firstName: string;
    lastName: string;
    bio: string;
    learningGoals: string[];
  };
  createdAt: string;
}

interface ChatMessage {
  id: number;
  message: string;
  messageType: string;
  createdAt: string;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

const MentorDashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'find' | 'matches' | 'chat'>('find');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mentorsData, matchesData] = await Promise.all([
        MentorService.getAvailableMentors(),
        MentorService.getUserMatches()
      ]);
      setMentors(mentorsData);
      setMatches(matchesData);
    } catch (error) {
      toast.error('Failed to load mentor data');
    } finally {
      setLoading(false);
    }
  };

  const requestMentorship = async (mentorId: number) => {
    try {
      const message = prompt('Enter a message for your mentorship request:');
      if (!message) return;

      await MentorService.requestMentorship(mentorId, message);
      toast.success('Mentorship request sent!');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const respondToRequest = async (matchId: number, status: 'accepted' | 'declined') => {
    try {
      const message = prompt(`Enter a response message:`);
      if (!message) return;

      await MentorService.respondToRequest(matchId, status, message);
      toast.success(`Request ${status}!`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to respond');
    }
  };

  const loadChat = async (match: Match) => {
    try {
      setSelectedMatch(match);
      const messages = await MentorService.getChatMessages(match.id);
      setChatMessages(messages);
      setActiveTab('chat');
    } catch (error) {
      toast.error('Failed to load chat');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch) return;

    try {
      await MentorService.sendMessage(selectedMatch.id, newMessage);
      setNewMessage('');
      loadChat(selectedMatch);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mentor-Mentee Program</h1>
        <p className="text-gray-600 dark:text-gray-300">Connect with experienced developers and grow together</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('find')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'find'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Find Mentors ({mentors.length})
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'matches'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Heart className="h-4 w-4 inline mr-2" />
              My Matches ({matches.length})
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <MessageCircle className="h-4 w-4 inline mr-2" />
              Chat
            </button>
          </nav>
        </div>

        <div className="p-8">
          {/* Find Mentors Tab */}
          {activeTab === 'find' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {mentor.firstName[0]}{mentor.lastName[0]}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {mentor.firstName} {mentor.lastName}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          {mentor.matchScore}% match
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {mentor.bio}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Award className="h-3 w-3 mr-2" />
                      {mentor.yearsOfExperience} years experience
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="h-3 w-3 mr-2" />
                      {mentor.currentLocation}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="h-3 w-3 mr-2" />
                      {mentor.availability}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {mentor.areasOfStrength.slice(0, 3).map((area, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => requestMentorship(mentor.id)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Request Mentorship
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Matches Tab */}
          {activeTab === 'matches' && (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {match.mentor.firstName[0]}{match.mentor.lastName[0]}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {match.mentor.firstName} {match.mentor.lastName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          match.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          match.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {match.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {match.status === 'pending' && (
                        <>
                          <button
                            onClick={() => respondToRequest(match.id, 'accepted')}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => respondToRequest(match.id, 'declined')}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {match.status === 'accepted' && (
                        <button
                          onClick={() => loadChat(match)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Chat
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    <strong>Request:</strong> {match.requestMessage}
                  </p>
                  {match.responseMessage && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <strong>Response:</strong> {match.responseMessage}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="h-96 flex flex-col">
              {selectedMatch ? (
                <>
                  <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Chat with {selectedMatch.mentor.firstName} {selectedMatch.mentor.lastName}
                    </h3>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {message.sender.firstName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {message.sender.firstName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                    <p>Select a match to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;