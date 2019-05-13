import { booksMock } from "./mock";
interface BookApi {
  title: string;
  cover_i?: number;
  isbn?: string[];
  author_name?: string[];
}

interface BooksApi {
  docs: BookApi[];
  numFound: number;
  start: number;
}

type CoverUrils = { [key in "small" | "medium" | "large"]: string };

export interface Book {
  id: string;
  authorName: string;
  coverUrls: CoverUrils;
}

export type Books = Book[];

const SEARCH_API = "http://openlibrary.org/search.json";

const prepareQueryString = (text: string) =>
  text
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter(word => !!word)
    .join("+");

const fetchApi = <T>(path: string): Promise<T> =>
  fetch(path).then(res => res.json());
  // new Promise((resolve, reject) => setTimeout(() => resolve(booksMock), 1000));


const getCoverUrl = (
  key: "isbn" | "oclc" | "lccn" | "olid" | "id",
  value: string,
  size: "S" | "M" | "L"
) =>
  `http://covers.openlibrary.org/a/${key}/${value}-${size}.jpg?default=false`;

const getCoverUrls = (coverId: number): CoverUrils => ({
  small: getCoverUrl("id", coverId.toString(), "S"),
  medium: getCoverUrl("id", coverId.toString(), "M"),
  large: getCoverUrl("id", coverId.toString(), "L")
});

const convertBooksApi = (booksApi: BooksApi): Books => {
  return booksApi.docs
    .filter(
      book =>
        book.author_name && book.cover_i && book.isbn && book.isbn.length > 0
    )
    .map(book => ({
      id: book.isbn[0],
      authorName: book.author_name.join(", "),
      coverUrls: getCoverUrls(book.cover_i)
    }));
};

export const searchBooks = (text: string): Promise<Books> =>
  fetchApi<BooksApi>(`${SEARCH_API}?q=${prepareQueryString(text)}`).then(
    books => convertBooksApi(books)
  );
