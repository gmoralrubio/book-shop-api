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

    const url = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const pages = Math.ceil(total / limit);
    const prevPage = page === 1 ? page : page - 1;
    const nextPage = page === pages ? pages : page + 1;

    const response: PaginatedResponse<Book> = {
      data: books,
      meta: {
        page,
        pages,
        total_items: total,
        per_page: limit,
        urls: {
          first: `${url}?page=1&limit=${limit}`,
          prev: `${url}?page=${prevPage}&limit=${limit}`,
          next: `${url}?page=${nextPage}&limit=${limit}`,
          last: `${url}?page=${pages}&limit=${limit}`,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
