import { Component, signal } from '@angular/core';
import { InputAddItemComponent } from '../../components/input-add-item/input-add-item.component';
import { IListItems } from '../../interface/IListItems.interface';
import { JsonPipe } from '@angular/common';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [InputAddItemComponent, InputListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  public addItem = signal(true);

  #setListItem = signal<IListItems[]>(this.#parseItems())
  public getListItems = this.#setListItem.asReadonly()

  #parseItems() {
    return JSON.parse(localStorage.getItem('@my-list') || '[]')
  }

  public getInputAndAddItem(value: IListItems) {
    localStorage.setItem(
      '@my-list', JSON.stringify([...this.#setListItem(), value])
    )

    return this.#setListItem.set(this.#parseItems())
  }

  public listItemsStage(value: 'pending' | 'completed') {
    return this.getListItems().filter((res: IListItems) => {
      if(value === 'pending') {
        return !res.checked
      }

      if(value === 'completed') {
        return res.checked
      }

      return res
    })
  }

  public updateItemCheckbox(newItem: {id: string; checked: boolean}) {
    this.#setListItem.update((oldValue: IListItems[]) => {
      oldValue.filter(res => {
        if(res.id === newItem.id) {
          res.checked = newItem.checked
          return res
        }
        return res
      })
      return oldValue
    })

    return localStorage.setItem('@my-list', JSON.stringify(this.#setListItem()))
  }

  public updateItemText(newItem: {id: string, value: string}) {
    this.#setListItem.update((oldValue: IListItems[]) => {
      oldValue.filter(res => {
        if(res.id === newItem.id) {
          res.value = newItem.value
          return res
        }
        return res
      })
      return oldValue
    })

    return localStorage.setItem('@my-list', JSON.stringify(this.#setListItem()))
  }

  public deleteItemText(id: string) {
    Swal.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, delete o item"
    }).then((result) => {
      if (result.isConfirmed) {
        this.#setListItem.update((oldValue: IListItems[]) => {
          return oldValue.filter((res) => res.id !== id)
        })
        return localStorage.setItem('@my-list', JSON.stringify(this.#setListItem()))
      }
    });

  }

  public deleteAllItems() {
    Swal.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, delete tudo"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('@my-list')
        return this.#setListItem.set(this.#parseItems())
      }
    });
  }
}
