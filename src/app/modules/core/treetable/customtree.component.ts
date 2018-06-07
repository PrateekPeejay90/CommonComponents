import {CommonModule} from '@angular/common';
import {Subscription} from 'rxjs/Subscription';
import {DomHandler, Header, Footer, Column, SharedModule} from 'primeng/primeng';
import {NgModule, Component, Input, Output, EventEmitter, AfterContentInit, AfterViewInit, ElementRef, ContentChild, IterableDiffers,
    ChangeDetectorRef, ContentChildren, QueryList, Inject, forwardRef, OnInit, Renderer2, ViewChild, TemplateRef, NgZone, HostListener, ViewEncapsulation
} from '@angular/core';
import { PrimeTemplate } from 'primeng/primeng';
import { CustomTreeNode } from './customtreenode';

@Component({
	selector: 'opTreeRowExpand',
	styleUrls: ['./customtree.component.css'],
	template: `
		<a href="#" class="ui-treetable-toggler fa fa-fw ui-clickable" [ngClass]="node.expanded ? treeTable.expandedIcon : treeTable.collapsedIcon"
            [ngStyle]="{'margin-left':level*16 + 'px','visibility': isLeaf() ? 'hidden' : 'visible'}"
            (click)="toggle($event)" [title]="node.expanded ? labelCollapse : labelExpand">
        </a>
        <div class="ui-chkbox ui-treetable-checkbox" *ngIf="treeTable.selectionMode === 'checkbox'" (click)="onCheckBoxClick($event)">
        	<div class="ui-chkbox-box ui-widget ui-corner-all ui-state-default">
            	<span class="ui-chkbox-icon ui-clickable fa" 
                [ngClass]="{'fa-check':isSelected(),'fa-minus':node.partialSelected}">
                </span>
            </div>
        </div>
	`
})
export class CustomRowExpand {

	@Input() node: CustomTreeNode;
	
	@Input() level: number;
	
    @Input() rowIndex: number;
    @Input() isSelect: boolean ;
    labelCollapse: string = '';
    labelExpand: string = '';
	
	constructor(@Inject(forwardRef(() => CustomTreeTable)) public treeTable:CustomTreeTable) {}
	
	toggle(event: Event) {
        if (this.node.expanded) {
        	this.treeTable.expandedNodes = this.treeTable.expandedNodes.filter(n => n.node !== this.node);
            this.treeTable.onNodeCollapse.emit({originalEvent: event, node: this.node});
        } else {
        	this.treeTable.expandedNodes.push({rowIdx: this.rowIndex, node: this.node});
        	if(!this.node.children){
            	this.treeTable.onNodeExpand.emit({originalEvent: event, node: this.node});
            }
        }
        this.node.expanded = !this.node.expanded;
        event.preventDefault();
    }
    
    isLeaf() {
        return this.node.leaf === false ? false : !(this.node.children && this.node.children.length);
    }
    
    isSelected() {
        return this.treeTable.isSelected(this.node);
    }

    onCheckBoxClick(event){
        this.treeTable.onRowClick(event,this.node);
        this.isSelect = !this.isSelect;
        this.treeTable.onSelected.emit({"event":event,"selected":this.isSelect,"node":this.node});
          }
    
}

