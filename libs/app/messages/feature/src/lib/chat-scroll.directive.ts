import { Directive, ElementRef, Renderer2, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[chatScroll]'
})
export class ChatScrollDirective implements AfterViewChecked {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    const element = this.el.nativeElement as HTMLElement;
    element.scrollTop = element.scrollHeight;
  }
}
