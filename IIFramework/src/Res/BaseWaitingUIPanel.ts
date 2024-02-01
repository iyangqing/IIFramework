/// <reference path="UIPanel.ts" />
namespace numas {
    export abstract class BaseWaitingUIPanel extends UIPanel {
        protected OnCreate(): void { }
        protected OnRelease(): void { }
        protected OnOpen(): void {
            this.BindBV(UIMgr.ins.waiting, isWaiting=>this.OnActiveChanged(isWaiting), true);
        }
        protected abstract OnActiveChanged(active: boolean): void;
    }
}
