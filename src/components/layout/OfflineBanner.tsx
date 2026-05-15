export default function OfflineBanner({ isOffline }: { isOffline: boolean }) {
  if (!isOffline) return null;
  return (
    <div className="bg-yellow-600 text-white text-center text-xs py-1">
      离线模式 - 游戏数据保存在本地
    </div>
  );
}
