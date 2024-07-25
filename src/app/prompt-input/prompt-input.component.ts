import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-prompt-input',
  templateUrl: './prompt-input.component.html',
  styleUrls: ['./prompt-input.component.css']
})
export class PromptInputComponent {
  prompt: string = '';
  response: string | null = null;
  loading: boolean = false;
  characterLimit: number = 300;

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (this.prompt.length > this.characterLimit) {
      return;
    }

    this.loading = true;
    this.response = null;

    this.http.post<{ refinedPrompt: string }>('http://localhost:3000/refine-prompt', { prompt: this.prompt })
      .subscribe({
        next: (data) => {
          this.response = data.refinedPrompt;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error refining prompt:', error);
          this.loading = false;
        }
      });
  }
}