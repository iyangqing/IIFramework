/// <reference path="UIPanel.ts" />

namespace numas {
    export abstract class BaseLoadingUIPanel extends UIPanel {    
        protected OnCreate(): void { }
        protected OnRelease(): void { }
        protected OnOpen(): void {
            this.BindBV(ResListLoaderInfo.ins.loaderCnt, loaderCnt=>{
                this.OnActiveChanged(loaderCnt > 0);
                this.__OnLoading(ResListLoaderInfo.ins.finishTaskCnt.v, ResListLoaderInfo.ins.totalTaskCnt.v)
            }, true);
            this.BindBV(ResListLoaderInfo.ins.finishTaskCnt, finishTaskCnt=>{
                this.__OnLoading(finishTaskCnt, ResListLoaderInfo.ins.totalTaskCnt.v)
            }, true);
            this.BindBV(ResListLoaderInfo.ins.totalTaskCnt, totalTaskCnt=>{
                this.__OnLoading(ResListLoaderInfo.ins.finishTaskCnt.v, totalTaskCnt)
            }, true);
        }
        private __OnLoading(finishCount: number, totalCount: number): void {
            if(ResListLoaderInfo.ins.loaderCnt.v > 0) {
                this.OnLoading(finishCount, totalCount)
            }
        }
        protected abstract OnLoading(finishCount: number, totalCount: number): void;
        protected abstract OnActiveChanged(active: boolean): void;
    }    
}