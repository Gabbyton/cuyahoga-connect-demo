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
  @Input('nullValue') nullValue: string | null = null;
  @Input('nullValueOption') nullValueOption: string | null = null;

  currentSelectorContent: string | null = null;
  constructor() { }

  ngOnInit(): void {
    this.currentSelectorContent = this.defaultOption ?? this.nullValue ?? 'option';
    this.menuTitle = this.menuTitle ?? 'title goes here';

    // emit -1 when input default does not exist on options list
    const defaultIndex = this.menuOptionsList.indexOf(this.currentSelectorContent);
    if (defaultIndex >= 0) {
      this.setData(defaultIndex);
    } else {
      this.onOptionSelected.emit(-1);
    }
  }

  get appendedMenuOptionsList() {
    if (this.nullValueOption != null)
      return [...this.menuOptionsList, this.nullValueOption];
    return this.menuOptionsList;
  }

  setData(index: number) {
    this.currentSelectorContent = this.menuOptionsList[index];
    if (this.nullValue != null && index == this.menuOptionsList.length) {
      this.currentSelectorContent = this.nullValue;
      this.onOptionSelected.emit(-1);
    } else {
      this.onOptionSelected.emit(index);
    }
  }

}
