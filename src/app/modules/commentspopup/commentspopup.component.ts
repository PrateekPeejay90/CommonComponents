import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
//import { Component, OnInit, Input,ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabViewModule, DialogModule } from 'primeng/primeng'
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { City } from "./constants";
import { SelectItem } from 'primeng/components/common/selectitem';
import { CommentspopupService } from './commentspopup.service';
import { Comments, Edit} from './comments.model';


@Component({
  selector: 'app-commentspopup',
  templateUrl: './comments.view.html',
  styleUrls: ['./comments.component.css'],
  //encapsulation: ViewEncapsulation.None,
  providers: [CommentspopupService]
})

export class CommentspopupComponent implements OnInit {
  sortedThread: any;

  @Input() commentsAttributes: {};
  @Input() commentsToggler: boolean = true;
  @Input() isMarketVisible: boolean = false;
  @Input() isShowAllVisible: boolean = false;
  @Output() onDropdownClick: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  private onHide = new EventEmitter<any>();
  hide($event) {
    this.onHide.emit(this.commentsToggler);
  }
  externalComment: any[];
  threadsArray: any[] = [];
  threadId: string;
  addComment: boolean;
  hideHeader: boolean;
  addExternalComment: boolean = false;
  contenteditable: boolean = false;
  editDescription: boolean = false;
  saveEnable: boolean = false;
  selectedCity: any;
  currentVal: any;
  index: number;
  enableAddReply: boolean = false;
  enableShowMore: boolean = false;
  enableReply: boolean = true;
  disableReplyComment: boolean = false;
  addingCommentDescriptionUsername: boolean = false;
  textValue = '';
  replys = [];
  comments = [];
  commentValue = '';
  threadGetUrl: string = '';
  notesGetUrl: string = '';
  threadPostUrl: string = '';
  notesPostUrl: string = '';
  activeTab: any;
  tempEdit: any;
  tempArray = []; 
  // editClicked: boolean = false;
  tempArrayReply = [];
  replyClicked: boolean = false;
  sortedThreadArray: any = [];
  commentDate: any;
  replyDate:any;
  sortedThreads: any = [];
  tempThreadId: any;
  tempNotesCount: any;
  notes = '';
  xApiKey: string= '';
  inputData:string = "";
  showAll: boolean = false;
  canEdit: boolean;
  previousNodeId:string = "";
  constructor(private commentspopupService: CommentspopupService) {
  }

  ngOnInit() {
    let externalEntityId = this.commentsAttributes['externalEntityId'];
    let tab;
    this.canEdit = this.commentsAttributes['tabConfig'][0].canEdit;
    // this.editClicked = false;
    this.replyClicked = false;
    this.tempEdit = 0;
    if (this.commentsAttributes['tabConfig']) {
      this.commentsAttributes['tabConfig'].forEach(tab => {
        tab['threads'] = [];
        tab['clickedEdit'] = false;
        tab['clickedReply'] = false;
      });
      externalEntityId = this.commentsAttributes['tabConfig'][0].externalEntityId;
      this.activeTab = this.commentsAttributes['tabConfig'][0];
     }
    this.threadGetUrl = this.commentsAttributes['apiThreadGetUrl'];
    this.xApiKey = this.commentsAttributes['xApiKey'];
  
    if(this.commentsAttributes['showMarkets']){

    let check = this.commentsAttributes['markets'][0].code;

      externalEntityId += check;
  }
    this.getThreads(externalEntityId, this.activeTab,this.sortComments);
  }
  
  sortComments(sortThread){
    
     let commentDate;
     let replyDate;
     if(sortThread.length <= 0) return;    
     for(let i = 0; i < sortThread.length ;i++) {  
       if(sortThread[i].replies && sortThread[i].replies.length > 0) {
         commentDate = new Date(sortThread[i].updatedTime);
         //from the reply array get the latest time      
        if(sortThread[i].replies.length == 1){
         replyDate = new Date(sortThread[i].replies[0].updatedTime);
        }else{        
         replyDate = this.getLastestReplyDatefromThread(sortThread[i].replies);  
        }       
         sortThread[i].latestTime = replyDate;;
       }
       else
       {
         sortThread[i].latestTime = new Date(sortThread[i].updatedTime);
       }
     }
     let sortedArr =  sortThread.sort(function(a,b){
       return b.latestTime - a.latestTime;
     });
 
     return sortedArr;
   }
 
