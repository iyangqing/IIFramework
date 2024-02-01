namespace numas {
    export type ServerLoginResult = {
        success: boolean;
        uid?: string;
        error?: string;
    }
    /**
     * 游戏登陆回调
     */
    export type ServerLoginCallback = (args: ServerLoginResult)=>void;
}
