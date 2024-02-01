namespace numas {
    export type TKV = { k: string, v: string, d: string }
    export type TGameCenterCfg = {
        Ranks: TKV[]
    }
    export type TPlatformCfg = {
        AppId: string
        , GameCenter: TGameCenterCfg
        , kvs: TKV[]
    }
    export type TSDKCfg = {
        iOS: TPlatformCfg,
        wx: TPlatformCfg
    }
}
