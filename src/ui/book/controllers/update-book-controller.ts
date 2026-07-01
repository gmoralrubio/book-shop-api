import { UpdateBookUseCase } from '@domain/book/use-cases/update-book';
import { PrismaBookRepository } from '@infraestructure/book/repositories/PrismaBookRepository';
import { updateBookValidationSchema } from '@ui/book/validators/book-validator';
import { Request, Response, NextFunction } from 'express';
export const updateBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prismaBookRepository = new PrismaBookRepository();
  const updateBookUseCase = new UpdateBookUseCase(prismaBookRepository);
  try {
    const { title, description, price, author } =
      updateBookValidationSchema.parse(req.body);

    const ownerId = req.userId!;
    const id = Number(req.params.id);

    const updatedBook = await updateBookUseCase.execute({
      id,
      ownerId,
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
