/**
 * ImageStore — IndexedDB 圖片儲存服務
 * 
 * 用於儲存使用者自訂的旅程封面圖片。
 * 圖片以 Blob 形式存入 IndexedDB，不影響 localStorage 空間。
 */

const DB_NAME = 'trip-images-db';
const DB_VERSION = 1;
const STORE_NAME = 'covers';

/**
 * 取得 IndexedDB 連線
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * 儲存圖片 Blob 到 IndexedDB
 * @param tripId 旅程 ID，作為儲存的 key
 * @param blob 壓縮後的圖片 Blob
 */
export async function saveImage(tripId: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(blob, tripId);

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

/**
 * 從 IndexedDB 讀取圖片並回傳 Object URL
 * @param tripId 旅程 ID
 * @returns Object URL 字串，若無圖片則回傳 null
 */
export async function getImageUrl(tripId: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(tripId);

      request.onsuccess = () => {
        db.close();
        const blob = request.result;
        if (blob instanceof Blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          resolve(null);
        }
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  } catch {
    // IndexedDB 不可用時（例如隱私模式），優雅降級
    console.warn('ImageStore: IndexedDB 不可用，使用預設圖片');
    return null;
  }
}

/**
 * 刪除 IndexedDB 中的圖片
 * @param tripId 旅程 ID
 */
export async function deleteImage(tripId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(tripId);

      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch {
    console.warn('ImageStore: 刪除圖片時 IndexedDB 不可用');
  }
}

/**
 * 壓縮圖片 File 為 Blob
 * 縮放至指定尺寸，降低品質，回傳 JPEG Blob
 * @param file 使用者選取的原始檔案
 * @param maxWidth 最大寬度（預設 1200px）
 * @param quality JPEG 品質（預設 0.75）
 */
export function compressImage(
  file: File,
  maxWidth = 1200,
  quality = 0.75
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // 計算等比縮放尺寸
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      // 使用 Canvas 壓縮
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context 建立失敗'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('圖片壓縮失敗'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('圖片載入失敗'));
    };

    img.src = url;
  });
}
