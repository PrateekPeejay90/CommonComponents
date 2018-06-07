import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, forwardRef, style, state, ViewEncapsulation } from '@angular/core';
//import { Calendar, ConfirmationService } from 'primeng/primeng';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConfirmationService, Message,Dialog } from 'primeng/primeng';
import { DatePipe } from '@angular/common';
import { SharedService } from '../shared.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'broadcast-calendar',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BroadcastCalendar),
    multi: true
  }, ConfirmationService, DatePipe],
  templateUrl: './broadcastcalendar.view.html',
  styleUrls: ['./broadcastcalendar.component.css'],
  encapsulation : ViewEncapsulation.None
})

export class BroadcastCalendar implements OnInit, ControlValueAccessor {
  @ViewChild('caldialog') cd:Dialog
  @Input() isSingleSelect: boolean = false;
  @Input() showAsRange: boolean = true;
  @Input() fieldName: string;
  @Input() minDate: string;
  @Input() maxDate: string;
  @Input() placeHolderText: string = 'Select';
  @Input() appendTo:any = "";
  @Input() closeIconTop:string = "23";
  
  @Output() onDirtySelect = new EventEmitter<any>();
  @Output() startDateSelected = new EventEmitter<any>();
  @Output() flightDtChange: EventEmitter<any> = new EventEmitter();
  
  subscription: Subscription;
  day = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  extraDays = [6, 0, 1, 2, 3, 4, 5];
  year = new Date().getFullYear();
  daysOfMonth = []
  yearArray: any[] = [];
  startMonth = 0;
  endMonth = 11;
  month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  curMon: string = "";
  selectedDates: any[] = [];
  hiatusArray: any[] = [];
  inputValue: string = "";
  showCalendar = false;
  _value = '';
  propagateChange: any = () => { };
  startOfTheMonth: string = '';
  endOfTheMonth: string = '';
  weekSelectArray: any[] = [];
  monthSelectArray: any[] = [];
  columnClickArray: any[] = [];
  cellHoverArray = [];
  isInitialOpen = false;
  lastlySelectedFlightDt: string
  clearAll: boolean = false;

  constructor(private confirmationService: ConfirmationService, private datePipe: DatePipe,private sharedService:SharedService) {
    this.daysOfMonth = [31, this.isLeapYear(this.year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.subscription = sharedService.clearFilters$.subscribe( event => {
    	this.clearAll = event.clearAll;
	  	this.onClearClick();
	});
  }

  ngOnInit() {
  }

  get value() {
    return this._value;
  }


  writeValue(value: any) {
    if (value) {
      this.inputValue = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  //AFTER VIEW INIT TO FIND ANY VALUE SELECTED ALREADY
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.inputValue != "") {
        let dateArray = (Array.isArray(this.inputValue)) ? this.inputValue : this.inputValue.split(',');
        this.selectedDates = dateArray;
        this.inputValue = this.selectedDates.toString();
        this.propagateChange(this.inputValue);
      }
      if (this.fieldName === "flStartDate") {
        this.lastlySelectedFlightDt = this.inputValue;
      }
    }, 1);
  }

  registerOnTouched(fn: () => void): void { }

  generateYearArray() {
    if (this.isSingleSelect) {
      if (this.inputValue !== '') {
        if (this.inputValue.indexOf('-') > 0) {
          this.minDate = this.inputValue.split('-')[0];
        } else {
          this.minDate = this.inputValue;
        }
      } else {
        let curD = new Date();
        curD.setDate(new Date(curD).getDate() - 1);
        this.minDate = curD.toString();
      }
    }else {
      let minMaxDate = this.minDate.split('-');
      if (this.minDate.indexOf('-') > 0) {
        this.minDate = minMaxDate[0];
        this.maxDate = minMaxDate[1];
      }
    }
    this.startMonth = new Date(this.minDate).getMonth();
    this.endMonth = this.startMonth + 11;
    this.year = new Date(this.minDate).getFullYear();
    if (this.maxDate == undefined) {
      let lastDate = new Date(this.minDate);
      lastDate.setMonth(lastDate.getMonth() + 13);
      this.maxDate = (lastDate.getMonth() === 0 ? 1 : lastDate.getMonth()) + '/' + lastDate.getDate() + '/' + lastDate.getFullYear();
    }
    let tmp = []
    for (let i = this.startMonth; i <= this.endMonth; i++) {
      let k = i;
      if (i > 11) {
        if (i == 12) {
          this.year = this.year + 1;
        }
        k = i - (11 + 1);
      }
      this.curMon = this.month[k];
      let prev = (k - 1 < 0) ? 11 : (k - 1);
      let startDate = this.extraDays[new Date(this.year, k, 1).getDay()];
      startDate = (Number(startDate) > 0) ? this.daysOfMonth[prev] - (startDate - 1) : 1;
      let endDate = new Date(this.year, k, this.daysOfMonth[k]).getDay();
      endDate = (Number(endDate) - 1 != 6) ? this.daysOfMonth[k] - endDate : this.daysOfMonth[k];
      tmp.push(this.getMonthArray(startDate, this.daysOfMonth[prev], endDate));
    }
    return tmp;
  }


  getMonthArray(start, preEnd, realEndDate) {
    let tmp = [];
    let realTmp = [];
    let ob = {};
    let n = 0;
    let prevDaysNum = Number(preEnd - start) + 1;
    if (start !== 1) {
      for (var i = start; i <= preEnd; i++) {
        tmp.push(i);
      }
    }
    for (var j = 1; j <= realEndDate; j++) {
      tmp.push(j);
    }
    for (let l = 0; l < tmp.length; l++) {
      ob[this.day[n]] = tmp[l];
      n++;
      if ((l + 1) % 7 === 0 && l != 0) {
        realTmp.push(ob);
        ob = {};
        n = 0;
      }
    }

    return { 'year': this.year, 'month': this.curMon, 'data': realTmp, 'oldDays': prevDaysNum };
  }

  isLeapYear = function (year) {
    let leap = [];
    for (let i = 1970; i < 2050; i++) {
      if (new Date(i, 1, 29).getMonth() === 1) {
        leap.push(i);
      }
    }
    if (leap.indexOf(year) >= 0) {
      return 29;
    } else {
      return 28;
    }
  }

  getBackgroundColorForCell(num, year, mont) {
    let cl = this.fieldName + '_' + year + '_' + mont;
    let el = document.getElementsByClassName(cl)[0];
    var extraNum = (this.isSingleSelect) ? 0 : 1;
    if (num < 7) {
      if (el) {
        let el1 = el.getElementsByTagName('tbody')[0];
        let el2 = el1.getElementsByTagName('tr')[0];
        for (let k = extraNum; k < num + extraNum; k++) {
          let tdEl = el2.getElementsByTagName('td')[k];
          if (tdEl) {
            tdEl.style.backgroundColor = "lightblue";
            tdEl.getElementsByTagName('span')[0].style.color = "white";
            tdEl.getElementsByTagName('span')[0].className = "oldday";
          }
        }
      }
    }
  }

