interface Window {
  yaContextCb?: Array<() => void>;
  Ya?: {
    Context?: {
      AdvManager?: {
        render: (params: {
          blockId: string;
          renderTo: string;
          type: string;
        }) => void;
      };
    };
  };
}
