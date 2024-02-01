namespace numas {
    export class UserLSMgr extends cc.Component {
        /**
         * 单例
         */
        static ins: UserLSMgr = null;
        onLoad() {
            if(CC_DEBUG) {
                console.info(">> UserLSMgr::onLoad")
            }
            if(UserLSMgr.ins === null) {
                UserLSMgr.ins = this;
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


        private m_UserId: string = null;
        setUserId(uid: string): void {
            console.warn(`uid >> ${uid}`)
            this.m_UserId = uid;
        }
        private checkUserId(): void {
            if(this.m_UserId === null) {
                throw new Error(">>>> please setUserId before use UserLSMgr");
            }
        }

        /**
         * 将普通关键字转化为和用户相关的关键字
         * @param key 
         * @returns 
         */
        private key2UserKey(key): string { return `${this.m_UserId}_${key}`; }

        
        deleteKey(key: string): void {  }
        hasKey(key: string): boolean { this.checkUserId(); return this.h.hasKey(this.key2UserKey(key)) }

        setBool(key: string, val: boolean, isEncrypt: boolean): void { this.checkUserId(); this.h.setBool(this.key2UserKey(key), val, isEncrypt) }
        getBool(key: string): boolean { this.checkUserId(); return this.h.getBool(this.key2UserKey(key)); }
        getBoolWithDefault(key: string, defaultVal: boolean){ this.checkUserId(); return this.h.getBoolWithDefault(this.key2UserKey(key), defaultVal); }

        setInt(key: string, val: number, isEncrypt: boolean){ this.checkUserId(); this.h.setInt(this.key2UserKey(key), val, isEncrypt) }
        getInt(key: string): number { this.checkUserId(); return this.h.getInt(this.key2UserKey(key)); }
        getIntWithDefault(key: string, defaultVal: number): number { this.checkUserId(); return this.h.getIntWithDefault(this.key2UserKey(key), defaultVal); }
            
        setString(key: string, val: string, isEncrypt: boolean){ this.checkUserId(); this.h.setString(this.key2UserKey(key), val, isEncrypt); }
        getString(key: string): string { this.checkUserId(); return this.h.getString(this.key2UserKey(key)); }
        getStringWithDefault(key: string, defaultVal: string){ this.checkUserId(); return this.h.getStringWithDefault(this.key2UserKey(key), defaultVal); }
            
        setObject<T extends {}>(key: string, val: T, isEncrypt: boolean){ this.checkUserId(); this.h.setObject<T>(this.key2UserKey(key), val, isEncrypt); }
        getObject<T>(key: string): T { this.checkUserId(); return this.h.getObject<T>(this.key2UserKey(key)); }
        getObjectWithDefault<T>(key: string, defaultVal: T): T { this.checkUserId(); return this.h.getObjectWithDefault(this.key2UserKey(key), defaultVal); }
    }
}
