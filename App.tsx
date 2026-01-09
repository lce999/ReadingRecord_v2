
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Student, BookEntry } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BookForm from './components/BookForm';
import { BookOpen, LogOut, LayoutDashboard, PlusCircle } from 'lucide-react';

const PrivateRoute = ({ children, student }: { children?: React.ReactNode; student: Student | null }) => {
  return student ? <>{children}</> : <Navigate to="/login" />;
};

const Navigation = ({ onLogout }: { onLogout: () => void }) => {
  const navigate = useNavigate();
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
      <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BookOpen className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-gray-800 hidden sm:block">독서 기록장</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <LayoutDashboard size={18} />
            <span className="hidden sm:inline">대시보드</span>
          </button>
          <button 
            onClick={() => navigate('/add')} 
            className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">기록하기</span>
          </button>
          <button 
            onClick={onLogout} 
            className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors ml-4"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">로그아웃</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

function MainApp() {
  const [student, setStudent] = useState<Student | null>(() => {
    const saved = localStorage.getItem('student_session');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [history, setHistory] = useState<BookEntry[]>([]);

  const handleLoginSuccess = (user: Student, userHistory: BookEntry[]) => {
    setStudent(user);
    setHistory(userHistory);
    localStorage.setItem('student_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setStudent(null);
    setHistory([]);
    localStorage.removeItem('student_session');
  };

  const updateHistory = (newEntry: BookEntry) => {
    setHistory(prev => [newEntry, ...prev]);
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50">
        {student && <Navigation onLogout={handleLogout} />}
        <div className={`${student ? 'pt-20' : ''} max-w-7xl mx-auto p-4`}>
          <Routes>
            <Route 
              path="/login" 
              element={student ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />} 
            />
            <Route 
              path="/" 
              element={
                <PrivateRoute student={student}>
                  <Dashboard student={student!} history={history} />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/add" 
              element={
                <PrivateRoute student={student}>
                  <BookForm student={student!} onEntryAdded={updateHistory} />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}

export default MainApp;
