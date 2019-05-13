import {} from "lit-html";
import { LitElement, html, property, customElement, css } from "lit-element";

@customElement("voice-input")
export class VoiceInput extends LitElement {
  @property({ type: String }) value: string = "";
  @property({ type: String }) placeholder: string = "";
  @property({ type: String }) language: string = "en";

  static get styles() {
    return css`
      .container {
        display: flex;
        height: 30px;
        font-size: 1.3em;
        margin: 25px 0 25px 0;
        justify-content: center;
      }

      input {
        font-family: inherit;
        font-size: inherit;
        width: 25vw;
        max-width: 40vh;
        height: 100%;
        padding-right: 30px;
        color: rgba(0, 0, 0, 0.87);
        border-style: solid;
        border-width: 1px;
        border-color: rgba(0, 0, 0, 0.1);
        outline: none;
        display: flex;
      }
      .voice-input {
        margin-left: -35px;
        width: 35px;
        height: 35px;

        color: rgba(0, 0, 0, 0.75);
        border: none;
        background: none;
        outline: none;
      }
      .voice-input.active {
        animation: blink 0.5s linear 0s infinite alternate;
      }
      .voice-input svg {
        fill: currentColor;
        width: 100%;
        height: 100%;
      }
      @keyframes blink {
        from {
          color: rgba(0, 0, 0, 0.75);
        }
        to {
          color: rgba(0, 0, 0, 0.3);
        }
      }
    `;
  }

  static get properties() {
    return {
      recognizing: { type: Boolean }
    };
  }

  private recognizing: Boolean = false;
  private recognition: SpeechRecognition;

  protected render() {
    return html`
      <div class="container">
        <input
          id="input"
          autofocus
          placeholder=${this.placeholder}
          .value=${this.value}
          @change=${this.onChange}
        />
        <button
          class=${`voice-input ${this.recognizing ? "active" : ""}`}
          @click=${this.onVoiceClick}
        >
          <svg viewbox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1472 704v128q0 221-147.5 384.5T960 1404v132h256q26 0 45 19t19 45-19 45-45 19H576q-26 0-45-19t-19-45 19-45 45-19h256v-132q-217-24-364.5-187.5T320 832V704q0-26 19-45t45-19 45 19 19 45v128q0 185 131.5 316.5T896 1280t316.5-131.5T1344 832V704q0-26 19-45t45-19 45 19 19 45zm-256-384v512q0 132-94 226t-226 94-226-94-94-226V320q0-132 94-226T896 0t226 94 94 226z"
            />
          </svg>
        </button>
      </div>
    `;
  }

  private onVoiceClick = () => {
    this.toggleRecognition();
  };

  private toggleRecognition = () => {
    this.recognizing = !this.recognizing;
    if (this.recognizing) {
      if (!this.recognition) {
        this.initSpeechRecognition();
      }
      this.recognition.start();
    } else {
      this.recognition.stop();
    }
  };

  private initSpeechRecognition() {
    this.recognition = new window.webkitSpeechRecognition();
    this.recognition.lang = this.language;
    this.recognition.interimResults = false;
    this.recognition.onresult = this.onSpeechRecognitionEvent;
    this.recognition.onnomatch = this.onSpeechRecognitionEnd;
    this.recognition.onerror = this.onSpeechRecognitionEnd;
    this.recognition.onend = this.onSpeechRecognitionEnd;
  }

  private onSpeechRecognitionEvent = (event: SpeechRecognitionEvent) => {
    let transcript = "";
    for (let i = 0; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    this.submitSpeechInput(transcript);
    this.onSpeechRecognitionEnd();
  };

  private onSpeechRecognitionEnd = () => {
    this.recognizing = false;
  };

  private submitSpeechInput = (text: string) => {
    this.value = text;
    this.dispatchValueChange(text);
  };

  private onChange = (e: Event) => {
    e.stopImmediatePropagation();
    this.dispatchValueChange((e.target as HTMLInputElement).value);
  };

  private dispatchValueChange = (value: string) => {
    this.dispatchEvent(
      new CustomEvent("valueChanged", {
        detail: value
      })
    );
  };
}
