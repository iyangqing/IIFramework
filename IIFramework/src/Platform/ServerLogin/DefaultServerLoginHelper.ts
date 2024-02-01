namespace numas {
    export class DefaultServerLoginHelper implements IServerLoginHelper {
        Login(args: PlatformLoginResult, loginCallback: ServerLoginCallback): void {
            if(CC_DEBUG) {
                console.info(`DefaultServerLoginHelper >> 使用默认游戏登录器进行登陆`);
            }
            setTimeout(()=>{
                loginCallback({
                    success: true,
                    uid: args.openid
                });
            }, 0.1);
        }
    }
}
