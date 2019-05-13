import { LitElement, html, property, customElement, css } from "lit-element";
import { Book } from "../api/booksService";

@customElement("book-details")
export class BookDetails extends LitElement {
  @property() book: Book;

  static get styles() {
    return css`
      .card {
        height: 100%;
        align-content: center;
        flex-wrap: nowrap;
        flex-direction: column;
      }
      .top-block {
        height: 90%;
      }
      .top-block img {
        height: 100%;
        width: 100%;
        object-fit: contain;
      }
      .bottom-block {
      }
    `;
  }
  protected render() {
    const { authorName, coverUrls } = this.book;
    const srcSet = `
      ${coverUrls.small},
      ${coverUrls.medium} 1.5x,
      ${coverUrls.large} 2x
    `;

    return html`
      <div class="card">
        <div class="top-block">
          <img srcset=${srcSet} src=${coverUrls.medium} />
        </div>
        <div class="bottom-block">
          <p>${authorName}</p>
        </div>
      </div>
    `;
  }
}
