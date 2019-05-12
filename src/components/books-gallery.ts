import { LitElement, html, customElement, property, css } from "lit-element";
import { repeat } from "lit-html/directives/repeat";
import { Books } from "../api/booksService";

@customElement("books-gallery")
export class BooksGallery extends LitElement {
  @property({ type: Array }) books: Books = [];

  protected active: boolean = false;

  static get styles() {
    return css`
      * {
        color: red;
      }
    `;
  }

  static get properties() {
    return {
      active: { attribute: false, type: Boolean }
    };
  }

  public connectedCallback() {
    super.connectedCallback();
    document.addEventListener("visibilitychange", this.checkActive);
    window.addEventListener("focus", this.checkActive);
    window.addEventListener("blur", this.checkActive);
    this.checkActive();
  }
  public disconnectedCallback() {
    document.removeEventListener("visibilitychange", this.checkActive);
    window.removeEventListener("focus", this.checkActive);
    window.removeEventListener("blur", this.checkActive);
    super.disconnectedCallback();
  }

  protected render() {
    const booksList = html`
      <ul>
        ${repeat(
          this.books,
          book => book.id,
          (book, i) => html`
            <li>${book.authorName}</li>
          `
        )}
        <ul></ul>
      </ul>
    `;
    return html`
      <h3>Books Gallery</h3>
      ${booksList}
      <h4>Active: ${this.active.toString()}</h4>
    `;
  }

  private checkActive = () => {
    this.active = !document.hidden; // Todo - uncomment && document.hasFocus()
  };
}