@Component({
    selector: '[opTreeRow]',
    styleUrls: ['./customtree.component.css'],
    template: `
       <div [class]="_node.styleClass" [ngClass]="{'ui-treetable-row':true,'ui-state-highlight':isSelected(),'ui-treetable-row-selectable':treeTable.selectionMode && _node.selectable !== false}">
            <ng-container *ngIf="!bodyTemplate;else custombody">
	            <td *ngFor="let col of treeTable.columns; let colIdx=index" [ngStyle]="treeTable.colStyle||col.style" [class]="col.bodyStyleClass||col.styleClass" (click)="onRowClick($event)" (dblclick)="rowDblClick($event)" (touchend)="onRowTouchEnd()" (contextmenu)="onRowRightClick($event)">
	                <opTreeRowExpand *ngIf="colIdx === treeTable.toggleColumnIndex" [node]="_node" [level]="level" [rowIndex]="rowIdx"></opTreeRowExpand>
	                <span *ngIf="!col.resolveFieldData;else bTemplate">{{resolveFieldData(_node.data,col.field)}}</span>
	                <ng-template #bTemplate>
	                	<span>{{col.resolveFieldData(_node.data,rowIdx,col,colIdx)}}</span>
	                </ng-template>
	            </td>
            </ng-container>
            <ng-template #custombody>
            	<ng-container *ngTemplateOutlet="bodyTemplate; context {$implicit: _node.data, node: _node, level: level,columns:treeTable.columns, rowIdx: rowIdx}"></ng-container>
            </ng-template>
        </div>
        <div #scrollChildBody *ngIf="_node.children && _node.expanded" class="ui-treetable-row ui-treetable-childrow rowid_{{rowIdx}}" style="display:table-row">
            <td [attr.colspan]="treeTable.columns.length" class="ui-treetable-child-table-container">
                <table #scrollChildTable [class]="treeTable.tableStyleClass" [ngStyle]="treeTable.tableStyle">
                	<ng-container *ngTemplateOutlet="treeTable.frozen ? treeTable.frozenChildColGroupTemplate||treeTable.childColGroupTemplate : treeTable.childColGroupTemplate; context {$implicit: columns}"></ng-container>
                    <tbody opTreeRow *ngFor="let childNode of _node.children" [node]="childNode" [bodyTemplate]="bodyTemplate?bodyTemplate:''" 
                    [level]="level+1" [labelExpand]="labelExpand" [labelCollapse]="labelCollapse" [parentNode]="_node"></tbody>
                </table>
                <div [class.disabled]="paginatorDisabled" *ngIf="_node.paginator && (_node.paginatorPosition === 'bottom' || _node.paginatorPosition =='both')">
                    <p-paginator [rows]="_node.pageSize||treeTable.pageSize" [first]="_node.first" [totalRecords]="_node.totalRecords" [pageLinkSize]="_node.pageLinks||treeTable.pageLinks" styleClass="ui-paginator-top" [alwaysShow]="_node.alwaysShowPaginator||treeTable.alwaysShowPaginator"
                        (onPageChange)="onPageChange($event,_node,level+1)" [rowsPerPageOptions]="_node.rowsPerPageOptions||treeTable.rowsPerPageOptions" *ngIf="_node.paginator && (_node.paginatorPosition === 'bottom' || _node.paginatorPosition =='both')"
                        [templateLeft]="treeTable.paginatorLeftTemplate" [templateRight]="treeTable.paginatorRightTemplate" [dropdownAppendTo]="treeTable.paginatorDropdownAppendTo">
                    </p-paginator>
                </div>
            </td>
        </div>
    `
})
export class CustomUITreeRow implements OnInit {

    _node: CustomTreeNode;
    
    @Input() get node(): CustomTreeNode {
        return this._node;
    }
    set node(n: CustomTreeNode) {
        this._node = n;
    }
    
    @Input() rowIdx: number;
    
    @Input() parentNode: CustomTreeNode;
    
    @Input() level: number = 0;

    @Input() labelExpand: string = "Expand";
    
    @Input() labelCollapse: string = "Collapse";
    
    @Input("bodyTemplate") bodyTemplate: TemplateRef<any>;
    
    scrollChildBodyView: any;
    
    childBodyScrollListener: Function;
    
    constructor(@Inject(forwardRef(() => CustomTreeTable)) public treeTable:CustomTreeTable) {}
    
    ngOnInit() {
        this._node.parent = this.parentNode;
    }
    
    isSelected() {
        return this.treeTable.isSelected(this._node);
    }
    
    onRowClick(event: MouseEvent) {
        this.treeTable.onRowClick(event, this._node);
    }
    
    onRowRightClick(event: MouseEvent) {
        this.treeTable.onRowRightClick(event, this._node);
    }
    
    rowDblClick(event: MouseEvent) {
      this.treeTable.onRowDblclick.emit({originalEvent: event, node: this._node});
    }

    onRowTouchEnd() {
        this.treeTable.onRowTouchEnd();
    }
    
    resolveFieldData(data: any, field: string): any {
        if (data && field) {
            if (field.indexOf('.') === -1) {
                return data[field];
            } else {
                const fields: string[] = field.split('.');
                let value = data;
                for (let i = 0, len = fields.length; i < len; ++i) {
                    value = value[fields[i]];
                }
                return value;
            }
        } else {
            return null;
        }
    }

    onPageChange(event,node,level){
        node.first = event.first;
        node.pageSize = event.rows;

        if (node.lazy) {
            this.treeTable.lazyLoad.emit({
            	first: node.first,
            	pageNumber: event.page,
                rows: node.pageSize,
                level: level
		    });
        }

        this.treeTable.onPage.emit({
            first: node.first,
            pageSize: node.pageSize,
            pageNumber: event.page,
            level: level
        });
    }
}

