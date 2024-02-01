/// <reference path="../../Base/UserBase.ts" />
namespace numas {
    export class iOSVibrate extends VibrateBase implements IVibrate {        
        DefaultImpl(): void {
            this.vibrateNormal();
        }

        private vibrateNormal(){ this.__bridgeVibrate("NORMAL") }
        private vibratePeek(){ this.__bridgeVibrate("PEEK") }
        private vibratePop(){ this.__bridgeVibrate("POP") }
        private vibrateContinue(){ this.__bridgeVibrate("CONTINUE") }
        private __bridgeVibrate(vibrateType: string) {jsb.reflection.callStaticMethod("NMVibrate", "vibrate:", vibrateType); }
    
        private tap_notification( uiNotificationFeedbackType:number = 2 ) { jsb.reflection.callStaticMethod("NMVibrate", "tap_notification:", uiNotificationFeedbackType); }
        private tap_selection() { jsb.reflection.callStaticMethod("NMVibrate", "tap_selection"); }
        private tap_impact( uiImpactFeedbackStyle: number = 4 ) { jsb.reflection.callStaticMethod("NMVibrate", "tap_impact:", uiImpactFeedbackStyle); }
        private isSupportTapEngine(): boolean { return jsb.reflection.callStaticMethod("NMVibrate", "isSupportTapEngine") }
    }
}