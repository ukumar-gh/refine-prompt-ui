import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PromptInputComponent } from './prompt-input/prompt-input.component';
import { StreamOutputComponent } from './stream-output/stream-output.component';

@NgModule({
  declarations: [
    AppComponent,
    PromptInputComponent,
    StreamOutputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }