import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-abstract-select',
  templateUrl: './abstract-select.component.html',
  styleUrls: ['./abstract-select.component.scss']
})
export class AbstractSelectComponent implements OnInit {
  @Input('selectTemplate') inputTemplate: TemplateRef<any> | null = null;
  @Input('menuTitle') menuTitle: string | null = null;
  @Input('popoverContent') inputPopoverContentTemplate: TemplateRef<any> | null = null;
  @Input('listContent') listContent: string[] = ['content goes here'];
  @Output('itemSelected') listItemSelected = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  selectItem(selectedItem: string) {
    console.log(selectedItem);
    this.listItemSelected.emit(selectedItem);
  }

}
