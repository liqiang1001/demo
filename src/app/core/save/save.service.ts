import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveService {

  constructor() { }

  saveExcel(data) {
    const a = document.createElement('a');
    const blob = new Blob([data], {'type': 'application/vnd.ms-excel;charset=utf-8' });
    a.href = URL.createObjectURL(blob);
    a.click();
  }
}
