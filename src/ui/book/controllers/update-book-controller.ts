import { UpdateBookUseCase } from '@domain/book/use-cases/update-book';
import { PrismaBookRepository } from '@infrastructure/book/repositories/PrismaBookRepository';
import {
  idParamValidationSchema,
  updateBookValidationSchema,
} from '@ui/book/validators/book-validator';
import { Request, Response, NextFunction } from 'express';
export const updateBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId!;

  const prismaBookRepository = new PrismaBookRepository();
  const updateBookUseCase = new UpdateBookUseCase(prismaBookRepository);

  try {
    const { id } = idParamValidationSchema.parse(req.params);

    const { title, description, price, author } =
      updateBookValidationSchema.parse(req.body);

    const updatedBook = await updateBookUseCase.execute({
      id,
      userId,
      title,
      description,
      price,
      author,
    });

    res.status(200).json(updatedBook);
  } catch (error) {
    next(error);
  }
};
