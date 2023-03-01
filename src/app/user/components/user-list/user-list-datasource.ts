import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, of, tap } from 'rxjs';
import { IUser } from '../../models/user';

/**
 * Data source for the ItemList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class UserListDataSource extends DataSource<IUser> {
  data: IUser[] = [];
  sortedData: Observable<IUser[]> = new Observable<IUser[]>();
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  sortBy: string = '';
  isAsc: boolean = true;
  filterBy:number = 1;

  constructor(private items:IUser[]) {
    super();
    this.data=items
    this.sortedData=of(items)
  }

  /*
  public sortBy(property:string, isAsc:boolean){
    this.sortedData.pipe(
      
      map(value=>value.sort((a,b)=>compare(`${a[property as keyof Item]}`,`${b[property as keyof Item]}`, isAsc))),
    ).subscribe()
  }

  public filterBy(typeId:number|string){
    this.sortedData.pipe(
      tap(value=>console.log(value)),
      map(value=>value.filter(i=>i.type.id==typeId)),
      tap(value=>console.log(value)),
    ).subscribe()
  }
  */

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<IUser[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: IUser[]): IUser[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: IUser[]): IUser[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'firstname': return compare(a.firstname, b.firstname, isAsc);
        case 'lastname': return compare(a.lastname, b.lastname, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