   getLastestReplyDatefromThread(replyArr){   
      let sortedReplyArr = replyArr.sort(function(replay1, reply2){ 
         return reply2.updatedTime - replay1.updatedTime;
     }); 
 
     let latestReplyDate = sortedReplyArr.shift();
     return latestReplyDate;
   }

  addReply(event, value: string): void {
    this.textValue = '';
    //this.replyClicked = false;
    this.commentsAttributes['tabConfig'][this.tempEdit]['clickedReply'] = false;
    this.replys.push(value);
    this.enableAddReply = false;
    this.enableReply = true;
    this.disableReplyComment = false;
    let id = event.currentTarget.id;
    this.showHideElements(id, false);
    let eleId = id.substring(id.indexOf("_") + 1, id.length);
    this.tempThreadId = id.substring(id.indexOf("_") + 1, id.length);
    let newReply = {
      threadId: eleId,
      note: value,
      read: false,
      author: this.commentsAttributes['userName'],
      updatedTime: new Date(),
      initials : ""
    };

    this.commentspopupService.createNotesByThreadId(this.threadGetUrl, newReply,this.xApiKey).then(res => {
    });
    let eeId = this.activeTab.externalEntityId;
    if(this.commentsAttributes['showMarkets']){
      eeId += this.selectedCity ? this.selectedCity.code : this.commentsAttributes['markets'][0].code;
    }

    this.commentspopupService.getThreads(eeId, this.threadGetUrl,this.xApiKey).then(res => {
      let threads = res['thread'];
      for (let i = 0; i < threads.length; i++) {
        if(threads[i].threadId == this.tempThreadId)
        {
          this.tempNotesCount = threads[i].notesCount;
        }
      }
      this.tempNotesCount++;
      let sampleNotesCount : string;
      sampleNotesCount = ""+this.tempNotesCount;

      this.commentspopupService.updateNotesCount(this.threadGetUrl,this.tempThreadId,sampleNotesCount,this.xApiKey).then(res => {
        let currThread = this.activeTab.threads.filter(thread => thread.threadId === eleId);
        if(currThread){
          currThread[0].notesCount = Number(res['notesCount']);
          let nameArr = newReply.author.split(" ");  
          newReply.initials = nameArr[0].substring(0, 1).toUpperCase();
          if(nameArr.length > 1)
          {
            newReply.initials += nameArr[nameArr.length - 1].substring(0, 1).toUpperCase();
          }
          if(value!=''){
            currThread[0].replies.splice(0,1,newReply);
          }   
          this.sortComments(this.sortedThread);
        }  
      });
    });

    
  }

  addCommentDescription(activeTab: any, value: string): void {
    this.addingCommentDescriptionUsername = true;
    this.commentValue = '';
    let externalEntityId = this.activeTab.externalEntityId
    let threadName = value;
    let updatedTime = new Date();
    
    if(this.commentsAttributes['showMarkets']){
      let marketCode = this.selectedCity ? this.selectedCity.code : this.commentsAttributes['markets'][0].code;
      externalEntityId += marketCode;
    }
    let read = true;
    this.commentspopupService.createThread(this.threadGetUrl, threadName, updatedTime, externalEntityId, read,this.xApiKey).then(res => {
      // this.externalComment[i].note = res['note'][0].note;
      this.tempThreadId = res['threadId'];
      let newReply = {
        threadId: res['threadId'],
        note: value,
        read: false,
        author: this.commentsAttributes['userName'],
        updatedTime: updatedTime
      };

      this.commentspopupService.createNotesByThreadId(this.threadGetUrl, newReply,this.xApiKey).then(res => {});

      let sampleNotesCount : string;
      sampleNotesCount = "" + 1;
      this.commentspopupService.updateNotesCount(this.threadGetUrl,this.tempThreadId,sampleNotesCount,this.xApiKey).then(res => {
      });

      let newThread = {
        threadName : value,
        updatedTime : new Date(),
        externalEntityId : this.activeTab.externalEntityId,
        author: this.commentsAttributes['userName'],
        threadId: this.tempThreadId,
        initials: '',
        replies: []
      }

      let nameArr = this.commentsAttributes['userName'].split(" ");  
      newThread.initials = nameArr[0].substring(0, 1).toUpperCase();
      if(nameArr.length > 1)
      {
        newThread.initials += nameArr[nameArr.length - 1].substring(0, 1).toUpperCase();
      }

      if(value!=''){
        this.activeTab.threads.push(newThread);
      }

      if(this.activeTab.canEdit){
        this.activeTab.canAdd = false;
       }

    });
 }

