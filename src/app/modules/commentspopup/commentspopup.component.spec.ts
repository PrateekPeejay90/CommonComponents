import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentspopupComponent } from './commentspopup.component';

describe('CommentspopupComponent', () => {
  let component: CommentspopupComponent;
  let fixture: ComponentFixture<CommentspopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentspopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentspopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
