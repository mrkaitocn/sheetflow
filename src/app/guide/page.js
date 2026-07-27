'use client';

import { useState } from 'react';
import { FiCheckCircle, FiHelpCircle, FiFileText, FiVideo, FiAlertCircle } from 'react-icons/fi';

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState('steps');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>
          Hướng Dẫn Chi Tiết Cho Người Sử Dụng
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          Dành riêng cho quản lý không rành máy tính — Từng bước có hình ảnh minh họa rõ ràng.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        justify: 'center',
        gap: '12px',
        marginBottom: '32px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '16px'
      }}>
        <button
          onClick={() => setActiveTab('steps')}
          style={{
            background: activeTab === 'steps' ? '#6366f1' : 'rgba(255, 255, 255, 0.06)',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          📘 3 Bước Khởi Tạo Hệ Thống
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          style={{
            background: activeTab === 'faq' ? '#6366f1' : 'rgba(255, 255, 255, 0.06)',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          ❓ Câu Hỏi Thường Gặp (FAQ)
        </button>
      </div>

      {/* TAB 1: 3 BƯỚC KHỞI TẠO */}
      {activeTab === 'steps' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                1
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Bước 1: Chọn mẫu hoặc tự thiết kế các cột</h2>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
              Vào trang <strong>Tạo Bảng Mới (Builder)</strong> trên SheetFlow. Hệ thống đã có sẵn 6 cột bắt buộc tiêu chuẩn: Tên công việc, Người phụ trách, Trạng thái, Hạn chót, Ghi chú, Tài liệu đính kèm. Bạn có thể thêm bất kỳ cột nào theo nhu cầu của nhóm.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                2
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Bước 2: Mở Google Sheet & Import Cấu Hình</h2>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>
              Tại bước 7 trên SheetFlow, bạn bấm nút <strong>Sao chép Mã Cấu Hình 1-Click</strong>. Sau đó mở Google Sheet của bạn, trên thanh Menu bấm <strong>Extensions → Apps Script</strong> (hoặc chọn Menu <strong>SheetFlow → Import Cấu hình</strong>) rồi dán đoạn mã vừa copy vào.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                3
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Bước 3: Deploy Web App & Gửi Link Cho Nhân Viên</h2>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
              Trong màn hình Apps Script, chọn góc trên bên phải nút <strong>Deploy → New deployment</strong>.
              <br />- Mục Select type chọn <strong>Web app</strong>.
              <br />- Mục Execute as chọn <strong>Me</strong>.
              <br />- Mục Who has access chọn <strong>Anyone</strong> (Mọi người).
              <br />Bấm Deploy, sau đó copy đường dẫn (URL) dán vào SheetFlow để lưu vào Dashboard và gửi cho nhân viên cập nhật.
            </p>
          </div>

        </div>
      )}

      {/* TAB 2: FAQ */}
      {activeTab === 'faq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            {
              q: 'Tôi không dùng Google Workspace (chỉ có Gmail cá nhân) thì có dùng được không?',
              a: 'Hoàn toàn được! Hệ thống SheetFlow được thiết kế tối ưu dành riêng cho tài khoản Gmail cá nhân không tốn bất kỳ chi phí nào.'
            },
            {
              q: 'Nhân viên báo cáo có cần đăng nhập tài khoản gì phức tạp không?',
              a: 'Nhân viên chỉ cần click vào đường dẫn Web App bạn gửi. Web App sẽ hiển thị giao diện báo cáo đơn giản để cập nhật trạng thái, ghi chú và dán link tài liệu.'
            },
            {
              q: 'Làm sao để đính kèm nhiều tài liệu cho một công việc?',
              a: 'Cột "Tài liệu đính kèm" hỗ trợ đính kèm nhiều đường dẫn link Google Drive, Dropbox hoặc tài liệu xem. Nhân viên chỉ cần dán mỗi đường dẫn trên một dòng.'
            },
            {
              q: 'Khi nhân viên cập nhật trên Web App thì dữ liệu có về Google Sheet ngay lập tức không?',
              a: 'Có! Ngay khi nhân viên bấm "Lưu cập nhật", dữ liệu sẽ được ghi trực tiếp vào dòng tương ứng trên Google Sheet của bạn ngay lập tức.'
            }
          ].map((faq, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#818cf8', marginBottom: '8px' }}>
                ❓ {faq.q}
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
