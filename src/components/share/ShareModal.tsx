import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ShareCard from './ShareCard';
import { useGameStore } from '../../store/useGameStore';
import { useShareImage } from '../../hooks/useShareImage';
import type { ShareCardData } from '../../types/share';

interface ShareModalProps {
  onClose: () => void;
}

export default function ShareModal({ onClose }: ShareModalProps) {
  const getShareData = useGameStore(s => s.getShareData);
  const { ref, generate } = useShareImage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const shareData = getShareData();

  const handleGenerate = async () => {
    setLoading(true);
    const blob = await generate();
    if (blob) {
      setImageUrl(URL.createObjectURL(blob));
    }
    setLoading(false);
  };

  return (
    <Modal open onClose={onClose} title="分享成绩">
      <div className="flex flex-col items-center space-y-4">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="分享卡"
              className="w-full rounded-xl shadow-lg"
            />
            <p className="text-sm text-gray-400 text-center">
              长按上方图片保存，然后发到微信群或朋友圈
            </p>
          </>
        ) : (
          <>
            {/* Hidden render target for html-to-image */}
            <div className="fixed left-[-9999px] top-0" aria-hidden="true">
              <ShareCard ref={ref} data={shareData} />
            </div>

            <div className="text-center py-8">
              <div className="text-4xl mb-3">📊</div>
              <div className="text-white font-bold mb-1">今日成绩</div>
              <div className="text-sm text-gray-400 mb-4">
                最高 {shareData.towerHeight} 层 · 收集 {shareData.totalCreaturesCollected} 只精灵
              </div>
              <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? '生成中...' : '生成分享图片'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
