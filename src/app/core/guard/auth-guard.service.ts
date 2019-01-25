import { Injectable, Injector } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  get msg(): NzMessageService {
    return this.injector.get(NzMessageService);
  }
  constructor(private router: Router, private injector: Injector, private cache: CacheService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.cache.get('token')) {
      return true;
    } else {
      this.msg.error('请重新登录');
      this.router.navigate(['/']);
      return false;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const AuthMenu = this.cache.get('AuthMenu');
    const MENU = AuthMenu.filter(item => {
      return state.url.indexOf(item.url) >= 0;
    });
    if (MENU.length > 0) {
      return true;
    } else {
      this.msg.error('您无访问权限该模块');
      return false;
    }
  }

}
