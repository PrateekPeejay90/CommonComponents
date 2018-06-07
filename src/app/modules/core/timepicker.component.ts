import { Component, OnInit, Input, OnChanges, AfterViewInit, ElementRef, EventEmitter, Output, forwardRef } from '@angular/core';
import { FormsModule, FormControlDirective, FormGroupDirective } from '@angular/forms';
import {FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS} from "@angular/forms";
import {DaysAndTimesConst, DefinedDaysConst, DefinedTimeConst} from './daysandtimes.constants';
import {SelectItem} from 'primeng/primeng';
import {Observable} from 'rxjs';
import { ViewChild } from '@angular/core';
import { AutoComplete } from 'primeng/primeng';

const _12_HRS_FORMAT = "12hrs time";
const _24_HRS_FORMAT = "24hrs time";
const BROADCAST_FORMAT = "Broadcast time";

const OnBoard = {
  configParams : {
    AM: 'AM',
    PM: 'PM',
    timeFormat : "12hrs time",
    broadcastDayStart: 21600,
    broadcastDayEnd: 108000
  }
};

function createRequiredValidator () {
  return function validateRequired(c: FormControl) {
    let isValid = false;
    let value = c.value;
    let err = {
      required: true
    };

    if( value !== null && (value.value !== null && value.value !== '')) {
      isValid = true;
    }

    return (!isValid) ? err: null;
  }
}

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimePickerComponent),
  multi: true
};

const CUSTOM_INPUT_CONTROL_VALUE_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => TimePickerComponent),
  multi: true
};

const noop = () => {
};

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.view.html',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, CUSTOM_INPUT_CONTROL_VALUE_VALIDATOR]
})

export class TimePickerComponent implements OnInit, OnChanges, ControlValueAccessor, AfterViewInit  {

  validateFn:Function;

  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  private selectedObj: any = {};
  propagateChange: any = () => { };

  @Input() min: string = "06:00 AM";
  @Input() max: string = "06:00 AM";
  @Input() interval: number = 30;
  @Input() from: string = "startTime";
  @Input() appendTo = null;
  @Input() mandatory = false;
  @Input() startTime = null;
  @Input() placeholder = 'Select';
  @Input() tabindex: number = 0;
  
  // inputValue: any;
  _from = this.from;
  _interval = this.interval;
  _data = [];
  _min = this.min;
  _max = this.max;
  data = [];
  merediem = OnBoard.configParams.AM;
  tempRaj: string = ""

  @ViewChild('timecomponent') timecomponent: AutoComplete;

