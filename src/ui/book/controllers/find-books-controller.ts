import { Request, Response, NextFunction } from 'express';
import { PrismaBookRepository } from '@infraestructure/book/repositories/PrismaBookRepository';
import { FindBooksUseCase } from '@domain/book/use-cases/find-books';
import { findBookValidationSchema } from '@ui/book/validators/book-validator';
import { PaginatedResponse } from '@ui/shared/types/PaginatedResponse';
import { Book } from '@domain/book/Book';
export const findBooksController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prismaBookRepository = new PrismaBookRepository();
  const findBooksUseCase = new FindBooksUseCase(prismaBookRepository);

  try {
    const { page, limit, search } = findBookValidationSchema.parse(req.query);
    const { books, total } = await findBooksUseCase.execute({
      page,
      limit,
      status: 'PUBLISHED',
      search,
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
