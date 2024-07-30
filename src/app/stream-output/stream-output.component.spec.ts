import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamOutputComponent } from './stream-output.component';

describe('StreamOutputComponent', () => {
  let component: StreamOutputComponent;
  let fixture: ComponentFixture<StreamOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StreamOutputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StreamOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
