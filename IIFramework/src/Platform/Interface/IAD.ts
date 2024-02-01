namespace numas {
    export enum EInterstitial {
        NOT_AVAILABLE = 0,
        LOAD_ERROR,
        SHOW,
        SHOW_ERROR,
        CLICK,
        HIDE,
    }
    
    export enum EInternalRewardedVideo {
        NOT_AVAILABLE = 0,
        SHOW_ERROR,
        SHOW,
        HIDE,
        REWARDED,
    }

    export enum ERewardedVideo {
        NOT_AVAILABLE = 0,
        SHOW,
        HIDE,
    }

    export type InterstitialCallback = (type: EInterstitial) => void
    export type RewardedVideoCallback = (type: ERewardedVideo, isRewared: boolean) => void
    
    export interface IAD {
        RewardedVideoBV: BooleanBV;
        RemoveAdsSecondsBV: NumberBV;
        Init(cfg: TSDKCfg): void;
        IsSupport(): boolean;
        InitByScript(): void;
        IsInitByScript(): boolean;
        ShowBanner(isShow: boolean): void;
        IsInterstitialAvailable(): boolean;
        LoadInterstitial(): void;
        LoadInterstitialIfNotAvalable(): void;
        ShowInterstitialWithBlocker(callback: Function, blockerPrefabKey: string, blockDuration: number): void;
        ShowInterstitial(callback: Function);
        IsRewardedVideoAvailable(): boolean;
        ShowRewardedVideo(callback: ()=>void): void;
        ShowRewardedVideoEx(callback: RewardedVideoCallback): void;
        RemoveAdsForSeconds(seconds: number): void;
    }
}