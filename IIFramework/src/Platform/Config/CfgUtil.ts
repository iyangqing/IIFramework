namespace numas {
    export class CfgUtil {
        static k2v(kvs: TKV[], k: string): string {
            if(kvs != null) {
                for(let i=kvs.length-1; i>=0; --i) {
                    if(kvs[i].k === k) {
                        return kvs[i].v;
                    }
                }
            }
            return null;
        }

        static v2k(kvs: TKV[], v: string): string {
            if(kvs != null) {
                for(let i=kvs.length-1; i>=0; --i) {
                    if(kvs[i].v === v) {
                        return kvs[i].k;
                    }
                }
            }
            return null;
        }
    }
}
