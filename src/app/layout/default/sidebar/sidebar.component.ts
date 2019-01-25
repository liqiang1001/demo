import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {
  @Input() menu;
  @Input() isCollapsed;
  @Output() toggle = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  openHandler(value: string): void {
    this.menu.forEach(element => {
      if (element.name === value) {
        element.checked = true;
        console.log(element);
      } else {
        element.checked = false;
      }
    });
  }
  selectMenu(item) {
    console.log(item);
    console.log(item.id);
  }
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit(this.isCollapsed);
  }
}
