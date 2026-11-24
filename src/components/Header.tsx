import { useState } from 'react';
import { Menu, X, Users, Briefcase } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigateToHome?: () => void;
  onNavigateToSchedule?: () => void;
  onNavigateToApplications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onNavigateToHome,
  onNavigateToSchedule,
  onNavigateToApplications,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">周末搭子</h1>
              <p className="text-xs text-gray-500">Weekend Match</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {currentRole === 'student' && (
              <>
                <button
                  onClick={onNavigateToHome}
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  找兼职
                </button>
                <button
                  onClick={onNavigateToSchedule}
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  我的时间
                </button>
                <button
                  onClick={onNavigateToApplications}
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  我的报名
                </button>
                <a href="#" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                  消息
                </a>
              </>
            )}
          </nav>

          {/* Role Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-gray-100 rounded-button p-1 flex items-center space-x-1">
              <button
                onClick={() => onRoleChange('student')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  currentRole === 'student'
                    ? 'bg-white text-primary-600 shadow-soft'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">学生端</span>
              </button>
              <button
                onClick={() => onRoleChange('business')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  currentRole === 'business'
                    ? 'bg-white text-business-600 shadow-soft'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span className="text-sm font-medium">商家端</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3">
              {currentRole === 'student' && (
                <>
                  <button
                    onClick={() => {
                      onNavigateToHome?.();
                      setMobileMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2 text-left"
                  >
                    找兼职
                  </button>
                  <button
                    onClick={() => {
                      onNavigateToSchedule?.();
                      setMobileMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2 text-left"
                  >
                    我的时间
                  </button>
                  <button
                    onClick={() => {
                      onNavigateToApplications?.();
                      setMobileMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2 text-left"
                  >
                    我的报名
                  </button>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                  >
                    消息
                  </a>
                </>
              )}
              <div className="pt-3 border-t border-gray-100">
                <div className="bg-gray-100 rounded-button p-1 flex flex-col space-y-1">
                  <button
                    onClick={() => {
                      onRoleChange('student');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all ${
                      currentRole === 'student'
                        ? 'bg-white text-primary-600 shadow-soft'
                        : 'text-gray-600'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">学生端</span>
                  </button>
                  <button
                    onClick={() => {
                      onRoleChange('business');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all ${
                      currentRole === 'business'
                        ? 'bg-white text-business-600 shadow-soft'
                        : 'text-gray-600'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm font-medium">商家端</span>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
