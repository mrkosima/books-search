import {
  LitElement,
  html,
  customElement,
  property,
  css,
  PropertyValues
} from "lit-element";
// import { repeat } from "lit-html/directives/repeat";
import { Books, Book } from "../api/booksService";
import "./book-details";

@customElement("books-gallery")
export class BooksGallery extends LitElement {
  @property({ type: Array }) books: Books = [];

  private active: boolean = false;
  private booksToRender: Book[] = [];

  private autoscrollInterval: number;
  private currentIndex = 0;
  private scrollDirection: "previous" | "next" | "none";

  static get styles() {
    return css`
      :host {
        --carousel-width: 40vh;
        --carousel-height: calc(1.2 * var(--carousel-width));
      }
      .container {
        width: 100%;
        margin: 25px auto;
        display: flex;

        justify-content: center;
        opacity: 1;
      }
      .container.deactivated {
        opacity: 0.3;
      }
      .carousel {
        background: none;
        border: 1px solid #e0e0e0;
        box-sizing: content-box;
        padding: 10px;
        width: calc(var(--carousel-width));
        height: calc(var(--carousel-height));
      }
      .scroll {
        display: flex;
        align-items: center;

        overflow-x: hidden;
        overflow-y: hidden;
        width: 100%;
        height: 100%;

        margin: 0;
        padding: 0;
        list-style-type: none;
        scroll-snap-type: x mandatory;
      }
      .item-outer {
        scroll-snap-align: center;
        width: 100%;
        height: 100%;
      }
      .book-wrapper {
        width: calc(var(--carousel-width));
        height: 100%;
      }
      .buttons {
        display: flex;
        justify-content: center;
      }
      .buttons button {
        padding: 10px 15px;
        margin: 0 5px;
        min-width: 80px;
        outline: none;
      }
    `;
  }

  static get properties() {
    return {
      booksToRender: { type: Array },
      active: { type: Boolean }
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
    this.stopAutoScroll();
    super.disconnectedCallback();
  }

  protected firstUpdated() {
    this.updateRenderList();
    this.checkActive();
  }

  protected render() {
    const [prev, curr, next] = this.booksToRender;
    return html`
      <div class=${`container ${!this.active ? "deactivated" : ""}`}>
        <div class="carousel">
          <ul class="scroll" id="scroll" scrollLeft="0">
            <li class="item-outer" id="previous">
              <div class="book-wrapper">
                <book-details .book=${prev}></book-details>
              </div>
            </li>
            <li class="item-outer" id="current">
              <div class="book-wrapper">
                <book-details .book=${curr}></book-details>
              </div>
            </li>
            <li class="item-outer" id="next">
              <div class="book-wrapper"></div>
                <book-details .book=${next}></book-details>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="buttons">
        <button @click=${this.onPrevious}>Previous</button>
        <button @click=${this.onNext}>Next</button>
      </div>
    `;
  }

  protected updated(values: PropertyValues) {
    super.update(values);
    if (values.has("booksToRender")) {
      this.updatePosition();
    }
  }

  private updatePosition = () => {
    if (this.scrollDirection === "none") {
      this.shadowRoot.getElementById("current").scrollIntoView();
    } else {
      this.shadowRoot
        .getElementById(
          this.scrollDirection === "previous" ? "next" : "previous"
        )
        .scrollIntoView();
      this.shadowRoot
        .getElementById("current")
        .scrollIntoView({ behavior: "smooth" });
    }
    this.scrollDirection = "none";
  };

  private setCurrentIndex = (index: number) => {
    const count = this.books.length;
    if (index < 0) {
      index = index - Math.floor(index / count) * count;
    }
    const newIndex = index % count;
    if (this.currentIndex !== newIndex) {
      this.currentIndex = newIndex;
      this.updateRenderList();
    }
  };

  private updateRenderList = () => {
    const totalBooks = this.books.length;
    const pervIndex =
      this.currentIndex === 0 ? totalBooks - 1 : this.currentIndex - 1;
    const nextIndex =
      this.currentIndex === totalBooks - 1 ? 0 : this.currentIndex + 1;
    this.booksToRender = [
      this.books[pervIndex],
      this.books[this.currentIndex],
      this.books[nextIndex]
    ];
  };

  private onPrevious = () => {
    this.scrollDirection = "previous";
    this.setCurrentIndex(this.currentIndex - 1);
    this.resetAutoScroll();
  };

  private onNext = () => {
    this.scrollDirection = "next";
    this.setCurrentIndex(this.currentIndex + 1);
    this.resetAutoScroll();
  };

  private checkActive = () => {
    this.setActive(!document.hidden && document.hasFocus());
  };

  private setActive = (newActive: boolean) => {
    if (this.active !== newActive) {
      this.active = newActive;
      if (this.active) {
        this.startAutoScroll();
      } else {
        this.stopAutoScroll();
      }
    }
  };

  private startAutoScroll = () => {
    this.autoscrollInterval = window.setInterval(this.onNext, 3000);
  };

  private resetAutoScroll = () => {
    this.stopAutoScroll();
    if (this.active) {
      this.startAutoScroll();
    }
  };

  private stopAutoScroll = () => {
    window.clearInterval(this.autoscrollInterval);
    this.autoscrollInterval = 0;
  };
}