@Component({
    selector: 'op-treeTable',
    styleUrls: ['./customtree.component.css'],
    template: `
        <div [ngClass]="'ui-treetable ui-widget custom-treetable'" [ngStyle]="style" [class]="styleClass">
            <div class="ui-table-loading ui-widget-overlay" *ngIf="loading"></div>
            <div class="ui-table-loading-content" *ngIf="loading">
                <i [class]="'fa fa-spin fa-2x ' + loadingIcon"></i>
            </div>
            <div [class.disabled]="paginatorDisabled" *ngIf="paginator && (paginatorPosition === 'top' || paginatorPosition =='both')">
                <p-paginator [rows]="pageSize" [first]="first" [totalRecords]="totalRecords" [pageLinkSize]="pageLinks" styleClass="ui-paginator-top" [alwaysShow]="alwaysShowPaginator"
                    (onPageChange)="onPageChange($event)" [rowsPerPageOptions]="rowsPerPageOptions" *ngIf="paginator && (paginatorPosition === 'top' || paginatorPosition =='both')"
                    [templateLeft]="paginatorLeftTemplate" [templateRight]="paginatorRightTemplate" [dropdownAppendTo]="paginatorDropdownAppendTo">
                </p-paginator>
            </div>
            <div *ngIf="captionTemplate" class="ui-treetable-caption ui-widget-header">
                <ng-container *ngTemplateOutlet="captionTemplate"></ng-container>
            </div>
            <div class="ui-treetable-tablewrapper" >
                <div>
                	<div #scrollHeader class="ui-treetable-scrollable-header ui-widget-header">
            			<div #scrollHeaderBox class="ui-treetable-scrollable-header-box">
			                <table class="ui-treetable-scrollable-header-table">
			                	<ng-container *ngTemplateOutlet="frozen ? frozenColGroupTemplate||colGroupTemplate : colGroupTemplate; context {$implicit: columns}"></ng-container>
			                    <thead class="ui-treetable-thead">
			                        <ng-container *ngTemplateOutlet="headerTemplate; context {$implicit: columns}"></ng-container>
			                        <ng-container *ngIf="!headerTemplate">
			                        	<th *ngFor="let col of columns; let i=index" [ngStyle]="colStyle||col.style" [class]="col.bodyStyleClass||col.styleClass">{{col.header}}
			                        	</th>
			                        </ng-container>
			                    </thead>
			                </table>
            			</div>
        			</div>
			        <div #scrollBody class="ui-treetable-scrollable-body">
			            <table #scrollTable [ngClass]="{'ui-treetable-virtual-table': virtualScroll}" class="ui-treetable-scrollable-body-table">
			            	<ng-container *ngTemplateOutlet="frozen ? frozenColGroupTemplate||colGroupTemplate : colGroupTemplate; context {$implicit: columns}"></ng-container>
			                <tbody class="ui-treetable-tbody" *ngIf="value.length === 0;else scrolltreebody">
						        <tr class="ui-widget-content ui-treetable-emptymessage-row" [style.display]="loading ? 'none' : 'table-row'">
						            <td [attr.colspan]="columns.length" class="ui-treetable-emptymessage">
						                <span>{{emptyMessage}}</span>
						            </td>
						        </tr>
						    </tbody>
						    <ng-template #scrolltreebody>
						        <tbody opTreeRow *ngFor="let node of value;let i=index" class="ui-widget-content" [bodyTemplate]="bodyTemplate?bodyTemplate:''" [node]="node" [rowIdx]="i" [level]="0" 
						        	[labelExpand]="labelExpand" [labelCollapse]="labelCollapse">
						        </tbody>
			                </ng-template>
			            </table>
			            <div #virtualScroller class="ui-table-virtual-scroller"></div>
			        </div>
			        <div #scrollFooter *ngIf="footerTemplate" class="ui-treetable-scrollable-footer ui-widget-header">
			            <div #scrollFooterBox class="ui-treetable-scrollable-footer-box">
			                <table class="ui-treetable-scrollable-footer-table">
			                    <ng-container *ngTemplateOutlet="frozen ? frozenColGroupTemplate||dt.colGroupTemplate : colGroupTemplate; context {$implicit: columns}"></ng-container>
			                    <tfoot class="ui-treetable-tfoot">
			                        <ng-container *ngTemplateOutlet="frozen ? frozenFooterTemplate||dt.footerTemplate : footerTemplate; context {$implicit: columns}"></ng-container>
			                    </tfoot>
			                </table>
			            </div>
			        </div>	
                </div>
            </div>
            <div [class.disabled]="paginatorDisabled" *ngIf="paginator && (paginatorPosition === 'bottom' || paginatorPosition =='both')">
                <p-paginator [rows]="pageSize" [first]="first" [totalRecords]="totalRecords" [pageLinkSize]="pageLinks" styleClass="ui-paginator-top" [alwaysShow]="alwaysShowPaginator"
                    (onPageChange)="onPageChange($event)" [rowsPerPageOptions]="rowsPerPageOptions" *ngIf="paginator && (paginatorPosition === 'bottom' || paginatorPosition =='both')"
                    [templateLeft]="paginatorLeftTemplate" [templateRight]="paginatorRightTemplate" [dropdownAppendTo]="paginatorDropdownAppendTo" class="override-paginator">
                </p-paginator>
            </div>
        </div>
    `,
    providers: [DomHandler],
    encapsulation : ViewEncapsulation.None
})
export class CustomTreeTable implements AfterContentInit,AfterViewInit {

