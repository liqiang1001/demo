import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-complaint-daily',
  templateUrl: './complaint-daily.component.html',
  styleUrls: ['./complaint-daily.component.less']
})
export class ComplaintDailyComponent implements OnInit {

  iframeURL: SafeResourceUrl;
  constructor(
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.iframeURL = this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.BI_IP + '/bi?reportlet=TSJB_JFB.cpt&op=view&sign='
      + sessionStorage.getItem('token'));
  }
}
