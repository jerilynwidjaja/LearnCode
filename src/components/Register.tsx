import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, Users, GraduationCap, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Register: React.FC = () => {
  const [step, setStep] = useState(1); // Step 1: Role selection, Step 2: Account details
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { isDarkMode } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role: 'mentor' | 'mentee' | 'none') => {
    setFormData({
      ...formData,
      role
    });
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      await register(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName,
        formData.role as 'mentor' | 'mentee' | 'none'
      ); 
    } catch (error) {
      // Error is handled in AuthContext
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Choose your role
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Select how you'd like to participate in our learning platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Mentor Card */}
            <button
              onClick={() => handleRoleSelect('mentor')}
              className="group relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 text-left"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Become a Mentor
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Share your knowledge and experience to guide others in their career journey
                  </p>
                </div>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>✓ Help others grow professionally</li>
                  <li>✓ Build your leadership skills</li>
                  <li>✓ Expand your network</li>
                </ul>
              </div>
            </button>

            {/* Mentee Card */}
            <button
              onClick={() => handleRoleSelect('mentee')}
              className="group relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500 dark:hover:border-green-400 text-left"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Find a Mentor
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Connect with experienced professionals to accelerate your growth
                  </p>
                </div>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>✓ Learn from experts</li>
                  <li>✓ Get career guidance</li>
                  <li>✓ Achieve your goals faster</li>
                </ul>
              </div>
            </button>

            {/* Skip Mentorship Card */}
            <button
              onClick={() => handleRoleSelect('none')}
              className="group relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gray-400 dark:hover:border-gray-500 text-left"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <X className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Skip for Now
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Just want to use the learning platform without mentorship
                  </p>
                </div>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>✓ Access all courses</li>
                  <li>✓ Track your progress</li>
                  <li>✓ Join later if interested</li>
                </ul>
              </div>
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <button
            onClick={() => setStep(1)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 mb-4 inline-flex items-center"
          >
            ← Back to role selection
          </button>
          <div className="mx-auto h-16 w-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
            {formData.role === 'mentor' ? (
              <GraduationCap className="h-8 w-8 text-white" />
            ) : formData.role === 'mentee' ? (
              <Users className="h-8 w-8 text-white" />
            ) : (
              <BookOpen className="h-8 w-8 text-white" />
            )}
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
            {formData.role !== 'none' && ` as a ${formData.role}`}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="First name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Last name"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Create a password (min 6 characters)"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;