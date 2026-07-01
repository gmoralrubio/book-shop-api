import { CreateBookUseCase } from '@domain/book/use-cases/create-book';
import { PrismaBookRepository } from '@infraestructure/book/repositories/PrismaBookRepository';
import { createBookValidationSchema } from '@ui/book/validators/book-validator';
import { NextFunction, Request, Response } from 'express';

export const createBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prismaBookRepository = new PrismaBookRepository();
  const createBookUseCase = new CreateBookUseCase(prismaBookRepository);

  try {
    const { title, description, price, author } =
      createBookValidationSchema.parse(req.body);
    const ownerId = req.userId!;

    const book = await createBookUseCase.execute({
      title,
      description,
      price,
      author,
      ownerId,
    });

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};
