namespace numas {
    export abstract class date {
        static TimeStamp2Date(timeStamp: number): Date { return new Date(timeStamp * 1000) }
        static Date2TimeStamp(date: Date): number { return Math.floor(date.getTime()/1000) }
        static getTimeStamp(): number { return Math.floor(new Date().getTime()/1000) }
        static getMilliTimeStamp(): number { return new Date().getTime() }
        static IsSameDay(date1: Date, date2: Date): boolean { return date1.toDateString() === date2.toDateString() }
        static IsSameDayTimeStamp(ts1: number, ts2: number): boolean { return this.IsSameDay(this.TimeStamp2Date(ts1), this.TimeStamp2Date(ts2)) }
        static zeroHourOfTimeStamp(timeStamp: number): number { return this.zeroHourTimeStampOfDate(this.TimeStamp2Date(timeStamp)) }
        static zeroHourTimeStampOfDate(date: Date): number { return this.Date2TimeStamp(date)-(date.getHours()*3600 + date.getMinutes()*60 + date.getSeconds()) }
        static tomorrowTimeStamp(timeStamp: number) { return this.zeroHourOfTimeStamp(timeStamp + 86400) }
        static tomorrowTimeStampOfDate(date: Date): number { return this.tomorrowTimeStamp(this.Date2TimeStamp(date)) }
        static IsToday(timeStamp: number) { return this.IsSameDayTimeStamp(timeStamp, this.getTimeStamp()) }
        static IsBeforToday(timeStamp: number) { return (!this.IsToday(timeStamp)) && timeStamp < this.getTimeStamp() }
        /**
         * 将秒转换的方法，目前格式只支持 dd hh mm ss
         * @param second 秒数
         * @param format 格式
         */
        static Format(seconds: number, format: string = "hh:mm:ss", single: boolean = false) {
            if(format.indexOf('dd')!=-1){
                let d = Math.floor(seconds/86400)
                seconds = seconds - d*86400
                let _d = (single || d>9)?`${d}`:`0${d}`
                format = format.replace("dd", _d)
            }
            if(format.indexOf('hh')!=-1){
                let h = Math.floor(seconds/3600)
                seconds = seconds - h*3600
                let _h = (single || h>9)?`${h}`:`0${h}`
                format = format.replace("hh", _h)
            }
            if(format.indexOf('mm')!=-1){
                let m = Math.floor(seconds/60)
                seconds = seconds - m*60
                let _m = (single || m>9)?`${m}`:`0${m}`
                format = format.replace("mm", _m)
            }
            if(format.indexOf('ss')!=-1){
                let s = Math.floor(seconds)
                let _s = (single || s>9)?`${s}`:`0${s}`
                format = format.replace("ss", _s)
            }
            return format  
        }
    }
}