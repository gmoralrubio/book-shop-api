import { Request, Response, NextFunction } from 'express';
import { PrismaBookRepository } from '@infraestructure/book/repositories/PrismaBookRepository';
import { FindBooksMeUseCase } from '@domain/book/use-cases/find-books';
import { findBookValidationSchema } from '@ui/book/validators/book-validator';
import { PaginatedResponse } from '@ui/shared/types/PaginatedResponse';
import { Book } from '@domain/book/Book';
export const findMeBooksController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prismaBookRepository = new PrismaBookRepository();
  const findBooksUseCase = new FindBooksMeUseCase(prismaBookRepository);
  const userId = req.userId;

  try {
    const { page, limit } = findBookValidationSchema.parse(req.query);
    const { books, total } = await findBooksUseCase.execute({
      userId,
      page,
      limit,
    });

    const response: PaginatedResponse<Book> = {
      data: books,
      meta: {
        limit,
        page,
        total,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