  onTabChange(event) {
    this.activeTab = this.commentsAttributes['tabConfig'][event.index];
    this.canEdit = this.commentsAttributes['tabConfig'][event.index].canEdit;
    this.activeTab.threads = [];
    this.saveEnable = false;
    this.contenteditable = false;
    this.tempEdit = event.index;
    this.selectedCity = this.commentsAttributes['markets'][0];
    let check;
    check = this.commentsAttributes['tabConfig'][event.index]['tabId'];
    if(this.commentsAttributes['tabConfig'][this.tempEdit]['clickedEdit'] ){
      let tabIdArr = [];
      this.saveEnable = true;
      this.contenteditable = true;
      this.editDescription = true;
      
      for(let i = 0 ; i< this.tempArray.length; i++){
        if(this.tempArray[i].tabId==this.commentsAttributes['tabConfig'][event.index]['tabId']){
          this.commentsAttributes['tabConfig'][this.tempEdit]['threads'] = this.tempArray[i].threadArr;
        }
      }
    } else if(this.commentsAttributes['tabConfig'][this.tempEdit]['clickedReply']){

      let tabIdReplyArr = [];
      for(let i = 0 ; i< this.tempArrayReply.length; i++){
        tabIdReplyArr[i] = this.tempArrayReply[i].tabId;
        }

      if(tabIdReplyArr.indexOf(check)<0)
      {
        this.getThreads(this.activeTab.externalEntityId, this.activeTab,this.sortComments);
      }
      else{
        for(let i = 0 ; i< this.tempArrayReply.length; i++){
          if(this.tempArrayReply[i].tabId==this.commentsAttributes['tabConfig'][event.index]['tabId']){
            this.commentsAttributes['tabConfig'][this.tempEdit]['threads'] = this.tempArrayReply[i].threadArr;
          }
        }
      }
    }else {
      let externalEntityId = this.activeTab.externalEntityId;
      if(this.commentsAttributes['showMarkets']){
        let check = this.selectedCity ? this.selectedCity.code : this.commentsAttributes['markets'][0].code;
        externalEntityId += check;
      }
      this.getThreads(externalEntityId, this.activeTab,this.sortComments);
    }  
  }

  getThreads(entityId, tab,sortComments) {

    this.commentspopupService.getThreads(entityId, this.threadGetUrl,this.xApiKey).then(res => {
      let threads = res['thread'];
      if(this.canEdit== true && threads.length>0 )
      {
        this.activeTab.canAdd = false;
        
      }
      if(this.canEdit== true && threads.length==0 )
      {
        this.activeTab.canAdd = true;
        
      }


      this.sortedThread = res['thread'];
     
      for (let i = 0; i < threads.length; i++) {
        this.commentspopupService.getCommentsByThreadId(this.threadGetUrl, threads[i].threadId, 1, true,this.xApiKey).then(res => {
          let thread = new Comments();
         
          thread.threadId = threads[i].threadId;
          thread.threadName = threads[i].threadName;
          thread.externalEntityId = threads[i].externalEntityId;
          thread.updatedTime = threads[i].updatedTime;
          let cnt = Number(threads[i].notesCount);
          thread.notesCount = isNaN(cnt) ? 0 : cnt;
          
          if (res['note'].length > 0) {
            thread.author = res['note'][0].author;
          } else {
            thread.author = '';
          }
          let nameArr = thread.author.split(" ");  
          thread.initials = nameArr[0].substring(0, 1).toUpperCase();
          if(nameArr.length > 1)
          {
            thread.initials += nameArr[nameArr.length - 1].substring(0, 1).toUpperCase();
          }

          // if(threads[i].threadCount>1){
          this.getCommentsByThreadId(thread, tab, 1, false);
            // }
        });
      }
      this.sortComments(this.sortedThread);
    });
  }

