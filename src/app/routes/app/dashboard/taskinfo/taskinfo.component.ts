import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CacheService } from 'src/app/core/cache/cache.service';

@Component({
  selector: 'ent-taskinfo',
  templateUrl: './taskinfo.component.html',
  styleUrls: ['./taskinfo.component.less']
})
export class TaskinfoComponent implements OnInit {
  @Input() taskList;
  constructor(private router: Router, private cache: CacheService) { }

  ngOnInit() { }

  goReport(param) {
    console.log(param);
    this.cache.set('taskInfo', param);
    this.router.navigate(['/app/report']);
  }

  goHistory(param) {
    this.cache.set('taskInfo', param);
    this.router.navigate(['/app/history']);
  }
}
