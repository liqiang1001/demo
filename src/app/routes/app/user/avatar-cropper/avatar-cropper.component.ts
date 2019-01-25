import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { CropperSettings, Bounds, ImageCropperComponent } from 'ng2-img-cropper';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { CacheService } from 'src/app/core/cache/cache.service';

@Component({
  selector: 'app-avatar-cropper',
  templateUrl: './avatar-cropper.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./avatar-cropper.component.less']
})
export class AvatarCropperComponent implements OnInit {
  // 用户头像
  userAvatar = '';
  beforeImg;
  // 头像
  avatar: any;
  // 头像裁剪配置
  avatarSettings: CropperSettings;
  // 头像裁剪元素
  @ViewChild('avatarCropper', undefined)
  avatarCropper: ImageCropperComponent;
  constructor(
    private message: NzMessageService,
    private cache: CacheService,
    private model: NzModalRef,
  ) {
    // 头像裁剪配置
    this.avatarSettings = new CropperSettings();
    this.avatarSettings.noFileInput = true;
    this.avatarSettings.width = 120;
    this.avatarSettings.height = 120;
    this.avatarSettings.croppedWidth = 120;
    this.avatarSettings.croppedHeight = 120;
    this.avatarSettings.canvasWidth = 580;
    this.avatarSettings.canvasHeight = 380;
    this.avatarSettings.minWidth = 100;
    this.avatarSettings.minHeight = 100;
    this.avatarSettings.cropperDrawSettings.strokeWidth = 2;
    this.avatarSettings.rounded = true;
    this.avatarSettings.fileType = 'image/png';
    this.avatar = {};
  }

  ngOnInit() {
    this.beforeImg = this.cache.get('tupian');
  }
  upload(e: any, avatarCropper): void {  // 上传按钮本地实现
    if (this.avatar.image) {
      this.userAvatar = this.avatar.image;
      this.message.success('图片设置成功!');
    } else {
      this.userAvatar = '';
      this.message.error('图片未变更!');
    }
  }
  close() {
    this.cache.del('tupian');
    this.model.destroy(this.userAvatar);
  }
  click_fileUp = (item) => {
    console.log(item);
    const that = this;
    const image: any = new Image();
    const file: File = item.file;
    const myReader: FileReader = new FileReader();
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.avatarCropper.setImage(image);
    };
    myReader.readAsDataURL(file);

  }

}
