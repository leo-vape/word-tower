import { useState, useEffect } from 'react';

export default function WeChatGuide() {
  const [isWeChat, setIsWeChat] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsWeChat(ua.includes('micromessenger'));
  }, []);

  if (!isWeChat) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="text-5xl mb-4">📱</div>
      <h2 className="text-xl font-bold text-white mb-3">在浏览器中打开</h2>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-xs">
        微信内置浏览器不支持打开此页面，请点击右上角
        <span className="text-white font-bold mx-1">···</span>
        选择<span className="text-white font-bold ml-1">在浏览器中打开</span>
      </p>

      <div className="bg-surface rounded-2xl p-5 max-w-xs w-full mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">···</div>
          </div>
          <div className="text-gray-500 text-xs">右上角菜单</div>
        </div>
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gray-600 mx-auto mb-2" />
        <div className="bg-gray-800 rounded-lg p-3 text-sm text-white">
          🌐 在浏览器中打开
        </div>
      </div>

      <p className="text-gray-600 text-xs">
        或者复制链接，粘贴到 Safari / Chrome 打开
      </p>
    </div>
  );
}
