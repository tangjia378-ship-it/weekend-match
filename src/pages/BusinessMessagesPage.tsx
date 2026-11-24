import { MessageSquare } from 'lucide-react';

export const BusinessMessagesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-soft py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">消息中心</h1>
          <p className="text-sm text-gray-600">查看和管理与学生的沟通消息</p>
        </div>

        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg mb-2">消息功能即将上线</p>
          <p className="text-gray-400 text-sm">您将能够在这里查看和回复学生的咨询</p>
        </div>
      </div>
    </div>
  );
};