  getCommentsByThreadId(thread, tab, limit, asc) {
    this.commentspopupService.getCommentsByThreadId(this.threadGetUrl, thread.threadId, limit, asc,this.xApiKey).then(res => {
     
      if(!this.canEdit){
        if (res['note'].length > 0){
          if (thread.updatedTime == res['note'][0].updatedTime)
            thread.replies = [];
          else
            thread.replies = res['note'];
          for(let i = 0 ; i<thread.replies.length; i++)
          {
            //let author = thread.replies[i].author;
            let nameArr = thread.replies[i].author.split(" ");  
            thread.replies[i].initials = nameArr[0].substring(0, 1).toUpperCase();
            if(nameArr.length > 1)
            {
              thread.replies[i].initials += nameArr[nameArr.length - 1].substring(0, 1).toUpperCase();
            }

          }
        }else{
          res['note'] = '';
        }
      }else{
        thread.replies = [];
      }

      if (tab) {
        tab.threads.push(thread);
        if (tab.canEdit) {
          tab.canAdd = false;
        }
      } else {
        this.threadsArray.push(thread);
      }
    });
  }

  onDelete(initials) {
    this.addExternalComment = true;
    this.externalComment.splice(this.externalComment.indexOf(initials), 1);
  }

  onEdit(event) {
    this.saveEnable = true;
    this.contenteditable = true;
    this.editDescription = true;
    let editId = event.currentTarget.id;
    this.tempThreadId = editId.substring(editId.indexOf("_") + 1, editId.length);
   // this.editClicked = true;
    this.commentsAttributes['tabConfig'][this.tempEdit]['clickedEdit'] = true;
    let temp = new Edit();
    temp.tabId = this.commentsAttributes['tabConfig'][this.tempEdit]['tabId'];
    temp.threadArr = this.commentsAttributes['tabConfig'][this.tempEdit]['threads'];
    this.tempArray.push(temp);
   }

  onSave(event) {
    this.saveEnable = false;
    let sampleNote = document.getElementById("edit2_"+this.tempThreadId);
    
    this.contenteditable = false;
    let saveId = event.currentTarget.id;
    let updatedTime = new Date();
    // this.editClicked = false;
    this.commentsAttributes['tabConfig'][this.tempEdit]['clickedEdit'] = false;
    if(this.inputData!=''){
    this.commentspopupService.threadEdit(this.threadGetUrl,this.inputData,this.tempThreadId,this.xApiKey).then(res => {
         
    })

    this.commentspopupService.getCommentsByThreadId(this.threadGetUrl, this.tempThreadId, 1, true,this.xApiKey).then(res => {
      let tempNote = {};
      tempNote = res['note'][0];
      let oldUpdatedTime = res['note'][0].updatedTime;

      let newReply = {
        threadId: this.tempThreadId,
        note: this.inputData,
        read: false,
        author: this.commentsAttributes['userName'],
        updatedTime: oldUpdatedTime
      };

      this.commentspopupService.createNotesByThreadId(this.threadGetUrl, newReply,this.xApiKey).then(res => {

        let currThread = this.activeTab.threads.filter(thread => thread.threadId === this.tempThreadId);

        if(currThread){

          currThread[0].author = this.commentsAttributes['userName'];
          currThread[0].updatedTime = updatedTime;
          currThread[0].threadName = this.inputData;
          let nameArr = currThread[0].author.split(" ");  
          currThread[0].initials = nameArr[0].substring(0, 1).toUpperCase();
          if(nameArr.length > 1)
          {
            currThread[0].initials += nameArr[nameArr.length - 1].substring(0, 1).toUpperCase();
          }
          for (let i = 0; i < this.activeTab.threads.length; i++) {
            if(this.activeTab.threads[i].threadId == currThread[0].threadId)
            {
              this.activeTab.threads[i] = currThread[0];
            }
          }

        }
       
      });

      this.commentspopupService.threadUpdatedTimeEdit(this.threadGetUrl,updatedTime,this.tempThreadId,this.xApiKey).then(res=>{
      });
    })
   }
  }

