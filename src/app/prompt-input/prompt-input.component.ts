// src/app/prompt-input/prompt-input.component.ts
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-prompt-input',
  templateUrl: './prompt-input.component.html',
  styleUrls: ['./prompt-input.component.css']
})
export class PromptInputComponent {
  @Output() newMessage = new EventEmitter<{ role: 'user' | 'assistant', content: string }>();
  @Output() loadingStatus = new EventEmitter<boolean>();
  @Input() loading: boolean = false;

  prompt: string = '';
  characterLimit: number = 300;
  characterCount: number = 0;

  constructor(private http: HttpClient) {}

  onInput(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    if (input.value.length <= this.characterLimit) {
      this.prompt = input.value;
      this.characterCount = input.value.length;
      input.style.height = 'auto'; // Reset height
      input.style.height = input.scrollHeight + 'px'; // Set height based on scroll height
    } else {
      input.value = this.prompt; // Prevent further input if limit is reached
    }
  }

  onSubmit() {
    if (this.prompt.length > this.characterLimit) {
      return;
    }

    this.newMessage.emit({ role: 'user', content: this.prompt });
    this.loadingStatus.emit(true);

    this.http.post<{ refinedPrompt: string }>('http://localhost:3000/refine-prompt', { prompt: this.prompt })
      .subscribe({
        next: (data) => {
          this.newMessage.emit({ role: 'assistant', content: data.refinedPrompt });
          this.loadingStatus.emit(false);
        },
        error: (error) => {
          console.error('Error refining prompt:', error);
          this.loadingStatus.emit(false);
        }
      });

    this.prompt = '';
    this.characterCount = 0;
  }
}