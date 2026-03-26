import React, { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { compressImage } from '../services/imageStore';

interface ImagePickerProps {
  /** 選取並壓縮後的 callback，回傳壓縮後的 Blob */
  onImageSelected: (blob: Blob) => void;
  /** 開始選取圖片時的 callback（用於阻止卡片導航） */
  onPickStart?: () => void;
  /** 額外的 CSS class */
  className?: string;
}

/**
 * 圖片選取按鈕元件
 * 
 * 點擊後觸發手機相簿 / 檔案選取器，
 * 選取圖片後自動壓縮並透過 callback 回傳。
 */
const ImagePicker: React.FC<ImagePickerProps> = ({ onImageSelected, onPickStart, className = '' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止冒泡觸發旅程卡片的 onClick
    e.preventDefault();
    onPickStart?.();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressedBlob = await compressImage(file);
      onImageSelected(compressedBlob);
    } catch (err) {
      console.error('圖片處理失敗:', err);
      alert('圖片處理失敗，請嘗試其他圖片');
    } finally {
      setIsCompressing(false);
      // 清空 input 值，確保選同一張圖也會觸發 onChange
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        disabled={isCompressing}
        className={`
          flex items-center justify-center gap-1.5
          px-2.5 py-1.5 rounded-lg
          bg-black/40 hover:bg-black/60
          backdrop-blur-md
          border border-white/20
          text-white text-xs font-bold
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        title="更換封面圖片"
      >
        {isCompressing ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>處理中...</span>
          </>
        ) : (
          <>
            <Camera size={14} />
            <span>換封面</span>
          </>
        )}
      </button>
    </>
  );
};

export default ImagePicker;