    @Input() lazy: boolean = false;
    
    @Input() pageSize:number = 25;
    
    @Input() first: number = 0;
    
    @Input() paginator: boolean;
    @Input() paginatorDisabled: boolean;
    
    @Input() pageLinks: number = 5;

    @Input() rowsPerPageOptions: number[];

    @Input() alwaysShowPaginator: boolean = true;

    @Input() paginatorPosition: string = 'bottom';

    @Input() paginatorDropdownAppendTo: any;
    
    @Input() virtualScroll: boolean = false;
    
    @Input() virtualScrollDelay: number = 500;

    @Input() virtualRowHeight: number = 27;
        
    @Input() selectionMode: string;
    
    @Input() selection: any;
        
    @Input() style: any;
        
    @Input() styleClass: string;

    @Input() labelExpand: string = "Expand";
    
    @Input() labelCollapse: string = "Collapse";
    
    @Input() metaKeySelection: boolean = true;
    
    @Input() contextMenu: any;

    @Input() toggleColumnIndex: number = 0;

    @Input() tableStyle: any;

    @Input() tableStyleClass: string;
    
    @Input() colStyle: any;
    
    @Input() collapsedIcon: string = "fa-caret-right";
    
    @Input() expandedIcon: string = "fa-caret-down";
    
    @Input() loading: boolean;
    
    @Input() loadingIcon: string = 'fa fa-spin fa-2x fa-circle-o-notch';
    
    @Input() emptyMessage: string = 'No records found';
    
    @Input() columns: any[];
    
    @Input() frozenColumns: any[];
    
    @Input() frozen: boolean = false;
    
    @Input() frozenWidth: string;
    
    @Input() rowTrackBy: Function = (index: number, item: any) => item;

    captionTemplate: TemplateRef<any>;
    
    headerTemplate: TemplateRef<any>;
    
    bodyTemplate: TemplateRef<any>;
    
    footerTemplate: TemplateRef<any>;
    
    frozenColGroupTemplate: TemplateRef<any>;
    
    frozenChildColGroupTemplate: TemplateRef<any>;
    
    frozenFooterTemplate: TemplateRef<any>;
    
    colGroupTemplate: TemplateRef<any>;
    
    childColGroupTemplate: TemplateRef<any>;
    
    frozenBodyTemplate: TemplateRef<any>;
    
    paginatorLeftTemplate: TemplateRef<any>;

    paginatorRightTemplate: TemplateRef<any>;
        
    @Output() onRowDblclick: EventEmitter<any> = new EventEmitter();    
    
    @Output() selectionChange: EventEmitter<any> = new EventEmitter();
    
    @Output() onNodeSelect: EventEmitter<any> = new EventEmitter();
    
    @Output() onNodeUnselect: EventEmitter<any> = new EventEmitter();
    
    @Output() onNodeExpand: EventEmitter<any> = new EventEmitter();

    @Output() onSelected: EventEmitter<any> = new EventEmitter();
    
    @Output() onNodeCollapse: EventEmitter<any> = new EventEmitter();
    
    @Output() onContextMenuSelect: EventEmitter<any> = new EventEmitter();
    
    @Output() lazyLoad: EventEmitter<any> = new EventEmitter();
    
