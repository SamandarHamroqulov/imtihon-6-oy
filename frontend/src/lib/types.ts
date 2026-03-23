/** Shared types for the application */

export interface Book {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  price: number;
  poetId: number;
  genre: string;
  Poet?: {

    firstname: string;
    lastname: string;
    genre: string;
    bio?: string;
    image?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Poet {
  id: number;
  firstname: string;
  lastname: string;
  country: string;
  birthDate: string;
  deathDate?: string;
  genre: string;
  bio: string;
  image: string;
  Books?: Book[];
  createdAt?: string;
  updatedAt?: string;
}


export interface BookshelfItem {
  id: string;
  book: Book;
  addedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface Comment {
  id: number;
  bookId: number;
  userId: number;
  commentText: string;
  text?: string;
  rating: number | null;
  User?: {
    id: number;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  createdAt: string;
  updatedAt: string;
}
