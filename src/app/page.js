'use client';

import Link from 'next/link';
import { FiPlusCircle, FiLayers, FiShield, FiSend, FiFileText, FiCheckCircle } from 'react-icons/fi';

export default function Home() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      
      {/* HERO SECTION */}
      <section style={{
        textAlign: 'center',
        padding: '60px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '6px 16px',
            borderRadius: '20px',
            color: '#818cf8',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '24px'
          }}>
            <FiCheckCircle size={14} /> Trợ lý Google Sheets & Apps Script Dành Cho Quản Lý
          </div>

          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            lineHeight: 1.2,
            letterSpacing: '-1px',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Tạo Web App Báo Cáo Công Việc Từ Google Sheets <br />
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Đơn Giản Nhất — Không Cần Biết Code</span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: '#94a3b8',
            maxWidth: '750px',
            margin: '0 auto 36px auto',
            lineHeight: 1.6
          }}>
            Xây dựng bảng quản lý công việc với 6 cột tiêu chuẩn (Tên công việc, Người phụ trách, Trạng thái, Hạn chót, Ghi chú, Tài liệu đính kèm) và sinh Web App tự động cho nhân viên báo cáo trực tiếp lên Sheet.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/builder"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                padding: '14px 32px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '16px',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              <FiPlusCircle size={20} />
              <span>Bắt Đầu Tạo Bảng Mới</span>
            </Link>

            <Link
              href="/templates"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#f8fafc',
                padding: '14px 28px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              <FiLayers size={20} />
              <span>Xem Các Mẫu Báo Cáo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* MANDATORY COLUMNS HIGHLIGHT */}
      <section style={{ margin: '60px 0' }}>
        <div className="glass-card" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', textAlign: 'center' }}>
            🎯 6 Cột Bắt Buộc Chuẩn Báo Cáo Công Việc Nhóm
          </h2>
          <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '32px' }}>
            Được tích hợp sẵn vào mọi bảng để đảm bảo quản lý chính xác và chặt chẽ nhất.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {[
              { title: '1. Tên công việc', desc: 'Nội dung công việc cần thực hiện', icon: '📝' },
              { title: '2. Người phụ trách', desc: 'Email hoặc nhân viên chịu trách nhiệm', icon: '👤' },
              { title: '3. Trạng thái', desc: 'Chưa bắt đầu → Đang làm → Hoàn thành / Trễ', icon: '⚡' },
              { title: '4. Hạn chót', desc: 'Thời hạn hoàn thành công việc', icon: '📅' },
              { title: '5. Ghi chú', desc: 'Báo cáo nhận xét & kết quả thực hiện', icon: '💬' },
              { title: '6. Tài liệu đính kèm', desc: 'Đính kèm nhiều link tài liệu/file đính kèm', icon: '📎' }
            ].map((col, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ fontSize: '24px' }}>{col.icon}</div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#f8fafc' }}>{col.title}</h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>{col.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ margin: '80px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
          3 Bước Đơn Giản Để Vận Hành
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '40px' }}>
          Không yêu cầu kỹ thuật lập trình hay cài đặt phức tạp.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {[
            { step: '1', title: 'Tùy chỉnh Bảng & Quyền', desc: 'Chọn mẫu hoặc tự thiết kế các cột bổ sung, đặt quy trình trạng thái và thêm danh sách email nhân viên.' },
            { step: '2', title: 'Copy Google Sheet Mẫu', desc: 'Tạo bản sao Google Sheet có sẵn Apps Script chỉ với 1 click vào tài khoản Google cá nhân của bạn.' },
            { step: '3', title: 'Dán Mã Cấu Hình & Deploy', desc: 'Sao chép mã cấu hình JSON dán vào Sheet và lấy đường dẫn Web App gửi cho nhân viên báo cáo.' }
          ].map((item, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '32px 24px', textAlign: 'left' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px',
                marginBottom: '20px'
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
