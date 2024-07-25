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
  }
}