  //ON SELECTION OF INDIVIDUAL DATE
  onDateSelect(evt) {
    let getId = evt.target.id;
    let ele = document.getElementById(getId);
    let splitDate = getId.split('_');
    let selectedDate = this.month.indexOf(splitDate[2]) + 1 + '/' + splitDate[4] + '/' + splitDate[1];
    selectedDate = this.formatDate(selectedDate);
    if (this.isSingleSelect) {
      this.changeTheSelectedDateBackground(getId);
    } else {
      if (this.hiatusArray.indexOf(selectedDate) >= 0) {
        this.changeTheSelectedDateBackground(getId, 'single', 'deselect');
      } else {
        this.changeTheSelectedDateBackground(getId, 'ele', 'select');
      }
    }
    this.onDirtySelect.emit({value:this.inputValue});
  }

  changeTheColorOfTheCellOnDeselect(ele) {
    if (ele !== null) {
      if (this.isSingleSelect) {
        ele.setAttribute('style', 'background-color:none !important; text-align:center; display:block');
        if (ele.parentElement.parentElement.style.backgroundColor !== 'lightblue') {
          ele.style.color = "#555555";
        } else {
          ele.style.color = "white";
        }
      } else {
        ele.setAttribute('style', 'background-color:green !important; text-align:center; display:block; color:white')
        // if(ele.parentElement.parentElement.style.backgroundColor !== 'lightblue'){
        //     ele.parentElement.parentElement.style.backgroundColor = '';
        //     ele.style.color = "#555555";
        // } else {
        //     ele.style.color = "white";
        //     ele.style.fontWeight = "normal";
        // }
      }
    }
  }

  changeTheColorOfTheCellOnSelect(ele) {
    if (ele !== null) {
      if (this.isSingleSelect) {
        ele.setAttribute('style', 'background-color:green !important; text-align:center; display:block');
        ele.style.color = "White";
      } else {
        ele.setAttribute('style', 'background-color:orange !important; text-align:center; display:block; color:white');
        // if(ele.parentElement.parentElement.style.backgroundColor !== 'lightblue'){
        //     ele.parentElement.parentElement.setAttribute('style', 'background-color:green !important; text-align:center; display:block') ;
        //     ele.style.color = "White";
        // } else {
        //     ele.style.color = "green";
        //     ele.style.fontWeight = "bold";
        // }
      }
    }
  }

  generateAllDatesArrayModel() {
    this.selectedDates = [];
    this.hiatusArray.sort(function (a, b) {
      var c = new Date(a);
      var d = new Date(b);
      return c.getTime() - d.getTime()
    })
    let dumyArray: any = "";
    for (let k = 0; k < this.hiatusArray.length; k++) {
      if (dumyArray === "") {
        dumyArray = this.hiatusArray[k].toString();
      }
      let nxtDay = new Date(this.hiatusArray[k]);
      nxtDay.setDate(nxtDay.getDate() + 1);
      if (new Date(nxtDay).getTime() === new Date(this.hiatusArray[k + 1]).getTime()) {
        if (dumyArray.indexOf('-') <= 0) {
          dumyArray += "-"
        }
      } else {
        if (dumyArray.indexOf('-') > 0) {
          dumyArray += this.hiatusArray[k].toString();
        }
        this.selectedDates.push(dumyArray);
        dumyArray = "";
      }
    }
    if (!this.isInitialOpen) {
      this.inputValue = this.selectedDates.toString();
      this.onDirtySelect.emit(true);
      this.propagateChange(this.inputValue);
    } else {
      this.selectedDates = this.inputValue.split(',');
      //this.onDirtySelect.emit(true);
      this.propagateChange(this.inputValue);
    }
  }

  getDatesBetweenTwoDates(stDt, enDt) {
    var dates = [],
      currentDate = stDt,
      addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
    while (currentDate <= enDt) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  }

  changeTheSelectedDateBackground(id, comp = null, type = null) {
    if (id && id !== '') {
      let ele = document.getElementById(id);
      let splitDate = id.split('_');
      let selectedDate = this.month.indexOf(splitDate[2]) + 1 + '/' + splitDate[4] + '/' + splitDate[1];
      selectedDate = this.formatDate(selectedDate);
      //CODE FOR SINGLE SELECTION
      if (this.isSingleSelect) {
        if (this.selectedDates.length > 0) {
          if (this.selectedDates.length === 1 && this.selectedDates[0].indexOf('-') < 0) {
            if (new Date(this.selectedDates[0]).getTime() > new Date(selectedDate).getTime()) {
              let newDate = selectedDate + '-' + this.selectedDates[0];
              this.selectedDates.pop();
              this.selectedDates.push(newDate.toString());
            } else {
              let newDate = this.selectedDates[0] + '-' + selectedDate;
              this.selectedDates.pop();
              this.selectedDates.push(newDate.toString());
            }
            this.selectRangeDateForSingleSelect(this.selectedDates[0].split('-')[0], this.selectedDates[0].split('-')[1]);
            //this.showCalendar = !this.showCalendar;
          } else if (this.selectedDates[0].indexOf('-') >= 0) {
            this.cellHoverArray = [];
            let dateArray = this.selectedDates[0].split('-');
            let deleteDate1 = new Date(dateArray[0]);
            let deleteDate2 = new Date(dateArray[1]);
            this.deselectRangeDateForSingleSelect(deleteDate1, deleteDate2);
            this.selectedDates.pop();
            this.selectedDates.push(selectedDate.toString());
            this.changeTheColorOfTheCellOnSelect(ele);
          }
        } else {
          this.selectedDates.push(selectedDate.toString());
          this.changeTheColorOfTheCellOnSelect(ele);
        }
        this.inputValue = this.selectedDates.toString();
        this.propagateChange(this.inputValue);
      } else {
        if (ele && ele !== null) {
          if (this.hiatusArray.indexOf(selectedDate.toString()) >= 0 && type !== 'select') { //Deselecting individual data
            //this.selectedDates.splice(this.selectedDates.indexOf(selectedDate.toString()),1);
            this.hiatusArray.splice(this.hiatusArray.indexOf(selectedDate.toString()), 1);
            if (this.weekSelectArray.length > 0 && (comp === 'column' || comp === 'single')) {
              this.deselectHiatusWeek();
            }
            this.changeTheColorOfTheCellOnDeselect(ele);
            //} else if(this.isDateIsinRange(selectedDate)){ // Deselecting range date

          } else { // Select the date
            if (this.hiatusArray.indexOf(selectedDate) < 0 && type === 'select') {
              this.hiatusArray.push(selectedDate.toString());
              //this.selectedDates.push(selectedDate.toString());
              this.changeTheColorOfTheCellOnSelect(ele);
            } else {
              this.changeTheColorOfTheCellOnSelect(ele);
            }
          }
          this.generateAllDatesArrayModel();
        }
      }
    }
  }

