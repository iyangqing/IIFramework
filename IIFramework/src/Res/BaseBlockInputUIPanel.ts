/// <reference path="UIPanel.ts" />
namespace numas {
    export abstract class BaseBlockInputUIPanel extends UIPanel {
        protected OnCreate(): void { }
        protected OnRelease(): void { }
        protected OnOpen(): void {
            this.BindBV(UIMgr.ins.block, isBlock=>this.OnActiveChanged(isBlock), true);
        }
        protected abstract OnActiveChanged(active: boolean): void;
    }
}
