import { type ReactNode } from 'react';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import OfflineBanner from './OfflineBanner';
import { usePWAStatus } from '../../hooks/usePWAStatus';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { isOffline } = usePWAStatus();

  return (
    <div className="fixed inset-0 flex flex-col bg-bg">
      <OfflineBanner isOffline={isOffline} />
      <TopBar />
      <main className="flex-1 flex flex-col min-h-0">{children}</main>
      <BottomNav />
    </div>
  );
}
