import { Directive, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

import { FilterModel } from './filter.model';

@Directive({
  selector: '[infinite-scroll]'
})
export class InfiniteScrollDirective implements OnInit {
  @Input()
  protected pageSize = 15;

  @Input()
  protected lastIndex = 0;

  @Input()
  protected totalCount = 0;

  @Input()
  protected dynamicPageSize: boolean = false;

  @Output()
  change: EventEmitter<FilterModel> = new EventEmitter<FilterModel>();

  @ViewChild('content', { read: ElementRef })
  protected contentElementRef: ElementRef;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    this.registerDebounceEvent(this.element, 'scroll', 500, this.refresh.bind(this));
  }

  refresh(event) {
    if (this.scrolledToBottom(event.target)) {
      requestAnimationFrame(() => {
        this.nextChunk(event);
      });
    }
  }

  private scrolledToBottom(element): boolean {
    const limit = element.scrollHeight - element.clientHeight;
    return Math.round(element.scrollTop) === limit;
  }

  private nextChunk(event) {
    if (this.lastIndex === this.totalCount) {
      return;
    }

    let rangeSize = this.pageSize;
    if (this.dynamicPageSize) {
      rangeSize = this.getRange(event.target) + 1;
    }

    this.change.emit({
      pageNumber: Math.round(this.lastIndex / this.pageSize) + 1,
      pageSize: rangeSize
    });
  }

  private getRange(container): number {
    const row = container.querySelector('.child');
    const rowsCount = (container.scrollTop) / row.offsetHeight;
    return Math.max(Math.floor(rowsCount), Math.round(rowsCount));
  }

  private registerDebounceEvent(targetEle: ElementRef, eventName: string, debounceDelay: number, subscribedBy: Function) {
    const eventStream = Observable.fromEvent(targetEle.nativeElement, eventName)
      .debounceTime(debounceDelay)
      .distinctUntilChanged();

    eventStream.subscribe(subscribedBy.bind(this));
  }
}
