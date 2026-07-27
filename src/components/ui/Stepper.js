export default function Stepper({ steps, currentStep }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '24px 0 36px 0',
      position: 'relative',
      overflowX: 'auto',
      paddingBottom: '8px'
    }}>
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={idx} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            zIndex: 2,
            minWidth: '100px'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: isCompleted
                ? '#10b981'
                : isActive
                ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                : '#1e293b',
              color: isCompleted || isActive ? '#ffffff' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '14px',
              border: isActive ? '3px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: isActive ? '0 0 16px rgba(99, 102, 241, 0.5)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              {isCompleted ? '✓' : stepNum}
            </div>

            <span style={{
              fontSize: '12px',
              fontWeight: isActive ? '600' : '400',
              color: isActive ? '#f8fafc' : isCompleted ? '#10b981' : '#64748b',
              textAlign: 'center'
            }}>
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
