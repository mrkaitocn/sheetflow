'use client';

import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

export default function CodeBlock({ code, title = 'Cấu hình JSON' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: '#0d1117',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      overflow: 'hidden',
      margin: '16px 0'
    }}>
      <div style={{
        background: '#161b22',
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#8b949e' }}>{title}</span>
        <button
          onClick={handleCopy}
          style={{
            background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: copied ? '#10b981' : '#f8fafc',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
          <span>{copied ? 'Đã sao chép!' : 'Sao chép 1-Click'}</span>
        </button>
      </div>
      <pre style={{
        padding: '16px',
        margin: 0,
        overflowX: 'auto',
        fontSize: '13px',
        fontFamily: 'monospace',
        color: '#e6edf3',
        lineHeight: 1.5
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
