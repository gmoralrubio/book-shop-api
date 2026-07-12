export interface SoldBookEmailParams {
  ownerId: number;
  title: string;
}

export interface QueueService {
  sendSoldBookEmail: (params: SoldBookEmailParams) => Promise<void>;
  priceReviewCron: () => Promise<void>;
}
