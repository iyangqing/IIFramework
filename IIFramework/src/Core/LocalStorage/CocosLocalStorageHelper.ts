namespace numas {
    export class CocosLocalStorageHelper implements ILocalStorageHelper{
        private constructor() {}
        private static _ins: CocosLocalStorageHelper = null;
        static get ins(): CocosLocalStorageHelper {
            if(this._ins === null) {
                this._ins = new CocosLocalStorageHelper();
            }
            return this._ins;
        }

        save(): void {}
        deleteKey(key: string): void { cc.sys.localStorage.removeItem(key) }
        hasKey(key: string): boolean {
            let _ret = cc.sys.localStorage.getItem(key);
            if(_ret == null || _ret.length == 0) {
                return false;
            }else{
                return true;
            }
        }
        setBool(key: string, val: boolean, isEncrypt: boolean){ this.setItem(key, val ? "t" : "f", isEncrypt) }
        getBool(key: string): boolean { return this.getItem(key) == "t"; }
        getBoolWithDefault(key: string, defaultVal: boolean){
            if(this.hasKey(key)) {
                return this.getBool(key);
            }else{
                return defaultVal;
            }
        }
            
        setInt(key: string, val: number, isEncrypt: boolean){ this.setItem(key, val.toString(), isEncrypt) }
        getInt(key: string): number { return Number(this.getItem(key)); }
        getIntWithDefault(key: string, defaultVal: number): number {
            if(this.hasKey(key)) {
                return this.getInt(key);
            }else{
                return defaultVal;
            }
        }
            
        setString(key: string, val: string, isEncrypt: boolean){ this.setItem(key, val, isEncrypt); }
        getString(key: string): string { return this.getItem(key); }
        getStringWithDefault(key: string, defaultVal: string){
            if(this.hasKey(key)) {
                return this.getString(key);
            }else{
                return defaultVal;
            }
        }
            
        setObject<T extends {}>(key: string, val: T, isEncrypt: boolean){ this.setItem(key, JSON.stringify(val), isEncrypt) }
        getObject<T>(key: string): T { return <T>JSON.parse(this.getItem(key)) }
        getObjectWithDefault<T>(key: string, defaultVal: T): T {
            if(this.hasKey(key)) {
                return this.getObject<T>(key);
            }else{
                return defaultVal;
            }
        }

        private PRE_FIX: string = "#@!l0lzl(s_";
        private getItem(key: string): string {
            let val: string = cc.sys.localStorage.getItem(key);
            let index: number = val.indexOf(this.PRE_FIX);
            if( index === 0){
                val = val.substring(this.PRE_FIX.length);
                val = encrypt.decodeBase64(val);
            }
            return val;
        }
        private setItem(key: string, val: string, isEncrypt: boolean) {
            cc.sys.localStorage.removeItem(key)
            // 开发模式下是不加密
            if(!CC_DEV) {
                if(isEncrypt) {
                    val = encrypt.encodeBase64(val);
                    val = `${this.PRE_FIX}${val}`
                }
            }
            cc.sys.localStorage.setItem(key, val)
        }
    }
}
