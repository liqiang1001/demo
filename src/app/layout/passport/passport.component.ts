import { Component, OnInit, OnDestroy } from '@angular/core';
import { CacheService } from 'src/app/core/cache/cache.service';


@Component({
  selector: 'app-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less']
})
export class PassportComponent implements OnInit, OnDestroy {
  src = '';
  time: any;
  constructor(private cache: CacheService) { }

  ngOnInit() {
    this.time = setInterval(() => {
      if (this.cache.get('systemconfig')) {
        // this.selectSystem(this.cache.get('systemconfig').id);
        this.src = this.cache.get('systemconfig').leftSide;
        clearInterval(this.time);
      } else {
        this.src = 'assets/image/system/back-ele.png';
      }
    }, 100);
    console.log(this.cache.get('systemconfig'));
  }
  selectSystem(id) {
    switch (id) {
      case 'bj/hg':
        this.src = 'assets/image/system/back-ele.png';
        break;
      case 'bj/hd':
        this.src = 'assets/image/system/hd-ele.png';
        break;
      case 'bj/74':
        this.src = 'assets/image/system/74-ele.png';
        break;
      case 'bj/ft':
        this.src = 'assets/image/system/ft-ele.png';
        break;
      default:
        this.src = 'assets/image/system/back-ele.png';
    }
  }
  ngOnDestroy() {
    clearInterval(this.time);
  }
}
