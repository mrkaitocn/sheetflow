'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function SignInPage() {
  return (
    <div style={{
      maxWidth: '480px',
      margin: '80px auto',
      padding: '0 24px'
    }}>
      
      <div style={{ marginBottom: '24px' }}>
        <Link href="/" style={{ color: '#818cf8', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500' }}>
          <FiArrowLeft /> Quay lại trang chủ
        </Link>
      </div>

      <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'center' }}>
        {/* Logo */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '24px',
          margin: '0 auto 16px auto',
          boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)'
        }}>
          S
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
          Đăng Nhập Vào SheetFlow
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '32px' }}>
          Quản lý các dự án báo cáo Google Sheets của bạn ở một nơi duy nhất.
        </p>

        {/* Google Sign-in button */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: '#ffffff',
            color: '#1e293b',
            padding: '14px 24px',
            borderRadius: '10px',
            border: 'none',
            fontWeight: '600',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease',
            marginBottom: '32px'
          }}
        >
          <FcGoogle size={22} />
          <span>Tiếp tục với Google</span>
        </button>

        {/* Feature Highlights */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', textAlign: 'left' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            Quyền lợi tài khoản:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              'Đồng bộ dữ liệu báo cáo trên mọi thiết bị',
              'Tùy chỉnh không giới hạn các quy trình công việc',
              'Truy cập bộ công cụ biểu đồ Recharts phân tích',
            ].map((text, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}>
                <FiCheckCircle size={16} color="#10b981" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
