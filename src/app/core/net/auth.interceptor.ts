import { Injectable, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
  HttpClient
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../environments/environment';
import { LoadingService } from './loading.service';

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  beforcount = 0;
  aftercount = 0;
  constructor(private injector: Injector) { }

  get msg(): NzMessageService {
    return this.injector.get(NzMessageService);
  }

  get Loading(): LoadingService {
    return this.injector.get(LoadingService);
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private handleData(
    event: HttpResponse<any> | HttpErrorResponse,
  ): Observable<any> {

    this.Loading.addafter();
    // 业务处理：一些通用操作
    switch (event.status) {
      case 200:
        // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
        if (event instanceof HttpResponse) {
          const body: any = event.body;
          if (body && (body.code !== '0000' || body.refresh_token !== undefined)) {
            if (body.message) {
              this.msg.error(body.message);
              // return throwError({});
            }
            // } else {
            return of(new HttpResponse(Object.assign(event, { body: body })));
            // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
            // this.http.get('/').subscribe() 并不会触发
          } else {
            // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
            return of(new HttpResponse(Object.assign(event, { body: body.data })));
            // 或者依然保持完整的格式
          }
        }
        // 文件导出请求()
        if (event instanceof HttpErrorResponse) {
            return of(new HttpResponse(Object.assign(event, { body: event.error.text })));
        }
        break;
      case 401: // 未登录状态码
        this.goTo('/login');
        break;
      case 403:
      case 404:
        this.msg.error('连接丢失！');
        break;
      case 500:
        this.msg.error('服务器错误！');
        break;
      default:
        if (event instanceof HttpErrorResponse) {
          console.warn(
            '未可知错误，大部分是由于后端不支持CORS或无效配置引起',
            event,
          );
          this.msg.error(event.message);
        }
        break;
    }
    return of(event);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<
  | HttpSentEvent
  | HttpHeaderResponse
  | HttpProgressEvent
  | HttpResponse<any>
  | HttpUserEvent<any>
  > {
    // 统一加上服务端前缀
    this.Loading.addbefore();
    const url = req.url;
    let newReq: any, hasAuth = false;
    // if (!url.startsWith('https://') && !url.startsWith('http://')) {
    //   url = environment.SERVER_URL + url;
    // }
    const Token = sessionStorage.getItem('token') || '';
    const id = sessionStorage.getItem('userId') || '';
    // 过滤不需要添加auth的请求
    environment.NO_AUTH.forEach(item => {
      if (url.indexOf(item) > 0) {
        hasAuth = true;
      }
    });

    if (hasAuth) {
      newReq = req.clone({
        url: url,
        setHeaders: {
          'content-type': 'application/json ;text/plain; charset=UTF-8'
        }
      });
    } else {
      if (url.includes('upload') || url.includes('import')) {
        newReq = req.clone({
          url: url,
          setHeaders: {
            'Authorization': 'bearer ' + Token,
            'userId': id
          }
        });
      } else {
        newReq = req.clone({
          url: url,
          setHeaders: {
            'Authorization': 'bearer ' + Token,
            'content-type': 'application/json ;text/plain; charset=UTF-8',
            'userId': id
          }
        });
      }
    }
    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
        if (event instanceof HttpResponse && event.status === 200) {
          return this.handleData(event);
        }
        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err)),
    );
  }
}
