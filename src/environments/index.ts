
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CacheService } from 'src/app/core/cache/cache.service';
import * as $ from 'jquery';

export class LoginView {
    public constructor(private http: HttpClient, private cache: CacheService) {

    }

    public getSyetem(id) {
        const formData = new FormData();
        const that = this;
        formData.append('id', id);
        $.ajax({
            url: environment.SERVER_URL + `/usermanagementservice/sysConfig/findConfig`,
            data: formData,
            type: 'post',
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.code === '0000') {
                    if (res.data) {
                        if (res.data.complianceCheckConfig) {
                            sessionStorage.setItem('complianceCheckConfig', res.data.complianceCheckConfig);
                        }
                        that.selectSystem(res.data.id);
                        sessionStorage.setItem('systemconfig', JSON.stringify(res.data));
                    }
                }
            }
        });
    }
    selectSystem(id) {
        switch (id) {
            case 'bj/hg':
                document.getElementsByTagName('body')[0]['className'] = 'style-hg';
                // this.src = 'assets/image/system/back-ele.png';
                break;
            case 'bj/hd':
                document.getElementsByTagName('body')[0]['className'] = 'style-hd';
                console.log(document.getElementsByTagName('body'));
                // this.src = 'assets/image/system/hd-ele.png';
                break;
            case 'bj/74':
                // this.src = 'assets/image/system/74-ele.png';
                document.getElementsByTagName('body')[0]['className'] = 'style-74';

                break;
            case 'bj/ft':
                document.getElementsByTagName('body')[0]['className'] = 'style-ft';
                // this.src = 'assets/image/system/ft-ele.png';
                break;
            default:
                // this.src = 'assets/image/system/back-ele.png';
                document.getElementsByTagName('body')[0]['className'] = 'style-hg';
        }
    }
}
