import { LitElement, html, customElement } from "lit-element";

@customElement("custom-loader")
export class CustomLoader extends LitElement {
  protected render() {
    return html`
      <p>Loading...</p>
    `;
  }
}
