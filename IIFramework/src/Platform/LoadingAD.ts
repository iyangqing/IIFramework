
namespace numas {
    export type LoadingADUIPanelArgs = {
        duration: number,
        cb: Function
    }

    export abstract class ALoadingADUIPanel<T extends LoadingADUIPanelArgs> extends UIPanel<T> {
        protected abstract OnOpenLoadingAD(args: T);
        protected OnOpen(args: T): void {
            this.OnOpenLoadingAD(args);
        }
    }
}