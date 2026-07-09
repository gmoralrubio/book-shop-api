export interface SoldBookEmailParams {
  ownerId: string;
  title: string;
}

export interface QueueService {
  sendSoldBookEmail: (params: SoldBookEmailParams) => Promise<void>;
}
