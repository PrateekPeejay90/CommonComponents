import { Component, Input } from '@angular/core';

@Component({
  selector: 'loading-indicator',
  templateUrl: 'loading.indicator.component.html',
  styleUrls: ['./loading.indicator.component.css']
})
export class LoadingIndicatorComponent {
  @Input() isShow: boolean = false;
  @Input() message: string = 'Loading...';
  @Input() labelColor: string = 'black';
}

