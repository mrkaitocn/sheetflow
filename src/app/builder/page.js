'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Stepper from '@/components/ui/Stepper';
import CodeBlock from '@/components/ui/CodeBlock';
import { TEMPLATE_PRESETS, REQUIRED_COLUMNS, DEFAULT_STATUS_FLOW } from '@/lib/templates/schema';
import { generateConfigJSON } from '@/lib/codegen/generateConfig';
import { saveProject, getProjects, getUserSubscription } from '@/lib/store';
import { FiLock, FiPlus, FiTrash2, FiArrowLeft, FiArrowRight, FiCheck, FiExternalLink, FiCopy } from 'react-icons/fi';

function BuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const presetId = searchParams.get('preset') || 'weekly-report';

  const userSub = getUserSubscription(session?.user?.email);
  const isPro = (userSub.plan === 'monthly' || userSub.plan === 'yearly') && userSub.status === 'active';

  const [currentStep, setCurrentStep] = useState(1);

  // Wizard Form State
  const [formData, setFormData] = useState({
    presetId: presetId,
    projectName: 'Báo cáo công việc nhóm',
    tableStartRow: 5,
    columns: [...REQUIRED_COLUMNS],
    statusFlow: [...DEFAULT_STATUS_FLOW],
    team: [{ email: '', role: 'employee' }],
    permissions: {
      employeeCanAddTask: false,
      employeeCanAttachFile: true,
      employeeCanEditNote: true
    },
    notifications: {
      enabled: true,
      managerEmail: '',
      notifyOnStatusChange: true
    },
    appearance: {
      title: 'Báo cáo công việc nhóm',
      primaryColor: '#6366f1'
    },
    webAppUrl: ''
  });

  // State for new custom column input
  const [newColLabel, setNewColLabel] = useState('');
  const [newColType, setNewColType] = useState('text');

  // State for new status input
  const [newStatusLabel, setNewStatusLabel] = useState('');
  const [newStatusColor, setNewStatusColor] = useState('#3b82f6');

  // State for new team email input
  const [newTeamEmail, setNewTeamEmail] = useState('');

  // Apps Script code state
  const [appsScriptCode, setAppsScriptCode] = useState({ codeGs: '', webAppHtml: '' });

  // Apply preset when selection changes
  useEffect(() => {
    const selectedPreset = TEMPLATE_PRESETS.find(p => p.id === presetId) || TEMPLATE_PRESETS[0];
    setFormData(prev => ({
      ...prev,
      presetId: selectedPreset.id,
      projectName: selectedPreset.name === 'Tự tạo bảng mới' ? 'Báo cáo công việc tùy chỉnh' : selectedPreset.name,
      columns: [...selectedPreset.columns],
      statusFlow: [...selectedPreset.statusFlow]
    }));
  }, [presetId]);

  // Fetch Apps Script template code
  useEffect(() => {
    fetch('/api/scripts')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setAppsScriptCode(data);
      })
      .catch(err => console.error('Failed to load apps script template:', err));
  }, []);

  const steps = [
    { title: '1. Chọn Mẫu' },
    { title: '2. Cột Báo Cáo' },
    { title: '3. Trạng Thái' },
    { title: '4. Phân Quyền' },
    { title: '5. Thông Báo' },
    { title: '6. Xem Lại' },
    { title: '7. Deploy' }
  ];

  // Helper functions for Step 2: Columns
  const handleAddColumn = () => {
    if (!isPro) {
      alert('🔒 Gói Miễn phí chỉ hỗ trợ 7 cột bắt buộc tiêu chuẩn. Vui lòng nâng cấp lên gói PRO để thêm cột tùy chỉnh không giới hạn!');
      router.push('/pricing');
      return;
    }
    if (!newColLabel.trim()) return;
    const key = 'custom_' + Date.now();
    const newCol = {
      key: key,
      label: newColLabel.trim(),
      type: newColType,
      required: false,
      system: false,
      editable_by: 'all',
      visibleInApp: true
    };
    setFormData(prev => ({
      ...prev,
      columns: [...prev.columns, newCol]
    }));
    setNewColLabel('');
  };

  const handleRemoveColumn = (key) => {
    setFormData(prev => ({
      ...prev,
      columns: prev.columns.filter(c => c.key !== key || c.system)
    }));
  };

  const handleToggleVisibility = (key) => {
    setFormData(prev => ({
      ...prev,
      columns: prev.columns.map(c => 
        c.key === key && !c.system ? { ...c, visibleInApp: !c.visibleInApp } : c
      )
    }));
  };

  const handleMoveColumn = (index, direction) => {
    setFormData(prev => {
      const newCols = [...prev.columns];
      if (direction === 'up' && index > 0) {
        const temp = newCols[index];
        newCols[index] = newCols[index - 1];
        newCols[index - 1] = temp;
      } else if (direction === 'down' && index < newCols.length - 1) {
        const temp = newCols[index];
        newCols[index] = newCols[index + 1];
        newCols[index + 1] = temp;
      }
      return { ...prev, columns: newCols };
    });
  };

  // Helper functions for Step 3: Status
  const handleAddStatus = () => {
    if (!newStatusLabel.trim()) return;
    const id = 'status_' + Date.now();
    const newStatus = {
      id: id,
      label: newStatusLabel.trim(),
      color: newStatusColor
    };
    setFormData(prev => ({
      ...prev,
      statusFlow: [...prev.statusFlow, newStatus]
    }));
    setNewStatusLabel('');
  };

  const handleRemoveStatus = (id) => {
    setFormData(prev => ({
      ...prev,
      statusFlow: prev.statusFlow.filter(s => s.id !== id)
    }));
  };

  // Helper functions for Step 4: Team
  const handleAddTeamMember = () => {
    if (!newTeamEmail.trim()) return;
    setFormData(prev => ({
      ...prev,
      team: [...prev.team.filter(t => t.email), { email: newTeamEmail.trim(), role: 'employee' }]
    }));
    setNewTeamEmail('');
  };

  const handleRemoveTeamMember = (email) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter(t => t.email !== email)
    }));
  };

  // Save Project & Complete Setup
  const handleFinishDeployment = () => {
    const existingProjects = getProjects();
    if (!isPro && existingProjects.length >= 1) {
      alert('🔒 Gói Miễn phí chỉ cho phép tạo tối đa 1 dự án. Vui lòng nâng cấp lên gói PRO để tạo dự án mới!');
      router.push('/pricing');
      return;
    }
    const projectObj = {
      id: 'proj_' + Date.now(),
      name: formData.projectName,
      webAppUrl: formData.webAppUrl,
      config: formData,
      taskCount: 0,
      createdAt: new Date().toISOString()
    };
    saveProject(projectObj);
    router.push('/dashboard');
  };

  const generatedJSON = generateConfigJSON(formData);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '36px 24px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Trợ Lý Tạo Bảng Báo Cáo Công Việc</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
          Tạo bảng và ứng dụng web cho nhân viên trong vài thao tác đơn giản.
        </p>
      </div>

      <Stepper steps={steps} currentStep={currentStep} />

      {/* STEP 1: CHỌN TEMPLATE */}
      {currentStep === 1 && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
            Bước 1: Chọn mẫu bắt đầu hoặc tự thiết kế
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {TEMPLATE_PRESETS.map(t => (
              <div
                key={t.id}
                onClick={() => setFormData(prev => ({ ...prev, presetId: t.id, columns: [...t.columns] }))}
                style={{
                  padding: '20px',
                  borderRadius: '10px',
                  border: formData.presetId === t.id ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: formData.presetId === t.id ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{t.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f8fafc' }}>{t.name}</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>{t.description}</p>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Tên dự án / Bảng báo cáo:
            </label>
            <input
              type="text"
              value={formData.projectName}
              onChange={e => setFormData({ ...formData, projectName: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: '#182033',
                color: '#fff',
                fontSize: '15px',
                marginBottom: '16px'
              }}
            />
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Dòng bắt đầu của bảng trên Google Sheet:
            </label>
            <input
              type="number"
              min="1"
              value={formData.tableStartRow || 5}
              onChange={e => setFormData({ ...formData, tableStartRow: parseInt(e.target.value) || 1 })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: '#182033',
                color: '#fff',
                fontSize: '15px'
              }}
            />
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
              💡 Tùy chọn này giúp đẩy lùi bảng xuống dưới, tạo không gian trống phía trên để bạn điền thông tin chung (như tên bảng, ghi chú...). Mặc định là dòng 5.
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: CỘT BÁO CÁO */}
      {currentStep === 2 && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
            Bước 2: Cấu hình các Cột trong Bảng
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
            🔒 7 cột hệ thống bắt buộc luôn xuất hiện trong mọi báo cáo. Bạn có thể thêm các cột tùy chỉnh bên dưới.
          </p>

          {/* Unified Columns List */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#818cf8', marginBottom: '12px' }}>
              Danh Sách Các Cột (Kéo/bấm để sắp xếp lại thứ tự xuất hiện):
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {formData.columns.map((col, idx, arr) => (
                <div key={col.key} style={{
                  background: col.system ? 'rgba(255, 255, 255, 0.04)' : 'rgba(99, 102, 241, 0.1)',
                  border: col.system ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(99, 102, 241, 0.3)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: !col.system ? '6px' : '0' }}>
                      <span style={{ fontWeight: '600', fontSize: '14px', color: col.system ? '#f8fafc' : '#ffffff' }}>{col.label}</span>
                      {col.system && <FiLock color="#64748b" size={12} title="Cột hệ thống bắt buộc" />}
                      {!col.system && <span style={{ fontSize: '12px', color: '#a5b4fc' }}>({col.type})</span>}
                    </div>
                    {col.system && <div style={{ fontSize: '12px', color: '#64748b' }}>{col.description}</div>}
                    {!col.system && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={col.visibleInApp !== false}
                          onChange={() => handleToggleVisibility(col.key)}
                          style={{ cursor: 'pointer' }}
                        />
                        Hiển thị trên Web App báo cáo
                      </label>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => handleMoveColumn(idx, 'up')}
                      disabled={idx === 0}
                      style={{ background: 'none', border: 'none', color: idx === 0 ? '#475569' : '#818cf8', cursor: idx === 0 ? 'default' : 'pointer', fontSize: '12px', padding: '4px' }}
                      title="Di chuyển lên"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMoveColumn(idx, 'down')}
                      disabled={idx === arr.length - 1}
                      style={{ background: 'none', border: 'none', color: idx === arr.length - 1 ? '#475569' : '#818cf8', cursor: idx === arr.length - 1 ? 'default' : 'pointer', fontSize: '12px', padding: '4px' }}
                      title="Di chuyển xuống"
                    >
                      ▼
                    </button>
                    <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.2)' }}></div>
                    <button
                      onClick={() => !col.system && handleRemoveColumn(col.key)}
                      disabled={col.system}
                      style={{ background: 'none', border: 'none', color: col.system ? '#475569' : '#f43f5e', cursor: col.system ? 'not-allowed' : 'pointer', padding: '4px' }}
                      title={col.system ? "Không thể xóa cột hệ thống" : "Xóa cột"}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Custom Columns Input */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Tên cột mới (VD: Tiến độ, Phòng ban...)"
                value={newColLabel}
                onChange={e => setNewColLabel(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: '#182033',
                  color: '#fff',
                  fontSize: '14px'
                }}
              />
              <select
                value={newColType}
                onChange={e => setNewColType(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: '#182033',
                  color: '#fff',
                  fontSize: '14px'
                }}
              >
                <option value="text">Văn bản (Text)</option>
                <option value="number">Số (Number)</option>
                <option value="date">Ngày tháng (Date)</option>
                <option value="checkbox">Hộp kiểm (Checkbox)</option>
              </select>
              <button
                onClick={handleAddColumn}
                style={{
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FiPlus size={16} /> Thêm Cột
              </button>
            </div>
        </div>
      )}

      {/* STEP 3: TRẠNG THÁI */}
      {currentStep === 3 && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
            Bước 3: Cấu hình Trạng thái Công việc
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
            Các bước trạng thái giúp nhân viên cập nhật tiến độ công việc trên web app.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {formData.statusFlow.map((status) => (
              <div key={status.id} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: status.color }} />
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>{status.label}</span>
                </div>
                {formData.statusFlow.length > 2 && (
                  <button
                    onClick={() => handleRemoveStatus(status.id)}
                    style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Tên trạng thái mới..."
              value={newStatusLabel}
              onChange={e => setNewStatusLabel(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: '#182033',
                color: '#fff',
                fontSize: '14px'
              }}
            />
            <input
              type="color"
              value={newStatusColor}
              onChange={e => setNewStatusColor(e.target.value)}
              style={{ width: '45px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }}
            />
            <button
              onClick={handleAddStatus}
              style={{
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FiPlus size={16} /> Thêm Trạng Thái
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PHÂN QUYỀN */}
      {currentStep === 4 && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
            Bước 4: Danh Sách Email & Phân Quyền Nhân Viên
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
            Giới hạn quyền truy cập trang báo cáo cho các nhân viên cụ thể qua Gmail.
          </p>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              <input
                type="checkbox"
                checked={formData.permissions.employeeCanAddTask}
                onChange={e => setFormData({
                  ...formData,
                  permissions: { ...formData.permissions, employeeCanAddTask: e.target.checked }
                })}
              />
              <span>Cho phép nhân viên tự thêm công việc mới từ Web App</span>
            </label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
              Danh sách email được phép báo cáo:
            </h3>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <input
                type="email"
                placeholder="nhanvien@gmail.com"
                value={newTeamEmail}
                onChange={e => setNewTeamEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: '#182033',
                  color: '#fff',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={handleAddTeamMember}
                style={{
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Thêm Email
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {formData.team.filter(t => t.email).map(member => (
                <div key={member.email} style={{
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '14px'
                }}>
                  <span>✉️ {member.email}</span>
                  <button
                    onClick={() => handleRemoveTeamMember(member.email)}
                    style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
              {formData.team.filter(t => t.email).length === 0 && (
                <div style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>
                  (Nếu không nhập email, bất kỳ ai có link Web App đều có thể cập nhật công việc)
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: THÔNG BÁO */}
      {currentStep === 5 && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
            Bước 5: Cài Đặt Email Thông Báo
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
            Tùy chọn nhận email tự động khi có nhân viên báo cáo hoặc cập nhật tình trạng.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Email của Quản Lý (Nhận thông báo):
              </label>
              <input
                type="email"
                placeholder="quanly@gmail.com"
                value={formData.notifications.managerEmail}
                onChange={e => setFormData({
                  ...formData,
                  notifications: { ...formData.notifications, managerEmail: e.target.value }
                })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: '#182033',
                  color: '#fff',
                  fontSize: '14px'
                }}
              />
            </div>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              <input
                type="checkbox"
                checked={formData.notifications.enabled}
                onChange={e => setFormData({
                  ...formData,
                  notifications: { ...formData.notifications, enabled: e.target.checked }
                })}
              />
              <span>Bật tính năng gửi email tự động khi nhân viên cập nhật</span>
            </label>
          </div>
        </div>
      )}

      {/* STEP 6: XEM LẠI */}
      {currentStep === 6 && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
            Bước 6: Xem Lại Tổng Thể Cấu Hình
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
              <strong>Tên dự án:</strong> {formData.projectName}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
              <strong>Số cột cấu hình:</strong> {formData.columns.length} cột (bao gồm 6 cột bắt buộc)
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
              <strong>Các trạng thái:</strong> {formData.statusFlow.map(s => s.label).join(' → ')}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
              <strong>Email Quản lý nhận thông báo:</strong> {formData.notifications.managerEmail || 'Chưa thiết lập'}
            </div>
          </div>
        </div>
      )}

      {/* STEP 7: DEPLOY & HƯỚNG DẪN */}
      {currentStep === 7 && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#10b981', marginBottom: '8px' }}>
            🚀 Bước 7: Khởi Tạo Google Sheet & Deploy Web App
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px' }}>
            Thực hiện 3 thao tác đơn giản theo hướng dẫn bên dưới để đưa hệ thống vào sử dụng:
          </p>

          {/* PART A: COPY SHEET */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>
              Phần A — Tạo Sheet Mới & Nhúng Apps Script
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '14px', lineHeight: '1.6' }}>
              1. Bấm nút dưới đây để tạo bảng Google Sheet mới trống.<br/>
              2. Trên thanh menu của Sheet, chọn <strong>Tiện ích mở rộng (Extensions) → Apps Script</strong>.<br/>
              3. Xóa code có sẵn, đổi tên tệp thành <strong>Code.gs</strong> và dán mã Code.gs ở dưới vào.<br/>
              4. Bấm dấu <strong>+</strong> chọn <strong>HTML</strong>, đặt tên tệp là <strong>WebApp</strong> (viết hoa chữ W và A) và dán mã WebApp.html vào.<br/>
              5. Bấm icon 💾 (Lưu dự án) để lưu lại.<br/>
              <span style={{ color: '#f59e0b', fontWeight: '600' }}>⚠️ Quan trọng: Bấm nút "Chạy" (Run) phía trên cùng để Google yêu cầu Cấp quyền truy cập (cho phép tải file lên Drive). Chọn "Xem lại quyền" ➔ Chọn tài khoản của bạn ➔ "Nâng cao" ➔ "Đi tới dự án" ➔ "Cho phép".</span>
            </p>
            <a
              href="https://docs.google.com/spreadsheets/create"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#10b981',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                marginBottom: '16px'
              }}
            >
              <FiExternalLink size={16} /> Tạo Google Sheet Mới Trực Tiếp
            </a>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <details style={{ background: '#090d16', padding: '12px', borderRadius: '8px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#818cf8', outline: 'none' }}>📦 Mã nguồn Code.gs (Bấm để mở rộng)</summary>
                <div style={{ marginTop: '12px' }}>
                  <CodeBlock code={appsScriptCode.codeGs || 'Đang tải mã nguồn...'} title="Code.gs" />
                </div>
              </details>
              
              <details style={{ background: '#090d16', padding: '12px', borderRadius: '8px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#818cf8', outline: 'none' }}>📦 Mã nguồn WebApp.html (Bấm để mở rộng)</summary>
                <div style={{ marginTop: '12px' }}>
                  <CodeBlock code={appsScriptCode.webAppHtml || 'Đang tải mã nguồn...'} title="WebApp.html" />
                </div>
              </details>
            </div>
          </div>

          {/* PART B: COPY JSON */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>
              Phần B — Khởi Tạo Cột Bảng Tự Động Từ Cấu Hình
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>
              1. Copy đoạn mã Cấu Hình JSON bên dưới bằng nút Sao Chép 1-Click.<br />
              2. Quay lại trang Google Sheet của bạn (làm mới lại trang nếu cần). Mở menu <strong>SheetFlow 🚀 → Import Cấu hình từ Web App</strong> và dán đoạn mã này vào. Sheet sẽ tự động tạo đủ các cột bạn đã thiết kế.
            </p>

            <CodeBlock code={generatedJSON} title="Mã Cấu Hình JSON Của Bạn" />
          </div>

          {/* PART C: PASTE WEB APP URL */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>
              Phần C — Xuất Bản (Deploy) & Điền Đường Dẫn Web App Để Hoàn Tất
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '14px', lineHeight: '1.6' }}>
              1. Tại cửa sổ Apps Script, bấm nút <strong>Triển khai (Deploy) → Tùy chọn triển khai mới (New deployment)</strong> góc trên cùng bên phải.<br/>
              2. Bấm bánh răng ⚙️ chọn <strong>Ứng dụng web (Web app)</strong>.<br/>
              3. Chỉnh <strong>Người có quyền truy cập (Who has access)</strong> thành <strong>Bất kỳ ai (Anyone)</strong>, sau đó bấm <strong>Triển khai</strong>.<br/>
              4. Copy <strong>URL ứng dụng web</strong> và dán vào ô bên dưới.
            </p>

            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={formData.webAppUrl}
              onChange={e => setFormData({ ...formData, webAppUrl: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: '#182033',
                color: '#fff',
                fontSize: '14px',
                marginBottom: '16px'
              }}
            />

            <button
              onClick={handleFinishDeployment}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
              }}
            >
              🎉 Hoàn Thành & Chuyển Đến Dashboard
            </button>
          </div>
        </div>
      )}

      {/* NAVIGATION BUTTONS */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        marginTop: '28px'
      }}>
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#f8fafc',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <FiArrowLeft size={16} /> Quay Lại
          </button>
        )}

        {currentStep < 7 && (
          <button
            onClick={() => setCurrentStep(prev => prev + 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#6366f1',
              border: 'none',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              marginLeft: 'auto'
            }}
          >
            Tiếp Theo <FiArrowRight size={16} />
          </button>
        )}
      </div>

    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Đang tải Wizard...</div>}>
      <BuilderContent />
    </Suspense>
  );
}
