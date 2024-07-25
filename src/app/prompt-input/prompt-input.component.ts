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

  constructor(private http: HttpClient) {}

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
      event.preventDefault(); // Prevent default form submission behavior
    }

    if (this.prompt.length > this.characterLimit) {
      alert(`Character limit of ${this.characterLimit} exceeded!`);
      return;
    }

    this.newMessage.emit({ role: 'user', content: this.prompt });
    this.loadingStatus.emit(true);

    this.http.post<{ refinedPrompt: string }>('http://localhost:3000/refine-prompt', { prompt: this.prompt })
      .subscribe({
        next: (data) => {
          this.newMessage.emit({ role: 'assistant', content: data.refinedPrompt });
          this.loadingStatus.emit(false);
          this.prompt = ''; // Clear the input field
        },
        error: (error) => {
          console.error('Error refining prompt:', error);
          this.loadingStatus.emit(false);
        }
      });
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.onSubmit(event);
    }
  }
}