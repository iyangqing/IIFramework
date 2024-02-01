namespace numas {
    export class NetUtil {
        /**
         * 是否是 Wifi 网络
         */
        static IsWifi(): boolean {
            return cc.sys.getNetworkType() == cc.sys.NetworkType.LAN;
        }
    }
}
