import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-tile-information',
  standalone: true,
  imports: [],
  templateUrl: './title-information.component.html',
  styleUrls: ['./title-information.component.scss'] 
})
export class TitleInformationComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
}
