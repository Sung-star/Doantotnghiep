import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const SuspenseFallback = () => (
  <div
    className="d-flex align-items-center justify-content-center"
    style={{ minHeight: '400px' }}
  >
    <div className="text-center">
      <Loader2 className="text-primary animate-spin mb-3" size={48} />
      <p className="text-muted">Loading...</p>
    </div>
  </div>
);

export const SuspenseWrapper = ({ children, fallback = <SuspenseFallback /> }) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default SuspenseWrapper;
