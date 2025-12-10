import React, { useState, useEffect, useRef } from 'react';
import { Users, MessageCircle, Star, Clock, MapPin, Award, Send, Heart, CheckCircle, XCircle, AlertCircle, Briefcase, Code, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import { MentorService } from '../services/mentorService';
import { useAuth } from '../contexts/AuthContext';

interface Mentor {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  bio: string;
  yearsOfExperience: number;
  areasOfStrength: string[];
  areasOfExpertise: string[];
  mentoringExperience: string;
  languagePreferences: string[];
  currentLocation: string;
  availability: string;
  industry: string;
  currentRole: string;
  company: string;
  rating: number | null;
  totalReviews: number;
  currentMenteeCount: number;
  maxMentees: number;
  matchScore: number;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Match {
  id: number;
  status: string;
  requestMessage: string;
  responseMessage: string;
  matchScore: number;
  mentor: {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    bio: string;
    areasOfStrength: string[];
    yearsOfExperience: number;
    user?: {
      firstName: string;
      lastName: string;
    };
  };
  mentee: {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    bio: string;
    learningGoals: string[];
    careerStage: string;
    user?: {
      firstName: string;
      lastName: string;
    };
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
  senderId: number;
}

const MentorDashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'find' | 'matches' | 'chat'>('matches');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Check if user has mentor or mentee role
  const isMentor = user?.role === 'mentor';
  const isMentee = user?.role === 'mentee';
  const hasNoRole = user?.role === 'none';

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const matchesData = await MentorService.getUserMatches();
      console.log('Matches data received:', matchesData);
      setMatches(matchesData);
      
      if (isMentee) {
        const mentorsData = await MentorService.getAvailableMentors();
        console.log('Mentors data received:', mentorsData);
        setMentors(mentorsData);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const requestMentorship = async (mentor: Mentor) => {
    try {
      const message = prompt('Enter a message for your mentorship request (tell them why you want them as your mentor):');
      if (!message || message.trim() === '') {
        toast.error('Please enter a message');
        return;
      }

      await MentorService.requestMentorship(mentor.userId, message);
      toast.success('Mentorship request sent successfully!');
      await fetchData();
      setActiveTab('matches');
    } catch (error: any) {
      console.error('Request error:', error);
      toast.error(error.message || 'Failed to send request');
    }
  };

  const respondToRequest = async (matchId: number, status: 'accepted' | 'declined') => {
    try {
      const message = prompt(`Enter a response message:`);
      if (!message || message.trim() === '') {
        toast.error('Please enter a message');
        return;
      }

      await MentorService.respondToRequest(matchId, status, message);
      toast.success(`Request ${status}!`);
      await fetchData();
    } catch (error: any) {
      console.error('Response error:', error);
      toast.error(error.message || 'Failed to respond');
    }
  };

  const loadChat = async (match: Match) => {
    try {
      setSelectedMatch(match);
      const messages = await MentorService.getChatMessages(match.id);
      console.log('Chat messages received:', messages);
      setChatMessages(messages);
      setActiveTab('chat');
    } catch (error: any) {
      console.error('Load chat error:', error);
      toast.error(error.message || 'Failed to load chat');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch) return;

    try {
      await MentorService.sendMessage(selectedMatch.id, newMessage);
      setNewMessage('');
      await loadChat(selectedMatch);
    } catch (error: any) {
      console.error('Send message error:', error);
      toast.error(error.message || 'Failed to send message');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'declined':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getMentorDisplayName = (mentor: Mentor) => {
    const firstName = mentor.user?.firstName || mentor.firstName || 'Unknown';
    const lastName = mentor.user?.lastName || mentor.lastName || 'Mentor';
    return { firstName, lastName };
  };

  const getMatchPersonDisplayName = (person: any) => {
    const firstName = person.user?.firstName || person.firstName || 'Unknown';
    const lastName = person.user?.lastName || person.lastName || 'User';
    return { firstName, lastName };
  };

// SIMPLIFIED VERSION - NO MORE BUGS
const getOtherPersonInMatch = (match: Match) => {
  console.log('🔍 DEBUG: Finding other person in match');
  console.log('Current user ID:', user?.id);
  console.log('Mentor userId:', match.mentor.userId, '| Name:', match.mentor.firstName);
  console.log('Mentee userId:', match.mentee.userId, '| Name:', match.mentee.firstName);
  
  // Simple direct comparison - if my ID matches mentee's ID, show mentor
  // String comparison to be safe
  const myId = String(user?.id);
  const menteeId = String(match.mentee.userId);
  const mentorId = String(match.mentor.userId);
  
  console.log('String comparison:', {
    myId,
    menteeId,
    mentorId,
    matchesMentee: myId === menteeId,
    matchesMentor: myId === mentorId
  });
  
  let otherPerson;
  if (myId === menteeId) {
    // I am the mentee, so show the mentor
    otherPerson = match.mentor;
    console.log('✅ I am mentee (userId:', myId, ') → Showing MENTOR:', match.mentor.firstName);
  } else if (myId === mentorId) {
    // I am the mentor, so show the mentee
    otherPerson = match.mentee;
    console.log('✅ I am mentor (userId:', myId, ') → Showing MENTEE:', match.mentee.firstName);
  } else {
    // Fallback - shouldn't happen
    console.log(myId)
    console.error('❌ USER ID DOES NOT MATCH EITHER ROLE!');
    otherPerson = match.mentee;
  }
  
  console.log('Final result - showing:', otherPerson.firstName, otherPerson.lastName);
  
  return { otherPerson, isCurrentUserMentee: myId === menteeId };
};

  if (hasNoRole) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Mentorship Program Not Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You chose to skip the mentor-mentee program during registration. 
            To access this feature, please update your profile to become a mentor or mentee.
          </p>
          <button
            onClick={() => window.location.href = '/profile'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Profile
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading mentor dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mentor-Mentee Program
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {isMentor && 'Manage your mentees and help others grow'}
          {isMentee && 'Connect with experienced developers and grow together'}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            {isMentee && (
              <button
                onClick={() => setActiveTab('find')}
                className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'find'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Find Mentors ({mentors.length})
              </button>
            )}
            
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'matches'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <Heart className="h-4 w-4 inline mr-2" />
              {isMentor ? 'My Mentees' : 'My Mentors'} ({matches.length})
            </button>
            
            <button
              onClick={() => setActiveTab('chat')}
              disabled={!selectedMatch}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <MessageCircle className="h-4 w-4 inline mr-2" />
              {selectedMatch ? (() => {
                const { otherPerson } = getOtherPersonInMatch(selectedMatch);
                const { firstName } = getMatchPersonDisplayName(otherPerson);
                return `Chat with ${firstName}`;
              })() : 'Chat'}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'find' && isMentee && (
            <div>
              {mentors.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No mentors available at the moment. Check back later!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mentors.map((mentor) => {
                    const { firstName, lastName } = getMentorDisplayName(mentor);
                    
                    return (
                      <div
                        key={mentor.id}
                        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                              {firstName[0]}{lastName[0]}
                            </div>
                            <div className="ml-3">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                {firstName} {lastName}
                              </h3>
                              <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                                <Star className="h-4 w-4 mr-1 fill-yellow-500" />
                                {mentor.matchScore || 0}% match
                              </div>
                            </div>
                          </div>
                        </div>

                        {(mentor.currentRole || mentor.company) && (
                          <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg px-3 py-2">
                            <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {mentor.currentRole || 'Professional'}
                              {mentor.company && ` @ ${mentor.company}`}
                            </span>
                          </div>
                        )}

                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {mentor.bio || 'Experienced professional ready to mentor and guide.'}
                        </p>

                        <div className="space-y-2 mb-4">
                          {mentor.yearsOfExperience > 0 && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <Award className="h-4 w-4 mr-2 flex-shrink-0 text-orange-500" />
                              <span className="font-medium">{mentor.yearsOfExperience}</span> years experience
                            </div>
                          )}
                          {mentor.currentLocation && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-red-500" />
                              {mentor.currentLocation}
                            </div>
                          )}
                          {mentor.availability && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-green-500" />
                              {mentor.availability}
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Users className="h-4 w-4 mr-2 flex-shrink-0 text-purple-500" />
                            <span className="font-medium">{mentor.currentMenteeCount || 0}/{mentor.maxMentees || 0}</span> mentees
                          </div>
                        </div>

                        {mentor.areasOfStrength && mentor.areasOfStrength.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                              <Code className="h-3 w-3 mr-1" />
                              Skills:
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {mentor.areasOfStrength.slice(0, 3).map((area, index) => (
                                <span
                                  key={index}
                                  className="px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full shadow-sm"
                                >
                                  {area}
                                </span>
                              ))}
                              {mentor.areasOfStrength.length > 3 && (
                                <span className="px-2.5 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                                  +{mentor.areasOfStrength.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => requestMentorship(mentor)}
                          disabled={mentor.currentMenteeCount >= mentor.maxMentees}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          {mentor.currentMenteeCount >= mentor.maxMentees
                            ? '🔒 Mentor Full'
                            : '✨ Request Mentorship'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'matches' && (
            <div>
              {matches.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {isMentee && 'No matches yet. Start by requesting mentorship from available mentors!'}
                    {isMentor && 'No mentorship requests yet. Mentees will be able to send you requests!'}
                  </p>
                  {isMentee && (
                    <button
                      onClick={() => setActiveTab('find')}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Find Mentors
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.map((match) => {
                    const { otherPerson } = getOtherPersonInMatch(match);
                    const { firstName, lastName } = getMatchPersonDisplayName(otherPerson);
                    
                    return (
                      <div
                        key={match.id}
                        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                              {firstName[0]}{lastName[0]}
                            </div>
                            <div className="ml-3">
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                {firstName} {lastName}
                              </h3>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                                  match.status
                                )}`}
                              >
                                {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {match.status === 'pending' && isMentor && (
                              <>
                                <button
                                  onClick={() => respondToRequest(match.id, 'accepted')}
                                  className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => respondToRequest(match.id, 'declined')}
                                  className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 shadow-sm"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Decline
                                </button>
                              </>
                            )}
                            {(match.status === 'accepted' || match.status === 'active') && (
                              <button
                                onClick={() => loadChat(match)}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                              >
                                <MessageCircle className="h-4 w-4 mr-1.5" />
                                Open Chat
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              📝 Request Message:
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {match.requestMessage}
                            </p>
                          </div>

                          {match.responseMessage && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                                💬 Response:
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {match.responseMessage}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                            <span className="flex items-center">
                              <Target className="h-3 w-3 mr-1" />
                              Match: {match.matchScore || 0}%
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(match.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-[650px] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              {selectedMatch ? (
                <>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-xl shadow-md">
                    <div className="flex items-center justify-between">
                      {(() => {
                        const { otherPerson } = getOtherPersonInMatch(selectedMatch);
                        const { firstName, lastName } = getMatchPersonDisplayName(otherPerson);
                        
                        return (
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/30">
                              {firstName[0]}{lastName[0]}
                            </div>
                            <div className="ml-3">
                              <h3 className="font-bold text-lg">
                                {firstName} {lastName}
                              </h3>
                              <p className="text-xs text-blue-100">
                                {selectedMatch.status === 'active' ? '🟢 Active' : selectedMatch.status === 'accepted' ? '✅ Connected' : '⏳ ' + selectedMatch.status}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                      <button
                        onClick={() => setActiveTab('matches')}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        <XCircle className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                          <MessageCircle className="h-10 w-10 opacity-50" />
                        </div>
                        <p className="text-lg font-medium mb-1">No messages yet</p>
                        <p className="text-sm">Start the conversation by sending a message!</p>
                      </div>
                    ) : (
                      <>
                        {chatMessages.map((message, index) => {
                          const isOwnMessage = message.senderId === user?.id;
                          const showAvatar = index === 0 || chatMessages[index - 1].senderId !== message.senderId;
                          
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${
                                !showAvatar && 'mt-1'
                              }`}
                            >
                              <div className={`flex items-end gap-2 max-w-[75%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                {showAvatar ? (
                                  <div 
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md ${
                                      isOwnMessage 
                                        ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                                        : 'bg-gradient-to-br from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700'
                                    }`}
                                  >
                                    {message.sender.firstName?.[0] || 'U'}{message.sender.lastName?.[0] || 'U'}
                                  </div>
                                ) : (
                                  <div className="w-9" />
                                )}
                                
                                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                                  {showAvatar && (
                                    <div className="flex items-center gap-2 mb-1 px-1">
                                      <span className={`text-xs font-semibold ${isOwnMessage ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {isOwnMessage ? 'You' : message.sender.firstName || 'User'}
                                      </span>
                                      <span className="text-xs text-gray-400">
                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </span>
                                    </div>
                                  )}
                                  <div
                                    className={`${
                                      isOwnMessage
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/50'
                                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md border border-gray-200 dark:border-gray-600'
                                    } px-4 py-2.5 rounded-2xl max-w-full break-words`}
                                  >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={chatEndRef} />
                      </>
                    )}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 rounded-b-xl">
                    <div className="flex items-end space-x-3">
                      <div className="flex-1 relative">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                          placeholder="Type your message... (Shift + Enter for new line)"
                          rows={2}
                          className="w-full p-3 pr-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none transition-all"
                        />
                      </div>
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none flex items-center justify-center"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Press Enter to send • Shift + Enter for new line
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-12 w-12 opacity-50" />
                    </div>
                    <p className="text-xl font-semibold mb-2">No chat selected</p>
                    <p className="text-sm">
                      Select a match from the "{isMentor ? 'My Mentees' : 'My Mentors'}" tab to start chatting
                    </p>
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