  onCancel(event){
    this.saveEnable = false;
    this.contenteditable = false;
    this.editDescription = false;
  }

  onReply(event, showAllBtId) {
    this.enableAddReply = true;
    this.disableReplyComment = true;
    this.enableReply = false;
   // this.replyClicked = true;
    this.commentsAttributes['tabConfig'][this.tempEdit]['clickedReply'] = true;
    let temp = new Edit();
    temp.tabId = this.commentsAttributes['tabConfig'][this.tempEdit]['tabId'];
    temp.threadArr = this.commentsAttributes['tabConfig'][this.tempEdit]['threads'];
    this.tempArrayReply.push(temp);
    let replyId = event.currentTarget.id;
    this.showHideElements(replyId, true);
    let eleId = replyId.substring(replyId.indexOf("_") + 1, replyId.length);
    let selThread = temp.threadArr.filter(thd => thd.threadId === eleId);
    
    let btID = "showAll_"+showAllBtId;
    
   if(btID  != event.target.id){
      document.getElementById(btID).style.display = 'block';
    }  

  }

  onCancelReply(event) {
    this.enableAddReply = false;
    this.enableReply = true;
    //this.replyClicked = false;
    this.commentsAttributes['tabConfig'][this.tempEdit]['clickedReply'] = false;
    this.textValue = '';
    this.showHideElements(event.currentTarget.id, false);
  }

  showHideElements(id, showFlag) {
    let eleId = id.substring(id.indexOf("_") + 1, id.length);
    let ele = document.getElementById("textarea_" + eleId);
    if (ele) {
      ele.style.display = showFlag ? "block" : "none";
    }
    ele = document.getElementById("buttons_" + eleId);
    if (ele) {
      ele.style.display = showFlag ? "none" : "block";
    }
    ele = document.getElementById("button_" + eleId);
    if (ele) {
      ele.style.display = showFlag ? "none" : "block";
    }
  }

  onDropdownChange(event){
    let externalEntityId = this.activeTab.externalEntityId;
    if(event) {
      this.currentVal = event;
    }
    if(this.commentsAttributes['showMarkets']){

      let check = this.currentVal.value.code;
      externalEntityId += check;
      this.activeTab.threads = [];
    }
    this.getThreads(externalEntityId, this.activeTab,this.sortComments);
  }

  commentThreadHandler(event){
    this.inputData = event.currentTarget.value;
  }

  showAllReplies(event,threadId){
    document.getElementById(event.target.attributes.id.nodeValue).style.display = 'none';
    if(event)
    {
      //this.showAll = false;
      let selThread = this.activeTab.threads.filter(thd => thd.threadId === threadId);
      selThread[0].showAllReplies = true;
      this.commentspopupService.getCommentsByThreadId(this.threadGetUrl,threadId, 10, true,this.xApiKey).then((res:any) => {
        //this.commentsAttributes['tabConfig'][i].threads[j].replies = res.note;  
        selThread[0].replies = res.note;
      });
    }else{
      this.showAll = true;
    }
    if(this.previousNodeId  != event.target.id){
      document.getElementById(event.target.id).style.display = 'none';
      if(this.previousNodeId)
      document.getElementById(this.previousNodeId).style.display = 'block';
      this.previousNodeId =  event.target.id;
    }   
  }

}
