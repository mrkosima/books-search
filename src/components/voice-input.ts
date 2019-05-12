import {} from "lit-html";
import { LitElement, html, property, customElement, css } from "lit-element";

@customElement("voice-input")
export class VoiceInput extends LitElement {
  @property({ type: String }) value: string = "";
  @property({ type: String }) placeholder: string = "";
  @property({ type: String }) language: string = "en";

  static get styles() {
    return css`
      input {
        color: red;
        font-size: 24px;
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

  constructor() {
    super();
  }

  render() {
    return html`
      <input
        id="input"
        type="search"
        autofocus
        placeholder=${this.placeholder}
        .value=${this.value}
        @change=${this.onChange}
      />
      <button @click=${this.onClick}>Mic</button>
      <p>${this.recognizing.toString()}</p>
    `;
  }

  private onClick = () => {
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
        detail: value,
      })
    );
  }
}
