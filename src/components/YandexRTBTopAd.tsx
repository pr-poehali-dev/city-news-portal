import { useEffect } from 'react';

export const YandexRTBTopAd = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.yaContextCb) {
      window.yaContextCb.push(() => {
        if (window.Ya && window.Ya.Context && window.Ya.Context.AdvManager) {
          window.Ya.Context.AdvManager.render({
            blockId: "R-A-17651616-3",
            type: "topAd"
          });
        }
      });
    }
  }, []);

  return (
    <div className="w-full bg-gray-50 border-b-4 border-primary">
      <div id="yandex_rtb_R-A-17651616-3" className="container mx-auto"></div>
    </div>
  );
};

declare global {
  interface Window {
    yaContextCb: Array<() => void>;
    Ya: {
      Context: {
        AdvManager: {
          render: (params: { blockId: string; type: string }) => void;
        };
      };
    };
  }
}
