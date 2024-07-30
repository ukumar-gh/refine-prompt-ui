import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-prompt-input',
  templateUrl: './prompt-input.component.html',
  styleUrls: ['./prompt-input.component.css']
})
export class PromptInputComponent implements OnInit {
  @Output() newMessage = new EventEmitter<{ role: 'user' | 'assistant', content: string }>();
  @Output() loadingStatus = new EventEmitter<boolean>();
  @Input() loading: boolean = false;

  prompt: string = '';
  characterLimit: number = 1000;
  userPrompt: string = '';

  constructor() {}

  ngOnInit() {}

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

    this.userPrompt = this.prompt; // Set the current prompt for streaming
    this.newMessage.emit({ role: 'user', content: this.prompt });
    this.loadingStatus.emit(true);
    this.prompt = ''; // Clear the input field immediately
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.onSubmit(event);
    }
  }
}