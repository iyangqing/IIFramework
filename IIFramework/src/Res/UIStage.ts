/// <reference path="./UIPanel.ts" />

namespace numas {
    /**
     * 每一个 GameBundle 都对应一个 UIStage
     */
    export abstract class UIStage extends UIPanel {
        protected OnCreate(): void { }
        protected OnRelease(): void {}
        protected OnOpen(uiArgs: any): void { }
        /**
         * 切换到此场景时，通过调用此方法初始化业务逻辑
         */
        __i_Init(onUICompleted: Function, args?: any): void {
            if(this.m_Initialized) {
                console.error(">> UIStage::OnOpen() >> 已经初始化，错误的使用方式")
                return;
            }
            this.m_Initialized = true;
            AudioMgr.ins.SetDefaultEffect(this.GetDefaultEffectAudioKey())
            this.OnInit(Util.onceCall(onUICompleted, 1), args);
        }
        private m_Initialized: boolean = false;
        protected abstract OnInit(onUICompleted: Function, args?: any): void;
        protected abstract GetDefaultEffectAudioKey(): string;
    }
}
