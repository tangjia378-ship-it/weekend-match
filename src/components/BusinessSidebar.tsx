import { LayoutDashboard, Briefcase, Users, MessageSquare } from 'lucide-react';
import { BusinessPage } from '../types/business';

interface BusinessSidebarProps {
  currentPage: BusinessPage;
  onPageChange: (page: BusinessPage) => void;
}

export const BusinessSidebar: React.FC<BusinessSidebarProps> = ({
  currentPage,
  onPageChange,
}) => {
  const menuItems = [
    { id: 'dashboard' as BusinessPage, label: '工作台', icon: LayoutDashboard },
    { id: 'jobs' as BusinessPage, label: '岗位管理', icon: Briefcase },
    { id: 'applications' as BusinessPage, label: '报名管理', icon: Users },
    { id: 'messages' as BusinessPage, label: '消息中心', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen flex-shrink-0">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900">商家中心</h2>
          <p className="text-sm text-gray-500 mt-1">招聘管理工作台</p>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-button transition-all ${
                  isActive
                    ? 'bg-business-500 text-white shadow-soft'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
