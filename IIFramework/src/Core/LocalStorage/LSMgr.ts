namespace numas {
    export class LSMgr extends cc.Component {
        /**
         * 单例
         */
        static ins: LSMgr = null;
        onLoad() {
            if(CC_DEBUG) {
                console.info(">> LSMgr::onLoad")
            }
            if(LSMgr.ins === null) {
                LSMgr.ins = this;
            }
            else {
                this.destroy();
            }
        }

        private h: ILocalStorageHelper = null;
        SetHelper(helper: ILocalStorageHelper) {
            this.h = helper;
        }
        UseDefaultHelper(): void { this.SetHelper(CocosLocalStorageHelper.ins); }

        
        deleteKey(key: string): void {  }
        hasKey(key: string): boolean { return this.h.hasKey(key) }

        setBool(key: string, val: boolean, isEncrypt: boolean): void { this.h.setBool(key, val, isEncrypt) }
        getBool(key: string): boolean { return this.h.getBool(key); }
        getBoolWithDefault(key: string, defaultVal: boolean){ return this.h.getBoolWithDefault(key, defaultVal); }

        setInt(key: string, val: number, isEncrypt: boolean){ this.h.setInt(key, val, isEncrypt) }
        getInt(key: string): number { return this.h.getInt(key); }
        getIntWithDefault(key: string, defaultVal: number): number { return this.h.getIntWithDefault(key, defaultVal); }
            
        setString(key: string, val: string, isEncrypt: boolean){ this.h.setString(key, val, isEncrypt); }
        getString(key: string): string { return this.h.getString(key); }
        getStringWithDefault(key: string, defaultVal: string){ return this.h.getStringWithDefault(key, defaultVal); }
            
        setObject<T extends {}>(key: string, val: T, isEncrypt: boolean){ this.h.setObject<T>(key, val, isEncrypt); }
        getObject<T>(key: string): T { return this.h.getObject<T>(key); }
        getObjectWithDefault<T>(key: string, defaultVal: T): T { return this.h.getObjectWithDefault(key, defaultVal); }
    }
}
