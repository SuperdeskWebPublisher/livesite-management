import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    styleUrls: ['./app.component.scss'],
    template: `<h1 class="style">Hello {{name}}</h1>`
})

export class AppComponent {
    name = 'Livesite Management';
}
