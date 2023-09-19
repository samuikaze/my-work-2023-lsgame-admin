import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-base-body',
    templateUrl: './base-body.component.html',
    styleUrls: ['./base-body.component.scss'],
    standalone: true,
    imports: [RouterOutlet]
})
export class BaseBodyComponent {

}
