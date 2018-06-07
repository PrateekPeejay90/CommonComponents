import { TestBed, inject } from '@angular/core/testing';

import { CommentspopupService } from './commentspopup.service';

describe('CommentspopupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommentspopupService]
    });
  });

  it('should be created', inject([CommentspopupService], (service: CommentspopupService) => {
    expect(service).toBeTruthy();
  }));
});
