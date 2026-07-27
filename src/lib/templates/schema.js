// === 7 CỘT BẮT BUỘC (Không thể xóa, luôn hiện diện trong mọi báo cáo) ===
export const REQUIRED_COLUMNS = [
  {
    key: 'task_id',
    label: 'Mã CV',
    type: 'id',
    required: true,
    system: true,
    description: 'Mã định danh duy nhất (Tự động tạo)',
    editable_by: 'system'
  },
  {
    key: 'task_name',
    label: 'Tên công việc',
    type: 'text',
    required: true,
    system: true,
    description: 'Tên hoặc nội dung mô tả công việc',
    editable_by: 'manager'
  },
  {
    key: 'assignee',
    label: 'Người phụ trách',
    type: 'select',
    required: true,
    system: true,
    description: 'Email hoặc tên nhân viên được giao việc',
    editable_by: 'manager'
  },
  {
    key: 'status',
    label: 'Trạng thái',
    type: 'status',
    required: true,
    system: true,
    description: 'Trạng thái tiến độ công việc',
    editable_by: 'all'
  },
  {
    key: 'deadline',
    label: 'Hạn chót',
    type: 'date',
    required: true,
    system: true,
    description: 'Ngày hết hạn hoàn thành',
    editable_by: 'manager'
  },
  {
    key: 'notes',
    label: 'Ghi chú',
    type: 'textarea',
    required: true,
    system: true,
    description: 'Báo cáo chi tiết hoặc phản hồi từ nhân viên',
    editable_by: 'all'
  },
  {
    key: 'attachments',
    label: 'Tài liệu đính kèm',
    type: 'files',
    multiple: true,
    required: true,
    system: true,
    description: 'Link hoặc đính kèm nhiều file tài liệu liên quan',
    editable_by: 'all'
  }
];

// === DANH SÁCH TRẠNG THÁI MẶC ĐỊNH ===
export const DEFAULT_STATUS_FLOW = [
  { id: 'not_started', label: 'Chưa bắt đầu', color: '#94a3b8' },
  { id: 'in_progress', label: 'Đang thực hiện', color: '#3b82f6' },
  { id: 'completed', label: 'Hoàn thành', color: '#10b981' },
  { id: 'overdue', label: 'Trễ hạn', color: '#ef4444' }
];

// === TEMPLATE PRESETS ===
export const TEMPLATE_PRESETS = [
  {
    id: 'weekly-report',
    name: 'Báo cáo công việc hàng tuần',
    description: 'Mẫu chuẩn theo dõi công việc nhóm hàng tuần với tiến độ phần trăm và đánh giá.',
    icon: '📋',
    columns: [
      ...REQUIRED_COLUMNS,
      {
        key: 'progress',
        label: 'Tiến độ (%)',
        type: 'number',
        required: false,
        system: false,
        editable_by: 'all'
      }
    ],
    statusFlow: DEFAULT_STATUS_FLOW
  },
  {
    id: 'project-mgmt',
    name: 'Quản lý dự án',
    description: 'Dành cho các dự án cần phân chia giai đoạn, mức độ ưu tiên và ngày bắt đầu.',
    icon: '📊',
    columns: [
      ...REQUIRED_COLUMNS,
      {
        key: 'stage',
        label: 'Giai đoạn',
        type: 'text',
        required: false,
        system: false,
        editable_by: 'manager'
      },
      {
        key: 'priority',
        label: 'Ưu tiên',
        type: 'select',
        options: ['Gấp', 'Cao', 'Bình thường', 'Thấp'],
        required: false,
        system: false,
        editable_by: 'manager'
      },
      {
        key: 'start_date',
        label: 'Ngày bắt đầu',
        type: 'date',
        required: false,
        system: false,
        editable_by: 'manager'
      }
    ],
    statusFlow: DEFAULT_STATUS_FLOW
  },
  {
    id: 'checklist',
    name: 'Checklist công việc',
    description: 'Danh mục kiểm tra công việc đơn giản theo từng mục tiêu cụ thể.',
    icon: '✅',
    columns: [
      ...REQUIRED_COLUMNS,
      {
        key: 'verified',
        label: 'Đã nghiệm thu',
        type: 'checkbox',
        required: false,
        system: false,
        editable_by: 'manager'
      }
    ],
    statusFlow: DEFAULT_STATUS_FLOW
  },
  {
    id: 'custom',
    name: 'Tự tạo bảng mới',
    description: 'Bắt đầu từ 6 cột bắt buộc và tự do thêm các cột theo nhu cầu công việc của bạn.',
    icon: '✨',
    columns: [...REQUIRED_COLUMNS],
    statusFlow: DEFAULT_STATUS_FLOW
  }
];
