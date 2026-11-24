import { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { MySchedulePage } from './pages/MySchedulePage';
import { BusinessLayout } from './components/BusinessLayout';
import { BusinessDashboard } from './pages/BusinessDashboard';
import { BusinessJobsPage } from './pages/BusinessJobsPage';
import { BusinessApplicationsPage } from './pages/BusinessApplicationsPage';
import { BusinessMessagesPage } from './pages/BusinessMessagesPage';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider } from './contexts/ToastContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
import { UserRole } from './types';
import { BusinessPage } from './types/business';

type StudentPage = 'home' | 'applications' | 'schedule';

function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [currentStudentPage, setCurrentStudentPage] = useState<StudentPage>('home');
  const [currentBusinessPage, setCurrentBusinessPage] = useState<BusinessPage>('dashboard');

  const renderStudentPage = () => {
    switch (currentStudentPage) {
      case 'applications':
        return <MyApplicationsPage />;
      case 'schedule':
        return <MySchedulePage />;
      case 'home':
      default:
        return <HomePage currentRole={currentRole} />;
    }
  };

  const renderBusinessPage = () => {
    switch (currentBusinessPage) {
      case 'dashboard':
        return <BusinessDashboard />;
      case 'jobs':
        return <BusinessJobsPage />;
      case 'applications':
        return <BusinessApplicationsPage />;
      case 'messages':
        return <BusinessMessagesPage />;
      default:
        return <BusinessDashboard />;
    }
  };

  return (
    <DataProvider>
      <ScheduleProvider>
        <ToastProvider>
          <div className="min-h-screen bg-bg-soft">
            <Header
              currentRole={currentRole}
              onRoleChange={(role) => {
                setCurrentRole(role);
                setCurrentStudentPage('home');
                setCurrentBusinessPage('dashboard');
              }}
              onNavigateToHome={() => setCurrentStudentPage('home')}
              onNavigateToSchedule={() => setCurrentStudentPage('schedule')}
              onNavigateToApplications={() => setCurrentStudentPage('applications')}
            />

          {currentRole === 'student' ? (
            <main>{renderStudentPage()}</main>
          ) : (
            <BusinessLayout
              currentPage={currentBusinessPage}
              onPageChange={setCurrentBusinessPage}
            >
              {renderBusinessPage()}
            </BusinessLayout>
          )}

          <footer className="bg-white border-t border-gray-100 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-sm text-gray-500">
                <p className="mb-2">© 2024 周末搭子 Weekend Match - 大学生周末兼职匹配平台</p>
                <p className="text-xs text-gray-400">让周末时光更有价值 · MVP 演示版本</p>
              </div>
            </div>
          </footer>
        </div>
      </ToastProvider>
    </ScheduleProvider>
  </DataProvider>
  );
}

export default App;