  private deselectHiatusWeek(){
    let that = this;
    let weekSelectedArr = JSON.parse(JSON.stringify(this.weekSelectArray));
    weekSelectedArr.forEach(function (ele) {
      let val = ele.split('-');
      let d1 = (that.month.indexOf(val[0].split('_')[1]) + 1) + '/' + val[0].split('_')[2] + '/' + val[0].split('_')[0];
      let d2 = (that.month.indexOf(val[1].split('_')[1]) + 1) + '/' + val[1].split('_')[2] + '/' + val[1].split('_')[0];
      let d = that.getDatesBetweenTwoDates(new Date(d1), new Date(d2));
      let dumArr = [];
      for (let a = 0; a < d.length; a++) {
        let dId = d[a].getMonth() === 0 ? "01" : ("0" + (d[a].getMonth() + 1)).slice(-2) + '/' + ("0" + d[a].getDate()).slice(-2) + '/' + d[a].getFullYear();
        dumArr.push(dId);
      }
      let found = dumArr.some(r => that.hiatusArray.indexOf(r) === -1);
      if (found) {
        let id = document.getElementById(ele);
        if (id) {
          id.style.backgroundColor = 'lightgray';
          that.weekSelectArray.splice(that.weekSelectArray.indexOf(ele), 1);
        }
      }
    })
  }

  //SINGLE SELECT CODE //////////////// SINGLE SELECT CODE ///////////////////////////
  changeTheColorForRangeSelectionSingleSelect(id, type) {
    let ele = document.getElementById(id);
    let selectedDate = id.split('_');
    selectedDate = this.month.indexOf(selectedDate[1]) + 1 + '/' + selectedDate[3] + '/' + selectedDate[0];
    selectedDate = this.formatDate(selectedDate);
    if (type === 'select' && ele) {
      this.changeTheColorOfTheCellOnSelect(ele);
    } else if (ele) {
      this.changeTheColorOfTheCellOnDeselect(ele);
    }
  }

  deselectRangeDateForSingleSelect(date1, date2) {
    let diff = Math.round((Date.parse(date2) - Date.parse(date1)) / 86400000) + 1;
    let curDate = new Date(date1);
    for (let j = 0; j < diff; j++) {
      let tomDate = new Date(curDate);
      tomDate.setDate(curDate.getDate() + j);
      let day = (tomDate.getDay() === 0) ? this.day[6] : this.day[tomDate.getDay() - 1];
      let dateId = this.fieldName + '_' + tomDate.getFullYear() + '_' + this.month[tomDate.getMonth()] + '_' + day + '_' + tomDate.getDate();
      if (dateId) {
        this.changeTheColorForRangeSelectionSingleSelect(dateId, 'deselect');
      }
    }
  }

  selectRangeDateForSingleSelect(date1, date2) {
    let diff = Math.round((Date.parse(date2) - Date.parse(date1)) / 86400000) + 1;
    let curDate = new Date(date1);
    for (let j = 0; j < diff; j++) {
      let tomDate = new Date(curDate);
      tomDate.setDate(curDate.getDate() + j);
      let day = (tomDate.getDay() === 0) ? this.day[6] : this.day[tomDate.getDay() - 1];
      let dateId = this.fieldName + '_' + tomDate.getFullYear() + '_' + this.month[tomDate.getMonth()] + '_' + day + '_' + tomDate.getDate();
      if (dateId) {
        this.changeTheColorForRangeSelectionSingleSelect(dateId, 'select');
      }
    }
    this.startDateSelected.emit(curDate);
  }

  //HIATUS DATE CODE //////////////////// HIATUS DATE CODE //////////////////////////

  // isDateIsinRange(selectedDate){ // deselect range dates
  //   let bol = false;
  //   for(let i=0; i<this.selectedDates.length; i++){
  //     let date = this.selectedDates[i];
  //     if(date.indexOf("-") >= 0){
  //       date = date.split("-");
  //       if(Date.parse(date[1]) >= Date.parse(selectedDate) && Date.parse(date[0]) <= Date.parse(selectedDate)){
  //         let newDate = this.selectedDates[i].split('-');
  //         let tomDate = new Date();
  //         let previousDate = new Date();
  //         this.selectedDates.splice(i,1);
  //         if(Date.parse(selectedDate) === Date.parse(newDate[0])){
  //           tomDate = new Date(newDate[0]);
  //           tomDate.setDate(new Date(newDate[0]).getDate() + 1);
  //           if(Date.parse((Number(tomDate.getMonth())+1)+'/'+tomDate.getDate()+'/'+tomDate.getFullYear()) === Date.parse(newDate[1])){
  //             this.selectedDates.push(newDate[1]);
  //           } else {
  //             this.selectedDates.push((Number(tomDate.getMonth())+1)+'/'+tomDate.getDate()+'/'+tomDate.getFullYear()+'-'+newDate[1]);
  //           }
  //         } else if(Date.parse(selectedDate) === Date.parse(newDate[1])){
  //           previousDate = new Date(newDate[1]);
  //           previousDate.setDate(new Date(newDate[1]).getDate() - 1);
  //           if(Date.parse((Number(previousDate.getMonth())+1)+'/'+previousDate.getDate()+'/'+previousDate.getFullYear()) === Date.parse(newDate[0])){
  //             this.selectedDates.push(newDate[0]);
  //           } else {
  //             this.selectedDates.push(newDate[0]+'-'+(Number(previousDate.getMonth())+1)+'/'+previousDate.getDate()+'/'+previousDate.getFullYear());
  //           }
  //         } else {
  //           tomDate = new Date(selectedDate);
  //           previousDate = new Date(selectedDate);
  //           tomDate.setDate(new Date(selectedDate).getDate() + 1);
  //           previousDate.setDate(new Date(selectedDate).getDate() - 1);
  //           if(Date.parse((Number(tomDate.getMonth())+1)+'/'+tomDate.getDate()+'/'+tomDate.getFullYear()) === Date.parse(newDate[1])){
  //             this.selectedDates.push(newDate[1]);
  //           } else {
  //             this.selectedDates.push((Number(tomDate.getMonth())+1)+'/'+tomDate.getDate()+'/'+tomDate.getFullYear()+'-'+newDate[1]);
  //           }
  //           if(Date.parse((Number(previousDate.getMonth())+1)+'/'+previousDate.getDate()+'/'+previousDate.getFullYear()) === Date.parse(newDate[0])){
  //             this.selectedDates.push(newDate[0]);
  //           } else {
  //             this.selectedDates.push(newDate[0]+'-'+(Number(previousDate.getMonth())+1)+'/'+previousDate.getDate()+'/'+previousDate.getFullYear());
  //           }
  //         }
  //         this.generateAllDatesArrayModel();
  //         let day = (new Date(selectedDate).getDay() === 0) ? 6 : (new Date(selectedDate).getDay() - 1)
  //         let dateId = this.fieldName+'_'+new Date(selectedDate).getFullYear()+'_'+this.month[new Date(selectedDate).getMonth()]+'_'+this.day[day]+'_'+new Date(selectedDate).getDate();
  //         let deleteEle = document.getElementById(dateId);
  //         this.changeTheColorOfTheCellOnDeselect(deleteEle);
  //         bol = true;
  //         return bol;
  //       }
  //     }
  //   }
  //   return bol;
  // }

