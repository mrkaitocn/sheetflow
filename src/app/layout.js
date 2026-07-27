import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthProvider from '@/components/AuthProvider';

export const metadata = {
  title: 'SheetFlow — Công Cụ Tạo Hệ Thống Báo Cáo Google Sheets Dễ Dàng',
  description: 'Web app hỗ trợ người dùng tạo bảng báo cáo công việc trên Google Sheets kết nối Apps Script nhanh chóng, không cần lập trình.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
