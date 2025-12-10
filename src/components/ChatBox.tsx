import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Send, ArrowLeft, User, Check, CheckCheck, Clock, 
  MoreVertical, Phone, Video, Info, Paperclip, Smile,
  Code, FileText, Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { MentorService } from '../services/mentorService';

interface ChatMessage {
  id: number;
  message: string;
  messageType: string;
  createdAt: string;
  isRead: boolean;
  readAt: string | null;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  };
  senderId: number;
}

interface Match {
  id: number;
  status: string;
  mentor: {
    id: number;
    firstName: string;
    lastName: string;
    bio: string;
    areasOfStrength: string[];
    profilePicture: string | null;
    availability: string;
  };
  mentee: {
    id: number;
    firstName: string;
    lastName: string;
    bio: string;
    learningGoals: string[];
    profilePicture: string | null;
    currentSkillLevel: string;
  };
}

const ChatPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Determine other user (mentor or mentee)
  const otherUser = match 
    ? (user?.id === match.mentor.id ? match.mentee : match.mentor)
    : null;

  const isMentor = match && user && user.id === match.mentor.id;

  useEffect(() => {
    if (matchId) {
      loadChatData();
      
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => {
        loadMessages();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatData = async () => {
    try {
      setLoading(true);
      const [matchesData, messagesData] = await Promise.all([
        MentorService.getUserMatches(),
        MentorService.getChatMessages(Number(matchId))
      ]);

      const currentMatch = matchesData.find((m: Match) => m.id === Number(matchId));
      if (!currentMatch) {
        toast.error('Match not found');
        navigate('/mentors');
        return;
      }

      setMatch(currentMatch);
      setMessages(messagesData);
    } catch (error) {
      toast.error('Failed to load chat');
      navigate('/mentors');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const messagesData = await MentorService.getChatMessages(Number(matchId));
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to refresh messages:', error);
    }
  };

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await MentorService.sendMessage(Number(matchId), newMessage.trim());
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!match || !otherUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Chat not found</p>
          <button
            onClick={() => navigate('/mentors')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Mentors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/mentors')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="relative">
                {otherUser.profilePicture ? (
                  <img
                    src={otherUser.profilePicture}
                    alt={`${otherUser.firstName} ${otherUser.lastName}`}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(otherUser.firstName, otherUser.lastName)}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>

              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {otherUser.firstName} {otherUser.lastName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isMentor ? 'Mentee' : 'Mentor'} • Active now
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Phone className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Video className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Info className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages List */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Start the conversation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Send your first message to {otherUser.firstName}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => {
                  const isCurrentUser = message.senderId === user?.id;
                  const showDate = index === 0 || 
                    new Date(messages[index - 1].createdAt).toDateString() !== 
                    new Date(message.createdAt).toDateString();

                  return (
                    <React.Fragment key={message.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                            {new Date(message.createdAt).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}

                      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-end space-x-2 max-w-md ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          {!isCurrentUser && (
                            <div className="flex-shrink-0">
                              {message.sender.profilePicture ? (
                                <img
                                  src={message.sender.profilePicture}
                                  alt={message.sender.firstName}
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                  {getInitials(message.sender.firstName, message.sender.lastName)}
                                </div>
                              )}
                            </div>
                          )}

                          <div>
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                isCurrentUser
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                              } ${message.messageType === 'code' ? 'font-mono text-sm' : ''}`}
                            >
                              {message.messageType === 'code' ? (
                                <pre className="whitespace-pre-wrap">{message.message}</pre>
                              ) : (
                                <p className="whitespace-pre-wrap">{message.message}</p>
                              )}
                            </div>

                            <div className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 dark:text-gray-400 ${isCurrentUser ? 'justify-end' : ''}`}>
                              <span>{formatTime(message.createdAt)}</span>
                              {isCurrentUser && (
                                <>
                                  {message.isRead ? (
                                    <CheckCheck className="h-3 w-3 text-blue-500" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <form onSubmit={sendMessage} className="flex items-end space-x-2">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                  <div className="absolute right-2 bottom-2 flex space-x-1">
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
                      title="Add emoji"
                    >
                      <Smile className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>

            <div className="flex items-center space-x-2 mt-2">
              <button
                type="button"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center"
              >
                <Paperclip className="h-4 w-4 mr-1" />
                Attach
              </button>
              <button
                type="button"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center"
              >
                <Code className="h-4 w-4 mr-1" />
                Code
              </button>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        {showInfo && (
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Profile */}
              <div className="text-center">
                {otherUser.profilePicture ? (
                  <img
                    src={otherUser.profilePicture}
                    alt={`${otherUser.firstName} ${otherUser.lastName}`}
                    className="h-20 w-20 rounded-full object-cover mx-auto mb-3"
                  />
                ) : (
                  <div className="h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-3">
                    {getInitials(otherUser.firstName, otherUser.lastName)}
                  </div>
                )}
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {otherUser.firstName} {otherUser.lastName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isMentor ? 'Your Mentee' : 'Your Mentor'}
                </p>
              </div>

              {/* Bio */}
              {otherUser.bio && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">About</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{otherUser.bio}</p>
                </div>
              )}

              {/* Areas/Goals */}
              {'areasOfStrength' in otherUser && otherUser.areasOfStrength && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Areas of Strength</h4>
                  <div className="flex flex-wrap gap-2">
                    {otherUser.areasOfStrength.map((area: string) => (
                      <span key={area} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {'learningGoals' in otherUser && otherUser.learningGoals && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Learning Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    {otherUser.learningGoals.map((goal: string) => (
                      <span key={goal} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Match Info */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Match Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                      {match.status}
                    </span>
                  </div>
                  {'availability' in otherUser && otherUser.availability && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Availability</span>
                      <span className="text-gray-900 dark:text-white">{otherUser.availability}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;