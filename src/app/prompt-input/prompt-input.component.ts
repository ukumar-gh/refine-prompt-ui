import { Component, EventEmitter, Output, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-prompt-input',
  templateUrl: './prompt-input.component.html',
  styleUrls: ['./prompt-input.component.css']
})
export class PromptInputComponent implements OnInit, OnDestroy {
  @Output() newMessage = new EventEmitter<{ role: 'user' | 'assistant', content: string }>();
  @Output() loadingStatus = new EventEmitter<boolean>();
  @Input() loading: boolean = false;

  prompt: string = '';
  characterLimit: number = 1000;
  private partialText: string = '';
  private eventSource: EventSource | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  ngOnDestroy() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    if (input.value.length <= this.characterLimit) {
      this.prompt = input.value;
      input.style.height = 'auto'; // Reset height
      input.style.height = input.scrollHeight + 'px'; // Set height based on scroll height
    } else {
      alert(`Character limit of ${this.characterLimit} exceeded!`);
      input.value = this.prompt; // Prevent further input if limit is reached
    }
  }

  onSubmit(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    if (this.prompt.trim().length === 0) {
      alert('Prompt cannot be empty');
      return;
    }

    if (this.prompt.length > this.characterLimit) {
      alert(`Character limit of ${this.characterLimit} exceeded!`);
      return;
    }

    const userPrompt = this.prompt; // Store the current prompt

    this.newMessage.emit({ role: 'user', content: userPrompt });
    this.loadingStatus.emit(true);

    this.prompt = ''; // Clear the input field immediately

    // Use the streaming endpoint for testing
    this.streamRefinePrompt(userPrompt);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.onSubmit(event);
    }
  }

  // Stream endpoint
  async streamRefinePrompt(userPrompt: string) {
    try {
      const response = await fetch('http://localhost:3000/refine-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userPrompt })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let partialText = '';

      if (reader) {
        const processText = async ({ done, value }: ReadableStreamReadResult<Uint8Array>) => {
          if (done) {
            console.log('Stream complete');
            this.newMessage.emit({ role: 'assistant', content: this.partialText });
            this.loadingStatus.emit(false);
            return;
          }

          if (value) {
            partialText += decoder.decode(value, { stream: true });
            this.partialText = this.formatText(partialText);
            this.updateTextarea();
          }

          reader.read().then(processText).catch(error => {
            console.error('Error processing text:', error);
            this.loadingStatus.emit(false);
          });
        };

        reader.read().then(processText).catch(error => {
          console.error('Error processing text:', error);
          this.loadingStatus.emit(false);
        });
      } else {
        this.loadingStatus.emit(false);
        console.error('No response body');
      }
    } catch (error) {
      console.error('Error refining prompt:', error);
      this.loadingStatus.emit(false);
    }
  }

  formatText(text: string): string {
    return text.replace(/data:\s*/g, ' ').replace(/\n\s*\n/g, '\n\n');
  }

  // Dynamically update textarea size
  updateTextarea() {
    const textarea = document.getElementById('streaming-textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = this.partialText;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }
}