import { BuyBookUseCase } from '@domain/book/use-cases/buy-book';
import { PrismaBookRepository } from '@infrastructure/book/repositories/PrismaBookRepository';
import { BullQueueService } from '@infrastructure/shared/services/BullQueueService';
import { idParamValidationSchema } from '@ui/book/validators/book-validator';
import { Request, Response, NextFunction } from 'express';

export const buyBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId!;

  const prismaBookRepository = new PrismaBookRepository();
  const bullQueueService = new BullQueueService();
  const buyBookUseCase = new BuyBookUseCase(
    prismaBookRepository,
    bullQueueService
  );

  try {
    const { id } = idParamValidationSchema.parse(req.params);

    const book = await buyBookUseCase.execute({ id, userId });

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};
