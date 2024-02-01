namespace numas { 
    export class EventCenter extends cc.EventTarget {
        private constructor(){ super(); } 
        private static _ins: EventCenter = null;
        public static get ins(): EventCenter {
            if(this._ins === null) {
                this._ins = new EventCenter();
            }
            return this._ins;
        }
    }
}
