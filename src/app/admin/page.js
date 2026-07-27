'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getAllSubscriptions, setUserSubscription } from '@/lib/store';
import { FiCheckCircle, FiShield, FiUserCheck, FiPlus, FiTrash2, FiSearch } from 'react-icons/fi';

export default function AdminPage() {
  const { data: session } = useSession();
  const [subs, setSubs] = useState({});
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('monthly'); // 'monthly' | 'yearly' | 'free'
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSubs();
  }, []);

  const loadSubs = () => {
    const data = getAllSubscriptions();
    setSubs(data);
  };

  const handleActivate = (e) => {
    e.preventDefault();
    if (!email) return;

    const months = plan === 'yearly' ? 12 : plan === 'monthly' ? 1 : 0;
    const success = setUserSubscription(email, plan, months, note);

    if (success) {
      setMessage(`✅ Đã kích hoạt gói [${plan.toUpperCase()}] cho tài khoản ${email}`);
      setEmail('');
      setNote('');
      loadSubs();
    } else {
      setMessage('❌ Không thể lưu thông tin gói.');
    }
  };

  const handleRevoke = (targetEmail) => {
    if (confirm(`Bạn có chắc chắn muốn hủy gói của ${targetEmail}?`)) {
      setUserSubscription(targetEmail, 'free', 0, 'Admin đã hủy gói');
      loadSubs();
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{ background: '#6366f1', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
          ADMIN PORTAL
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Quản Lý Kích Hoạt Thuê Bao</h1>
      </div>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '32px' }}>
        Kích hoạt gói Tháng/Năm thủ công cho khách hàng sau khi nhận được chuyển khoản QR.
      </p>

      {message && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '14px 20px', borderRadius: '8px', marginBottom: '24px' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
        
        {/* Activation Form */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiPlus color="#6366f1" /> Kích Hoạt Gói Mới
          </h2>

          <form onSubmit={handleActivate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Email người dùng (Google Account):
              </label>
              <input
                type="email"
                required
                placeholder="vd: khachhang@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Chọn loại gói:
              </label>
              <select
                value={plan}
                onChange={e => setPlan(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
              >
                <option value="monthly">Gói Tháng PRO (50.000đ - 1 Tháng)</option>
                <option value="yearly">Gói Năm PRO (500.000đ - 1 Năm)</option>
                <option value="free">Hủy về Gói Miễn Phí (Free)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Ghi chú giao dịch / Mã chuyển khoản:
              </label>
              <input
                type="text"
                placeholder="vd: Đã nhận CK 50K qua MBBank ngày 27/07"
                value={note}
                onChange={e => setNote(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Kích Hoạt Thuê Bao
            </button>
          </form>
        </div>

        {/* Existing Subscriptions List */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiUserCheck color="#10b981" /> Danh Sách Kích Hoạt ({Object.keys(subs).length})
          </h2>

          {Object.keys(subs).length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
              Chưa có tài khoản nào được kích hoạt thủ công.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
              {Object.entries(subs).map(([userEmail, item]) => (
                <div
                  key={userEmail}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: '#fff', fontSize: '14px' }}>{userEmail}</div>
                    <div style={{ fontSize: '12px', color: item.plan === 'free' ? '#94a3b8' : '#10b981', marginTop: '2px' }}>
                      Gói: <strong>{item.plan.toUpperCase()}</strong> | Hạn: {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString('vi-VN') : 'Vĩnh viễn'}
                    </div>
                    {item.note && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Ghi chú: {item.note}</div>}
                  </div>

                  {item.plan !== 'free' && (
                    <button
                      onClick={() => handleRevoke(userEmail)}
                      style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Hủy gói
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
