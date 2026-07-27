'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProjects, deleteProject } from '@/lib/store';
import { FiPlusCircle, FiExternalLink, FiCopy, FiTrash2, FiLayers, FiCheckCircle } from 'react-icons/fi';

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa dự án này khỏi Dashboard?')) {
      deleteProject(id);
      setProjects(getProjects());
    }
  };

  const copyLink = (url, id) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800' }}>Dashboard Quản Lý Báo Cáo</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
            Tổng hợp danh sách các hệ thống báo cáo Google Sheet + Apps Script của bạn.
          </p>
        </div>

        <Link
          href="/builder"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}
        >
          <FiPlusCircle size={18} /> Tạo Bảng Báo Cáo Mới
        </Link>
      </div>

      {/* Stats Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Tổng số bảng báo cáo</div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#6366f1', marginTop: '4px' }}>{projects.length}</div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Trạng thái Web App</div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>Hoạt động</div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Cột tiêu chuẩn bắt buộc</div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#8b5cf6', marginTop: '4px' }}>6 Cột</div>
        </div>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <FiLayers size={48} color="#64748b" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Chưa có bảng báo cáo nào</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '450px', margin: '0 auto 24px auto' }}>
            Bạn chưa tạo hệ thống báo cáo công việc nào. Bắt đầu ngay với trợ lý tự động chỉ trong vài phút.
          </p>
          <Link
            href="/builder"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#6366f1',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '15px'
            }}
          >
            <FiPlusCircle size={18} /> Tạo Bảng Báo Cáo Đầu Tiên
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {projects.map((proj) => (
            <div key={proj.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>{proj.name}</h3>
                  <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>
                    Active
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                  Ngày tạo: {new Date(proj.createdAt).toLocaleDateString('vi-VN')}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Link Web App nhân viên:</div>
                  {proj.webAppUrl ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        readOnly
                        value={proj.webAppUrl}
                        style={{
                          flex: 1,
                          fontSize: '12px',
                          padding: '6px 8px',
                          background: '#090d16',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '4px',
                          color: '#e2e8f0'
                        }}
                      />
                      <button
                        onClick={() => copyLink(proj.webAppUrl, proj.id)}
                        style={{
                          background: copiedId === proj.id ? '#10b981' : '#6366f1',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {copiedId === proj.id ? 'Coppy!' : 'Copy'}
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: '12px', color: '#f59e0b' }}>Chưa cập nhật URL Web App</div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {proj.webAppUrl && (
                    <Link
                      href={`/dashboard/${proj.id}`}
                      style={{ fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}
                    >
                      📊 Xem Thống Kê
                    </Link>
                  )}
                  {proj.webAppUrl && (
                    <a
                      href={proj.webAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '13px', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}
                    >
                      Mở Web App <FiExternalLink size={14} />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(proj.id)}
                  style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <FiTrash2 size={14} /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
