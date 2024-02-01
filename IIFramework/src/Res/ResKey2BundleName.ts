namespace numas {
    export class ResKey2BundleName {
        private static _ins: ResKey2BundleName = null;
        static get ins(): ResKey2BundleName {
            if(this._ins === null) {
                this._ins = new ResKey2BundleName();
            }
            return this._ins;
        }
        private _m: Map<string, string> = new Map()
        /**
         * 获取设置资源对应的包名
         * @param resKey 资源关键字
         */
        GetBundleName(resKey: string): string { return this._m.get(resKey); }

        /**
         * 设置资源对应的包名
         * @param resKey 资源关键字
         * @param bundleName 包名
         */
        SetBundleName(resKey: string, bundleName: string) {
            this._m.set(resKey, bundleName);
        }

        /**
         * 资源关键字的包名是否存在
         * @param resKey 资源关键字
         */
        HasBundleName(resKey: string): boolean {
            return this._m.has(resKey);
        }
    }
}
