'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiCheck, FiX, FiZap, FiCheckCircle } from 'react-icons/fi';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
          marginBottom: '16px'
        }}>
          <FiZap size={14} /> Chọn Gói Phù Hợp Với Bạn
        </div>

        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>
          Bảng Giá Dịch Vụ SheetFlow
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '600px', margin: '0 auto 24px auto' }}>
          Đơn giản hóa báo cáo công việc nhóm với chi phí tiết kiệm tối đa. Không ràng buộc, nâng cấp hoặc hủy bất kỳ lúc nào.
        </p>

        {/* Toggle Billing Cycle */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '4px',
          borderRadius: '12px'
        }}>
          <button
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              background: billingCycle === 'monthly' ? '#6366f1' : 'transparent',
              color: '#fff',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Theo Tháng
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              background: billingCycle === 'yearly' ? '#6366f1' : 'transparent',
              color: '#fff',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Theo Năm</span>
            <span style={{ fontSize: '11px', background: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>Tiết kiệm 17%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        alignItems: 'stretch'
      }}>
        {/* FREE PLAN */}
        <div className="glass-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#cbd5e1', marginBottom: '8px' }}>Miễn Phí</div>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px', minHeight: '38px' }}>
              Dành cho cá nhân muốn trải nghiệm quy trình báo cáo cơ bản.
            </p>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '24px' }}>
              0đ <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '400' }}>/ vĩnh viễn</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#e2e8f0' }}>
                <FiCheck color="#10b981" size={18} /> <span>1 Dự án tối đa</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#e2e8f0' }}>
                <FiCheck color="#10b981" size={18} /> <span>7 Cột bắt buộc tiêu chuẩn</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#64748b' }}>
                <FiX color="#ef4444" size={18} /> <span>Không hỗ trợ cột tùy chỉnh thêm</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#64748b' }}>
                <FiX color="#ef4444" size={18} /> <span>Không có biểu đồ thống kê Dashboard</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#64748b' }}>
                <FiX color="#ef4444" size={18} /> <span>Không hỗ trợ upload file đính kèm</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#64748b' }}>
                <FiX color="#ef4444" size={18} /> <span>Không có bộ lọc nâng cao</span>
              </div>
            </div>
          </div>

          <Link
            href="/builder"
            style={{
              display: 'block',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            Trải Nghiệm Miễn Phí
          </Link>
        </div>

        {/* PRO PAID PLAN */}
        <div className="glass-card" style={{
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '2px solid #6366f1',
          background: 'rgba(99, 102, 241, 0.06)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-14px',
            right: '24px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '700',
            padding: '4px 12px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            KHUYÊN DÙNG
          </div>

          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#818cf8', marginBottom: '8px' }}>
              {billingCycle === 'monthly' ? 'Gói Tháng PRO' : 'Gói Năm PRO'}
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px', minHeight: '38px' }}>
              Mở khóa toàn bộ sức mạnh cho quản lý nhóm chuyên nghiệp.
            </p>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '24px' }}>
              {billingCycle === 'monthly' ? '50.000đ' : '500.000đ'}
              <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '400' }}>
                /{billingCycle === 'monthly' ? 'tháng' : 'năm'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#e2e8f0', fontWeight: '600' }}>
                <FiCheck color="#10b981" size={18} /> <span>Không giới hạn số lượng dự án</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#e2e8f0', fontWeight: '600' }}>
                <FiCheck color="#10b981" size={18} /> <span>Không giới hạn cột tùy chỉnh</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#e2e8f0' }}>
                <FiCheck color="#10b981" size={18} /> <span>Biểu đồ Recharts phân tích (PieChart & BarChart)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#e2e8f0' }}>
                <FiCheck color="#10b981" size={18} /> <span>Tải file đính kèm lên Google Drive (50MB/file)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#e2e8f0' }}>
                <FiCheck color="#10b981" size={18} /> <span>Bộ lọc nâng cao (Hạn chót, Người phụ trách...)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#e2e8f0' }}>
                <FiCheck color="#10b981" size={18} /> <span>Thông báo Email tự động khi công việc thay đổi</span>
              </div>
            </div>
          </div>

          <a
            href="https://qr.seapay.vn/img?bank=MBBank&acc=00000000000" // Placeholder QR link
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#fff',
              padding: '14px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '15px',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            Đăng Ký Nâng Cấp Ngay
          </a>
        </div>
      </div>
    </div>
  );
}
