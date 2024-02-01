/// <reference path="../../Base/UserBase.ts" />
namespace numas {
    export class WeChatUser extends UserBase implements IUser {
        IsAuthedUserInfo(): boolean {
            return true;
            return WeChatAuthUtil.IsAuthed(WeChatAuthScope.userInfo);
        }
        AuthUserInfo(buttonNode: cc.Node, onSuccess: Function, onFail: Function): void {
            WeChatAuthUtil.AuthUserInfo(buttonNode, onSuccess, onFail);
        }
        LoginPlatform(loginCallback: PlatformLoginCallback, isAuthedUserInfo: boolean): void {
            loginCallback({
                success: true,
                openid: Cfg.DefaultUserKey
            })
            return;
            
            if(!isAuthedUserInfo) {
                // 没有授权的情况下，也允许用户登陆
                loginCallback({
                    success: true,
                    openid: Cfg.DefaultUserKey
                })
            }else{
                // ! 授权成功：登陆第一步，调用 login 接口
                window["wx"].login({
                    success (res) {
                        if (res.code) {
                            // 请求后台服务器
                            HttpWeChatUtil.Get("https://api.numas.ltd/wx/verify", {
                                code: res.code
                            }, (result: any)=>{
                                console.warn("请求自己的服务器成功：")
                                console.warn(result)
                                if(result.code == 0) {
                                    // 成功
                                    loginCallback({
                                        success: true,
                                        openid: result.openid
                                    })
                                }else{
                                    loginCallback({
                                        success: true,
                                        openid: Cfg.DefaultUserKey
                                    })
                                }
                            }, (reason?: any)=>{
                                console.warn("请求自己的服务器失败：")
                                console.warn(reason)
                            });
                        } else {
                            loginCallback({
                                success: false,
                                error: res.errMsg
                            });
                        }
                    }
                })
            }
        }
        private __GetUserInfo(): void {
            // ! 登陆成功：登陆第二步，获取用户关键信息
            window["wx"].getUserInfo({
                // 是否需要返回敏感数据
                withCredentials: false,
                success(tres) {
                    let userInfo = tres.userInfo;
                    if (userInfo) {
                        console.warn("获得的用户信息 >> 成功")
                        console.warn(userInfo)
                        // userInfo.nickName
                        // userInfo.avatarUrl
                        // userInfo.gender
                        // loginCallback({
                        //     success: true,
                        //     openid: res.code
                        // })
                    }
                },
                fail(res) {
                    console.warn("获得的用户信息 >> 失败")
                }
            });
        }
        protected OnLoginServerSuccess(): void { }
        protected OnLoginServerFailed(): void { }
        protected GetGameCenterCfg(): TGameCenterCfg { return this.sdkCfg.wx.GameCenter; }
        protected ReportScore(realKey: string, score: number) { }
        FiveStar(): void { /** do nothing */ }
        IsSupportLeaderboard(): boolean { return false; }
        ShowDefaultLeaderboard(): void { /** do nothing */ }
        IsSupportRateUsByOpenUrl(): boolean { return false; }
        RateUsByOpenUrl(): void { /** do nothing */ }
        IsSupportContactUs(): boolean { return false; }
        ContactUs(): void { /** do nothing */ }
    }
}