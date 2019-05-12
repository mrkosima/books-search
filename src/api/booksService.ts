interface BookApi {
  title: string;
  isbn: string[];
  author_name: string[];
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

const getCoverUrl = (
  key: "isbn" | "oclc" | "lccn" | "olid" | "id",
  value: string,
  size: "S" | "M" | "L"
) => `http://covers.openlibrary.org/a/${key}/${value}-${size}.jpg`;

const getCoverUrls = (isbn: string): CoverUrils => ({
  small: getCoverUrl("isbn", isbn, "S"),
  medium: getCoverUrl("isbn", isbn, "M"),
  large: getCoverUrl("isbn", isbn, "L")
});

const convertBooksApi = (booksApi: BooksApi): Books => {
  return booksApi.docs
    .filter(book => book.author_name && book.isbn && book.isbn.length > 0)
    .map(book => ({
      id: book.isbn[0],
      authorName: book.author_name.join(", "),
      coverUrls: getCoverUrls(book.isbn[0])
    }));
};

export const searchBooks = (text: string): Promise<Books> =>
  fetchApi<BooksApi>(`${SEARCH_API}?q=${prepareQueryString(text)}`).then(
    books => convertBooksApi(books).slice(0, 5)
  );

//   http://covers.openlibrary.org/a/$key/$value-$size.jpg
//   http://covers.openlibrary.org/a/isbn/$value-$size.jpg
