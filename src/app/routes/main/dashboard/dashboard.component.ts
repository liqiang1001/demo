import { Component, OnInit } from '@angular/core';
import { RouterModule, Route, Router, ActivatedRoute } from '@angular/router';
import { CacheService } from './../../../core/cache/cache.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  shouImg: boolean;
  constructor(public router: Router,
    public cache: CacheService,
    private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    console.log(this.cache.get('systemconfig').link);
    // switch (this.cache.get('systemconfig').id) {
    //   case 'bj/hg':
    //     this.shouImg = false;
    //     break;
    //   case 'bj/hd':
    //     this.shouImg = false;
    //     break;
    //   case 'bj/74':
    //     this.shouImg = true;
    //     break;
    //   case 'bj/ft':
    //     this.shouImg = true;
    //     break;
    //   default:
    // }
    if (this.cache.get('systemconfig').link === 'main') {
      this.shouImg = true;
    } else {
      this.shouImg = false;
    }
    console.log(this.cache.get('systemconfig'));
    console.log(this.cache.get('MENU'));
    let id = '';
    if (this.cache.get('MENU')) {
      this.cache.get('MENU').forEach(element => {
        if (element.childMenus) {
          element.childMenus.forEach(item => {
            if (item.childMenus) {
              item.childMenus.filter((item1 => {

                if (this.cache.get('systemconfig').link.indexOf(item1.url) !== -1) {
                  id = item1.id;
                  this.router.navigate([this.cache.get('systemconfig').link],
                  { queryParams: { littleId: id } });
                }
              }));
            }
          });
        }
      });
    }
  }
}
