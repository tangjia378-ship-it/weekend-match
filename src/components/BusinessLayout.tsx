import { ReactNode } from 'react';
import { BusinessSidebar } from './BusinessSidebar';
import { BusinessPage } from '../types/business';

interface BusinessLayoutProps {
  children: ReactNode;
  currentPage: BusinessPage;
  onPageChange: (page: BusinessPage) => void;
}

export const BusinessLayout: React.FC<BusinessLayoutProps> = ({
  children,
  currentPage,
  onPageChange,
}) => {
  return (
    <div className="flex min-h-screen bg-bg-soft">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <BusinessSidebar currentPage={currentPage} onPageChange={onPageChange} />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
        <div className="flex justify-around p-2">
          <MobileNavItem
            page="dashboard"
            label="工作台"
            isActive={currentPage === 'dashboard'}
            onClick={() => onPageChange('dashboard')}
          />
          <MobileNavItem
            page="jobs"
            label="岗位"
            isActive={currentPage === 'jobs'}
            onClick={() => onPageChange('jobs')}
          />
          <MobileNavItem
            page="applications"
            label="报名"
            isActive={currentPage === 'applications'}
            onClick={() => onPageChange('applications')}
          />
          <MobileNavItem
            page="messages"
            label="消息"
            isActive={currentPage === 'messages'}
            onClick={() => onPageChange('messages')}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
};

interface MobileNavItemProps {
  page: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors ${
        isActive ? 'text-business-600' : 'text-gray-500'
      }`}
    >
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );
};
