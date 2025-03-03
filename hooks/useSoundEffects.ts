// Bu hook artık kullanılmıyor, ancak TypeScript derlemesi için gerekli
import { useEffect } from 'react';

export function useSoundEffects() {
  useEffect(() => {
    // Ses efektleri kaldırıldı
    return () => {
      // Temizleme işlemi
    };
  }, []);

  return {
    playSound: () => {
      // Boş fonksiyon
    }
  };
}

export default useSoundEffects; 