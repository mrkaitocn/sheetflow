'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProjects } from '@/lib/store';
import { FiArrowLeft, FiExternalLink, FiRefreshCw, FiSearch, FiFilter } from 'react-icons/fi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DashboardClient({ params }) {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [data, setData] = useState({ tasks: [], config: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const projs = getProjects();
    const proj = projs.find(p => p.id === params.id);
    if (!proj) {
      router.push('/dashboard');
      return;
    }
    setProject(proj);
    if (proj.webAppUrl) {
      fetchData(proj.webAppUrl);
    } else {
      setError('Dự án chưa được cập nhật Web App URL. Hãy vào Builder để cài đặt.');
      setLoading(false);
    }
  }, [params.id]);

  const fetchData = async (webAppUrl) => {
    setLoading(true);
    setError('');
    try {
      const target = webAppUrl + '?action=getData';
      let res;
      try {
        res = await fetch(`/api/proxy?url=${encodeURIComponent(target)}`);
        if (!res.ok) throw new Error('Proxy error');
      } catch (proxyErr) {
        res = await fetch(target);
      }
      const result = await res.json();
      if (result && result.tasks) {
        setData(result);
      } else {
        setError('Không thể lấy dữ liệu từ Apps Script. Vui lòng kiểm tra lại quyền truy cập hoặc URL.');
      }
    } catch (err) {
      setError('Lỗi kết nối: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Stats calculation
  const totalTasks = data.tasks.length;
  const statusCounts = {};
  if (data.config && data.config.statusFlow) {
    data.config.statusFlow.forEach(s => statusCounts[s.label] = 0);
  }
  
  let completedTasksCount = 0;
  let overdueTasksCount = 0;
  const assigneeWorkload = {};

  const today = new Date();
  today.setHours(0,0,0,0);

  data.tasks.forEach(t => {
    if (t.status) {
      statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
      const isCompleted = data.config.statusFlow && data.config.statusFlow[data.config.statusFlow.length - 1].label === t.status;
      if (isCompleted || t.status === 'Hoàn thành') completedTasksCount++;
    }
    
    if (t.assignee) {
      assigneeWorkload[t.assignee] = (assigneeWorkload[t.assignee] || 0) + 1;
    }
    
    if (t.deadline) {
      const isCompleted = data.config.statusFlow && data.config.statusFlow[data.config.statusFlow.length - 1].label === t.status;
      if (!isCompleted && t.status !== 'Hoàn thành') {
        const dl = new Date(t.deadline);
        if (dl < today) overdueTasksCount++;
      }
    }
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  const pieData = Object.keys(statusCounts).map(key => {
    const sObj = data.config.statusFlow ? data.config.statusFlow.find(s => s.label === key) : null;
    return {
      name: key,
      value: statusCounts[key],
      color: sObj ? sObj.color : '#cbd5e1'
    };
  }).filter(d => d.value > 0);

  const barData = Object.keys(assigneeWorkload).map(key => ({
    name: key,
    tasks: assigneeWorkload[key]
  }));

  // Filtering
  const filteredTasks = data.tasks.filter(t => {
    const matchStatus = statusFilter === '' || t.status === statusFilter;
    const matchSearch = searchQuery === '' || 
      (t.task_name && t.task_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.assignee && t.assignee.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.task_id && t.task_id.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  if (!project) return null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <Link href="/dashboard" style={{ color: '#818cf8', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500' }}>
          <FiArrowLeft /> Quay lại Dashboard
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800' }}>{project.name}</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
            Thống kê và theo dõi dữ liệu công việc trực tiếp từ Google Sheet.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => fetchData(project.webAppUrl)}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            <FiRefreshCw className={loading ? 'spin' : ''} /> Cập nhật
          </button>
          <a
            href={project.webAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#6366f1', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '14px' }}
          >
            Mở Web App <FiExternalLink />
          </a>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
          <div className="spin" style={{ display: 'inline-block', marginBottom: '16px', fontSize: '24px' }}>⏳</div>
          <div>Đang đồng bộ dữ liệu từ Google Sheet...</div>
        </div>
      ) : (
        <>
          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>TỔNG CÔNG VIỆC</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#fff', marginTop: '8px' }}>{totalTasks}</div>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>TỶ LỆ HOÀN THÀNH</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#10b981', marginTop: '8px' }}>{completionRate}%</div>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>CÔNG VIỆC TRỄ HẠN</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#ef4444', marginTop: '8px' }}>{overdueTasksCount}</div>
            </div>
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '14px', color: '#f8fafc', fontWeight: '600', marginBottom: '16px' }}>Phân bố Trạng thái</div>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '14px', color: '#f8fafc', fontWeight: '600', marginBottom: '16px' }}>Khối lượng công việc theo Nhân sự</div>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                    <RechartsTooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Bar dataKey="tasks" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="glass-card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '250px' }}>
              <FiSearch color="#64748b" />
              <input 
                type="text" 
                placeholder="Tìm Mã CV, Tên công việc, Người phụ trách..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiFilter color="#64748b" />
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
              >
                <option value="">Tất cả trạng thái</option>
                {data.config.statusFlow && data.config.statusFlow.map(s => (
                  <option key={s.id} value={s.label}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '600' }}>Mã CV</th>
                    <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '600' }}>Tên công việc</th>
                    <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '600' }}>Trạng thái</th>
                    <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '600' }}>Người phụ trách</th>
                    <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '600' }}>Hạn chót</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Không tìm thấy công việc nào.</td>
                    </tr>
                  ) : (
                    filteredTasks.map((t, idx) => {
                      const sObj = data.config.statusFlow ? data.config.statusFlow.find(s => s.label === t.status) : null;
                      const sColor = sObj ? sObj.color : '#64748b';
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '16px', fontWeight: '600', color: '#818cf8' }}>{t.task_id || '-'}</td>
                          <td style={{ padding: '16px', color: '#e2e8f0', maxWidth: '300px' }}>{t.task_name || '-'}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ padding: '4px 8px', borderRadius: '4px', background: `${sColor}20`, color: sColor, fontWeight: '600', fontSize: '12px' }}>
                              {t.status || 'Chưa đặt'}
                            </span>
                          </td>
                          <td style={{ padding: '16px', color: '#cbd5e1' }}>{t.assignee || '-'}</td>
                          <td style={{ padding: '16px', color: '#cbd5e1' }}>{t.deadline ? new Date(t.deadline).toLocaleDateString('vi-VN') : '-'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
