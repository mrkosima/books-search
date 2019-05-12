import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";

@customElement("chrome-checker")
export class ChromeChecker extends LitElement {
  @property({ type: String }) minVersion: string;

  render() {
    if (!this.supported()) {
      let message: TemplateResult;
      if (this.isChrome() && this.minVersion) {
        message = html`
          <p>
            Please upgrade your Google Chrome browser to version
            ${this.minVersion} or higher.
          </p>
        `;
      } else {
        message = html`
          <p>
            To enter the website please use
            <a href="https://www.google.com/chrome/">Google Chrome</a>.
          </p>
        `;
      }

      return html`
        <h2>
          Your browser is not supported
        </h2>
        ${message}
      `;
    }
    return html`
      <slot></slot>
    `;
  }

  private isChrome = () =>
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

  private getChromeVersion = (): number => {
    const match = /Chrome\/(\d+)/g.exec(navigator.userAgent);
    if (match.length > 1) {
      return +match[1];
    }
    return -1;
  };

  private supported = () => {
    const chrome = this.isChrome();
    if (chrome && !isNaN(+this.minVersion)) {
      return +this.minVersion <= this.getChromeVersion();
    }
    return chrome;
  };
}
