export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      background: '#090d16',
      padding: '40px 24px',
      color: '#64748b',
      fontSize: '14px',
      marginTop: '60px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <strong style={{ color: '#f8fafc' }}>SheetFlow</strong> — Hỗ trợ xây dựng báo cáo Google Sheets & Apps Script cho nhóm.
        </div>
        <div>
          Giải pháp không mã hóa dành cho quản lý & nhóm làm việc.
        </div>
      </div>
    </footer>
  );
}
