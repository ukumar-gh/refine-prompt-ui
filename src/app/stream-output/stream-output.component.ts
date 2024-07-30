import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-stream-output',
  templateUrl: './stream-output.component.html',
  styleUrls: ['./stream-output.component.css']
})
export class StreamOutputComponent implements OnInit, OnChanges, OnDestroy {
  @Input() userPrompt: string = '';
  displayedText: string = '';
  private controller: AbortController | null = null;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userPrompt'] && this.userPrompt) {
      this.startStream(this.userPrompt);
    }
  }

  ngOnDestroy() {
    if (this.controller) {
      this.controller.abort();
    }
  }

  async startStream(prompt: string) {
    if (this.controller) {
      this.controller.abort();
    }
    this.controller = new AbortController();
    const signal = this.controller.signal;

    try {
      const response = await fetch('http://localhost:3000/refine-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt }),
        signal
      });

      if (!response.body) {
        console.error('ReadableStream not supported in this browser.');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let partialText = '';

      const processText = async ({ done, value }: ReadableStreamReadResult<Uint8Array>) => {
        if (done) {
          console.log('Stream complete');
          return;
        }

        if (value) {
          partialText += decoder.decode(value, { stream: true });
          const messages = partialText.split('\n\n').filter(Boolean);
          for (const message of messages) {
            const cleanMessage = this.cleanDataPrefix(message);
            this.displayedText += this.formatText(cleanMessage);
          }
          partialText = messages.length ? messages[messages.length - 1] : '';
        }

        reader.read().then(processText).catch(error => {
          console.error('Error processing text:', error);
        });
      };

      reader.read().then(processText).catch(error => {
        console.error('Error processing text:', error);
      });
    } catch (error) {
      console.error('Error refining prompt:', error);
    }
  }

  cleanDataPrefix(text: string): string {
    return text.replace(/data:\s*/g, '').trim();
  }

  formatText(text: string): string {
    // Process and format the text for readability
    text = text.replace(/\s+/g, ' ').trim();
    text = text.replace(/(\w)([A-Z])/g, '$1 $2'); // Split words combined without space
    text = text.replace(/(\.|!|\?)([A-Z])/g, '$1 $2'); // Add space after punctuation followed by a capital letter
    return text + ' ';
  }
}