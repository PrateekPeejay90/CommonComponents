import { Component, OnInit, QueryList, ViewChildren, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { ButtonModule, TreeNode } from 'primeng/primeng';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'app';
    filterAttributes: any[] = [];
    sortBy: string = "";
    showSearchFilter: boolean = true;
    showMoreFiltersPanel: boolean = false;
    showExport: boolean = false;
    filterStyleClass: string = "topfilterStyle";
    tenantId: string = "NBC";
    moduleName: string = "Avails";
    files1: TreeNode[];
    files: TreeNode[] = [];
    cols: any[] = [];
    loading: boolean = false;
    pageSize: number = 10;
    count: number = 0;
    btnclick: number = 0;
    selectedFiles: TreeNode[] = [];
    panelId = new Date().getTime().toString();
    commentsAttributes: {};
    topFilterToggler: boolean = true;
    sideFilterToggler: boolean = false;
    treeToggler: boolean = true;
    commentsToggler: boolean = false;
    showErrorDialog: boolean = false; 
   
    @ViewChild('filterPanel') filterPanel: any;
    @ViewChild('sidefilter') sidefilter: any;
    @ViewChild('confirmPopup') confirmPopup: any;
    confirmObj : any ;
    ngOnInit() {
      
        this.cols = [{ field: 'name', header: 'Name', resolveFieldData: this.getName },
        { field: 'col1', header: 'Col1' },
        { field: 'col2', header: 'Col2' },
        { field: 'col3', header: 'Col3' },
        { field: 'col4', header: 'Col4' },
        { field: 'col5', header: 'Col5' },
        { field: 'col6', header: 'Col6' },
        {
            field: 'size', header: 'Size', resolveFieldData: function (row, index, fld) {
                return '<i class="fa fa-minus"></i>';
            }
        },
        { field: 'type', header: 'Type' },
        { field: 'print', header: 'Print' }];

        this.confirmObj = {
            "title":"Confirmation title",
            "desc":"Confirmation desc",
            "yesButtonLabel": "Yes Button",
            "noButtonLabel": "No Button",
            "success":function(){
                console.log('success...click...');
            },
            "fail":function(){
                console.log('fail...click...');
            }
        };
        
       
  	/*let marketFilter = {
		attributeName: 'market',
		displayName: "Markets",
  		displayLabelsAfterMax: true,
        isMandatory: true,
  		maxSelected: 0,
  		frequent: false,
  		disabled: true,
  		filter: true,
  		sortOrder: 1,
  		groupName: 'location',
  		dataType: 'multiselect',
  		dataArray: [{
	  			label: 'Chicago',
	  			value: 'bAc_4eNVQp2GZTbhpZmPbw'
	  		},{
	  			label: 'New York',
	  			value: 'IrVm-c6oQWWfrImvKkeqlQ'
	  		}]
  	};
  	let stationFilter = {
		attributeName: 'Stations',
		displayName: "Stations",
  		selParentData: [],
  		groupName: 'location',
  		displayLabelsAfterMax: true,
  		isMandatory: true,
  		maxSelected: 0,
  		sortOrder: 2,
  		frequent: false,
  		disabled: false,
  		dataType: 'multiselect',
  		dataArray: [{
	  			label: 'WMAQ',
	  			value: 'T2jGjv5nSk-5xAy5nkcuMw',
	  			mId: 'bAc_4eNVQp2GZTbhpZmPbw'
	  		},{
	  			label: 'WNBC',
	  			value: '_0J7rMB9Q6Oc0hMt0qfysQ',
	  			mId: 'IrVm-c6oQWWfrImvKkeqlQ'
	  		},{
	  			label: 'ENBC',
	  			value: '4MVjSi8SRAWeul5eS4jk6g',
	  			mId: 'IrVm-c6oQWWfrImvKkeqlQ'
	  		}]
	  };
	  let productFilter = {
		attributeName: 'Products',
		displayName: "Products",
  		selParentData: [],
        groupName: 'location',
  		displayLabelsAfterMax: true,
  		isMandatory: true,
  		maxSelected: 0,
  		sortOrder: 2,
  		frequent: false,
  		disabled: false,
  		dataType: 'multiselect',
  		dataArray: [{
	  			label: 'WMAQ',
	  			value: 'T2jGjv5nSk-5xAy5nkcuMw',
	  			mId: 'bAc_4eNVQp2GZTbhpZmPbw'
	  		},{
	  			label: 'WNBC',
	  			value: '_0J7rMB9Q6Oc0hMt0qfysQ',
	  			mId: 'IrVm-c6oQWWfrImvKkeqlQ'
	  		},{
	  			label: 'ENBC',
	  			value: '4MVjSi8SRAWeul5eS4jk6g',
	  			mId: 'IrVm-c6oQWWfrImvKkeqlQ'
	  		}]
	  };
	  let agencyFilter = {
		attributeName: 'Agency',
		displayName: "Agency",
  		isMandatory: true,
  		//sortOrder: 3,
  		disabled: false,
  		editable: false,
  		frequent: false,
  		dataType: 'dropdown',
  		dataArray: [{
  			label: 'CARAT USA/MACY',
  			value: 'CARAT USA/MACY'
  		},{
  			label: 'CARAT USA',
  			value: 'CARAT USA'
  		},{
  			label: 'JS MEDIA',
  			value: 'JS MEDIA'
  		},{
  			label: 'HAVAS MEDIA',
  			value: 'HAVAS MEDIA'
  		}]
	  };
	  let agencyGroupFilter = {
		attributeName: 'Agency_Group',
		displayName: "Agencys",
  		isMandatory: false,
  		//sortOrder: 3,
  		disabled: false,
  		editable: true,
  		frequent: false,
  		dataType: 'dropdown',
  		dataArray: [{
  			label: 'CARAT USA/MACY',
  			value: 'CARAT USA/MACY'
  		},{
  			label: 'CARAT USA',
  			value: 'CARAT USA'
  		},{
  			label: 'JS MEDIA',
  			value: 'JS MEDIA'
  		},{
  			label: 'HAVAS MEDIA',
  			value: 'HAVAS MEDIA'
  		}]
      };
      
  	let chkboxFilter = {
        attributeName: "checkMe",
        displayName: "Check Me",
  		isMandatory: false,
  		frequent: false,
  		dataType: 'checkbox',
  		disabled: false,
  		checked: true
      };
      let daysFilter = {
        displayName: "Days",
        attributeName: 'days',
        frequent: true,
        dataType: 'days',
        value: ['Sa-Su'],
        mandatory: false
    };

    let starttimeFilter = {
        displayName: "Start Time",
        attributeName: 'startTime',
        mandatory: true,
        frequent: true,
        dataType: 'time'
    };

    let endtimeFilter = {
        displayName: "End Time",
        attributeName: 'endTime',
        mandatory: false,
        frequent: true,
        dataType: 'time',
        value: {
            text: '09:00 AM',
            value: '09:00 AM'
        }
    };*/

        let dateFilter = {
            attributeName: 'Start Date',
            displayName: "Start Date ",
            isMandatory: false,
            frequent: true,
            dataType: 'bcdaterange',
            //previousDateLimit: new Date("05/01/2018").toString(),
            maxDate: new Date("12/31/2018").toString(),
            isSingleSelect: true,
            showAsRange: false
        };
        let textFilter = {
            attributeName: "Product Name",
            displayName: "Product Name",
            isMandatory: false,
            frequent: true,
            dataType: 'text',
            disabled: false
        };
        let productGroupFilter = {
            attributeName: 'Product_Group',
            displayName: "Products",
            selParentData: [],
            groupName: 'location',
            displayLabelsAfterMax: true,
            isMandatory: true,
            maxSelected: 0,
            sortOrder: 2,
            frequent: true,
            disabled: false,
            dataType: 'multiselect',
            dataArray: [{
                label: 'WMAQ',
                value: 'T2jGjv5nSk-5xAy5nkcuMw',
                mId: 'bAc_4eNVQp2GZTbhpZmPbw'
            }, {
                label: 'WNBC',
                value: '_0J7rMB9Q6Oc0hMt0qfysQ',
                mId: 'IrVm-c6oQWWfrImvKkeqlQ'
            }, {
                label: 'ENBC',
                value: '4MVjSi8SRAWeul5eS4jk6g',
                mId: 'IrVm-c6oQWWfrImvKkeqlQ'
            }]
        };
        let demoFilter = {
            attributeName: 'Demo',
            displayName: "Demo",
            groupName: 'rating',
            displayLabelsAfterMax: true,
            isMandatory: true,
            sortOrder: 3,
            frequent: true,
            maxSelected: 0,
            disabled: false,
            dataType: 'multiselect',
            dataArray: [{
                label: 'W15-17dssfdgfhgjghjhgfdsasdfghjkl',
                value: 'W15-17dssfdgfhgjghjhgfdsasdfghjkl'
            }, {
                label: 'M15-17',
                value: 'M15-17'
            }/*,{
  			label: 'M25-34',
  			value: 'M25-34'
  		},{
  			label: 'C2-5',
  			value: 'C2-5'
  		}*/]
        };
        let statusFilter = {
            attributeName: 'status',
            displayName: "Status",
            groupName: 'rating',
            displayLabelsAfterMax: true,
            isMandatory: true,
            sortOrder: 3,
            frequent: true,
            maxSelected: 0,
            disabled: false,
            dataType: 'multiselect',
            dataArray: [{
                label: 'W15-17-statusfilter',
                value: 'W15-17statusfilter'
            }, {
                label: 'M25-34',
                value: 'M25-34'
            }/*,{
  			label: 'M25-34',
  			value: 'M25-34'
  		},{
  			label: 'C2-5',
  			value: 'C2-5'
  		}*/]
        };
        let networkFilter = {
            attributeName: 'Network',
            displayName: "Network",
            groupName: 'rating',
            displayLabelsAfterMax: true,
            isMandatory: true,
            sortOrder: 3,
            frequent: true,
            maxSelected: 0,
            disabled: false,
            dataType: 'multiselect',
            dataArray: [{
                label: 'W15-17',
                value: 'W15-17'
            }, {
                label: 'M16-17-networkFilter;',
                value: 'M16-17-networkFilter'
            }, {
                label: 'M25-34',
                value: 'M25-34'
            }/*,{
  			label: 'C2-5',
  			value: 'C2-5'
  		}*/]
        };
        let networkGroupFilter = {
            attributeName: 'Network_Group',
            displayName: "Networks",
            groupName: 'rating',
            displayLabelsAfterMax: true,
            isMandatory: true,
            sortOrder: 3,
            frequent: false,
            maxSelected: 0,
            disabled: false,
            dataType: 'multiselect',
            dataArray: [{
                label: 'W15-17',
                value: 'W15-17'
            }, /*{
  			label: 'M15-17',
  			value: 'M15-17'
  		},{
  			label: 'M25-34',
  			value: 'M25-34'
  		},{
  			label: 'C2-5',
  			value: 'C2-5'
  		}*/]
        };

        let telecastDatesFilter = {
            displayName: "Effective Dates",
            attributeName: 'effectiveDates',
            isMandatory: false,
            frequent: false,
            dataType: 'daterange',
            fromDateLabel: 'First Telecast',
            toDateLabel: 'Last Telecast'
        };

        let daysAndTimesFilter = {
            displayName: "Days And Times",
            attributeName: 'daysAndTimes',
            isMandatory: false,
            frequent: true,
            dataType: 'daysAndTimes',
            multiSelect: true,
            items: [{
                daysAttribute: {
                    displayName: "Days",
                    attributeName: 'days',
                    value: ['M','Tu','W']
                },
                startTimeAttribute: {
                    displayName: "Start Time",
                    attributeName: 'startTime',
                    value: {
                        text: '05:35 AM',
                        value: '05:35 AM'
                    }
                },
                endTimeAttribute: {
                    displayName: "End Time",
                    attributeName: 'endTime',
                    value: {
                        text: '05:55 AM',
                        value: '05:55 AM'
                    }
                }
            },{
                daysAttribute: {
                    displayName: "Days",
                    attributeName: 'days',
                    value: ['Mon','Tue','Wed'],
                   /* dataArray: [
                        {"value":"M-Su","label":"Mon-Sun"},
                        {"value":"M-F","label":"Mon-Fri"},
                        {"value":"Sa-Su","label":"Sat-Sun","isLastGroupOption":true},
                        {"value":"M","label":"Mon"},
                        {"value":"Tu","label":"Tues"},
                        {"value":"W","label":"Wed"},
                        {"value":"Th","label":"Thr"},
                        {"value":"F","label":"Fri","selected":true},
                        {"value":"Sa","label":"Sat"},
                        {"value":"Su","label":"Sun"}
                    ],*/
                    dataArray: [
                        {"value":"Mon","label":"Monday"},
                        {"value":"Tue","label":"Tuesday"},
                        {"value":"Wed","label":"Wednesday"},
                        {"value":"Thu","label":"Thursday"},
                    ]
                },
                startTimeAttribute: {
                    displayName: "Start Time",
                    attributeName: 'startTime',
                    dataArray: [
                        {"value":"09:00 AM","text":"09:00 AM text"},
                        {"value":"10:00 AM","text":"10:00 AM text"},
                        {"value":"11:00 AM","text":"11:00 AM text"},
                        {"value":"12:00 AM","text":"12:00 AM text"},
                        {"value":"13:00 AM","text":"13:00 AM text"},
                        {"value":"14:00 AM","text":"14:00 AM text"},
                    ],
                    value: {"value":"13:00 AM","text":"13:00 AM text"}
                },
                endTimeAttribute: {
                    displayName: "End Time",
                    attributeName: 'endTime',
                    dataArray: [
                        {"value":"09:00 AM","text":"09:00 AM text"},
                        {"value":"10:00 AM","text":"10:00 AM text"},
                        {"value":"11:00 AM","text":"11:00 AM text"},
                        {"value":"12:00 AM","text":"12:00 AM text"},
                        {"value":"13:00 AM","text":"13:00 AM text"},
                        {"value":"14:00 AM","text":"14:00 AM text"},
                    ],
                    value:{"value":"14:00 AM","text":"14:00 AM text"}
                }
            }]
        };

        let indexFilter = {
            attributeName: "index",
            displayName: "Index",
            isMandatory: false,
            frequent: true,
            dataType: 'index',
            disabled: false
        };

        this.commentsAttributes = {
            moduleName:"Avails",
            apiThreadGetUrl:"https://hktmjaon13.execute-api.us-east-1.amazonaws.com/v1/thread",
            apiThreadPostUrl:"https://hktmjaon13.execute-api.us-east-1.amazonaws.com/v1/thread",
            apiNotesGetUrl:"",
            xApiKey: 'vitaDa2DZw3wDQhkB5ge9zLs20ZdlFY6QwbGQqD2',
            apiNotesPostUrl:"https://hktmjaon13.execute-api.us-east-1.amazonaws.com/v1/thread",
            userName:"Paras Setya",
            showMarkets:true,
            markets:[
                { name: 'New York', code: 'IrVm-c6oQWWfrImvKkeqlQ' },
                { name: 'Chicago', code: 'bAc_4eNVQp2GZTbhpZmPbw' },
                { name: 'London', code: 'LDN' }
                ],
            hideHeader:false,
            tabConfig:[
                // {
                //     tabId:"",
                //     tabDisplayName: "",
                //     externalEntityId:"",
                //     showMetaData: true,
                //     canAdd:true, 
                // },
            {
                tabId:"avails_sales",
                tabDisplayName: "Sales",
                //externalEntityId:"Connect*Proposal*1234",
                externalEntityId: "Avail*5b15b296050064ddec379ec0*Tab*Internal*Market*",
                showMetaData: true,
                canAdd:true, 
                canEdit:false,
                canReply:true, 
                canDelete:false
            },
            /*{
                tabId:"",
                tabDisplayName:"Research",
                externalEntityId:"",
                showMetaData: true,
                canAdd:true, 
                canEdit:false, 
                canReply:false, 
                canDelete:false
            },*/
            // {
            //     tabId:"avails_Lineage",
            //     tabDisplayName: "Lineage",
            //     externalEntityId:"Connect*Proposal*1234",
            //     showMetaData: true,
            //     canAdd:false, 
            //     canEdit:false,
            //     canReply:true, 
            //     canDelete:false
            // },
            {
                tabId:"avails_external",
                tabDisplayName: "External",
                externalEntityId:"Connect*Proposal*9867",
                showMetaData: true,
                canAdd:true,
                canEdit:true, 
                canReply:false, 
                canDelete:true,
                isShowAllVisible:false
                
            }
        ]
            
            
            }

            let daysFilter = {
                displayName: "Days1",
                attributeName: 'days2',
                frequent: true,
                dataType: 'days',
                mandatory: false,
                isMandatory: true,
                sortOrder: 3,
                maxSelected: 0,
                disabled: false
            };

            let endtimeFilter = {
                displayName: "End Time",
                attributeName: 'timeendTime',
                mandatory: false,
                frequent: true,
                dataType: 'time',
                dataArray: [
                    {"value":"09:00 AM","text":"09:00 AM text"},
                    {"value":"10:00 AM","text":"10:00 AM text"},
                    {"value":"11:00 AM","text":"11:00 AM text","selected":true},
                    {"value":"12:00 AM","text":"12:00 AM text"},
                    {"value":"13:00 AM","text":"13:00 AM text"},
                    {"value":"14:00 AM","text":"14:00 AM text"},
                ]
            };

        this.filterAttributes.push(
            //marketFilter,
            demoFilter,
            productGroupFilter,
            networkGroupFilter,
            //agencyGroupFilter,
            statusFilter,
            networkFilter,
            daysAndTimesFilter,
            //chkboxFilter,
            telecastDatesFilter,
            textFilter,
            daysFilter,
            endtimeFilter,
            indexFilter,
            dateFilter
        );

        
        this.files1 = [{
            "data": {
                "name": "Documents1",
                "size": "75kb",
                "type": "Folder",
                "print": ++this.count
            },
            "leaf": false
            /*"children":[
                
                {  
                    "data":{  
                        "name":"Home",
                        "size":"20kb",
                        "type":"Folder"
                    },
                    "children":[  
                        {  
                            "data":{  
                                "name":"Invoices",
                                "size":"20kb",
                                "type":"Text"
                            }
                        }
                    ]
                }
            ]*/
        },
        {
            "data": {
                "name": "Pictures1",
                "size": "150kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "barcelona.jpg",
                        "size": "90kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "primeui.png",
                        "size": "30kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "optimus.jpg",
                        "size": "30kb",
                        "type": "Picture"
                    }
                }
            ]
        }, {
            "data": {
                "name": "Documents1",
                "size": "75kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "Work",
                        "size": "55kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Expenses.doc",
                                "size": "30kb",
                                "type": "Document"
                            }
                        },
                        {
                            "data": {
                                "name": "Resume.doc",
                                "size": "25kb",
                                "type": "Resume"
                            }
                        }
                    ]
                },
                {
                    "data": {
                        "name": "Home",
                        "size": "20kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Invoices",
                                "size": "20kb",
                                "type": "Text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "data": {
                "name": "Pictures1",
                "size": "150kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "barcelona.jpg",
                        "size": "90kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "primeui.png",
                        "size": "30kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "optimus.jpg",
                        "size": "30kb",
                        "type": "Picture"
                    }
                }
            ]
        }, {
            "data": {
                "name": "Documents1",
                "size": "75kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "Work",
                        "size": "55kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Expenses.doc",
                                "size": "30kb",
                                "type": "Document"
                            }
                        },
                        {
                            "data": {
                                "name": "Resume.doc",
                                "size": "25kb",
                                "type": "Resume"
                            }
                        }
                    ]
                },
                {
                    "data": {
                        "name": "Home",
                        "size": "20kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Invoices",
                                "size": "20kb",
                                "type": "Text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "data": {
                "name": "Pictures1",
                "size": "150kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "barcelona.jpg",
                        "size": "90kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "primeui.png",
                        "size": "30kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "optimus.jpg",
                        "size": "30kb",
                        "type": "Picture"
                    }
                }
            ]
        }, {
            "data": {
                "name": "Documents1",
                "size": "75kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "Work",
                        "size": "55kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Expenses.doc",
                                "size": "30kb",
                                "type": "Document"
                            }
                        },
                        {
                            "data": {
                                "name": "Resume.doc",
                                "size": "25kb",
                                "type": "Resume"
                            }
                        }
                    ]
                },
                {
                    "data": {
                        "name": "Home",
                        "size": "20kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Invoices",
                                "size": "20kb",
                                "type": "Text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "data": {
                "name": "Pictures1",
                "size": "150kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "barcelona.jpg",
                        "size": "90kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "primeui.png",
                        "size": "30kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "optimus.jpg",
                        "size": "30kb",
                        "type": "Picture"
                    }
                }
            ]
        }, {
            "data": {
                "name": "Documents1",
                "size": "75kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "Work",
                        "size": "55kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Expenses.doc",
                                "size": "30kb",
                                "type": "Document"
                            }
                        },
                        {
                            "data": {
                                "name": "Resume.doc",
                                "size": "25kb",
                                "type": "Resume"
                            }
                        }
                    ]
                },
                {
                    "data": {
                        "name": "Home",
                        "size": "20kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Invoices",
                                "size": "20kb",
                                "type": "Text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "data": {
                "name": "Pictures1",
                "size": "150kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "barcelona.jpg",
                        "size": "90kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "primeui.png",
                        "size": "30kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "optimus.jpg",
                        "size": "30kb",
                        "type": "Picture"
                    }
                }
            ]
        }, {
            "data": {
                "name": "Documents1",
                "size": "75kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "Work",
                        "size": "55kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Expenses.doc",
                                "size": "30kb",
                                "type": "Document"
                            }
                        },
                        {
                            "data": {
                                "name": "Resume.doc",
                                "size": "25kb",
                                "type": "Resume"
                            }
                        }
                    ]
                },
                {
                    "data": {
                        "name": "Home",
                        "size": "20kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Invoices",
                                "size": "20kb",
                                "type": "Text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "data": {
                "name": "Pictures1",
                "size": "150kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "barcelona.jpg",
                        "size": "90kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "primeui.png",
                        "size": "30kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "optimus.jpg",
                        "size": "30kb",
                        "type": "Picture"
                    }
                }
            ]
        }, {
            "data": {
                "name": "Documents1",
                "size": "75kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "Work",
                        "size": "55kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Expenses.doc",
                                "size": "30kb",
                                "type": "Document"
                            }
                        },
                        {
                            "data": {
                                "name": "Resume.doc",
                                "size": "25kb",
                                "type": "Resume"
                            }
                        }
                    ]
                },
                {
                    "data": {
                        "name": "Home",
                        "size": "20kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Invoices",
                                "size": "20kb",
                                "type": "Text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "data": {
                "name": "Pictures1",
                "size": "150kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "barcelona.jpg",
                        "size": "90kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "primeui.png",
                        "size": "30kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "optimus.jpg",
                        "size": "30kb",
                        "type": "Picture"
                    }
                }
            ]
        }, {
            "data": {
                "name": "Documents1",
                "size": "75kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "Work",
                        "size": "55kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Expenses.doc",
                                "size": "30kb",
                                "type": "Document"
                            }
                        },
                        {
                            "data": {
                                "name": "Resume.doc",
                                "size": "25kb",
                                "type": "Resume"
                            }
                        }
                    ]
                },
                {
                    "data": {
                        "name": "Home",
                        "size": "20kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Invoices",
                                "size": "20kb",
                                "type": "Text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "data": {
                "name": "Pictures1",
                "size": "150kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "barcelona.jpg",
                        "size": "90kb",
                        "type": 'Picture'
                    }
                },
                {
                    "data": {
                        "name": "primeui.png",
                        "size": "30kb",
                        'type': "Picture"
                    }
                },
                {
                    "data": {
                        "name": "optimus.jpg",
                        "size": "30kb",
                        "type": "Picture"
                    }
                }
            ]
        }, {
            "data": {
                "name": "Documents1",
                "size": "75kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "Work",
                        "size": "55kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Expenses.doc",
                                "size": "30kb",
                                "type": "Document"
                            }
                        },
                        {
                            "data": {
                                "name": "Resume.doc",
                                "size": "25kb",
                                "type": "Resume"
                            }
                        }
                    ]
                },
                {
                    "data": {
                        "name": "Home",
                        "size": "20kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Invoices",
                                "size": "20kb",
                                "type": "Text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "data": {
                "name": "Pictures1",
                "size": "150kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "barcelona.jpg",
                        "size": "90kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "primeui.png",
                        "size": "30kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "optimus.jpg",
                        "size": "30kb",
                        "type": "Picture"
                    }
                }
            ]
        }, {
            "data": {
                "name": "Documents1",
                "size": "75kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "Work",
                        "size": "55kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Expenses.doc",
                                "size": "30kb",
                                "type": "Document"
                            }
                        },
                        {
                            "data": {
                                "name": "Resume.doc",
                                "size": "25kb",
                                "type": "Resume"
                            }
                        }
                    ]
                },
                {
                    "data": {
                        "name": "Home",
                        "size": "20kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Invoices",
                                "size": "20kb",
                                "type": "Text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "data": {
                "name": "Pictures1",
                "size": "150kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "barcelona.jpg",
                        "size": "90kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "primeui.png",
                        "size": "30kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "optimus.jpg",
                        "size": "30kb",
                        "type": "Picture"
                    }
                }
            ]
        }, {
            "data": {
                "name": "Documents1",
                "size": "75kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "Work",
                        "size": "55kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Expenses.doc",
                                "size": "30kb",
                                "type": "Document"
                            }
                        },
                        {
                            "data": {
                                "name": "Resume.doc",
                                "size": "25kb",
                                "type": "Resume"
                            }
                        }
                    ]
                },
                {
                    "data": {
                        "name": "Home",
                        "size": "20kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Invoices",
                                "size": "20kb",
                                "type": "Text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "data": {
                "name": "Pictures1",
                "size": "150kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "barcelona.jpg",
                        "size": "90kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "primeui.png",
                        "size": "30kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "optimus.jpg",
                        "size": "30kb",
                        "type": "Picture"
                    }
                }
            ]
        }, {
            "data": {
                "name": "Documents1",
                "size": "75kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "Work",
                        "size": "55kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Expenses.doc",
                                "size": "30kb",
                                "type": "Document"
                            }
                        },
                        {
                            "data": {
                                "name": "Resume.doc",
                                "size": "25kb",
                                "type": "Resume"
                            }
                        }
                    ]
                },
                {
                    "data": {
                        "name": "Home",
                        "size": "20kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Invoices",
                                "size": "20kb",
                                "type": "Text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "data": {
                "name": "Pictures1",
                "size": "150kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "barcelona.jpg",
                        "size": "90kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "primeui.png",
                        "size": "30kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "optimus.jpg",
                        "size": "30kb",
                        "type": "Picture"
                    }
                }
            ]
        }, {
            "data": {
                "name": "Documents1",
                "size": "75kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "Work",
                        "size": "55kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Expenses.doc",
                                "size": "30kb",
                                "type": "Document"
                            }
                        },
                        {
                            "data": {
                                "name": "Resume.doc",
                                "size": "25kb",
                                "type": "Resume"
                            }
                        }
                    ]
                },
                {
                    "data": {
                        "name": "Home",
                        "size": "20kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Invoices",
                                "size": "20kb",
                                "type": "Text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "data": {
                "name": "Pictures1",
                "size": "150kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "barcelona.jpg",
                        "size": "90kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "primeui.png",
                        "size": "30kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "optimus.jpg",
                        "size": "30kb",
                        "type": "Picture"
                    }
                }
            ]
        }, {
            "data": {
                "name": "Documents1",
                "size": "75kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "Work",
                        "size": "55kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Expenses.doc",
                                "size": "30kb",
                                "type": "Document"
                            }
                        },
                        {
                            "data": {
                                "name": "Resume.doc",
                                "size": "25kb",
                                "type": "Resume"
                            }
                        }
                    ]
                },
                {
                    "data": {
                        "name": "Home",
                        "size": "20kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Invoices",
                                "size": "20kb",
                                "type": "Text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "data": {
                "name": "Pictures1",
                "size": "150kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "barcelona.jpg",
                        "size": "90kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "primeui.png",
                        "size": "30kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "optimus.jpg",
                        "size": "30kb",
                        "type": "Picture"
                    }
                }
            ]
        }, {
            "data": {
                "name": "Documents1",
                "size": "75kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "Work",
                        "size": "55kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Expenses.doc",
                                "size": "30kb",
                                "type": "Document"
                            }
                        },
                        {
                            "data": {
                                "name": "Resume.doc",
                                "size": "25kb",
                                "type": "Resume"
                            }
                        }
                    ]
                },
                {
                    "data": {
                        "name": "Home",
                        "size": "20kb",
                        "type": "Folder"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Invoices",
                                "size": "20kb",
                                "type": "Text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "data": {
                "name": "Pictures1",
                "size": "150kb",
                "type": "Folder",
                "print": ++this.count
            },
            "children": [
                {
                    "data": {
                        "name": "barcelona.jpg",
                        "size": "90kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "primeui.png",
                        "size": "30kb",
                        "type": "Picture"
                    }
                },
                {
                    "data": {
                        "name": "optimus.jpg",
                        "size": "30kb",
                        "type": "Picture"
                    }
                }
            ]
        }];

        this.files = this.files1.splice(0, this.pageSize);

       // console.log(this.commentsAttributes['tabConfig'].length);
    }

    ngAfterViewInit() {
        const demoCombo = this.filterPanel.getComponentByAttributeName('Product_Group');
        demoCombo.addGroupOptions([demoCombo.options[1], demoCombo.options[2]]);
        this.filterPanel.clearAll(null, false);
        /*let statusCombo = this.sidefilter.getComponentByAttributeName('status');
        console.log(statusCombo);*/
    }

    onLazyLoad(event) {
        if (!event.level) {
            if (this.files1.length > 0) {
                this.files = this.files1.splice(0, this.pageSize);
            }
        }
    }

    loadNode(event) {
        event.node.paginator = true;
        event.node.pageSize = 10;
        event.node.totalRecords = 15;
        event.node.paginatorPosition = "bottom";
        event.node.lazy = true;
        event.node.first = 0;
        event.node.children = [{
            "data": {
                "name": "Work",
                "size": "55kb",
                "type": "Folder",
                "print": "yes"
            },
            "leaf": true,
            "children": [
                {
                    "data": {
                        "name": "Expenses.doc",
                        "size": "30kb",
                        "type": "Document",
                        "print": "yes"
                    }
                },
                {
                    "data": {
                        "name": "Resume.doc",
                        "size": "25kb",
                        "type": "Resume",
                        "print": "yes"
                    }
                }
            ]
        }];
    }

    nextPage(event) {
        if (this.files1.length > 0) {
            this.files = this.files1.splice(0, this.pageSize);
        }
    }

    getName(rowData, rowId, fld, colIdx) {
        return "from custom method " + rowData[fld.field];
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

    onChkboxChange(event) {
        console.log(event);
    }

    onClearAllFilters() {
        console.log("clear all filters");
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

    visibleExport() {
        this.showExport = true;
    }
    onHideErrordialog($event): void {
        this.showErrorDialog = false;
    }

    onHideCommentsToggler($event): void {
        this.commentsToggler = false;
    }

    selectedBooks($event) {
        console.log($event);
    }

}