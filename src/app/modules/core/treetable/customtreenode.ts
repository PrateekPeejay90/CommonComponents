export interface CustomTreeNode {
    label?: string;
    data?: any;
    icon?: any;
    expandedIcon?: any;
    collapsedIcon?: any;
    children?: CustomTreeNode[];
    leaf?: boolean;
    expanded?: boolean;
    type?: string;
    parent?: CustomTreeNode;
    partialSelected?: boolean;
    styleClass?: string;
    draggable?: boolean;
    droppable?: boolean;
    selectable?: boolean;
    pageSize?: number;
    totalRecords?: number;
    first?: number;
    pageLinks?: number;
    alwaysShowPaginator?: boolean;
    paginatorPosition?: string;
    paginator?: boolean;
    rowsPerPageOptions?: number;
    lazy?: boolean;
}