  loopToBisectRangeDateAndSelectOrDeselect(diff, curDate, element = null, eleType = null, type = null) {
    for (let j = 0; j < diff; j++) {
      let tomDate = new Date(curDate);
      tomDate.setDate(curDate.getDate() + j);
      let day = (tomDate.getDay() === 0) ? this.day[6] : this.day[tomDate.getDay() - 1];
      let dateId = this.fieldName + '_' + tomDate.getFullYear() + '_' + this.month[tomDate.getMonth()] + '_' + day + '_' + tomDate.getDate();
      if (dateId) {
        //this.changeTheColorForRangeSelection(dateId, type);
        this.changeTheSelectedDateBackground(dateId, element, type)
      }
    }

    //this.generateInputValueForRangeSelection(type);
  }


  //   generateInputValueForRangeSelection(type){
  //     let index = 0;
  //     for(let k=0; k<this.hiatusArray.length; k++){
  //       let lastSelectedDate;
  //       if(this.selectedDates.length > 0){
  //         lastSelectedDate = (this.selectedDates[this.selectedDates.length - 1].toString().indexOf('-') > 0) ? this.selectedDates[this.selectedDates.length - 1].toString().split('-')[1] : this.selectedDates[this.selectedDates.length - 1];
  //       }

  //       if(lastSelectedDate === this.hiatusArray[k]){
  //         index = k + 1;
  //       }
  //     }
  //     if(type === 'select'){
  //       this.selectedDates.push(this.hiatusArray[index]+'-'+this.hiatusArray[this.hiatusArray.length - 1]);
  //       this.inputValue = this.selectedDates.toString();
  //       this.hiatusArray = [];
  //       this.propagateChange(this.inputValue);
  //     } else {
  //       this.selectedDates.splice(this.selectedDates.indexOf(this.hiatusArray[index]+'-'+this.hiatusArray[this.hiatusArray.length - 1]),1);
  //       this.inputValue = this.selectedDates.toString();
  //       this.hiatusArray = [];
  //       this.propagateChange(this.inputValue);
  //     }
  //   }

  changeTheColorForRangeSelection(id, type) {
    let ele = document.getElementById(id);
    let selectedDate = id.split('_');
    selectedDate = this.month.indexOf(selectedDate[1]) + 1 + '/' + selectedDate[3] + '/' + selectedDate[0];
    selectedDate = this.formatDate(selectedDate);
    if (type === 'select' && ele) {
      this.hiatusArray.push(this.formatDate((this.month.indexOf(id.split('_')[2]) + 1) + '/' + id.split('_')[4] + '/' + id.split('_')[1]));
      this.changeTheColorOfTheCellOnSelect(ele);
    } else if (ele) {
      this.hiatusArray.splice(this.hiatusArray.indexOf(this.formatDate((this.month.indexOf(id.split('_')[2]) + 1) + '/' + id.split('_')[4] + '/' + id.split('_')[1]), 1));
      this.changeTheColorOfTheCellOnDeselect(ele);
    }
  }



  deselectRangeDate(date1, date2) {
    //this.deselect = true;
    let diff = Math.round((Date.parse(date2) - Date.parse(date1)) / 86400000) + 1;
    let curDate = new Date(date1);
    this.loopToBisectRangeDateAndSelectOrDeselect(diff, curDate, 'deselect');
  }

  selectRangeDate(date1, date2) {
    let diff = Math.round((Date.parse(date2) - Date.parse(date1)) / 86400000) + 1;
    let curDate = new Date(date1);
    if (this.weekSelectArray.length > 0) {
      for (let k = 0; k < this.weekSelectArray.length; k++) {
        let ele = document.getElementById(this.weekSelectArray[k]);
        if (ele) {
          ele.style.backgroundColor = 'green';
        }
      }
    }
    for (let j = 0; j < diff; j++) {
      let tomDate = new Date(curDate);
      tomDate.setDate(curDate.getDate() + j);
      let day = (tomDate.getDay() === 0) ? this.day[6] : this.day[tomDate.getDay() - 1];
      let dateId = this.fieldName + '_' + tomDate.getFullYear() + '_' + this.month[tomDate.getMonth()] + '_' + day + '_' + tomDate.getDate();
      if (dateId) {
        this.changeTheColorForRangeSelection(dateId, 'select');
      }
    }
    this.startDateSelected.emit(curDate);
  }

  getCellStyle(year, month, date, ri) {
    if (this.minDate && this.maxDate) {
      let mon = 0;
      if (Number(ri) === 0) {
        if (Number(date) > 20) {
          mon = this.month.indexOf(month);
        } else {
          mon = this.month.indexOf(month) + 1;
        }
      } else {
        mon = this.month.indexOf(month) + 1;
      }
      let d = new Date(mon + '/' + date + '/' + year);
      if (this.isSingleSelect) {
        let minProjdate = new Date();
        minProjdate.setDate(new Date(minProjdate).getDate() - 1);
        if (new Date(minProjdate).getTime() > d.getTime()) {
          return "lightgray";
        }
      } else {
        if (new Date(this.minDate).getTime() > d.getTime() || new Date(this.maxDate).getTime() < d.getTime()) {
          return "lightgray";
        } else {
          if (!this.isSingleSelect) {
            return "white";
          }
        }
      }
    }
  }

  getCellStyleForHiatus(year, month, date, ri) {
    if (this.minDate && this.maxDate && !this.isSingleSelect) {
      let mon = 0;
      if (Number(ri) === 0) {
        if (Number(date) > 20) {
          mon = this.month.indexOf(month);
        } else {
          mon = this.month.indexOf(month) + 1;
        }
      } else {
        mon = this.month.indexOf(month) + 1;
      }
      let d = new Date(mon + '/' + date + '/' + year);
      if (new Date(this.minDate).getTime() > d.getTime() || new Date(this.maxDate).getTime() < d.getTime()) {

      } else if (!isNaN(d.getTime())) {
        return "green";
      }
    }
  }

  getCellId(year, month, day, date, ri) {
    if (this.minDate && this.maxDate && !this.isSingleSelect) {
      let mon = 0;
      if (Number(ri) === 0) {
        if (Number(date) > 20) {
          mon = this.month.indexOf(month);
          if (mon === 0) {
            mon = 12;
            year = year - 1;
          }
        } else {
          mon = this.month.indexOf(month) + 1;
        }
      } else {
        mon = this.month.indexOf(month) + 1;
      }
      let d = new Date(mon + '/' + date + '/' + year);

      if (new Date(this.minDate).getTime() > d.getTime() || new Date(this.maxDate).getTime() < d.getTime()) {
        return "";
      } else {
        if (Number(ri) === 0) {
          if (Number(date) > 20) {
            month = this.month[this.month.indexOf(month) - 1];
            if (month === undefined) {
              month = "Dec";
            }
            return this.fieldName + '_' + year + '_' + month + '_' + day + '_' + date;
          } else {
            return this.fieldName + '_' + year + '_' + month + '_' + day + '_' + date;
          }
        } else {
          return this.fieldName + '_' + year + '_' + month + '_' + day + '_' + date;
        }
      }
    } else {
      let mon = 0;
      if (Number(ri) === 0) {
        if (Number(date) > 20) {
          mon = this.month.indexOf(month);
          if (mon === 0) {
            mon = 12;
            year = year - 1;
          }
        } else {
          mon = this.month.indexOf(month) + 1;
        }
      } else {
        mon = this.month.indexOf(month) + 1;
      }
      let d = new Date(mon + '/' + date + '/' + year);
      let minProjdate = new Date();
      minProjdate.setDate(new Date(minProjdate).getDate() - 1);
      if (new Date(minProjdate).getTime() > d.getTime()) {
        return "";
      } else {
        if (Number(ri) === 0) {
          if (Number(date) > 20) {
            month = this.month[this.month.indexOf(month) - 1];
            if (month === undefined) {
              month = "Dec";
            }
            return this.fieldName + '_' + year + '_' + month + '_' + day + '_' + date;
          } else {
            return this.fieldName + '_' + year + '_' + month + '_' + day + '_' + date;
          }
        } else {
          return this.fieldName + '_' + year + '_' + month + '_' + day + '_' + date;
        }
      }
    }
  }