  //property el on this.autoComplete is of type elementRef
  private inputEl: ElementRef;
  @Input() inputValue: string; 
  @Input() attributeName: string;  
  @Input() displayName: string;
  @Input() filterAttribute: any;
  @Output() optionChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.validateFn = createRequiredValidator();
  }

  ngOnInit() {
    this.tabindex = (this.tabindex) ? this.tabindex : 0;
    this._from = this.from;
    this._interval = this.interval;
    this._min = this.min;
    this._max = this.max;

    if(this.filterAttribute.dataArray){
      this._data = this.filterAttribute.dataArray;
      this.data = this._data;
    }else{
      if (OnBoard.configParams.timeFormat == BROADCAST_FORMAT) {
        this.createData();
      } else {
          if (OnBoard.configParams.timeFormat == _24_HRS_FORMAT) {
            this.createData24Hours();
          } else {
              if (OnBoard.configParams.timeFormat == _12_HRS_FORMAT) {
                this.createData12Hours();
              }
          }
      }
    }
    
    this.inputEl = this.timecomponent.el;
  }

  ngOnChanges(inputs) {
  }

  public ngAfterViewInit(): void {
    /* Removing the tab index of the component so when focus it will direct move to another component*/
    let buttonEl = this.inputEl.nativeElement.querySelector('.ui-autocomplete-dropdown');
    if( buttonEl !== null || buttonEl !== undefined ) {
      buttonEl.setAttribute('tabindex', -1);
    }
  }

  validate(c: FormControl) {
    if( this.mandatory ) {
      return this.validateFn(c);
    } else {
      return true;
    }
  }

  get value() {
    return this.inputValue;
  }

  set value(value) {
    this.inputValue = value;
  }

  // Function to override
  writeValue(value: any) {
    if( !value ) {
      value = {
        text: '',
        value: ''
      };
    }
    if (value !== this.inputValue) {
      this.inputValue = value;
    }
    this.onChangeCallback(value);
    this.propagateChange(this.inputValue);
    this.filterAttribute.value = value;
    this.optionChanged.emit({
      val:value.value,
      valObject: this.getStringToTimeObject24(value.value),
      attribute:this.attributeName
    });
  }

  // From ControlValueAccessor interface
  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  onChange(event) {
    this.propagateChange(event.value);
  }
  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  private _setValue(value) {
    let newVal;
    let val = value;
    val = this.parseOddTimes(val);
    if ( val === "" ) {
      //this.optionChanged.emit({val:val,attribute:this.attributeName});
      this.writeValue(null);
    } else if (!this.checkTime(val)) {
      //this.optionChanged.emit({val:val,attribute:this.attributeName});
      this.writeValue(null);
    } else {
      if (OnBoard.configParams.timeFormat == _24_HRS_FORMAT)
        newVal = this.convertString24ToObject30();
      else {
        if (OnBoard.configParams.timeFormat == _12_HRS_FORMAT)
          newVal = this.convertObject12ToInt30(this.convertStringToTimeObject12(val));
        else
          newVal = this.convertStringTimeToInt(val);
      }
      if (!this.isValidTime(newVal)) {
        //this.optionChanged.emit({val:val,attribute:this.attributeName});
        this.writeValue(null);
      } else {
        //this.optionChanged.emit({val:val,attribute:this.attributeName});
        this.writeValue({
          value: val,
          text: val
        });
      }
    }
  }

  onBlur(event) {
    if(!this.filterAttribute.dataArray){
      this._setValue(event.target.value);
    }else{
      if(this.selectedObj.value){
        event.target.value = this.selectedObj.text;
        this.optionChanged.emit({
          val: this.selectedObj.value,
          valObject: this.selectedObj,
          attribute:this.attributeName
        });
      }
    }
  }

  onSelect(value) {
    
    let valObject = value;

    if(!this.filterAttribute.dataArray){
      let valObject = this.getStringToTimeObject24(value.value);
    }else{
      this.selectedObj = valObject;
    }

    this.optionChanged.emit({
      val:value.value,
      valObject: valObject,
      attribute:this.attributeName
    });
  }

  onCompleteMethod(event) {
    let ldata = this._data;
    this.data = ldata.filter( x => x['text'].search(event.query) !== -1 );
  }

  /**
   * The method in used for parse odd times according to configuration time format.
   * First the method checking if value is correct according to return value from checkTime function.
   * if check time method return false - try to parsing odd time.
   * @param value time in string type.
   * @returns time in string type in correct configuration.
   */
  private parseOddTimes (value) {
    if (!this.checkTime(value)) {
      var result = "";
      var timeFormat = OnBoard.configParams.timeFormat;
      if (timeFormat == _12_HRS_FORMAT) {
        result = this.parse12hrs(value);
      }
      else { // timeFormat == "24hrs time" || "Broadcast time"
        result = this.parse24hrsOrBroadcastTime(value);
      }
      value = result;
    }
    return value;
  };


  private checkTime (value) {

    var timeFormat = OnBoard.configParams.timeFormat;
    var regularTimeEx = new RegExp("^([0-9][0-9]|[0-9]):([0-5][0-9]):([0-5][0-9])$"),
        smallRegularEx = new RegExp("^([0-9][0-9]|[0-9]):([0-5][0-9])$"),
        regularTime24 = new RegExp("^([01]?[0-9]|2[0-3]):[0-5][0-9]$"),
        regularTime12 = new RegExp("^(0[1-9]|1[0-2]):[0-5][0-9] ([ap]m|[AP]M)$");

    if (value === "") { // empty time
        return 3;
    } else if ((timeFormat == _24_HRS_FORMAT) && (regularTime24.test(value))) { // If the 24hrs time is correct
        return 1;
    } else if ((timeFormat == _12_HRS_FORMAT) && (regularTime12.test(value))) { // If the 12hrs time is correct
        return 1;
    } else if ((timeFormat == BROADCAST_FORMAT) && (regularTimeEx.test(value))) { // If the BROADCAST_FORMAT is correct
        return 1;
    } else if (smallRegularEx.test(value)) {
        return 2;
    } else {
        return 0;
    }
  };


  /**
   * The method split the time to array: [TIME][AM/PM]
   * The method init new vars for build new time: h1h2m1m2 t from TIME cell.
   * the method call to buildTime with the initialized vars and PM/AM according to time array;
   * @param value string Time in '12hrs time' format
   * @returns string
  **/
  private parse12hrs(value) {
      var valueInLocaleLowerCase = value.toLowerCase();
      var time = [];
      var resT = this.checkIfAmOrPm(valueInLocaleLowerCase);
      if (resT == "p") {
          time = valueInLocaleLowerCase.split("p");
          time[1] = OnBoard.configParams.PM;
      } else if (resT == "a") {
          time = valueInLocaleLowerCase.split("a");
          time[1] = OnBoard.configParams.AM;
      } else if (resT == null){ // not found characters - Default to PM
          this.merediem = this.checkMerediem(this.startTime, value);
          time[0] = value;
          time[1] = this.merediem;
      } else { // resT contain characters that are not 'p' or 'a' - clear the field
          return "";
      }
      var t = " " + time[1];
      var arrayOfTime = this.createArrayOfTime(time[0]);
      if (!arrayOfTime) {
          return "";
      }
      return this.createTime(arrayOfTime, t);
  };



  /**
   * The method get time in string format.
   * The method init new vars for build new time: h1h2m1m2
   * the method call to createTime with the initialized vars;
   * @param value
   * @returns new time in 24hrs time or broadcast time.
   */
  private parse24hrsOrBroadcastTime (value) {
      var arrayOfTime = this.createArrayOfTime(value);
      if (!arrayOfTime) {
          return "";
      }
      return this.createTime(arrayOfTime, '');
  };


