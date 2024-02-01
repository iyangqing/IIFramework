/// <reference path="UIPanel.ts" />
namespace numas {
    export type MsgUIPanelArgs = {
        msg: string[]
    }
    export abstract class BaseMsgUIPanel extends UIPanel<MsgUIPanelArgs> {
        protected abstract get ActionNode(): cc.Node;
        protected abstract get MsgLabel(): cc.Label;
    
        protected OnCreate(): void {
            this.SetUserData("K_INIT_POS", this.ActionNode.position);
        }
        protected OnRelease(): void { }
        protected OnOpen(uiArgs: MsgUIPanelArgs): void {
            this.MsgLabel.string = LangUtil.Get(...this.args.msg);
            cc.tween(this.ActionNode)
                .to(0.2, {opacity: 255, position: cc.Vec3.ZERO})
                .delay(3)
                .to(0.2, {opacity: 0, position: this.GetUserData("K_INIT_POS")})
                .call(()=>{
                    this.Close()
                })
                .start()
        }
    }
}