  onCalendarShow() {
    this.isInitialOpen = true;
    let that = this;
    setTimeout(function () {
      that.onCalendarShowSelectDate();
    }, 1000)
  }

  generateWeeklyArrayOnInitialClick(d1, d2, diff) {
    let numberOfWeek = Math.floor(diff / 7);
    let year = d1.getFullYear();
    let mon = this.month[d1.getMonth()];
    let dt1 = d1.getDate();
    if (numberOfWeek === 1) {
      let dt2 = d2.getDate();
      let id = d1.getFullYear() + '_' + this.month[d1.getMonth()] + '_' + dt1 + '-' + d2.getFullYear() + '_' + this.month[d2.getMonth()] + '_' + dt2;
      if (this.weekSelectArray.indexOf(id) < 0) {
        this.weekSelectArray.push(id);
      }
    } else {
      for (let z = 1; z <= numberOfWeek; z++) {
        let dt3 = new Date(d1.setDate(d1.getDate() + 7));
        let dt4 = new Date(dt3.setDate(dt3.getDate() - 7));
        let dt5 = new Date(dt3);
        dt5.setDate(dt3.getDate() + 6)
        let id1 = dt3.getFullYear() + '_' + this.month[dt3.getMonth()] + '_' + dt3.getDate() + '-' + dt5.getFullYear() + '_' + this.month[dt5.getMonth()] + '_' + dt5.getDate();
        if (this.weekSelectArray.indexOf(id1) < 0) {
          this.weekSelectArray.push(id1);
        }
      }
    }
  }

  onCalendarShowSelectDate() {
    let that = this;
    if (this.selectedDates.length > 0) {
      this.selectedDates.forEach(function (ele) {
        if (ele.indexOf('-') >= 0) {
          let rDate = ele.split('-');
          if (!that.isSingleSelect) {
            let diff = Math.ceil((new Date(rDate[1]).getTime() - new Date(rDate[0]).getTime()) / (1000 * 3600 * 24)) + 1;
            if (diff >= 7 && new Date(rDate[0]).getDay() === 1) {
              that.generateWeeklyArrayOnInitialClick(new Date(rDate[0]), new Date(rDate[1]), diff);
            }
            that.loopToBisectRangeDateAndSelectOrDeselect(diff, new Date(rDate[0]), 'ele', 'ele', 'select');
          } else {
            that.selectRangeDate(rDate[0], rDate[1]);
          }
        } else {
          let individualDate = new Date(ele);
          let day = (individualDate.getDay() === 0) ? that.day[6] : that.day[individualDate.getDay() - 1];
          let dateId = that.fieldName + '_' + individualDate.getFullYear() + '_' + that.month[individualDate.getMonth()] + '_' + day + '_' + individualDate.getDate();
          that.changeTheSelectedDateBackground(dateId, 'ele', 'select');
        }
      });
    }
    if (this.weekSelectArray.length > 0) {
      this.deselectHiatusWeek();
      // let that = this;      
      // weekSelectedArr.forEach(function (ele) {
      //   let val = ele.split('-');
      //   let d1 = (that.month.indexOf(val[0].split('_')[1]) + 1) + '/' + val[0].split('_')[2] + '/' + val[0].split('_')[0];
      //   let d2 = (that.month.indexOf(val[1].split('_')[1]) + 1) + '/' + val[1].split('_')[2] + '/' + val[1].split('_')[0];
      //   let d = that.getDatesBetweenTwoDates(new Date(d1), new Date(d2));
      //   let dumArr = [];
      //   for (let a = 0; a < d.length; a++) {
      //     let dId = d[a].getMonth() === 0 ? "01" : ("0"+(d[a].getMonth() + 1)).slice(-2) + '/' + ("0"+d[a].getDate()).slice(-2) + '/' + d[a].getFullYear();
      //     dumArr.push(dId);
      //   }
      //   let found = dumArr.some(r => that.hiatusArray.indexOf(r) === -1);
      //   if (found) {
      //     let id = document.getElementById(ele);
      //     if (id) {
      //       id.style.backgroundColor = 'lightgray';
      //       that.weekSelectArray.splice(that.weekSelectArray.indexOf(ele), 1);
      //     }
      //   }
      // })
    }
    if (this.weekSelectArray.length > 0 && this.selectedDates.length > 0) {
      this.weekSelectArray.forEach(function (ele) {
        let el = document.getElementById(ele);
        if (el) {
          el.style.backgroundColor = 'orange';
        }
      });
    }
    this.isInitialOpen = false;
  }

  onCalendarHide() {
    this.startOfTheMonth = '';
    this.endOfTheMonth = '';
    this.hiatusArray = [];
    this.cellHoverArray = [];
    if (this.isSingleSelect && this.showAsRange) {
      if (this.inputValue.indexOf('-') < 0 && this.inputValue !== '') {
        this.inputValue = this.inputValue + '-' + this.inputValue;
        this.propagateChange(this.inputValue);
      }
      this.maxDate = undefined;
    }
    if (this.fieldName == "flStartDate" && this.inputValue.localeCompare(this.lastlySelectedFlightDt) != 0) {
      this.lastlySelectedFlightDt = this.inputValue;
      this.flightDtChange.emit(this.inputValue);
    }
  }

  renderModifiedDate(value) {
    this.selectedDates = [];
    this.weekSelectArray = [];
    let inputVal = typeof(value) == "object" ? value.toString() : value;
    this.inputValue = inputVal;
    typeof(value) != "object" ? this.selectedDates.push(value) : this.selectedDates = value;
    this.propagateChange(this.inputValue);
  }

  onShowCalendarClick() {
    this.showCalendar = !this.showCalendar;
    this.yearArray = this.generateYearArray();
  }

