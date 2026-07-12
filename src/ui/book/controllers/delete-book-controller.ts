import { DeleteBookUseCase } from '@domain/book/use-cases/delete-book';
import { PrismaBookRepository } from '@infrastructure/book/repositories/PrismaBookRepository';
import { idParamValidationSchema } from '@ui/book/validators/book-validator';
import { Request, Response, NextFunction } from 'express';
export const deleteBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId!;

  const prismaBookRepository = new PrismaBookRepository();
  const deleteBookUseCase = new DeleteBookUseCase(prismaBookRepository);

  try {
    const { id } = idParamValidationSchema.parse(req.params);

    await deleteBookUseCase.execute({
      id,
      userId,
    });

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};