/** The method create new time from the arguments.
   * in case 12hrs time : the method get t. need to be 'AM' OR 'PM'.
    * in case 24hts time or broadcast time : t is empty string.
    * time format : [h1][h2][m1][m2] [tt]
    * @param timeArray [h1][h2][m1][m2]
    * @param t  could be AM or PM or ""
    * @returns Time in current configuration.
    */
  private createTime (timeArray, t) {
      return timeArray[0] + timeArray[1] + ":" + timeArray[2] + timeArray[3] + t;
  };

  /** the method used for odd times - in case the user insert - 803p or 803pm , the method return P.
   *  look for the first char that different from digit.
   *  @param value - time
   *  @returns the first character that are not digit
   */
  private checkIfAmOrPm (value) {
      var firstChar = value.match(/[a-z.]/);
      return firstChar;
  };

  /**
   * array of time -> [h1][h2][m1][m2]
   * @param value
   * @returns  in case the length of value small than 1 or big than 4 return -1, else return array of time.
   */
  private createArrayOfTime(value) {
      var valueLength = value.length;
      var arrayOfTime = ["0","0","0","0"];

      if (valueLength == 1) {
          arrayOfTime[1] = value.charAt(0);
      }

      else if (valueLength == 2) {
          arrayOfTime[0] = value.charAt(0);
          arrayOfTime[1] = value.charAt(1);
      }

      else if (valueLength == 3) {
          arrayOfTime[1] = value.charAt(0);
          arrayOfTime[2] = value.charAt(1);
          arrayOfTime[3] = value.charAt(2);
      }

      else if (valueLength == 4) {
          arrayOfTime[0] = value.charAt(0);
          arrayOfTime[1] = value.charAt(1);
          arrayOfTime[2] = value.charAt(2);
          arrayOfTime[3] = value.charAt(3);
      }
      else {
          return false;
      }
      return arrayOfTime;
  };

  private convertString24ToObject30() {
    var times = {
      max: null,
      min: null
    };

    let tempMax = this.convertStringToTimeObject(this._max);
    let tempMaxNumber = this.convertObject24ToInt30(tempMax);

    if ((OnBoard.configParams.broadcastDayStart == tempMaxNumber))
    tempMaxNumber = OnBoard.configParams.broadcastDayEnd;

    var maxObj = this.convertIntToTimeObject(tempMaxNumber);
    times.max = maxObj;

    let tempMin = this.convertStringToTimeObject(this._min);
    let tempMinNumber = this.convertObject24ToInt30(tempMin);
    var minObj = this.convertIntToTimeObject(tempMinNumber);

    times.min = minObj;

    return times;
  };

  private createData12Hours () {

    var times = this.convertString12ToObject30();
    var minObj = times.min;
    var maxObj = times.max;

    var minHours = minObj.hour,
        minMinutes = minObj.minutes,
        maxHours = maxObj.hour,
        maxMinutes = maxObj.minutes;

    var j = minMinutes;
    var timeAmPm = " " + OnBoard.configParams.AM;
    var timeminus = 0;

    this._data = [];

    for (var i = minHours; i <= maxHours; ++i) {
        if (i >= 25) {
            timeminus = 24;
        }
        else {
            if (i >= 13) {
                timeminus = 12;
            }
        }

        if (i >= 24) {
            timeAmPm =  " " + OnBoard.configParams.AM;
        }
        else {
            if (i >= 12) {
                timeAmPm =  " " + OnBoard.configParams.PM;
            }
        }

        var endMinute = 59;

        j = j >= (endMinute + 1) ? j - (endMinute + 1) : j;

        if (i == maxHours) {
            endMinute = maxMinutes;
        }

        var timeH = (i - timeminus) < 10 ? "0" + (i - timeminus) : (i - timeminus);


        for (; j <= endMinute; j += this._interval) {

            var timeM = j < 10 ? "0" + j : j;

            if ((minMinutes == j) && (minHours == i) && (this._from == "endTime"))
                continue;

            if ((i == maxHours) && (j == endMinute) && (this._from == "startTime"))
                continue;

            var temp = {
                text: timeH + ":" + timeM + timeAmPm,
                value: timeH + ":" + timeM + timeAmPm
            };

            this._data.push(temp);
        }
    }
    this.data = this._data;
};

  private createData24Hours() {

    var times = this.convertString24ToObject30();
    var minObj = times.min;
    var maxObj = times.max;

    var minHours = minObj.hour,
      minMinutes = minObj.minutes,
      maxHours = maxObj.hour,
      maxMinutes = maxObj.minutes;


    var j = minMinutes;

    this._data = [];

    for (var i = minHours; i <= maxHours; ++i) {
      var endMinute = 59;
      let timeH;
      let timeM;
      j = j >= (endMinute + 1) ? j - (endMinute + 1) : j;

      if (i === maxHours) {
        endMinute = maxMinutes;
      }

      if ((i - 24) < 0) {
        timeH = i < 10 ? "0" + i : i;
      }
      else {
        timeH = (i - 24) < 10 ? "0" + (i - 24) : (i - 24);
      }

      for (; j <= endMinute; j += this._interval) {

        if ((minMinutes == j) && (minHours == i) && (this._from == "endTime"))//(this._from == "startTime"))
          continue;


        if ((i == maxHours) && (j == endMinute) && (this._from == "startTime"))//(this._from == "endTime"))
          continue;

        timeM = j < 10 ? "0" + j : j;

        var temp = {
          text: timeH + ":" + timeM,
          value: timeH + ":" + timeM
        };


        this._data.push(temp);
      }
    }

    this.data = this._data;
  };


  private convertStringToTimeObject(str) {
    var time = {
      hour: null,
      minutes: null,
      seconds: null
    },
      tempArray = str.split(":");
    if (this.checkTime(str)) {
      time.hour = parseInt(tempArray[0], 10);
      time.minutes = parseInt(tempArray[1], 10);
      time.seconds = 0;
      if (tempArray.length == 3) {
        time.seconds = parseInt(tempArray[2], 10);
      }
      return time;
    } else {
      return null;
    }
  };

  //convert string to object - 12hrs time
  private convertStringToTimeObject12(str) {
    if (str == "")
      return this.convertStringToTimeObject(str);

    var time = {
      hour: null,
      clock: null,
      minutes: null,
      seconds: null
    },
      tempArray = str.split(":");
    if (this.checkTime(str)) {
      time.hour = parseInt(tempArray[0], 10);
      var temp = tempArray[1].split(" ");
      time.minutes = parseInt(temp[0], 10);
      time.clock = temp[1];
      time.seconds = 0;
      return time;
    } else {
      return null;
    }
  };

  //convert string to object - 12hrs time
  private convertStringToTimeObject24(str) {
    if (str == "")
      return this.convertStringToTimeObject(str);

    var time = {
      hour: null,
      clock: null,
      minutes: null,
      seconds: null
    },
      tempArray = str.split(":");
    if (this.checkTime(str)) {
      time.hour = parseInt(tempArray[0], 10);
      var temp = tempArray[1].split(" ");
      time.minutes = parseInt(temp[0], 10);
      time.clock = temp[1];
      time.seconds = 0;
      if ( time.clock.toUpperCase() === OnBoard.configParams.PM && time.hour !== 12) {
        time.hour = time.hour + 12;
      }
      if ( time.clock.toUpperCase() === OnBoard.configParams.AM && time.hour === 12) {
        time.hour = 0;
      }
      return time;
    } else {
      return null;
    }
  };

  //convert string to object - 12hrs time
  getStringToTimeObject24(str) {
    return this.convertStringToTimeObject24(str);
  };

  private convertObject12ToInt30(value) {
    var hours = value.hour
    var minutes = value.minutes * 60;
    var clock = value.clock;
    var timeStartDay = (this.convertIntToTimeObject(OnBoard.configParams.broadcastDayStart)).hour;

    if (clock == undefined)
      return null;

    if (clock.toUpperCase() == OnBoard.configParams.AM) {
      if ((hours >= timeStartDay) && (hours <= 11))
        hours = hours * 3600;

      if (hours == 12)
        hours = (hours + 12) * 3600;

      if ((hours >= 1) && (hours <= (timeStartDay - 1)))
        hours = (hours + 24) * 3600;

    }
    else //clock == "pm"
    {
      if (((hours >= 1) && (hours <= 11)))
        hours = (hours + 12) * 3600;

      if (hours == 12)
        hours = hours * 3600;
    }
    return hours + minutes
  };

  private convertObject24ToInt30(value) {
    var timeStartDay = (this.convertIntToTimeObject(OnBoard.configParams.broadcastDayStart)).hour;
    var hours = value.hour
    var minutes = value.minutes * 60;

    if (hours < timeStartDay)
      hours = (hours + 24) * 3600;
    else
      hours = hours * 3600;

    return hours + minutes
  };


  private createData() {
    var minObj = this.convertStringToTimeObject(this._min),
      maxObj = this.convertStringToTimeObject(this._max),
      minHours = minObj.hour,
      minMinutes = minObj.minutes,
      maxHours = maxObj.hour,
      maxMinutes = maxObj.minutes;

    var j = minMinutes;

    this._data = [];

    for (var i = minHours; i <= maxHours; ++i) {
      var endMinute = 59;
      j = j >= (endMinute + 1) ? j - (endMinute + 1) : j;

      if (i === maxHours) {
        endMinute = maxMinutes;
      }
      var timeH = i < 10 ? "0" + i : i;
      for (; j <= endMinute; j += this._interval) {

        if ((minMinutes == j) && (minHours == i) && (this._from == "endTime"))
          continue;


        if ((i == maxHours) && (j == endMinute) && (this._from == "startTime"))
          continue;

        var timeM = j < 10 ? "0" + j : j;

        var temp = {
          text: timeH + ":" + timeM,
          value: timeH + ":" + timeM
        };

        this._data.push(temp);
      }
    }

    this.data = this._data;
  };

  private convertTimeObjectToInt (val) {
      var hour = val.hour* 3600
      var minutes = val.minutes * 60
      return (hour + minutes);
  };

  private convertIntToTimeObject(value) {
    var time = {
      hour: null,
      minutes: null,
      seconds: null
    },
      temp = value;

    time.hour = Math.floor(temp / 3600);
    temp = temp % 3600;
    time.minutes = Math.floor(temp / 60);
    time.seconds = temp % 60;

    return time;
  };


  private convertStringTimeToInt(str) {
    var tempArray;
    if (OnBoard.configParams.timeFormat == _12_HRS_FORMAT)
      tempArray = this.convertStringToTimeObject12(str);
    else
      tempArray = this.convertStringToTimeObject(str);

    return (parseInt(tempArray.hour, 10) * 3600 + parseInt(tempArray.minutes, 10) * 60 + parseInt(tempArray.seconds, 10) * 60);
  };

  private isValidTime(newVal) {
    var max, min, times;

    if (OnBoard.configParams.timeFormat == _24_HRS_FORMAT) {

      times = this.convertString24ToObject30();

         min= this.convertTimeObjectToInt(times.min)
         max = this.convertTimeObjectToInt(times.max);
    }else {
      if (OnBoard.configParams.timeFormat == _12_HRS_FORMAT) {
        times = this.convertString12ToObject30();

        min= this.convertTimeObjectToInt(times.min)
        max = this.convertTimeObjectToInt(times.max);
      }else {// BROADCAST_FORMAT
        min = this.convertStringTimeToInt(this._min);
        max = this.convertStringTimeToInt(this._max);
      }
    }

    if (this._from == "startTime") {
      if (min > newVal || max <= newVal) {
        return false;
      }
    }
    else if(this._from == "endTime") {//"endTime"

      if (min > newVal || max < newVal) {
        return false;
      }
    }

    return true;
  }

  private convertString12ToObject30 () {
      var times = {
        min: null,
        max: null
      };
      var maxObj, minObj;

      let tempMax = this.convertStringToTimeObject12(this._max);//12
      let tempMaxNumber = this.convertObject12ToInt30(tempMax);

      if ((OnBoard.configParams.broadcastDayStart == tempMaxNumber))
        tempMaxNumber = OnBoard.configParams.broadcastDayEnd;

      if (tempMaxNumber == null)
          maxObj = this.convertStringToTimeObject12(this._max);//12
      else
          maxObj = this.convertIntToTimeObject(tempMaxNumber);

      times.max = maxObj;


      let tempMin = this.convertStringToTimeObject12(this._min);//12
      let tempMinNumber = this.convertObject12ToInt30(tempMin);
      if (tempMinNumber == null)
          minObj = this.convertStringToTimeObject12(this._min);//12
      else
          minObj = this.convertIntToTimeObject(tempMinNumber);

      times.min = minObj;

      return times;
  }

  setMax(max) {
    if (max === undefined || max === null || max === '') {
      return;
    }
    if (!isNaN(max)) {
        max = this.convertTimeIntToString(max);
    }
    this._max = max;
    if (OnBoard.configParams.timeFormat == BROADCAST_FORMAT) {
      this.createData();
    } else {
        if (OnBoard.configParams.timeFormat == _24_HRS_FORMAT) {
          this.createData24Hours();
        } else {
            if (OnBoard.configParams.timeFormat == _12_HRS_FORMAT) {
              this.createData12Hours();
            }
        }
    }
  };

  setMin(min) {
    if (min === undefined || min === null) {
      return;
    }
    if (!isNaN(min)) {
        min = this.convertTimeIntToString(min);
    }
    this._min = this.fixMinTime(min);
    if (OnBoard.configParams.timeFormat == BROADCAST_FORMAT) {
      this.createData();
    } else {
        if (OnBoard.configParams.timeFormat == _24_HRS_FORMAT) {
          this.createData24Hours();
        } else {
            if (OnBoard.configParams.timeFormat == _12_HRS_FORMAT) {
              this.createData12Hours();
            }
        }
    }
  };

  //this function fix the min time in case the user type odd time, so the min wont be an odd time too.
  private fixMinTime(time)
  {
    var tempTime;

    if (OnBoard.configParams.timeFormat == _12_HRS_FORMAT)
        tempTime = this.convertStringToTimeObject12(time);
    else
        tempTime = this.convertStringToTimeObject(time);

    var minutes = tempTime.minutes;
    var mod = (minutes % this._interval);
    if (mod != 0) {
        minutes = minutes - mod;
    }
    tempTime.minutes=minutes;

    if (OnBoard.configParams.timeFormat == BROADCAST_FORMAT)
        tempTime = this.convertTimeObjectToInt(tempTime);
    else {
        if (OnBoard.configParams.timeFormat == _24_HRS_FORMAT)
        {
            tempTime = this.convertObject24ToInt30(tempTime);
        }
        else {
            if (OnBoard.configParams.timeFormat == _12_HRS_FORMAT) {
                tempTime = this.convertObject12ToInt30(tempTime);
            }
        }
    }

    return this.convertIntToTimes(tempTime);
  };

  private convertTimeIntToString(val) {
    var tempObject = this.convertIntToTimeObject(val);

    tempObject.hour = this.fixTimeString(tempObject.hour);
    tempObject.minutes = this.fixTimeString(tempObject.minutes);
    tempObject.seconds = this.fixTimeString(tempObject.seconds);

    return tempObject.hour + ":" + tempObject.minutes + ":" + tempObject.seconds;
  };

  private convertIntToTimes (val, includeSeconds?) {
    includeSeconds = !!includeSeconds; // Default false;
    if (OnBoard.configParams.timeFormat == "Broadcast time")
        return (this.convertIntToTimes(val, includeSeconds));
    else {
        if (OnBoard.configParams.timeFormat == "24hrs time")
            return (this.convertSecondsIntToTimeString24(val, includeSeconds));
        else {
            if (OnBoard.configParams.timeFormat == "12hrs time")
                return (this.convertSecondsIntToTimeString12(val, includeSeconds));
        }
    }
  };

  private fixTimeString(str) {
    var strTemp = String(str);

    if (strTemp.length === 2) {
        return strTemp;
    } else if (strTemp.length === 1) {
        return ("0" + strTemp);
    }

    return "00";
  };

  //convert int to string - timeFormat == "24hrs time"
  private convertSecondsIntToTimeString24(value, seconds)
  {
    if (!value)
        return "";

    let minString;
    let hoursString;
    let secString;
    var time = this.convertSecondsIntToHoursMinutesSeconds(value);
    var result;
    //Build the String
    if ( time.hour >= 24) {
        time.hour -= 24
    }
    if (time.hour < 10) {
      hoursString = "0" + time.hour  + ":";
    }
    else
    {
      hoursString = time.hour  + ":";
    }

    if (time.minutes< 10) {
      minString = "0" + time.minutes;
    }
    else
    {
      minString = time.minutes;
    }

    if (seconds) {
        if (time.seconds < 10) {
            secString = "0" + time.seconds;
        } else {
            secString = time.seconds;
        }
        result = hoursString + minString + ":" + secString;
    } else {
        result = hoursString + minString;
    }
    return result;
  };


  /**
   * convert int to string - timeFormat == "12hrs time"
   * @param value
   * @param capital - boolean, if true - method will return time period as AM/PM, if false: am/pm.
   * @returns *
   **/
  private convertSecondsIntToTimeString12(value, seconds)
  {
    if (!value)
        return "";

    let minString;
    let hoursString;
    let secString;

    var time = this.convertSecondsIntToHoursMinutesSeconds(value);
    var result,temp;

    if (( time.hour >= 24)||(time.hour<12))
    {
        temp= " AM"
    }
    else
    {
        temp= " PM"
    }
    if ( time.hour > 24)
    {
        time.hour -= 24
    }
    else
    {
        if ( time.hour > 12)
        {
            time.hour -= 12
        }
    }


    if (time.hour < 10) {
        hoursString = "0" + time.hour  + ":";
    }
    else
    {
        hoursString = time.hour  + ":";
    }

    if (time.minutes< 10) {
        minString = "0" + time.minutes;
    }
    else
    {
        minString = time.minutes;
    }

    if (seconds) {
        if (time.seconds < 10) {
            secString = "0" + time.seconds;
        } else {
            secString =  time.seconds;
        }
        result = hoursString + minString + ":" + secString + temp;
    } else {
        result = hoursString + minString +  temp;
    }

    return result
  };

  private convertSecondsIntToHoursMinutesSeconds(value)
  {
      var time = {
        minutes: null,
        hour: null,
        seconds: null
      },
          temp = value;

      time.hour = Math.floor(temp / 3600);

      temp = temp % 3600;
      time.minutes = Math.floor(temp / 60);
      time.seconds = Math.floor(temp % 60);
      return time;
  };

  checkMerediem(startTimeValue, currentValue) {
    if(startTimeValue !== undefined && startTimeValue !== null && startTimeValue.text !== "") {
      var startTemp = startTimeValue.text;
      var reverseMerediem = false;
      startTemp = startTemp.slice(0,5).replace(":","");
      var currTempArr = this.createArrayOfTime(currentValue);
      var endTemp = currTempArr[0] + currTempArr[1] + currTempArr[2] + currTempArr[3];
      if(!startTemp.startsWith("12") && endTemp.startsWith("12")) {
        reverseMerediem = true;
      } else if(startTemp.startsWith("12") && !endTemp.startsWith("12")) {
        reverseMerediem = false;
      } else if(parseInt(startTemp) >= parseInt(endTemp)) {
        reverseMerediem = true;
      }
      if(startTimeValue.text.toLowerCase().includes("am")) {
        if(reverseMerediem){
          return OnBoard.configParams.PM;
        } else {
          return OnBoard.configParams.AM;
        }
      }
      if(startTimeValue.text.toLowerCase().includes("pm")) {
        if(reverseMerediem){
          return OnBoard.configParams.AM;
        } else {
          return OnBoard.configParams.PM;
        }
      }
    }
    return OnBoard.configParams.AM;
  };
}
