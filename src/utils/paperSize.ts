export const printerPaperSize: Record<string, PaperConfig> = {
  "58": {
    breakLine: 19,
    productName: 20,
    productAmount: 11,
    productPrice: 11,
    characters: 32,
  },
  "80": {
    breakLine: 33,
    productName: 34,
    productAmount: 11,
    productPrice: 11,
    characters: 44,
  },
};
type PaperConfig = {
  productPrice: number;
  productAmount: number;
  productName: number;
  breakLine: number;
  characters: number;
};
