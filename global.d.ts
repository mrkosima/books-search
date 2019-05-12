declare global {
  var SpeechRecognitionDeclaration: {
    new (): SpeechRecognition;
  };

  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognitionDeclaration;
  }
}
export {};
