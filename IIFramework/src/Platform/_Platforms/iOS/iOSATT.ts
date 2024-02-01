namespace numas {
    enum EiOSATTAuthStatus {
        AUTHORIZED = "AUTHORIZED",
        DENIED = "DENIED",
        RESTRICTED = "RESTRICTED", /** 限制（系统限制 App 广告追踪） */
        NOT_DETERMINED = "NOT_DETERMINED" /** 还没有决定或者弹窗 */
    }
    export class iOSATT {
        private static _ins: iOSATT = null;
        static get ins(): iOSATT {
            if(this._ins === null) {
                this._ins = new iOSATT();
            }
            return this._ins;
        }

        Init(cfg: TSDKCfg): void {
            iOSMsgBridge.ins.on('NMEventATT', jsonData=>this.iOSCallbackHandler(jsonData), this);
        }

        private iOSCallbackHandler( jsonData: {event: string} | { status: string } ){
            switch ((jsonData as {event: string}).event) {
                case "REQUEST_TRACKING_AUTHORIZATION": 
                    this.HandleRequestTrackingAuthorizationResult(jsonData as { status: string });
                    break;
                default:
                    console.warn(`Unhandled iOS Event >> ${(jsonData as {event: string}).event}`)
                    break;
            }
        }
        private HandleRequestTrackingAuthorizationResult(jsonData: { status: string }) {
            if(this.m_RequestIDFACallback !== null) {
                let _cb = this.m_RequestIDFACallback;
                this.m_RequestIDFACallback = null;
                _cb(jsonData.status == EiOSATTAuthStatus.AUTHORIZED);
            }
        }

        //#region //! iOS 桥接部分
        private m_RequestIDFACallback: (auth: boolean)=>void = null
        RequestTrackingAuthorization(callback: (auth:boolean)=>void, requestAuth: boolean): void {
            this.m_RequestIDFACallback = Util.onceCall(callback, 1);
            jsb.reflection.callStaticMethod("NMProxyATT", "RequestTrackingAuthorization:", requestAuth);
        }
        //#endregion
    }
}
