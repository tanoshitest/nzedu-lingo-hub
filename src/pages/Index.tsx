import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import AppShell from '@/components/AppShell';
import type { Role } from '@/data/mockData';

const Index = () => {
  const [activeRole, setActiveRole] = useState<Role | null>(null);

  if (activeRole === null) {
    return <LandingPage onLogin={setActiveRole} />;
  }

  return <AppShell role={activeRole} onLogout={() => setActiveRole(null)} />;
};

export default Index;
