import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCatchComponent } from './create-catch.component';

describe('CreateCatchComponent', () => {
  let component: CreateCatchComponent;
  let fixture: ComponentFixture<CreateCatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
