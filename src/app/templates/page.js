'use client';

import Link from 'next/link';
import { TEMPLATE_PRESETS } from '@/lib/templates/schema';
import { FiArrowRight, FiLock, FiPlusCircle, FiCheck } from 'react-icons/fi';

export default function TemplatesPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>
          Chọn Mẫu Báo Cáo Công Việc
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '650px', margin: '0 auto' }}>
          Tất cả mẫu đều chứa sẵn 6 cột chuẩn bắt buộc. Bạn có thể chọn mẫu có sẵn hoặc tự khởi tạo bảng tùy chỉnh từ đầu.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px'
      }}>
        {TEMPLATE_PRESETS.map((tmpl) => {
          const isCustom = tmpl.id === 'custom';

          return (
            <div
              key={tmpl.id}
              className="glass-card"
              style={{
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isCustom ? '2px stroke #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                background: isCustom ? 'rgba(99, 102, 241, 0.05)' : 'rgba(17, 23, 38, 0.65)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '36px' }}>{tmpl.icon}</span>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#f8fafc' }}>{tmpl.name}</h3>
                    {isCustom && (
                      <span style={{
                        fontSize: '11px',
                        background: '#6366f1',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>Khuyên dùng</span>
                    )}
                  </div>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                  {tmpl.description}
                </p>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '10px' }}>
                    Danh sách các cột trong mẫu:
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {tmpl.columns.map((col, cIdx) => (
                      <div
                        key={cIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: col.system ? 'rgba(255, 255, 255, 0.03)' : 'rgba(99, 102, 241, 0.1)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}
                      >
                        <span style={{ color: col.system ? '#f8fafc' : '#a5b4fc', fontWeight: col.system ? '500' : '600' }}>
                          {col.label}
                        </span>
                        {col.system ? (
                          <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiLock size={10} /> Bắt buộc
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#818cf8' }}>
                            Tùy chỉnh
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href={`/builder?preset=${tmpl.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: isCustom ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{isCustom ? 'Tự Tạo Bảng Mới' : 'Sử Dụng Mẫu Này'}</span>
                <FiArrowRight size={16} />
              </Link>
            </div>
          );
        })}
      </div>

    </div>
  );
}
