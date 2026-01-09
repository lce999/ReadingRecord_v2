
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student, BookEntry } from '../types';
import { sheetApi } from '../services/googleSheetService';
import { BookOpen, Calendar, Building2, Quote, FileText, Loader2, Save } from 'lucide-react';

interface BookFormProps {
  student: Student;
  onEntryAdded: (entry: BookEntry) => void;
}

const BookForm: React.FC<BookFormProps> = ({ student, onEntryAdded }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    publisher: '',
    impression: '',
    pages: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await sheetApi.addBookEntry(student, {
      date: formData.date,
      title: formData.title,
      publisher: formData.publisher,
      impression: formData.impression,
      pages: parseInt(formData.pages)
    });

    if (result.success && result.data) {
      onEntryAdded(result.data);
      alert('독서 기록이 저장되었습니다!');
      navigate('/');
    } else {
      alert(result.message || '저장 중 오류가 발생했습니다.');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Save className="text-white" size={20} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">새로운 독서 기록</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">읽은 날짜</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.date}
                  onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">페이지 수</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="예: 45"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.pages}
                  onChange={e => setFormData(prev => ({ ...prev, pages: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">책 제목</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                required
                placeholder="책 제목을 입력하세요"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">출판사</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                required
                placeholder="출판사를 입력하세요"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.publisher}
                onChange={e => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">소감 및 메모</label>
            <div className="relative">
              <Quote className="absolute left-3 top-4 text-gray-400" size={18} />
              <textarea
                required
                rows={4}
                placeholder="오늘 읽은 내용에 대해 자유롭게 적어주세요."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                value={formData.impression}
                onChange={e => setFormData(prev => ({ ...prev, impression: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