  flightChange(evt) {
    if (this.fieldName === "flStartDate") {
      this.flightDtChange.emit(this.inputValue);
    }
  }
  onFocusOut(evt) {
    evt.target.value = String(evt.target.value).replace(/\s+/g, '');
    if (evt.target.value != '') {
      this.selectedDates = evt.target.value.split(',');
      this.inputValue = this.selectedDates.toString();
      // for(let k=0; k<this.selectedDates.length; k++){
      //     if(this.selectedDates[k].indexOf('-') >= 0){
      //         let date = this.selectedDates[k].split('-');
      //         if(!this.isSingleSelect){
      //             this.selectRangeDate(date[0], date[1]);
      //         } else {
      //             for(let n=0; n<=1; n++){
      //                 let individualDate = new Date(date[n]);
      //                 let day = (individualDate.getDay() === 0) ? this.day[6] : this.day[individualDate.getDay() - 1];
      //                 let dateId = this.fieldName+'_'+individualDate.getFullYear()+'_'+this.month[individualDate.getMonth()]+'_'+day+'_'+individualDate.getDate();
      //                 this.changeTheColorForRangeSelection(dateId,'select')
      //             }
      //         }
      //     } else {
      //         let individualDate = new Date(this.selectedDates[k]);
      //         let day = (individualDate.getDay() === 0) ? this.day[6] : this.day[individualDate.getDay() - 1];
      //         let dateId = this.fieldName+'_'+individualDate.getFullYear()+'_'+this.month[individualDate.getMonth()]+'_'+day+'_'+individualDate.getDate();
      //         this.changeTheColorForRangeSelection(dateId,'select')
      //     }
      // }
      this.propagateChange(this.inputValue);
    } else if (evt.target.value === '') {
      this.selectedDates = [];
      this.inputValue = this.selectedDates.toString();
      this.propagateChange(this.inputValue);
    }
  }

  rowButtonId(data, ri) {
    if (Number(ri) === 0) {
      if (Number(data.data[ri].mon) > 20) {
        let month = this.month[this.month.indexOf(data.month) - 1];
        return data.year + '_' + month + '_' + data.data[ri].mon + '-' + data.year + '_' + data.month + '_' + data.data[ri].sun;
      } else {
        return data.year + '_' + data.month + '_' + data.data[ri].mon + '-' + data.year + '_' + data.month + '_' + data.data[ri].sun;
      }
    } else {
      return data.year + '_' + data.month + '_' + data.data[ri].mon + '-' + data.year + '_' + data.month + '_' + data.data[ri].sun;
    }
  }

  onMonthSelect(data, evt) {
    let month = (data.data[0]['mon'] > 20) ? this.month.indexOf(data.month) : (this.month.indexOf(data.month) + 1);
    let startDate = month + '/' + data.data[0]['mon'] + '/' + data.year;
    startDate = this.formatDate(startDate);
    let endDate = (this.month.indexOf(data.month) + 1) + '/' + data.data[data.data.length - 1]['sun'] + '/' + data.year;
    endDate = this.formatDate(endDate);
    if (new Date(startDate).getTime() < new Date(this.maxDate).getTime() && new Date(endDate).getTime() > new Date(this.minDate).getTime()) {
      if (!this.isSingleSelect) {
        if (this.monthSelectArray.length > 0 && this.monthSelectArray.indexOf(month + '_' + data.year) >= 0) {
          if (this.weekSelectArray.length > 0) {
            let that = this;
            let dumArr = [];
            this.weekSelectArray.forEach(function (val) {
              if (val.split('_')[3] === data.month && Number(data.year) === Number(val.split('_')[0])) {
                dumArr.push(val);
                let ele = document.getElementById(val);
                ele.style.backgroundColor = 'lightgray';
              }
            });
            if (dumArr.length > 0) {
              dumArr.forEach(function (val) {
                let idx = that.weekSelectArray.indexOf(val);
                if (idx != -1) {
                  that.weekSelectArray.splice(idx, 1)
                }
              });
            }
          }


          this.monthSelectArray.splice(this.monthSelectArray.indexOf(month + '_' + data.year));
          this.loopToBisectRangeDateAndSelectOrDeselect(data.data.length * 7, new Date(startDate), 'ele', 'month', 'deselect');
        } else {
          this.monthSelectArray.push(month + '_' + data.year);
          this.loopToBisectRangeDateAndSelectOrDeselect(data.data.length * 7, new Date(startDate), 'ele', 'month', 'select');
        }
      }
    }
    // if(this.weekSelectArray.length > 0 && this.weekSelectArray.toString().indexOf(data.month) > 0){
    //     this.hiatusArray.forEach(ele=>{
    //         if(new Date(ele).getTime() >= new Date(startDate).getTime() && new Date(ele).getTime() <= new Date(endDate).getTime()){
    //             this.hiatusArray.splice(this.hiatusArray.indexOf(ele), 1);
    //         }
    //     });
    // }

    // if(new Date(startDate).getTime() < new Date(this.maxDate).getTime() && new Date(endDate).getTime() > new Date(this.minDate).getTime()){
    //     if(!this.isSingleSelect){
    //         let alreadySelected = false;
    //         let weekDummyArray = [];
    //         if(this.monthSelectArray.length > 0 && this.monthSelectArray.indexOf(month+'_'+data.year) >= 0){
    //             alreadySelected = true;
    //             if(this.weekSelectArray.length > 0){
    //                 let len = this.weekSelectArray.length;
    //                 for(let i=0; i< len; i++){
    //                     if(this.weekSelectArray[i].toString().indexOf(data.month) > 0){
    //                         let ele = document.getElementById(this.weekSelectArray[i]);
    //                         weekDummyArray.push(this.weekSelectArray[i])
    //                         ele.style.backgroundColor = 'lightgray';
    //                         let selectedDate = this.weekSelectArray[i].split('-');
    //                         let stDate = selectedDate[0].split('_');
    //                         let enDate = selectedDate[1].split('_');
    //                         let startDate = (this.month.indexOf(stDate[1]) + 1)+'/'+stDate[2]+'/'+stDate[0];
    //                         let endDate = (this.month.indexOf(enDate[1]) + 1)+'/'+enDate[2]+'/'+enDate[0];
    //                         //this.weekSelectArray.splice(this.weekSelectArray.indexOf(this.weekSelectArray[i]), 1);
    //                         this.selectedDates.splice(this.selectedDates.indexOf(startDate+'-'+endDate),1);
    //                     }
    //                 }
    //             }
    //         } else if(evt.target.className == ''){
    //             evt.target.className = "selected";
    //             alreadySelected = false;
    //             if(this.weekSelectArray.length > 0){
    //                 let len = this.weekSelectArray.length;
    //                 for(let i=0; i< len; i++){
    //                     if(this.weekSelectArray[i].toString().indexOf(data.month) > 0){
    //                         let ele = document.getElementById(this.weekSelectArray[i]);
    //                         weekDummyArray.push(this.weekSelectArray[i]);
    //                         ele.style.backgroundColor = 'lightgray';
    //                         let selectedDate = this.weekSelectArray[i].split('-');
    //                         let stDate = selectedDate[0].split('_');
    //                         let enDate = selectedDate[1].split('_');
    //                         let startDate = (this.month.indexOf(stDate[1]) + 1)+'/'+stDate[2]+'/'+stDate[0];
    //                         let endDate = (this.month.indexOf(enDate[1]) + 1)+'/'+enDate[2]+'/'+enDate[0];
    //                         //this.weekSelectArray.splice(this.weekSelectArray.indexOf(this.weekSelectArray[i]), 1);
    //                         this.selectedDates.splice(this.selectedDates.indexOf(startDate+'-'+endDate),1);
    //                     }
    //                 }
    //             }
    //         } else {
    //             alreadySelected = true;
    //             evt.target.className = "";
    //         }

    //         if(weekDummyArray.length > 0){
    //             for(let l=0; l<weekDummyArray.length; l++){
    //                 this.weekSelectArray.splice(weekDummyArray[l]);
    //             }
    //         }

    //         // let selectedDateRange = (startDate+'-'+endDate);
    //         // if(this.selectedDates.indexOf(selectedDateRange) >= 0){
    //         //     alreadySelected = true;
    //         // }
    //         if(!alreadySelected){
    //             this.loopToBisectRangeDateAndSelectOrDeselect(data.data.length * 7, new Date(startDate), 'select');
    //             this.monthSelectArray.push(month+'_'+data.year);
    //         } else {
    //             this.loopToBisectRangeDateAndSelectOrDeselect(data.data.length * 7, new Date(startDate), 'deselect');
    //             this.monthSelectArray.splice(this.monthSelectArray.indexOf(month+'_'+data.year));
    //         }
    //         // if(alreadySelected){
    //         //     this.selectedDates.splice(this.selectedDates.indexOf(selectedDateRange),1);
    //         // } else {
    //         //     this.selectedDates.push(selectedDateRange);
    //         // }

    //         // this.inputValue = this.selectedDates.toString();
    //         // this.propagateChange(this.inputValue);
    //     }
    // }
  }

