import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {

  transform(value: string, term: string | undefined): string {

    if (!term) return value;

    return value.replace(new RegExp(term, 'ig'), '<span class="highlight">$&</span>');
  }

}
