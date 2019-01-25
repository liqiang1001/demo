import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workspace',
  template: `
  <router-outlet></router-outlet>
  `,
  styles: []
})
export class WorkspaceBoxComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
