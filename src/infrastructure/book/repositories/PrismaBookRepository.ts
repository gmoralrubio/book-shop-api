import { Book, BookStatus } from '@domain/book/Book';
import { FindBooksResponse } from '@domain/book/types/FindBooksResponse';
import { BookRepository } from '@domain/book/repositories/BookRepository';
import { CreateBookUseCaseInput } from '@domain/book/use-cases/create-book';
import { FindBooksUseCaseInput } from '@domain/book/use-cases/find-books';
import { UpdateBookUseCaseInput } from '@domain/book/use-cases/update-book';
import prismaClient from '@infrastructure/shared/prisma-client';

interface PrismaBook {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  price: number;
  author: string;
  status: BookStatus;
  soldAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

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

    return this.restore(prismaBook);
  }
  async update(params: UpdateBookUseCaseInput): Promise<Book> {
    const prismaBook = await this.prisma.book.update({
      where: { id: params.id },
      data: {
        title: params.title,
        description: params.description,
        price: params.price,
        author: params.author,
      },
    });
    return this.restore(prismaBook);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.book.delete({ where: { id } });
  }

  async findMany(criteria: FindBooksUseCaseInput): Promise<FindBooksResponse> {
    const { page, limit } = criteria;

    const where: Record<string, unknown> = {};

    if (criteria.search) {
      where.OR = [
        { title: { contains: criteria.search, mode: 'insensitive' as const } },
        { author: { contains: criteria.search, mode: 'insensitive' as const } },
      ];
    }

    if (criteria.userId) {
      where.ownerId = criteria.userId;
    }

    if (criteria.status) {
      where.status = criteria.status;
    }

    const [booksPrisma, booksCount] = await Promise.all([
      await this.prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.book.count({
        where,
      }),
    ]);

    const books = booksPrisma.map((book) => this.restore(book));

    return {
      books,
      total: booksCount,
    };
  }

  async findPublishedBefore(date: Date): Promise<Book[]> {
    const prismaBooks = await this.prisma.book.findMany({
      where: { status: 'PUBLISHED', createdAt: { lt: date } },
    });

    return prismaBooks.map((book) => this.restore(book));
  }

  async findById(id: number): Promise<Book | null> {
    const prismaBook = await this.prisma.book.findUnique({ where: { id } });
    if (!prismaBook) {
      return null;
    } else {
      return this.restore(prismaBook);
    }
  }

  async toggleStatusTo(status: BookStatus, id: number): Promise<void> {
    await this.prisma.book.update({ where: { id }, data: { status } });
  }

  async setSoldAt(date: Date, id: number): Promise<void> {
    await this.prisma.book.update({ where: { id }, data: { soldAt: date } });
  }

  private restore(prismaBook: PrismaBook): Book {
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
