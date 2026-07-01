import { Book } from '@domain/book/Book';
import { BookRepository } from '@domain/book/repositories/BookRepository';
import { CreateBookUseCaseInput } from '@domain/book/use-cases/create-book';
import prismaClient from '@infraestructure/prisma-client';

export class PrismaBookRepository implements BookRepository {
  private readonly prisma = prismaClient;

  async create(params: CreateBookUseCaseInput): Promise<Book> {
    const prismaBook = await this.prisma.book.create({
      data: {
        ownerId: params.ownerId,
        title: params.title,
        description: params.description,
        price: params.price,
        author: params.author,
      },
    });

    return new Book({
      id: prismaBook.id,
      ownerId: prismaBook.ownerId,
      title: prismaBook.title,
      description: prismaBook.description,
      price: prismaBook.price,
      author: prismaBook.author,
      status: prismaBook.status,
      soldAt: prismaBook.soldAt,
      createdAt: prismaBook.createdAt,
      updatedAt: prismaBook.updatedAt,
    });
  }
}
