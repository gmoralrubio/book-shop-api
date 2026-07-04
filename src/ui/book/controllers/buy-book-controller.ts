import { BuyBookUseCase } from '@domain/book/use-cases/buy-book';
import { PrismaBookRepository } from '@infraestructure/book/repositories/PrismaBookRepository';
import { idParamValidationSchema } from '@ui/book/validators/book-validator';
import { Request, Response, NextFunction } from 'express';

export const buyBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId!;

  const prismaBookRepository = new PrismaBookRepository();
  const buyBookUseCase = new BuyBookUseCase(prismaBookRepository);

  try {
    const { id } = idParamValidationSchema.parse(req.params);

    const book = await buyBookUseCase.execute({ id, userId });

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};
