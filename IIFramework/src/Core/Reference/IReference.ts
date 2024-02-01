namespace numas {
    export interface IAutoReturn {
        AutoReturn<T extends IReference>(target: T): T;
    }
    export interface IReference {
        /// 数据清理接口（恢复到可用状态）
        Reset(): void;
        /// 重用接口
        Return(): void;
    }
}
