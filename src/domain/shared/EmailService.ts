export interface SendEmailParams {
  email: string;
  message: string;
  subject?: string;
}

export interface EmailService {
  send: (params: SendEmailParams) => Promise<void>;
}
