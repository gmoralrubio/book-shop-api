export interface SoldBookEmailParams {
  ownerId: number;
  title: string;
}
export interface ReviewPriceEmailParams {
  ownerId: number;
  title: string;
  price: number;
}

export interface QueueService {
  sendSoldBookEmail: (params: SoldBookEmailParams) => Promise<void>;
  priceReviewCron: () => Promise<void>;
}
