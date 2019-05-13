import {
  LitElement,
  property,
  html,
  customElement,
  PropertyValues
} from "lit-element";
import { format } from "timeago.js";

@customElement("time-ago")
export class TimeAgo extends LitElement {
  @property({ type: Number }) time: number;

  private timeoutInterval: number;
  private formattedDuration: string;

  static get properties() {
    return {
      formattedDuration: { attribute: false, type: String }
    };
  }

  public disconnectedCallback() {
    this.resetTimer();
    super.disconnectedCallback();
  }

  protected firstUpdated() {
    this.updateFormattedDuration();
  }
  protected render() {
    if (this.formattedDuration) {
      return html`
        <div>
          <p>Last update: <span>${this.formattedDuration}</span></p>
        </div>
      `;
    }
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has("time")) {
      this.checkTimer();
    }
  }

  private checkTimer = () => {
    if (this.time) {
      if (!this.timeoutInterval) {
        this.timeoutInterval = window.setInterval(
          this.updateFormattedDuration,
          1000
        );
      }
    } else {
      this.resetTimer();
    }
  };

  private resetTimer = () => {
    window.clearInterval(this.timeoutInterval);
    this.timeoutInterval = 0;
  };

  private updateFormattedDuration = () => {
    this.formattedDuration = this.time
      ? format(this.time, navigator.language)
      : null;
  };
}
