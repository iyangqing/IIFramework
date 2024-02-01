namespace numas {
    /**
     * Objective-C 和 JavaScript 的连接桥
     */
    export class iOSMsgBridge extends cc.EventTarget {
        private static _ins: iOSMsgBridge = null;
        static get ins(): iOSMsgBridge {
            if(!this._ins) {
                this._ins = new iOSMsgBridge();
                let self = this;
                if(CC_DEBUG) {
                    console.info("iOSMsgBridge >> 注册桥接监听器");
                }
                window["_G_EventHandler"] = function(eventName, jsonString) {
                    self._ins.EmitiOSEvent(eventName, jsonString ? JSON.parse(jsonString) : null);
                }
            }
            return this._ins;
        }

        private EmitiOSEvent(eventName: string, jsonData?): void {
            this.emit(eventName, jsonData);
        }
    }
}
