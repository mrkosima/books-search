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
  private updateTime: number;

  static get styles() {
    return css`
      * {
        color: green;
      }
    `;
  }

  static get properties() {
    return {
      books: { attribute: false, type: Array },
      searchText: { attribute: false, type: String },
      loading: { attribute: false, type: Boolean, reflect: true },
      updateTime: { attribute: false, type: Number }
    };
  }

  protected render() {
    const content = this.loading
      ? html`
          <custom-loader></custom-loader>
        `
      : html`
          <books-gallery .books=${this.books}></books-gallery>
        `;

    return html`
      <h1>Hello</h1>
      <voice-input
        placeholder="Search"
        language="en"
        @valueChanged=${this.onSearchChanged}
      ></voice-input>
      <time-ago .time=${this.updateTime}></time-ago>
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
    searchBooks(searchText).then(this.handleBooksLoaded, this.handleError);
  };

  private handleBooksLoaded = (books: Books) => {
    this.loading = false;
    this.books = books;
    this.updateTime = Date.now();
  };

  private handleError = (error: any) => {
    console.warn(error);
    this.loading = false;
    this.updateTime = null;
  };
}
