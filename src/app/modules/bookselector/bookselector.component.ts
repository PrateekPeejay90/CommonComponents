import { Component, OnInit, Input, Output, EventEmitter, AfterContentInit,ViewEncapsulation } from "@angular/core";
import { ButtonModule, TreeNode } from 'primeng/primeng';
import * as _ from 'lodash';

import { BOOK_CONSTANTS, BOOK_PERMISSIONS } from './constants/book.constants';
import { BOOK_LIST_FILTERS, BOOK_TYPES_FILTER, SOURCE_FILTER, STATUS_FILTER } from './book.list.filter';
import { BookFilterCriteria, DataStream } from './constants/book.filter.criteria.model';
import { BookSelectorService } from './bookselector.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'op-bookselector',
    templateUrl: './bookselector.view.html',
    styleUrls: ['./bookselector.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class BookSelectorComponent implements OnInit, AfterContentInit {
    @Input() apiKey: string;
    @Input() jwtToken: string;
    @Input() mrdServiceUrl: string;
    @Input() canFilterByStatus = true;
    @Input() pageno: number;
    @Input() pagesize: number;
    @Input() bookListRequest: any[] = [];
    @Input() selectBookList: Array<any> = [];
    @Output() onSelected: EventEmitter<any> = new EventEmitter();
    @Output() rowSelected: EventEmitter<any> = new EventEmitter();
    @Input() statusColumn:boolean;
    selectBookFilter: any[] = [];
    bookValue: any[] = [];
    showErrorDialog = false;
    files1: TreeNode[];
    files: TreeNode[] = [];
    cols: any[] = [];
    loading = false;
    pageSize = 10;
    count = 0;
    selectedFiles: TreeNode[] = [];
    sortBy: string;
    filterStyleClass: string;
    tree: string;
    onOptionChanged: any;
    fieldName: string;
    book: TreeNode[] = [];
    constructor(private bookSelectorService: BookSelectorService) { }

    ngOnInit() {
        this.cols = [{ field: 'name', header: 'Book Name' },
        { field: 'stream', header: 'Rating Stream' },
        { field: 'market', header: 'Market' },
        { field: 'bookType', header: 'Book Type' },
        { field: 'lastModified', header: 'Last Modified' }];
        
        if(this.statusColumn){
            this.cols.push({ field: 'status', header: 'Status'});
        }

        this.getBookList();
    }
    getBookList(): Promise<void> {
        // this.pageno, this.pagesize, this.bookListRequest,
        const filesData: Promise<void> = this.bookSelectorService.getBooks(this.mrdServiceUrl, this.apiKey, this.jwtToken).then(fileData => {
            const obj = {};
            const outArr = [];
            for (var k in fileData) {
                var data = fileData[k];
                var bookName = data['data']['bookName'];
                if (!obj[bookName]) {
                    obj[bookName] = data;
                } else {
                    obj[bookName]['data']['markets'][0]['name'] = 'Multiple';
                }
            }

            for (var k in obj) {
                outArr.push(obj[k]);
            }

            this.files = outArr;
        });
        return filesData;
    }

    filterBooks(books: TreeNode[]): TreeNode[] {
        let resultBooks: Map<string, TreeNode>;
        let result: TreeNode[];
        books.forEach(book => {
            if (resultBooks.get(book.data.bookName) == null) {
                resultBooks.set(book.data.bookName, book);
                result.push(book);
            } else {
                book.data.markets[0].name = 'Multiple';
            }
        });
        this.files = result;
        return this.files;
    }
    nextPage(event) {

    }

    getName(rowData, rowId, fld, colIdx) {
        return 'from custom method ' + rowData[fld.field];
    }

    onTextChanged(event) {
        console.log(event);
    }

    onDateChanged(event) {
        console.log(event);
    }

    onMultiChange(event) {
        console.log(event);
    }

    onDropdownChange(event) {
        console.log(event);
    }

    onBcDaterangeChange(event) {
        console.log(event);
    }

    onDaterangeChange(event) {
        console.log(event);
    }

    onCheckboxChange(event) {
        console.log(event);
    }

    onClearAllFilters($event) {
        console.log('clear all filters');
    }

    onLazyLoad($event) {
        console.log('onLazyLoad');
    }

    onDaysAndTimeFilterChanged(event) {
        console.log(event);
    }

    onDaysFilterChanged(event) {
        console.log(event);
    }

    onTimeFilterChanged(event) {
        console.log(event);
    }

    onShowMoreClick(event) {
        console.log(event);
    }

    loadNode(event) {

    }


    ngAfterContentInit() {
        const FILTERS = BOOK_LIST_FILTERS;
        this.selectBookFilter = this.buildFilterMeta(FILTERS.COMMON, FILTERS.SPECIFIC);
    }

    buildFilterMeta(COMMON, SPECIFIC): Array<any> {
        return _.chain(SPECIFIC)
            .keys()
            .map((key, index) => {
                const spec = SPECIFIC[key];
                this.bindFunction(spec, 'fetchCallback');
                spec.sortOrder = index;
                spec.dataArray = this[spec.dataArray] || [];
                return _.assign(_.clone(COMMON), spec);
            })
            .value();
    }

    bindFunction(spec, property): boolean {
        if (!spec[property] || _.isFunction(spec[property]) || !_.isFunction(this[spec[property]])) {
            return false;
        }
        spec[property] = this[spec[property]].bind(this);
        return true;
    }

    fetchSources(): Promise<any> {
        return new Promise((resolve, reject) => { resolve(SOURCE_FILTER); });
    }

    fetchBookTypes(): Promise<any> {
        return new Promise((resolve, reject) => { resolve(BOOK_TYPES_FILTER); });
    }

    fetchStatuses(): Promise<any> {
        return new Promise((resolve, reject) => { resolve(STATUS_FILTER); });
    }

    fetchDataStreams(): Promise<DataStream[]> {
        const sortedDataStreams: Promise<DataStream[]> = this.bookSelectorService.getRatingStreams(this.mrdServiceUrl, this.apiKey, this.jwtToken).then(dataStreams => {
            return dataStreams.sort(this.getSortOrder('displayName'));
        });
        return sortedDataStreams;
    }

    getSortOrder(prop) {
        return function (a, b) {
            if (a[prop] > b[prop]) {
                return 1;
            } else if (a[prop] < b[prop]) {
                return -1;
            }
            return 0;
        };
    }


    /*fetchMarkets(): Promise<Market[]> {
      const sortedMarkets: Promise<Market[]> = this.mrdService.getMarkets().then(markets => {
        return markets.sort(Utils.getSortOrder('name'));
      });
      return sortedMarkets;
    }

    */

   onSelectCheckBox(event){
        
        if(event.selected){
            this.selectBookList.push(event.node);
        }else{
            var bookNameToRemove = event['node']['data']['bookName'];

            var tempArr = [];
            for(let i=0 ; i < this.selectBookList.length ; i++){
                
                if(this.selectBookList[i]['data']['bookName']!=bookNameToRemove){
                    tempArr.push(this.selectBookList[i]);
                } 
            }
            this.selectBookList = tempArr;
        }
        event.selectedData = this.selectBookList;
        event.selectedCount = this.selectBookList.length;
        this.onSelected.emit(event);
   }

}
