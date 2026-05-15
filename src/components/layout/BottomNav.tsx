import { useLocation, Link } from 'react-router-dom';

const tabs = [
  { path: '/', label: '爬塔', icon: '🗼' },
  { path: '/hatchery', label: '孵蛋', icon: '🥚' },
  { path: '/collection', label: '图鉴', icon: '📖' },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="flex-shrink-0 bg-surface border-t border-gray-800 flex z-50">
      {tabs.map(tab => {
        const active = pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex-1 flex flex-col items-center py-2 pb-safe text-xs transition-colors ${
              active ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
