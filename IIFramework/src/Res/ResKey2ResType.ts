namespace numas {
    export class ResKey2ResType {
        private static _ins: ResKey2ResType = null;
        static get ins(): ResKey2ResType {
            if(this._ins === null) {
                this._ins = new ResKey2ResType();
            }
            return this._ins;
        }
        private _m: Map<string, EResType> = new Map()
        /**
         * 获取资源类型
         * @param resKey 资源关键字
         */
        GetResType(resKey: string): EResType { return this._m.get(resKey); }

        /**
         * 设置资源类型
         * @param resKey 资源关键字
         * @param resType 资源类型
         */
        SetResType(resKey: string, resType: EResType) {
            this._m.set(resKey, resType);
        }

        /**
         * 资源关键字的资源类型是否存在
         * @param resKey 资源关键字
         */
        HasResType(resKey: string): boolean {
            return this._m.has(resKey);
        }
    }
}
