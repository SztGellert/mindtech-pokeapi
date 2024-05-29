import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatchesPage } from './catches.page';

describe('CatchesPage', () => {
  let component: CatchesPage;
  let fixture: ComponentFixture<CatchesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatchesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatchesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
