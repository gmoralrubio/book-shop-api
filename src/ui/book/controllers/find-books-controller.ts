import { Request, Response, NextFunction } from 'express';
import { PrismaBookRepository } from '@infraestructure/book/repositories/PrismaBookRepository';
import { FindBooksUseCase } from '@domain/book/use-cases/find-books';
export const findBooksController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prismaBookRepository = new PrismaBookRepository();
  const findBooksUseCase = new FindBooksUseCase(prismaBookRepository);

  try {
    const userId = req.userId!;

    const books = await findBooksUseCase.execute(userId);

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};