    @Output() onPage: EventEmitter<any> = new EventEmitter();
        
    @ContentChild(Header) header: Header;

    @ContentChild(Footer) footer: Footer;
    
    @ContentChildren(Column) cols: QueryList<Column>;
    
    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate>;
    
    @ViewChild('tbl') tableViewChild: ElementRef;
    
    @ViewChild('scrollHeader') scrollHeaderViewChild: ElementRef;
    
    @ViewChild('scrollHeaderBox') scrollHeaderBoxViewChild: ElementRef;

    @ViewChild('scrollBody') scrollBodyViewChild: ElementRef;

    @ViewChild('scrollTable') scrollTableViewChild: ElementRef;
    
    @ViewChild('virtualScroller') virtualScrollerViewChild: ElementRef;
    
    @ViewChild('scrollChildTable') scrollChildTableViewChild: ElementRef;
    
    @ViewChild('scrollFooter') scrollFooterViewChild: ElementRef;

    @ViewChild('scrollFooterBox') scrollFooterBoxViewChild: ElementRef;
    
    prevLeft: any;

    virtualScrollTimer: any;
        
    virtualScrollCallback: Function;
    
    bodyScrollListener: Function;
    
    headerScrollListener: Function;
    
    footerScrollListener: Function;
    
    frozenSiblingBody: Element;
    
    childTreeRow: any[];
    
    public rowTouched: boolean;
    
    public expandedNodes: any[] = [];
    
    _scrollHeight: string;
    
    _totalRecords: number;
    
    _value: CustomTreeNode[];
        
    columnsSubscription: Subscription;
    
    @Input() get scrollHeight(): string {
        return this._scrollHeight;
    }
    set scrollHeight(val: string) {
        this._scrollHeight = val;
        this.setScrollHeight();
    }
    
    @Input() get totalRecords(): number {
    	return this._totalRecords;
    }
    
    set totalRecords(val: number) {
    	this._totalRecords = val;
    	if(this.virtualScroll) {
            this.virtualScrollerViewChild.nativeElement.style.height = this._totalRecords * this.virtualRowHeight + 'px';
        }
    }
    
    constructor (public el: ElementRef, public domHandler: DomHandler, public changeDetector: ChangeDetectorRef,
        public renderer: Renderer2, public zone: NgZone) {}
        
