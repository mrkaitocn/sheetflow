/**
 * Sinh chuỗi JSON cấu hình từ thông tin wizard để nhập vào Google Sheet
 */
export const generateConfigJSON = (wizardData) => {
  const config = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    projectName: wizardData.projectName || 'Báo cáo công việc nhóm',
    tableStartRow: wizardData.tableStartRow || 5,
    columns: wizardData.columns || [],
    statusFlow: wizardData.statusFlow || [],
    team: wizardData.team || [],
    permissions: {
      employeeCanAddTask: wizardData.permissions?.employeeCanAddTask || false,
      employeeCanAttachFile: wizardData.permissions?.employeeCanAttachFile ?? true,
      employeeCanEditNote: wizardData.permissions?.employeeCanEditNote ?? true
    },
    notifications: {
      enabled: wizardData.notifications?.enabled ?? true,
      managerEmail: wizardData.notifications?.managerEmail || '',
      notifyOnStatusChange: wizardData.notifications?.notifyOnStatusChange ?? true,
      notifyOnNoteUpdate: wizardData.notifications?.notifyOnNoteUpdate ?? false
    },
    appearance: {
      title: wizardData.appearance?.title || wizardData.projectName || 'Trang báo cáo công việc',
      primaryColor: wizardData.appearance?.primaryColor || '#6366f1'
    }
  };

  return JSON.stringify(config, null, 2);
};
