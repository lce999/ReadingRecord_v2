
import { ApiResponse, Student, BookEntry } from '../types';

/**
 * Replace this URL with your deployed Google Apps Script Web App URL.
 */
const API_URL = 'https://script.google.com/macros/s/AKfycbwi_qsos20W-J4RpaIfP7w0hLKJBPnUB_kzcOwcYIimTuT5YEA8CdLsFwCUCUFlg3sObg/exec';

export const sheetApi = {
  async login(student: Student): Promise<ApiResponse<{ student: Student; history: BookEntry[] }>> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'login',
          ...student
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: '네트워크 오류가 발생했습니다.' };
    }
  },

  async addBookEntry(student: Student, entry: Omit<BookEntry, 'no' | 'cumulativePages'>): Promise<ApiResponse<BookEntry>> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'addEntry',
          student,
          entry
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Add entry failed:', error);
      return { success: false, message: '기록 저장 중 오류가 발생했습니다.' };
    }
  },

  async getDashboard(): Promise<ApiResponse<Student[]>> {
    try {
      const response = await fetch(`${API_URL}?action=getDashboard`);
      return await response.json();
    } catch (error) {
      console.error('Fetch dashboard failed:', error);
      return { success: false, message: '대시보드 로드 중 오류가 발생했습니다.' };
    }
  }
};