    @Input() get value(): any[] {
        return this._value;
    }
    set value(val: any[]) {
        this._value = val;
        this.updateTotalRecords();

        if(this.virtualScroll && this.virtualScrollCallback) {
            this.virtualScrollCallback();
        }

        let scrollPos = this.scrollBodyViewChild.nativeElement.scrollHeight - this.scrollBodyViewChild.nativeElement.scrollTop;

        if(this.loading && scrollPos<300){
            this.scrollBodyViewChild.nativeElement.scrollTop = 0;
        }

        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                this.alignScrollBar();
            }, 50);
        });
    }
        
    ngAfterViewInit() {
    	this.bindEvents();
    	this.setScrollHeight();
    	this.alignScrollBar();
    	
		if(!this.frozen) {
            if (this.frozenColumns || this.frozenBodyTemplate) {
                this.domHandler.addClass(this.el.nativeElement, 'ui-table-unfrozen-view');
            }

            if(this.frozenWidth) {
                this.el.nativeElement.style.left = this.frozenWidth;
                this.el.nativeElement.style.width = 'calc(100% - ' + this.frozenWidth + ')';
            }

            let frozenView = this.el.nativeElement.previousElementSibling;
            if (frozenView) {
                this.frozenSiblingBody = this.domHandler.findSingle(frozenView, '.ui-treetable-scrollable-body');
            }
        }else {
            this.scrollBodyViewChild.nativeElement.style.paddingBottom = this.domHandler.calculateScrollbarWidth() + 'px';
        }

        if(this.virtualScroll) {
            this.virtualScrollerViewChild.nativeElement.style.height = this.totalRecords * this.virtualRowHeight + 'px';
        }
    }

    ngAfterContentInit() {
        this.templates.forEach((item) => {
        	switch (item.getType()) {
                case 'caption': 
                    this.captionTemplate = item.template;
                break;
                
        		case 'header':
                    this.headerTemplate = item.template;
                break;

                case 'body':
                    this.bodyTemplate = item.template;
                break;
                
                case 'colgroup':
                	this.colGroupTemplate = item.template;
                break;
                
                case 'childcolgroup':
                	this.childColGroupTemplate = item.template;
                break;
                
                case 'frozencolgroup':
                    this.frozenColGroupTemplate = item.template;
                break;
                
                case 'frozenchildcolgroup':
                    this.frozenChildColGroupTemplate = item.template;
                break;

                case 'footer':
                    this.footerTemplate = item.template;
                break;
                
                case 'frozenfooter':
                    this.frozenFooterTemplate = item.template;
                break;
                
                case 'paginatorleft':
                    this.paginatorLeftTemplate = item.template;
                break;

                case 'paginatorright':
                    this.paginatorRightTemplate = item.template;
                break;
        	}
        });
    }
    
    bindEvents() {
        this.zone.runOutsideAngular(() => {
        	//let scrollBarWidth = this.domHandler.calculateScrollbarWidth();

            if (this.scrollHeaderViewChild && this.scrollHeaderViewChild.nativeElement) {                
                this.headerScrollListener = this.onHeaderScroll.bind(this);
                this.scrollHeaderBoxViewChild.nativeElement.addEventListener('scroll', this.headerScrollListener);
            }
        	if (this.scrollFooterViewChild && this.scrollFooterViewChild.nativeElement) {                
                this.footerScrollListener = this.onFooterScroll.bind(this);
                this.scrollFooterViewChild.nativeElement.addEventListener('scroll', this.footerScrollListener);
            }
            if(!this.frozen) {
                this.bodyScrollListener = this.onBodyScroll.bind(this);
                this.scrollBodyViewChild.nativeElement.addEventListener('scroll', this.bodyScrollListener);
            }
        });
    }
    
    onHeaderScroll(event) {
        this.scrollHeaderViewChild.nativeElement.scrollLeft = 0;
    }

    onFooterScroll(event) {
        this.scrollFooterViewChild.nativeElement.scrollLeft = 0;
    }
    
    onBodyScroll(event) {

        if (this.scrollHeaderViewChild && this.scrollHeaderViewChild.nativeElement) {
            this.scrollHeaderBoxViewChild.nativeElement.style.marginLeft = -1 * this.scrollBodyViewChild.nativeElement.scrollLeft + 'px';
        }

        if (this.scrollFooterViewChild && this.scrollFooterViewChild.nativeElement) {
            this.scrollFooterBoxViewChild.nativeElement.style.marginLeft = -1 * this.scrollBodyViewChild.nativeElement.scrollLeft + 'px';
        }

        if (this.frozenSiblingBody) {
            this.frozenSiblingBody.scrollTop = this.scrollBodyViewChild.nativeElement.scrollTop;
        }

        //skip for horizontal scroll
        var currentLeft = this.scrollBodyViewChild.nativeElement.scrollLeft;
        if(this.prevLeft != currentLeft) {
            this.prevLeft = currentLeft;
            return;
        }
        
        if(this.virtualScroll) {
            let viewport = this.domHandler.getOuterHeight(this.scrollBodyViewChild.nativeElement);
            let tableHeight = this.domHandler.getOuterHeight(this.scrollTableViewChild.nativeElement);
            let pageHeight = 28 * this.pageSize;
            let virtualTableHeight = this.domHandler.getOuterHeight(this.virtualScrollerViewChild.nativeElement);
            let pageCount = (virtualTableHeight / pageHeight)||1;
            let scrollBodyTop = this.scrollTableViewChild.nativeElement.style.top||'0';

            if((this.scrollBodyViewChild.nativeElement.scrollTop + viewport  > parseFloat(scrollBodyTop) + tableHeight) || (this.scrollBodyViewChild.nativeElement.scrollTop  < parseFloat(scrollBodyTop))) {
                let page = Math.floor((this.scrollBodyViewChild.nativeElement.scrollTop * pageCount) / (this.scrollBodyViewChild.nativeElement.scrollHeight)) + 1;
                this.handleVirtualScroll({
                    page: page,
                    callback: () => {
                        this.scrollTableViewChild.nativeElement.style.top = ((page - 1) * pageHeight) + 'px';

                        if (this.frozenSiblingBody) {
                            (<HTMLElement> this.frozenSiblingBody.children[0]).style.top = this.scrollTableViewChild.nativeElement.style.top;
                        }
                    }
                });
            }
        }

    }
    
    handleVirtualScroll(event){
    	this.first = (event.page - 1) * this.pageSize;
        this.virtualScrollCallback = event.callback;
        
        this.zone.run(() => {
            if(this.virtualScrollTimer) {
                clearTimeout(this.virtualScrollTimer);
            }
            
            this.virtualScrollTimer = setTimeout(() => {
                this.lazyLoad.emit({
		            first: this.first,
		            rows: this.virtualScroll ? this.pageSize * 2: this.pageSize
		        });
            }, this.virtualScrollDelay);
        });
    }
    
    setScrollHeight() {
        if(this.scrollHeight && this.scrollBodyViewChild && this.scrollBodyViewChild.nativeElement) {
            if(this.scrollHeight.indexOf('%') !== -1) {
                this.scrollBodyViewChild.nativeElement.style.visibility = 'hidden';
                this.scrollBodyViewChild.nativeElement.style.height = '100px';     //temporary height to calculate static height
                let containerHeight = this.domHandler.getOuterHeight(this.el.nativeElement.children[0]);
                let relativeHeight = this.domHandler.getOuterHeight(this.el.nativeElement.parentElement) * parseInt(this.scrollHeight) / 100;
                let staticHeight = containerHeight - 100;   //total height of headers, footers, paginators
                let scrollBodyHeight = (relativeHeight - staticHeight);
                
                this.scrollBodyViewChild.nativeElement.style.height = 'auto';
                this.scrollBodyViewChild.nativeElement.style.maxHeight = scrollBodyHeight + 'px';
                this.scrollBodyViewChild.nativeElement.style.visibility = 'visible';
            }
            else {
                this.scrollBodyViewChild.nativeElement.style.maxHeight = this.scrollHeight;
            }
        }
    }
    
    hasVerticalOverflow() {
        return this.domHandler.getOuterHeight(this.scrollTableViewChild.nativeElement) > this.domHandler.getOuterHeight(this.scrollBodyViewChild.nativeElement);
    }

    alignScrollBar() {
        if(!this.frozen) {
            let scrollBarWidth = this.hasVerticalOverflow() ? this.domHandler.calculateScrollbarWidth() : 0;
            this.scrollHeaderBoxViewChild.nativeElement.style.marginRight = scrollBarWidth + 'px';
            if(this.scrollFooterBoxViewChild && this.scrollFooterBoxViewChild.nativeElement) {
                this.scrollFooterBoxViewChild.nativeElement.style.marginRight = scrollBarWidth + 'px';
            }
        }
    }
    
    updateTotalRecords() {
        this.totalRecords = this.lazy ? this.totalRecords : (this._value ? this._value.length : 0);
    }
    
    onPageChange(event) {
        this.first = event.first;
        this.pageSize = event.rows;

        if (this.lazy) {
            this.lazyLoad.emit({
            	first: this.first,
            	pageNumber: event.page,
		        rows: this.virtualScroll ? this.pageSize * 2: this.pageSize
		    });
        }

        this.onPage.emit({
            first: this.first,
            pageSize: this.pageSize,
            pageNumber: event.page
        });
    }
        
    onRowClick(event: MouseEvent, node: CustomTreeNode) {
        const eventTarget = (<Element> event.target);
        if (eventTarget.className && eventTarget.className.indexOf('ui-treetable-toggler') === 0) {
            return;
        } else if (this.selectionMode) {
            if (node.selectable === false) {
                return;
            }

            const metaSelection = this.rowTouched ? false : this.metaKeySelection;
            const index = this.findIndexInSelection(node);
            const selected = (index >= 0);
        if (this.isCheckboxSelectionMode()) {
                if (selected) {
                    this.propagateSelectionDown(node, false);
                    if (node.parent) {
                        this.propagateSelectionUp(node.parent, false);
                    }
                    this.selectionChange.emit(this.selection);
                    this.onNodeUnselect.emit({originalEvent: event, node: node});
                } else {
                    this.propagateSelectionDown(node, true);
                    if (node.parent) {
                        this.propagateSelectionUp(node.parent, true);
                    }
                    this.selectionChange.emit(this.selection);
                    this.onNodeSelect.emit({originalEvent: event, node: node});
                }
            } else {
                if (metaSelection) {
                    const metaKey = (event.metaKey || event.ctrlKey);
                    if (selected && metaKey) {
                        if (this.isSingleSelectionMode()) {
                            this.selectionChange.emit(null);
                        } else {
                            this.selection = this.selection.filter((val, i) => i !== index);
                            this.selectionChange.emit(this.selection);
                        }

                        this.onNodeUnselect.emit({originalEvent: event, node: node});
                    } else {
                        if (this.isSingleSelectionMode()) {
                            this.selectionChange.emit(node);
                        } else if (this.isMultipleSelectionMode()) {
                            this.selection = (!metaKey) ? [] : this.selection || [];
                            this.selection = [...this.selection, node];
                            this.selectionChange.emit(this.selection);
                        }

                        this.onNodeSelect.emit({originalEvent: event, node: node});
                    }
                } else {
                    if (this.isSingleSelectionMode()) {
                        if (selected) {
                            this.selection = null;
                            this.onNodeUnselect.emit({originalEvent: event, node: node});
                        } else {
                            this.selection = node;
                            this.onNodeSelect.emit({originalEvent: event, node: node});
                        }
                    } else {
                        if (selected) {
                            this.selection = this.selection.filter((val, i) => i !== index);
                            this.onNodeUnselect.emit({originalEvent: event, node: node});
                        } else {
                            this.selection = [...this.selection || [], node];
                            this.onNodeSelect.emit({originalEvent: event, node: node});
                        }
                    }
                    
                    this.selectionChange.emit(this.selection);
                }
            }
        }
        
        this.rowTouched = false;
    }
        
    onRowTouchEnd() {
        this.rowTouched = true;
    }
    
    onRowRightClick(event: MouseEvent, node: CustomTreeNode) {
        if (this.contextMenu) {
            const index = this.findIndexInSelection(node);
            const selected = (index >= 0);
            if (!selected) {
                if (this.isSingleSelectionMode()) {
                    this.selection = node;
                } else if (this.isMultipleSelectionMode()) {
                    this.selection = [node];
                    this.selectionChange.emit(this.selection);
                }
                
                this.selectionChange.emit(this.selection);
            }
            
            this.contextMenu.show(event);
            this.onContextMenuSelect.emit({originalEvent: event, node: node});
        }
    }
    
    findIndexInSelection(node: CustomTreeNode) {
        let index = -1;

        if (this.selectionMode && this.selection) {
            if (this.isSingleSelectionMode()) {
                index = (this.selection === node) ? 0 : - 1;
            } else {
                for (let i = 0; i  < this.selection.length; i++) {
                    if (this.selection[i] === node) {
                        index = i;
                        break;
                    }
                }
            }
        }

        return index;
    }

    propagateSelectionUp(node: CustomTreeNode, select: boolean) {
        if (node.children && node.children.length) {
            let selectedCount = 0;
            let childPartialSelected = false;
            for (const child of node.children) {
                if (this.isSelected(child)) {
                    selectedCount++;
                } else if (child.partialSelected) {
                    childPartialSelected = true;
                }
            }
            if (select && selectedCount === node.children.length) {
                this.selection = [...this.selection || [], node];
                node.partialSelected = false;
            } else {
                if (!select) {
                    const index = this.findIndexInSelection(node);
                    if (index >= 0) {
                        this.selection = this.selection.filter((val, i) => i !== index);
                    }
                }

                if (childPartialSelected || selectedCount > 0 && selectedCount != node.children.length){
                    node.partialSelected = true;
                } else {
                    node.partialSelected = false;
                }
            }
        }

        const parent = node.parent;
        if (parent) {
            this.propagateSelectionUp(parent, select);
        }
    }

    propagateSelectionDown(node: CustomTreeNode, select: boolean) {
        const index = this.findIndexInSelection(node);
        if (select && index === -1) {
            this.selection = [...this.selection || [], node];
        } else if (!select && index > -1) {
            this.selection = this.selection.filter((val, i) => i !== index);
        }
        node.partialSelected = false;

        if (node.children && node.children.length) {
            for (const child of node.children) {
                this.propagateSelectionDown(child, select);
            }
        }
    }

    isSelected(node: CustomTreeNode) {
        return this.findIndexInSelection(node) !== -1;
    }

    isSingleSelectionMode() {
        return this.selectionMode && this.selectionMode === 'single';
    }

    isMultipleSelectionMode() {
        return this.selectionMode && this.selectionMode === 'multiple';
    }

    isCheckboxSelectionMode() {
        return this.selectionMode && this.selectionMode === 'checkbox';
    }

    hasFooter() {
        if (this.columns) {
            const columnsArr = this.cols.toArray();
            for (let i = 0; i < columnsArr.length; i++) {
                if (columnsArr[i].footer) {
                    return true;
                }
            }
        }
        return false;
    }
}

