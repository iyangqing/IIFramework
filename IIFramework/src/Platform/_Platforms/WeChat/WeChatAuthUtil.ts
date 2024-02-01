namespace numas {
    export enum WeChatAuthScope {
        userInfo,
        writePhotosAlbum
    }
    export class WeChatAuthUtil {
        /** // ! API
         * 是否获得了某项用户授权
         * @param typ 
         * @returns 
         */
        static IsAuthed(typ: WeChatAuthScope): boolean {
            let _isAuthed: boolean = false;
            this.GetSetting(res => {
                _isAuthed = this.__IsAuth(res.authSetting, typ);
            }, ()=>{
                _isAuthed = false;
            });
            return _isAuthed;
        }

        /** // ! API
         * 授权获得用户信息
         * @param posNode 
         * @param onSuccess 
         * @param onFail 
         */
        static AuthUserInfo(posNode: cc.Node, onSuccess: Function, onFail: Function): void {
            if(!this.IsAuthed(WeChatAuthScope.userInfo)) {
                this.__AuthUserInfo(posNode, onSuccess, onFail);
            }else{
                Util.safeCall(onSuccess);
            }
        }
        
        private static GetSetting(onCompleted: (res: any)=>void, onFail: Function): void {
            window["wx"].getSetting({
                success(res) {
                    onCompleted(res);
                },
                fail() {
                    console.error("WeChatUtil >> Auth::getSetting failed.");
                    Util.safeCall(onFail);
                }
            });
        }

        private static __IsAuth(authSetting: any, typ: WeChatAuthScope): boolean {
            if(!authSetting) {
                return false;
            }
            let scopeKey: string = null;
            switch(typ) {
                case WeChatAuthScope.userInfo:
                    scopeKey = 'scope.userInfo'
                    break;
                case WeChatAuthScope.writePhotosAlbum:
                    scopeKey = 'scope.writePhotosAlbum'
                    break;
                default:
                    throw new Error(`WeChatUtil >> __Typ2AuthSettingKey: 未处理的授权类型 typ = ${typ}`);
            }
            return authSetting[scopeKey]
        }
        private static __AuthUserInfo(posNode: cc.Node, onSuccess: Function, onFail: Function): void {
            let pos = posNode && this.convertToWxPos(posNode);
                                
            //位置尺寸环境参数
            let left = 0;
            let top = 0;
            let width = 0;
            let height = 0;
            if(pos){
                left = pos.left;
                top = pos.top;
                width = pos.width;
                height = pos.height;
            }
            let button = window["wx"].createUserInfoButton({
                type: 'image',
                image: '',
                style: {
                    left: left,
                    top: top,
                    width: width,
                    height: height,
                    lineHeight: 40,
                    borderColor: '#00000000',
                    borderWidth: 0,
                    backgroundColor: '#00000000',
                    color: '#ffffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            })
            button.onTap((res) => {
                if (cc.isValid(button)) {
                    button.destroy();
                }
                if(res.userInfo) {
                    Util.safeCall(onSuccess);
                }else{

                    Util.safeCall(onFail);
                }
            })
        }

        /**
         * 将一个节点转化为 wx坐标，left top 等
         * @param node 
         */
        private static convertToWxPos(node?: cc.Node): {left: number, top: number, width: number, height: number} {
            if(!node) return null;
            let leftDownPos = node.convertToWorldSpaceAR(cc.v2(-node.width * node.anchorX, -node.height * node.anchorY));
            let rightUpPos = node.convertToWorldSpaceAR(cc.v2(node.width * (1 - node.anchorX), node.height * (1 - node.anchorY)));
            let frameSize = cc.view.getFrameSize();   // Wx View
            let visibleSize = cc.view.getVisibleSize();  // Game View
            let left = leftDownPos.x / visibleSize.width * frameSize.width;
            let top = frameSize.height - (rightUpPos.y / visibleSize.height * frameSize.height);
            let width = (rightUpPos.x - leftDownPos.x) / visibleSize.width * frameSize.width;
            let height = (rightUpPos.y - leftDownPos.y) / visibleSize.height * frameSize.height;
            return { left, top, width, height };
        }
    }
}
