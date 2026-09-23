import React from 'react';

export const EventLandingFooter: React.FC = () => {
  return (
    <footer
      className="w-full py-6 border-t text-center text-xs text-slate-500"
      style={{
        borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.08))',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      }}
    >
      <p>© {new Date().getFullYear()} Sàn Thương Mại Điện Tử Nông Sản OCOP.</p>
    </footer>
  );
};
