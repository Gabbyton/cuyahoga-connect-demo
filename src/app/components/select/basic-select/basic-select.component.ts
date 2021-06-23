import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-basic-select',
  templateUrl: './basic-select.component.html',
  styleUrls: ['./basic-select.component.scss']
})
export class BasicSelectComponent implements OnInit {
  @Input('menuTitle') menuTitle: string | null = null;
  @Input('menuOptionsList') menuOptionsList: string[] = [];
  @Output('optionSelected') onOptionSelected = new EventEmitter<number>();
  @Input('defaultOption') defaultOption: string | null = null;
  currentSelectorContent: string | null = null;
  constructor() { }

  ngOnInit(): void {
    this.currentSelectorContent = this.defaultOption ?? 'option';
    this.menuTitle = this.menuTitle ?? 'title goes here';

    const defaultIndex = this.menuOptionsList.indexOf(this.currentSelectorContent);
    if (defaultIndex >= 0) {
      this.setData(defaultIndex);
    } else {
      this.onOptionSelected.emit(-1);
    }
  }

  setData(index: number) {
    this.currentSelectorContent = this.menuOptionsList[index];
    this.onOptionSelected.emit(index);
  }

}
