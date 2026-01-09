
import React from 'react';
import { Student, BookEntry } from '../types';
import { Book, Layers, Calendar, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  student: Student;
  history: BookEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ student, history }) => {
  const totalBooks = history.length;
  const totalPages = history.reduce((sum, entry) => sum + entry.pages, 0);
  
  const chartData = [...history].reverse().slice(-5).map(entry => ({
    title: entry.title.length > 8 ? entry.title.substring(0, 8) + '...' : entry.title,
    pages: entry.pages
  }));

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">안녕하세요, {student.name} 학생! 👋</h2>
        <p className="text-gray-500">오늘도 즐거운 독서 시간 되세요.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Book size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">읽은 도서</p>
            <h3 className="text-2xl font-bold text-gray-800">{totalBooks}권</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl text-green-600">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">누적 페이지</p>
            <h3 className="text-2xl font-bold text-gray-800">{totalPages}p</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hidden lg:flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">최근 기록일</p>
            <h3 className="text-xl font-bold text-gray-800">{history[0]?.date || '-'}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">최근 읽은 책 페이지 수</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pages" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#4f46e5' : '#818cf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">최근 읽은 목록</h3>
            <button className="text-indigo-600 text-sm font-medium hover:underline flex items-center">
              전체보기 <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-gray-400 text-center py-8">기록이 없습니다.</p>
            ) : (
              history.slice(0, 5).map((entry, idx) => (
                <div key={idx} className="flex flex-col border-b border-gray-50 pb-3 last:border-0">
                  <span className="text-sm font-bold text-gray-800 truncate">{entry.title}</span>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{entry.date}</span>
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{entry.pages}p</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
