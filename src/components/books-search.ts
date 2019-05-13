import { customElement, LitElement, css, html } from "lit-element";
import { searchBooks, Books } from "../api/booksService";

import "./voice-input";
import "./books-gallery";
import "./custom-loader";
import "./time-ago";

@customElement("books-search")
export class BooksSearch extends LitElement {
  private books: Books = [];

  private searchText: string = "";
  private loading: boolean = false;
  private error: string;
  private updateTime: number;

  static get properties() {
    return {
      books: { type: Array },
      searchText: { type: String },
      loading: { type: Boolean, reflect: true },
      error: { type: String, reflect: true },
      updateTime: { type: Number }
    };
  }

  protected render() {
    let content;
    if (this.error) {
      content = html`<p>${this.error}</p>`;
    } else if (this.loading) {
      content = html`
        <custom-loader></custom-loader>
      `;
    } else if (!this.books || !this.books.length) {
      if (this.updateTime) {
        content = html`
          <p>No results found</p>
        `;
      }
    } else {
      content = html`
        <time-ago .time=${this.updateTime}></time-ago>
        <books-gallery .books=${this.books}></books-gallery>
      `;
    }
    return html`
        <voice-input
          placeholder="Search"
          language="en"
          @valueChanged=${this.onSearchChanged}
        ></voice-input>
        ${content}
    `;
  }

  private updateSearchText = (value: string) => {
    if (this.searchText !== value) {
      this.searchText = value;
      this.fetchData(this.searchText);
    }
  };

  private onSearchChanged = (event: CustomEvent) => {
    this.updateSearchText(event.detail);
  };

  private fetchData = (searchText: string) => {
    this.loading = true;
    this.error = null;
    searchBooks(searchText).then(this.handleBooksLoaded, this.handleError);
  };

  private handleBooksLoaded = (books: Books) => {
    this.loading = false;
    this.books = books;
    this.updateTime = Date.now();
  };

  private handleError = () => {
    this.loading = false;
    this.books = [];
    this.updateTime = null;
    this.error = "Something went wrong";
  };
}
