interface SpeechRecognition extends EventTarget {
    grammars?: SpeechGrammarList;
    lang?: string;
    continuous?: boolean;
    interimResults?: boolean;
    maxAlternatives?: number;
    serviceURI?: string;
    onaudiostart?: (ev: Event) => any;
    onaudioend?: (ev: Event) => any;
    onend?: (ev: SpeechRecognitionEvent) => any;
    onerror?: (ev: SpeechRecognitionError) => any;
    onnomatch?: (ev: SpeechRecognitionEvent) => any;
    onresult?: (ev: SpeechRecognitionEvent) => any;
    onsoundstart?: (ev: Event) => any;
    onsoundend?: (ev: Event) => any;
    onspeechstart?: (ev: Event) => any;
    onspeechend?: (ev: Event) => any;
    onstart?: (ev: Event) => any;
    stop(): void;
    abort(): void;
    start(): void;
}
