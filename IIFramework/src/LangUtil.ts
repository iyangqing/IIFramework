namespace numas {
    export class LangUtil {
        /**
         * 系统当前的语言
         */
        private static _sysLang: string = "zh"
        private static _lang: {
            [langCode: string]: {
                [key: string]: string
            }
        } = {};

        private static _init: boolean = false;
        static IsSystemLanguageChinese(): boolean { return cc.sys.language == cc.sys.LANGUAGE_CHINESE; }
        /**
         * 初始化系统语言
         */
        private static InitSysLang() {
            if(this._init) {
                return;
            }
            this._init = true;
            // // 更新语言包设置
            // if(this.IsSystemLanguageChinese()) {
            //     this._sysLang = "zh"
            // }else{
            //     this._sysLang = "en"
            // }
            // this._sysLang = "en";

            this._sysLang = "zh";
        }

        static Get(...key: any[]): string {
            if(key.length == 0) {
                throw new Error("LangUtil >> 参数个数不能为 0 个");
            }
            let str: string = this._lang[this._sysLang][key[0]]
            if(str === undefined) {
                str = key[0];
            }
            for(let i=1;i<key.length;++i) {
                let re = new RegExp('\\{' + (i-1) + '\\}','gm');
                str = str.replace(re, key[i]);
            }
            return str;
        }

        static AddLangCfg(
            langCfg: {
                [langCode: string]: {
                    [key: string]: string
                }
            }
        ){
            this.InitSysLang();
            for(let langCode in langCfg) {
                this._lang[langCode] = this._lang[langCode] ?? {}
                let dstCfg = this._lang[langCode];
                let srcCfg = langCfg[langCode];
                for(let langKey in srcCfg) {
                    dstCfg[langKey] = srcCfg[langKey];
                }
            }
        }
    }
}