  columnHeaderClick(data, type) {
    if (this.monthSelectArray.indexOf(this.month.indexOf(data.month) === 0 ? 1 : this.month.indexOf(data.month) + '_' + data.year) < 0) {
      //let alreadySelected = false;
      let month = (data.data[0][type] > 20) ? this.month.indexOf(data.month) : (this.month.indexOf(data.month) + 1);
      for (let j = 0; j < data.data.length; j++) {
        let month = '';
        let id = '';
        if (j == 0 && data.data[j][type] > 20) {
          month = this.month[this.month.indexOf(data.month) - 1];
        } else {
          month = data.month;
        }
        id = this.fieldName + '_' + data.year + '_' + month + '_' + type + '_' + data.data[j][type];
        let columnId = data.year + '_' + month + '_' + data.data[j][type];
        if (this.columnClickArray.indexOf(columnId) >= 0) {
          this.columnClickArray.splice(this.columnClickArray.indexOf(columnId), 1);
          this.changeTheSelectedDateBackground(id, 'column', 'deselect');
        } else {
          this.columnClickArray.push(columnId);
          this.changeTheSelectedDateBackground(id, 'ele', 'select');
        }

        // let ele = document.getElementById(id);
        // if(ele){
        //     if(this.selectedDates.indexOf((this.month.indexOf(id.split('_')[2])+1)+'/'+id.split('_')[4]+'/'+id.split('_')[1]) >= 0){
        //         alreadySelected = true;
        //         this.hiatusArray.push((this.month.indexOf(id.split('_')[2])+1)+'/'+id.split('_')[4]+'/'+id.split('_')[1]);
        //         this.changeTheColorOfTheCellOnDeselect(ele);
        //     } else {
        //         alreadySelected = false;
        //         this.hiatusArray.push((this.month.indexOf(id.split('_')[2])+1)+'/'+id.split('_')[4]+'/'+id.split('_')[1]);
        //         this.changeTheColorOfTheCellOnSelect(ele);
        //     }
        // }
      }
      // if(alreadySelected){
      //     for(let l=0; l<this.hiatusArray.length; l++){
      //         this.selectedDates.splice(this.selectedDates.indexOf(this.hiatusArray[l]),1);
      //     }
      // } else {
      //     for(let k=0; k<this.hiatusArray.length; k++){
      //         if(this.selectedDates.indexOf(this.hiatusArray[k]) < 0){
      //             this.selectedDates.push(this.hiatusArray[k]);
      //         }
      //     }
      // }
      // this.hiatusArray = [];
      // this.inputValue = this.selectedDates.toString();
      // this.propagateChange(this.inputValue);
    }

  }

  onRowSelectClick(evt) {
    let dateRange = evt.target.id.split('-');
    let startDate = dateRange[0].split('_');
    let endDate = dateRange[1].split('_');
    let diff = 7;
    if (this.monthSelectArray.indexOf((this.month.indexOf(endDate[1]) === 0 ? 1 : this.month.indexOf(endDate[1])) + '_' + endDate[0]) < 0) {
      let curStartDate = new Date(startDate[0], this.month.indexOf(startDate[1]), startDate[2]);
      let lastDate = new Date(endDate[0], this.month.indexOf(endDate[1]), endDate[2]);
      if (new Date(curStartDate).getTime() < new Date(this.maxDate).getTime() && new Date(lastDate).getTime() > new Date(this.minDate).getTime()) {
        diff = Math.ceil((new Date(lastDate).getTime() - new Date(curStartDate).getTime()) / (1000 * 3600 * 24)) + 1;
        if (evt.target.style.backgroundColor === 'lightgray') {
          this.loopToBisectRangeDateAndSelectOrDeselect(diff, curStartDate, evt.target, 'rowSelect', 'select');
          this.weekSelectArray.push(evt.target.id);
          evt.target.style.backgroundColor = 'orange';
        } else {
          this.loopToBisectRangeDateAndSelectOrDeselect(diff, curStartDate, evt.target, 'rowSelect', 'deselect');
          this.weekSelectArray.splice(this.weekSelectArray.indexOf(evt.target.id), 1);
          evt.target.style.backgroundColor = 'lightgray';
        }
      }
    }
  }

  nextYear() {
    if (this.startOfTheMonth === '') {
      this.startOfTheMonth = this.maxDate;
      let lastDate = new Date(this.startOfTheMonth);
      lastDate.setMonth(lastDate.getMonth() + 13);
      this.endOfTheMonth = (lastDate.getMonth() === 0 ? 1 : lastDate.getMonth()) + '/' + lastDate.getDate() + '/' + lastDate.getFullYear();
    } else {
      this.startOfTheMonth = this.endOfTheMonth;
      let lastDate = new Date(this.startOfTheMonth);
      lastDate.setMonth(lastDate.getMonth() + 13);
      this.endOfTheMonth = (lastDate.getMonth() === 0 ? 1 : lastDate.getMonth()) + '/' + lastDate.getDate() + '/' + lastDate.getFullYear();
    }
    if (this.isSingleSelect) {
      this.maxDate = this.endOfTheMonth;
    }
    this.yearArray = this.changeYear(this.startOfTheMonth, this.endOfTheMonth);
    if (this.isSingleSelect) {
      this.cellHoverArray = [];
      if (this.selectedDates.length > 0 && this.selectedDates[0].indexOf('-') > 0) {
        this.onCalendarShow();
      }
    } else {
      this.onCalendarShow();
    }
  }

