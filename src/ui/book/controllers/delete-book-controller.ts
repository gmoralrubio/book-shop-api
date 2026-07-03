import { DeleteBookUseCase } from '@domain/book/use-cases/delete-book';
import { PrismaBookRepository } from '@infraestructure/book/repositories/PrismaBookRepository';
import { Request, Response, NextFunction } from 'express';
export const deleteBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId!;
  const id = Number(req.params.id);

  const prismaBookRepository = new PrismaBookRepository();
  const deleteBookUseCase = new DeleteBookUseCase(prismaBookRepository);

  try {
    await deleteBookUseCase.execute({
      id,
      userId,
    });

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};
