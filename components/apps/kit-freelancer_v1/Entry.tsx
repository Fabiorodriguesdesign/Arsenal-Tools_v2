
import React, { Suspense } from 'react';
import { Loading } from '../../ui/Loading';
import { TabId } from './types';

// Lazy load the main App component of Kit Freelancer
const KitFreelancerApp = React.lazy(() => import('./App'));

interface KitFreelancerEntryProps {
  initialTool?: TabId;
}

export default function KitFreelancerEntry({ initialTool }: KitFreelancerEntryProps) {
  return (
    <Suspense fallback={<Loading fullScreen text="Preparando ferramentas..." />}>
      <KitFreelancerApp initialTool={initialTool} />
    </Suspense>
  );
}