  prevYear() {
    let that = this;
    if (this.startOfTheMonth === '') {
      this.endOfTheMonth = this.minDate;
      let lastDate = new Date(this.endOfTheMonth);
      lastDate.setMonth(lastDate.getMonth() - 11);
      this.startOfTheMonth = (lastDate.getMonth() === 0 ? 1 : lastDate.getMonth()) + '/' + lastDate.getDate() + '/' + lastDate.getFullYear();
    } else {
      this.endOfTheMonth = this.startOfTheMonth;
      let lastDate = new Date(this.endOfTheMonth);
      lastDate.setMonth(lastDate.getMonth() - 11);
      this.startOfTheMonth = (lastDate.getMonth() === 0 ? 1 : lastDate.getMonth()) + '/' + lastDate.getDate() + '/' + lastDate.getFullYear();
    }
    // if(this.isSingleSelect){
    //     this.minDate = this.startOfTheMonth;
    // }
    this.yearArray = this.changeYear(this.startOfTheMonth, this.endOfTheMonth);
    if (this.isSingleSelect) {
      this.cellHoverArray = [];
      if (this.selectedDates.length > 0 && this.selectedDates[0].indexOf('-') > 0) {
        this.onCalendarShow();
      } else {
        let individualDate = new Date(this.selectedDates[0]);
        let day = (individualDate.getDay() === 0) ? this.day[6] : this.day[individualDate.getDay() - 1];
        let dateId = this.fieldName + '_' + individualDate.getFullYear() + '_' + this.month[individualDate.getMonth()] + '_' + day + '_' + individualDate.getDate();
        setTimeout(function () {
          let ele = document.getElementById(dateId);
          if (ele) {
            that.changeTheColorOfTheCellOnSelect(ele);
          }
        }, 1000)
      }
    } else {
      this.onCalendarShow();
    }
  }

  changeYear(stDate, endDate) {
    this.startMonth = new Date(stDate).getMonth();
    this.endMonth = this.startMonth + 11;
    this.year = new Date(stDate).getFullYear();
    let tmp = []
    for (let i = this.startMonth; i <= this.endMonth; i++) {
      let k = i;
      if (i > 11) {
        if (i == 12) {
          this.year = this.year + 1;
        }
        k = i - (11 + 1);
      }
      this.curMon = this.month[k];
      this.daysOfMonth = [31, this.isLeapYear(this.year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      let prev = (k - 1 < 0) ? 11 : (k - 1);
      let startDate = this.extraDays[new Date(this.year, k, 1).getDay()];
      startDate = (Number(startDate) > 0) ? this.daysOfMonth[prev] - (startDate - 1) : 1;
      let endDate = new Date(this.year, k, this.daysOfMonth[k]).getDay();
      endDate = (Number(endDate) - 1 != 6) ? this.daysOfMonth[k] - endDate : this.daysOfMonth[k];
      tmp.push(this.getMonthArray(startDate, this.daysOfMonth[prev], endDate));
    }
    return tmp;
  }

  disableCalendar() {
    if (this.fieldName === 'hiatusDate') {
      let stDate: any;
      let endsDate: any;
      if (this.minDate === '') {
        return true;
      } else if (this.minDate.indexOf('-') > 0) {
        stDate = new Date(this.minDate.split('-')[0]).getTime();
        endsDate = new Date(this.maxDate.split('-')[1]).getTime();
      } else {
        stDate = new Date(this.minDate).getTime();
        endsDate = new Date(this.maxDate).getTime();
      }
      if (stDate === endsDate) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  onCellHover(evt) {
    if (this.isSingleSelect && this.selectedDates.length === 1 && this.selectedDates[0].indexOf('-') < 0) {
      if (this.cellHoverArray.length > 0) {
        this.cellHoverArray.forEach(function (ele) {
          ele.style.backgroundColor = "";
          if (ele.parentElement.parentElement.style.backgroundColor !== 'lightblue') {
            ele.style.color = "black";
          }
        })
      }
      this.cellHoverArray = [];
      let splitHoverDate = evt.target.id.split('_');
      let hoverDate = (this.month.indexOf(splitHoverDate[2]) + 1) + '/' + splitHoverDate[4] + '/' + splitHoverDate[1];
      if (new Date(this.selectedDates[0]).getTime() < new Date(hoverDate).getTime()) {
        let nxtDay = new Date(this.selectedDates[0]);
        nxtDay.setDate(nxtDay.getDate() + 1);
        let diff = ((Date.parse(hoverDate) - new Date(nxtDay).getTime()) / 86400000);
        for (let j = 0; j < diff; j++) {
          let tomDate = new Date(nxtDay);
          tomDate.setDate(nxtDay.getDate() + j);
          let day = (tomDate.getDay() === 0) ? this.day[6] : this.day[tomDate.getDay() - 1];
          let dateId = this.fieldName + '_' + tomDate.getFullYear() + '_' + this.month[tomDate.getMonth()] + '_' + day + '_' + tomDate.getDate();
          let ele = document.getElementById(dateId);
          if (ele) {
            this.cellHoverArray.push(ele);
            ele.style.backgroundColor = "green";
            ele.style.color = "white";
          }
        }
      }
    }
  }

  validNumberInput(event: KeyboardEvent) {
    let allowedArray = ['-', '/', 'Delete', 'Backspace', 'Enter', 'Tab', ','];
    if (isNaN(Number(event.key)) && ((event.key !== 'v') || (event.key === 'v' && !event.ctrlKey)) && (allowedArray.indexOf(event.key) < 0 || (event.key === "," && allowedArray.indexOf(event.key) > -1 && this.isSingleSelect))) {
      event.preventDefault();
    }
  }

  validateClipboardValue(event) {
    let val = event.clipboardData.getData('text');
    let regEx = /^(0?[1-9]|1[012])[\/](0?[1-9]|[12][0-9]|3[01])[\/]\d{4}\-(0?[1-9]|1[012])[\/](0?[1-9]|[12][0-9]|3[01])[\/]\d{4}$/;
    if (!regEx.test(val)) {
      event.preventDefault();
    }
  }

  private formatDate(date){
    let splitDate = date.split("/");
    return (("0" + splitDate[0]).slice(-2)  +"/"+ ("0" + splitDate[1]).slice(-2) +"/"+ splitDate[2]);
  }
  private setDateFormat() {
    let inputDate = this.inputValue;
    let formatedDate = "";

    for (let i = 0; inputDate.length != 0;) {
      let slashPosition = inputDate.indexOf("/");
      if (slashPosition != -1) {
        let isValue = inputDate.charAt(slashPosition - 2);
        if (isValue != "" && isNaN(parseFloat(isValue))) {
          formatedDate += inputDate.slice(0, (slashPosition - 1) < 0 ? 0 : slashPosition - 1) + "0" + inputDate.slice(5, slashPosition + 1);
        }
        else if(isNaN(parseFloat(isValue))){
          formatedDate += inputDate.slice(0, (slashPosition - 2) < 0 ? 0 : slashPosition - 2) + "0" + inputDate.slice(0, slashPosition + 1);
        }
        else {
          formatedDate += inputDate.slice(0, slashPosition + 1);
        }
        inputDate = inputDate.slice(slashPosition + 1);
      }
      else{
        formatedDate += inputDate;
        inputDate = "";
      }
    }
    this.inputValue = formatedDate;

  }
  
  onClearClick(){
  	this.inputValue = "";
  	if(!this.clearAll){
  		this.onDirtySelect.emit({value:this.inputValue});
  	}
  }
  
  showClearAll(){
  	return this.inputValue.trim() !== '' ? 'visible' : 'hidden';
  }
}
