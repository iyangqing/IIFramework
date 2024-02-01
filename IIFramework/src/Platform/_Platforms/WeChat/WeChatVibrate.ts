/// <reference path="../../Base/UserBase.ts" />
namespace numas {
    export class WeChatVibrate extends VibrateBase implements IVibrate {        
        DefaultImpl(): void {
            this.vibrateShort("light");
        }


        /**
         * 
         * @param typ heavy medium light
         * https://developers.weixin.qq.com/minigame/dev/api/device/vibrate/wx.vibrateShort.html
         */
        private vibrateShort(typ: string): void {
            window["wx"].vibrateShort({
                type: typ
            });
        }

        /**
         * https://developers.weixin.qq.com/minigame/dev/api/device/vibrate/wx.vibrateLong.html
         */
        private vibrateLong(): void {
            window["wx"].vibrateLong();
        }
    }
}
