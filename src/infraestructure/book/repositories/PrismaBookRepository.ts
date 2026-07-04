import { Book, BookStatus } from '@domain/book/Book';
import { BookRepository } from '@domain/book/repositories/BookRepository';
import { CreateBookUseCaseInput } from '@domain/book/use-cases/create-book';
import { UpdateBookUseCaseInput } from '@domain/book/use-cases/update-book';
import prismaClient from '@infraestructure/prisma-client';

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

  async findMany(id: number): Promise<Book[] | null> {
    const prismaBooks = await this.prisma.book.findMany({
      where: { ownerId: id },
    });
    if (!prismaBooks) {
      return null;
    } else {
      return prismaBooks.map((book) => this.restore(book));
    }
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
