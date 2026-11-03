export type DetailImage = {
  order: number;
  url: string;
  naturalWidth?: number;
  naturalHeight?: number;
  displayWidth?: number;
  displayHeight?: number;
};

export type DetailBlock = { order: number; type: "text"; text: string } | { order: number; type: "image"; imageUrl: string };

export interface SmartstoreAnalysisSource {
  product: {
    title?: string; price?: number; salePrice?: number; productNo?: string;
    storeName?: string; category?: string; mainImage?: string; url: string;
  };
  detail: { images: DetailImage[]; text: string; blocks: DetailBlock[] };
  meta: { extractedAt: string; imageCount: number; blockCount: number; extractorVersion: string };
}
