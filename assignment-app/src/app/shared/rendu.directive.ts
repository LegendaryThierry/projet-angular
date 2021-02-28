import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appRendu]',
})
export class RenduDirective {
  constructor(el: ElementRef) {
    el.nativeElement.style.color = 'green';
    el.nativeElement.style.border = '1px solid black';

    //el.nativeElement.innerHTML += 'TOTO ';
  }
}
