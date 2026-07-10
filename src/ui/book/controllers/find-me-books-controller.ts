import { Request, Response, NextFunction } from 'express';
import { PrismaBookRepository } from '@infraestructure/book/repositories/PrismaBookRepository';
import { FindBooksUseCase } from '@domain/book/use-cases/find-books';
import { findBookValidationSchema } from '@ui/book/validators/book-validator';
import { buildPaginatedResponse } from '@ui/shared/presenters/paginated-response';
export const findMeBooksController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prismaBookRepository = new PrismaBookRepository();
  const findBooksUseCase = new FindBooksUseCase(prismaBookRepository);
  const userId = req.userId;

  try {
    const { page, limit } = findBookValidationSchema.parse(req.query);
    const { books, total } = await findBooksUseCase.execute({
      userId,
      page,
      limit,
    });

    const url = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

    const response = buildPaginatedResponse({
      data: books,
      total,
      page,
      limit,
      url,
    });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
