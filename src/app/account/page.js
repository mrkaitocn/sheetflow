'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUserSubscription, isPaidPlan, getProjects } from '@/lib/store';
import { FiUser, FiShield, FiZap, FiGrid, FiArrowRight, FiCheckCircle, FiClock } from 'react-icons/fi';

export default function AccountPage() {
  const { data: session } = useSession();
  const [sub, setSub] = useState(null);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    if (session?.user?.email) {
      const userSub = getUserSubscription(session.user.email);
      setSub(userSub);
      const projs = getProjects();
      setProjectCount(projs.length);
    }
  }, [session]);

  if (!session) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8' }}>Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  const isPro = sub && (sub.plan === 'monthly' || sub.plan === 'yearly') && sub.status === 'active';

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 24px' }}>
      
      <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>
        Quản Lý Tài Khoản
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* User Info Card */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #6366f1' }}
              />
            ) : (
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#fff'
              }}>
                {session.user.name ? session.user.name.charAt(0) : 'U'}
              </div>
            )}

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>{session.user.name}</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>{session.user.email}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiGrid /> Số dự án đã tạo:
            </span>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: '16px' }}>{projectCount}</span>
          </div>
        </div>

        {/* Subscription Status Card */}
        <div className="glass-card" style={{ padding: '28px', border: isPro ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Gói Hiện Tại</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: isPro ? '#10b981' : '#818cf8', marginTop: '4px' }}>
                {isPro ? (sub.plan === 'yearly' ? 'Gói PRO theo Năm' : 'Gói PRO theo Tháng') : 'Gói Miễn Phí (Free)'}
              </div>
            </div>

            <span style={{
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              background: isPro ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              color: isPro ? '#10b981' : '#818cf8'
            }}>
              {isPro ? 'Đang hoạt động' : 'Trải nghiệm'}
            </span>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px', lineHeight: '1.5' }}>
            {isPro 
              ? 'Tài khoản của bạn đã được mở khóa toàn bộ tính năng cao cấp không giới hạn.'
              : 'Gói Miễn phí giới hạn tối đa 1 dự án và chỉ hỗ trợ 7 cột chuẩn bắt buộc.'}
          </p>

          {isPro && sub?.expiresAt && (
            <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiClock color="#10b981" /> Hạn dùng đến: <strong>{new Date(sub.expiresAt).toLocaleDateString('vi-VN')}</strong>
            </div>
          )}

          <Link
            href="/pricing"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              background: isPro ? 'rgba(255, 255, 255, 0.08)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#fff',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: isPro ? 'none' : '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            <span>{isPro ? 'Gia Hạn / Đổi Gói' : 'Nâng Cấp Ngay (50K/tháng)'}</span>
            <FiArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
