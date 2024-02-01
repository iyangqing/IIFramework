declare namespace numas {
    abstract class BV<T> implements IReference {
        protected m_CacheValue: T;
        constructor(val: T);
        Reset(): void;
        abstract Return(): void;
        ReturnBy<SELF extends BV<T>>(target: IAutoReturn): SELF;
        get v(): T;
        set v(val: T);
        SetValueWithoutNotification(val: T): void;
        protected abstract IsEqual(newVal: T, curVal: T): boolean;
        private m_ObserversList;
        protected NotifyObservers(cur: T, pre: T): void;
        Bind<SELF extends BV<T>>(handler: ValueChangedFunc<T>, callOnBind: boolean, target: any): SELF;
        TargetUnbind(target: any): void;
        UnbindAll(): void;
    }
}
declare namespace numas {
    class BooleanBV extends BV<boolean> {
        constructor();
        protected IsEqual(newVal: boolean, curVal: boolean): boolean;
        static Borrow(initValue: boolean): BooleanBV;
        Return(): void;
        static BorrowAsLS(key: string, defaultValue: boolean, isEncrypt: boolean): BooleanBV;
        static BorrowAsUserLS(key: string, defaultValue: boolean, isEncrypt: boolean): BooleanBV;
    }
    class NumberBV extends BV<number> {
        constructor();
        protected IsEqual(newVal: number, curVal: number): boolean;
        static Borrow(initValue: number): NumberBV;
        Return(): void;
        static BorrowAsLS(key: string, defaultValue: number, isEncrypt: boolean): NumberBV;
        static BorrowAsUserLS(key: string, defaultValue: number, isEncrypt: boolean): NumberBV;
    }
    class MaxNumberBV extends BV<number> {
        constructor();
        protected IsEqual(newVal: number, curVal: number): boolean;
        static Borrow(initValue: number): MaxNumberBV;
        Return(): void;
        static BorrowAsLS(key: string, defaultValue: number, isEncrypt: boolean): MaxNumberBV;
        static BorrowAsUserLS(key: string, defaultValue: number, isEncrypt: boolean): MaxNumberBV;
    }
    class StringBV extends BV<string> {
        constructor();
        protected IsEqual(newVal: string, curVal: string): boolean;
        static Borrow(initValue: string): StringBV;
        Return(): void;
        static BorrowAsLS(key: string, defaultValue: string, isEncrypt: boolean): StringBV;
        static BorrowAsUserLS(key: string, defaultValue: string, isEncrypt: boolean): StringBV;
    }
    class ObjectBV extends BV<Object> {
        constructor();
        protected IsEqual(newVal: Object, curVal: Object): boolean;
        static Borrow(initValue: Object): ObjectBV;
        Return(): void;
        static BorrowAsLS(key: string, defaultValue: Object, isEncrypt: boolean): ObjectBV;
        static BorrowAsUserLS(key: string, defaultValue: Object, isEncrypt: boolean): ObjectBV;
    }
}
declare namespace numas {
    class BaseComp extends cc.Component {
        protected onDestroy(): void;
        private __im_UserData;
        private get _i_userdata();
        SetUserData(key: string, data: any): void;
        GetUserData<T>(key: string): T;
        HasUserData(key: string): boolean;
        RemoveUserData(key: string): void;
        RemoveAllUserData(): void;
        protected onGlobal<T extends Function>(type: string, callback: T): T;
        protected emitGlobal(key: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void;
        protected offGlobal(): void;
        AutoReturn<T extends IReference>(bv: T): T;
        protected GetDataCache<T>(dataCacheName: any): T;
        protected AddAutoReleaseDataCache<T extends DataCache>(dataCacheName: string, type: {
            new (): T;
        }): void;
        AutoReleaseRes(resKey: string | string[]): void;
        private __AutoReleaseRes;
        private Destroy_AutoRelease;
        private _i_AutoQueue;
        private get _I_AutoReleaseItemQueue();
        private __im_RefData;
        private get _i_RefData();
        protected SetAssetProperty<T extends cc.Asset>(key: string, data: T): T;
        protected RemoveAllAssetProperty(): void;
        private __im_SchedulerMap;
        private get _I_SchedulerMap();
        protected HasScheduler(key: string): boolean;
        protected RegisterScheduler(key: string, func: Function): void;
        protected StartScheduler(key: string, func: Function, interval: number, repeat?: number, delay?: number): void;
        protected StopScheduler(key: any): void;
        private StopAllScheduler;
    }
}
declare namespace numas {
    class ResListLoaderInfo {
        private static _ins;
        static get ins(): ResListLoaderInfo;
        loaderCnt: NumberBV;
        totalTaskCnt: NumberBV;
        finishTaskCnt: NumberBV;
    }
    interface IAutoCloseUIComp<ARGS> {
        __i_AutoCloseUIComp<T extends UIComp<ARGS>>(uiComp: T): T;
    }
    class BaseUIComp extends BaseComp {
        private static _s_LOAD_EVENT_ID;
        private static get LOAD_EVENT();
        PositionTo<SELF extends BaseUIComp>(x: cc.Vec2 | cc.Vec3 | number, y?: number, z?: number): SELF;
        protected onDestroy(): void;
        protected get Task(): task.TaskComponent;
        protected UUID_GROUP_KEY(key: string): string;
        private _i_b_LoadFunctionCalled;
        protected LoadRes<T extends cc.Asset>(resKey: string, cb: (asset: T, resKey: string) => void, autoReleaseRes: boolean, group?: string): void;
        private Destroy_LoadResKey;
        protected LoadResList(resKeyList: string[], cb: Function, hideLoading?: boolean, showWaiting?: boolean, parallelCount?: number): void;
        OnIIClick(event: cc.Event.EventTouch, key: string): any;
        private m_IIEventHandler;
        protected SetIIClickHandler(key: string, handler: Function, hideSound?: boolean, blockInputSeconds?: number): void;
        protected RemoveIIClickHandler(key: string): void;
        protected RemoveAllIIClickHandler(): void;
    }
}
declare namespace numas {
    abstract class App extends BaseUIComp {
        abstract get Version(): string;
        abstract get sdkCfg(): TSDKCfg;
        protected abstract get StartBundlePrefabCfg(): TPrefabCfg;
        protected abstract AdapterCanvas(canvas: cc.Canvas): void;
        protected get FrameRate(): number;
        protected abstract OnAppLoad(): void;
        protected get AppTracing(): boolean;
        static ins: App;
        private _canvas;
        private _platform;
        get p(): PlatformBase;
        private readonly START_BUNDLE_NAME;
        onLoad(): void;
        private __LoadStartResListAndOnLoad;
        private OnPreAppLoad;
        protected EnterFirstGame(firstGameBundleName: string): void;
        setDisplayStats(displayStats: boolean): App;
        setFrameRate(frameRate: number): App;
        protected FitHeight(): void;
        protected FitWidth(): void;
        protected FitCanvas(): App;
        protected FitCanvasWithVisiableSize(visibleWidth: number, visibleHeight: number): App;
        delayCall(seconds: number, cb: Function, block?: boolean): void;
        Debug(): void;
        private GetPlatformComponent;
    }
}
declare namespace numas {
    const Cfg: {
        DefaultUserKey: string;
    };
}
declare namespace numas {
    class LangUtil {
        private static _sysLang;
        private static _lang;
        private static _init;
        static IsSystemLanguageChinese(): boolean;
        private static InitSysLang;
        static Get(...key: any[]): string;
        static AddLangCfg(langCfg: {
            [langCode: string]: {
                [key: string]: string;
            };
        }): void;
    }
}
declare namespace numas {
    class Util {
        static safeCall(cb: Function): void;
        static onceCall: (cb: Function, cnt: number) => () => void;
        static onceCallEx: <T>(cb: Action<T>, cnt: number) => (p: T) => void;
        static playParticleSystem(particle: cc.ParticleSystem, delay?: number): void;
        static block(seconds: number): (target: any, methodName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    }
}
declare namespace numas {
    enum UIZIndex {
        Stage = 0,
        Normal = 128,
        PopUp = 256,
        TopModule = 512,
        TopMsg = 1024,
        SystemModule = 2048
    }
}
declare namespace numas {
    const IIStartPrefabCfg: {
        dft: {
            panel: {
                DialogUIPanel: {
                    key: string;
                    z: UIZIndex;
                };
                MsgUIPanel: {
                    key: string;
                    z: UIZIndex;
                };
                BlockInputUIPanel: {
                    key: string;
                    z: UIZIndex;
                };
                LoadingUIPanel: {
                    key: string;
                    z: UIZIndex;
                };
                WaitingUIPanel: {
                    key: string;
                    z: UIZIndex;
                };
            };
            comp: {};
        };
    };
}
declare namespace numas {
    class LangCfg {
        static readonly dft: {
            dialog_title: string;
            dialog_lablel0_ok: string;
            dialog_lablel_sure: string;
            dialog_lablel_cancel: string;
            login_game: string;
            login_fail_msg: string;
            login_retry: string;
        };
    }
}
declare namespace numas {
    class DialogUIPanelArgs {
        btnCount: number;
        msg: string;
        title: string;
        label0: string;
        label1: string;
        label2: string;
        btnFunc0?: Function;
        btnFunc1?: Function;
        btnFunc2?: Function;
        static Create1(msg: string, btnFunc0?: Function, label0?: string, title?: string): DialogUIPanelArgs;
        static Create2(msg: string, btnFunc0?: Function, btnFunc1?: Function, label0?: string, label1?: string, title?: string): DialogUIPanelArgs;
        static Create3(msg: string, btnFunc0?: Function, btnFunc1?: Function, btnFunc2?: Function, label0?: string, label1?: string, label2?: string, title?: string): DialogUIPanelArgs;
    }
}
declare namespace numas {
    const _LangCfg_DefaultJson: {
        en: {
            "default.dialog_title": string;
            "default.dialog_lablel0_ok": string;
            "default.dialog_lablel_sure": string;
            "default.dialog_lablel_cancel": string;
            "default.login_game": string;
            "default.login_fail_msg": string;
            "default.login_retry": string;
        };
        zh: {
            "default.dialog_title": string;
            "default.dialog_lablel0_ok": string;
            "default.dialog_lablel_sure": string;
            "default.dialog_lablel_cancel": string;
            "default.login_game": string;
            "default.login_fail_msg": string;
            "default.login_retry": string;
        };
    };
}
declare namespace numas {
    class AudioMgr extends cc.Component {
        static ins: AudioMgr;
        protected onLoad(): void;
        private m_AudioHelper;
        SetHelper(helper: IAudioHelper): void;
        UseDefaultHelper(): void;
        private m_ToPlayEffectQueue;
        private m_PlayEffectScheduler;
        private AddPlayEffect;
        private ScheduleToPlayEffectQueue;
        private __i_StartScheduler;
        private __i_StopScheduler;
        private DEFAULT_EFFECT;
        SetDefaultEffect(audioKey: string): void;
        get effectOffBV(): BooleanBV;
        private _effectOffBV;
        PlayEffect(audioKey?: string): void;
        get effectVolume(): number;
        set effectVolume(vol: number);
        private PlayEffect_Impl;
        private _musicOffBV;
        get musicOffBV(): BooleanBV;
        private m_LastMusicKey;
        playMusic(audioKey: string, loop?: boolean): void;
        IsMusicPlaying(): boolean;
        PauseMusic(): void;
        ResumeMusic(): void;
        StopMusic(): void;
        get musicVolume(): number;
        set musicVolume(vol: number);
    }
}
declare namespace numas {
    class DefaultAudioHelper extends cc.EventTarget implements IAudioHelper {
        private _effectQueue;
        PlayEffect(audioClip: cc.AudioClip): void;
        GetEffectVolume(): number;
        SetEffectVolume(vol: number): void;
        StopAllEffect(): void;
        private m_CurMusicId;
        private m_MusicClip;
        PlayMusic(musicClip: cc.AudioClip, loop: boolean): void;
        IsMusicPlaying(): boolean;
        PauseMusic(): void;
        ResumeMusic(): void;
        StopMusic(): void;
        GetMusicVolume(): number;
        SetMusicVolume(vol: number): void;
    }
}
declare namespace numas {
    interface IAudioHelper {
        PlayEffect(audioClip: cc.AudioClip): void;
        GetEffectVolume(): number;
        SetEffectVolume(vol: number): void;
        StopAllEffect(): void;
        PlayMusic(audioClip: cc.AudioClip, loop: boolean): void;
        IsMusicPlaying(): boolean;
        PauseMusic(): void;
        ResumeMusic(): void;
        StopMusic(): void;
        GetMusicVolume(): number;
        SetMusicVolume(vol: number): void;
    }
}
declare namespace numas {
    namespace Const {
    }
}
declare namespace numas {
    namespace ENUM {
    }
}
declare namespace numas {
    type Constructor<T = unknown> = new (...args: any[]) => T;
    type VoidFunction = () => void;
    type New<T> = new () => T;
    type Action<T> = (elem: T) => void;
    type Func<T, RETURN> = (elem: T) => RETURN;
    type Predicate<T> = (elem: T) => boolean;
    type ValueChangedFunc<T> = (cur: T, pre: T) => void;
    type Resolve<T> = (value?: T) => void;
    type Resolve2<T, S> = (value: T, t: S) => void;
    type Reject<T> = (reason?: T) => void;
    type StringKeyDict<V> = {
        [key: string]: V;
    };
}
declare namespace numas {
    class DelayEventComponent extends cc.Component {
        private m_IsEventHandlable;
        private m_EventQueue;
        private get EventQueue();
        WrapEventHandler(handler: Function, target: any): Function;
        HandleEvents(): void;
        BlockEvents(): void;
        onDestroy(): void;
    }
}
declare namespace numas {
    abstract class BaseLink<T> implements IReference {
        get Count(): number;
        IndexOf(find: Predicate<T>): number;
        ReverseIndexOf(find: Predicate<T>): number;
        Fetch(find: Predicate<T>): T;
        ReverseFetch(find: Predicate<T>): T;
        FetchByIndex(index: number): T;
        ReverseFetchByIndex(index: number): T;
        Remove(find: Predicate<T>, handler?: Action<T>): void;
        ReverseRemove(find: Predicate<T>, handler: Action<T>): void;
        RemoveFirst(find: Predicate<T>, handler?: Action<T>): void;
        ReverseRemoveFirst(find: Predicate<T>, handler: Action<T>): void;
        RemoveAll(handler?: Action<T>): void;
        ReverseRemoveAll(handler?: Action<T>): void;
        For(breakIf: Predicate<T>): boolean;
        ReverseFor(breakIf: Predicate<T>): boolean;
        ForEach(handler: Action<T>): void;
        ReverseForEach(handler: Action<T>): void;
        CountIf(ifFunc: Predicate<T>): number;
        Contains(find: Predicate<T>, handler?: Action<T>): boolean;
        protected FrontValue(): T;
        protected TailValue(): T;
        protected AddFront(elem: T): void;
        protected AddTail(elem: T): void;
        protected Get(): T;
        protected ReverseGet(): T;
        Reset(): void;
        abstract Return(): void;
        private m_front;
        private m_tail;
        private m_len;
        constructor();
        private AddNext;
        private AddPrevious;
        private RemoveNext;
        private RemovePrevious;
        private __RemoveByFind;
        private __RemoveFirstByFind;
        private __IndexOf;
        private __Fetch;
        private __FetchByIndex;
        private __For;
        private __ForEach;
    }
}
declare namespace numas {
    abstract class Queue<T> extends BaseLink<T> {
        get Front(): T;
        get Tail(): T;
        Enqueue(elem: T): void;
        Dequeue(): T;
        ReverseDequeue(): T;
    }
}
declare namespace numas {
    class AnyQueue extends Queue<any> {
        static Borrow(): AnyQueue;
        Return(): void;
    }
}
declare namespace numas {
    abstract class Stack<T> extends BaseLink<T> {
        get Top(): T;
        get Bottom(): T;
        Push(elem: T): void;
        Pop(): T;
        ReversePop(): T;
    }
}
declare namespace numas {
    class AnyStack extends Stack<any> {
        static Borrow(): AnyStack;
        Return(): void;
    }
}
declare namespace numas {
    class Heap<T> {
        private m_Compare;
        private data;
        constructor(m_Compare: (a: T, b: T) => number);
        private left;
        private right;
        private parent;
        Add(element: T): void;
        private siftUp;
        ExtractRoot(): T;
        private siftDown;
        get Count(): number;
        get Root(): T;
        Clear(): void;
    }
}
declare namespace numas {
    class LinkNode implements IReference {
        Next: LinkNode;
        Previous: LinkNode;
        Value: any;
        Reset(): void;
        static Borrow(value?: any): LinkNode;
        Return(): void;
    }
}
declare namespace numas {
    class encrypt {
        static encodeBase64(s: string): string;
        static decodeBase64(s: string): string;
    }
}
declare namespace numas {
    class EventCenter extends cc.EventTarget {
        private constructor();
        private static _ins;
        static get ins(): EventCenter;
    }
}
declare namespace numas {
    class CocosLocalStorageHelper implements ILocalStorageHelper {
        private constructor();
        private static _ins;
        static get ins(): CocosLocalStorageHelper;
        save(): void;
        deleteKey(key: string): void;
        hasKey(key: string): boolean;
        setBool(key: string, val: boolean, isEncrypt: boolean): void;
        getBool(key: string): boolean;
        getBoolWithDefault(key: string, defaultVal: boolean): boolean;
        setInt(key: string, val: number, isEncrypt: boolean): void;
        getInt(key: string): number;
        getIntWithDefault(key: string, defaultVal: number): number;
        setString(key: string, val: string, isEncrypt: boolean): void;
        getString(key: string): string;
        getStringWithDefault(key: string, defaultVal: string): string;
        setObject<T extends {}>(key: string, val: T, isEncrypt: boolean): void;
        getObject<T>(key: string): T;
        getObjectWithDefault<T>(key: string, defaultVal: T): T;
        private PRE_FIX;
        private getItem;
        private setItem;
    }
}
declare namespace numas {
    interface ILocalStorageHelper {
        save(): void;
        deleteKey(key: string): void;
        hasKey(key: string): boolean;
        setBool(key: string, val: boolean, isEncrypt: boolean): any;
        getBool(key: string): boolean;
        getBoolWithDefault(key: string, defaultVal: boolean): any;
        setInt(key: string, val: number, isEncrypt: boolean): any;
        getInt(key: string): number;
        getIntWithDefault(key: string, defaultVal: number): number;
        setString(key: string, val: string, isEncrypt: boolean): any;
        getString(key: string): string;
        getStringWithDefault(key: string, defaultVal: string): any;
        setObject<T extends {}>(key: string, val: T, isEncrypt: boolean): any;
        getObject<T>(key: string): T;
        getObjectWithDefault<T>(key: string, defaultVal: T): T;
    }
}
declare namespace numas {
    class LSMgr extends cc.Component {
        static ins: LSMgr;
        onLoad(): void;
        private h;
        SetHelper(helper: ILocalStorageHelper): void;
        UseDefaultHelper(): void;
        deleteKey(key: string): void;
        hasKey(key: string): boolean;
        setBool(key: string, val: boolean, isEncrypt: boolean): void;
        getBool(key: string): boolean;
        getBoolWithDefault(key: string, defaultVal: boolean): any;
        setInt(key: string, val: number, isEncrypt: boolean): void;
        getInt(key: string): number;
        getIntWithDefault(key: string, defaultVal: number): number;
        setString(key: string, val: string, isEncrypt: boolean): void;
        getString(key: string): string;
        getStringWithDefault(key: string, defaultVal: string): any;
        setObject<T extends {}>(key: string, val: T, isEncrypt: boolean): void;
        getObject<T>(key: string): T;
        getObjectWithDefault<T>(key: string, defaultVal: T): T;
    }
}
declare namespace numas {
    class UserLSMgr extends cc.Component {
        static ins: UserLSMgr;
        onLoad(): void;
        private h;
        SetHelper(helper: ILocalStorageHelper): void;
        UseDefaultHelper(): void;
        private m_UserId;
        setUserId(uid: string): void;
        private checkUserId;
        private key2UserKey;
        deleteKey(key: string): void;
        hasKey(key: string): boolean;
        setBool(key: string, val: boolean, isEncrypt: boolean): void;
        getBool(key: string): boolean;
        getBoolWithDefault(key: string, defaultVal: boolean): any;
        setInt(key: string, val: number, isEncrypt: boolean): void;
        getInt(key: string): number;
        getIntWithDefault(key: string, defaultVal: number): number;
        setString(key: string, val: string, isEncrypt: boolean): void;
        getString(key: string): string;
        getStringWithDefault(key: string, defaultVal: string): any;
        setObject<T extends {}>(key: string, val: T, isEncrypt: boolean): void;
        getObject<T>(key: string): T;
        getObjectWithDefault<T>(key: string, defaultVal: T): T;
    }
}
declare namespace numas {
    class NodePool {
        private static _m;
        static Get<T extends cc.Component>(k: string, typ: {
            new (): T;
        }): T;
        static Put<T extends cc.Component>(k: string, c: T): void;
        private static GetPool;
    }
}
declare namespace numas {
    interface IAutoReturn {
        AutoReturn<T extends IReference>(target: T): T;
    }
    interface IReference {
        Reset(): void;
        Return(): void;
    }
}
declare namespace numas {
    interface IReferenceSinglePool {
        Borrow(): IReference;
        Return(reference: IReference): void;
        Add(count: number): void;
        Remove(count: number): void;
        RemoveAll(): any;
    }
}
declare namespace numas {
    class ReferencePool {
        private static readonly s_ReferenceCollections;
        static Debug(): void;
        static get Count(): number;
        static ClearAll(): void;
        static Borrow<T extends IReference>(typ: New<T>): T;
        static Return<T extends IReference>(typ: New<T>, reference: T): void;
        static Add<T extends IReference>(typ: {
            new (): T;
        }, count: number): void;
        static Remove<T extends IReference>(typ: {
            new (): T;
        }, count: number): void;
        static RemoveAll<T extends IReference>(typ: {
            new (): T;
        }): void;
        private static GetReferenceCollection;
    }
}
declare namespace numas {
    class ReferenceSinglePool<T extends IReference> implements IReferenceSinglePool {
        private m_References;
        private m_UsingReferenceCount;
        private m_BorrowReferenceCount;
        private m_ReleaseReferenceCount;
        private m_AddReferenceCount;
        private m_RemoveReferenceCount;
        private m_New;
        constructor(creator: New<T>);
        get UnusedReferenceCount(): number;
        get UsingReferenceCount(): number;
        get BorrowReferenceCount(): number;
        get ReleaseReferenceCount(): number;
        get AddReferenceCount(): number;
        get RemoveReferenceCount(): number;
        Borrow(): IReference;
        Return(reference: IReference): void;
        Add(count: number): void;
        Remove(count: number): void;
        RemoveAll(): void;
    }
}
declare namespace numas {
    module StateMachine {
        const VERSION = "2.3.5";
        const Result: {
            SUCCEEDED: number;
            NOTRANSITION: number;
            CANCELLED: number;
            PENDING: number;
        };
        const Error: {
            INVALID_TRANSITION: number;
            PENDING_TRANSITION: number;
            INVALID_CALLBACK: number;
        };
        const WILDCARD = "*";
        const ASYNC = "async";
        function create(cfg: any, target?: any): {
            current: string;
            is: (state: Array<string> | string) => boolean;
            can: (event: string) => boolean;
            cannot: (event: string) => boolean;
            transitions: () => Array<string>;
            isFinished: () => boolean;
        };
    }
}
declare namespace numas {
    namespace task {
        type TaskFunc = (resolve: Function, reject?: Function) => void;
        enum ETaskStatus {
            NONE = 0,
            RUNNING = 1,
            DONE = 2,
            ERROR = 3
        }
        class TaskComponent extends cc.Component {
            private _m_TaskQueue;
            private get TaskQueue();
            private _m_RunningTaskQueue;
            private get RunningTaskQueue();
            private m_TaskScheduler;
            private _m_CallbackQueue;
            private get CallbackQueue();
            AddFunc(func: TaskFunc): TaskComponent;
            Run(parallelCount: number, onCompleted?: Function): TaskComponent;
            RemoveSelf(): void;
            private StartTaskScheduler;
            private StopTaskScheduler;
            private UpdateLoading;
            onDestroy(): void;
        }
    }
}
declare namespace numas {
    abstract class date {
        static TimeStamp2Date(timeStamp: number): Date;
        static Date2TimeStamp(date: Date): number;
        static getTimeStamp(): number;
        static getMilliTimeStamp(): number;
        static IsSameDay(date1: Date, date2: Date): boolean;
        static IsSameDayTimeStamp(ts1: number, ts2: number): boolean;
        static zeroHourOfTimeStamp(timeStamp: number): number;
        static zeroHourTimeStampOfDate(date: Date): number;
        static tomorrowTimeStamp(timeStamp: number): number;
        static tomorrowTimeStampOfDate(date: Date): number;
        static IsToday(timeStamp: number): boolean;
        static IsBeforToday(timeStamp: number): boolean;
        static Format(seconds: number, format?: string, single?: boolean): string;
    }
}
declare namespace numas {
    enum Dir {
        Right = 0,
        Top = 1,
        Left = 2,
        Bottom = 3
    }
}
declare namespace numas {
    abstract class UIPanel<ARGS = any> extends BaseUIComp implements IAutoCloseUIComp<ARGS> {
        protected args: ARGS;
        private _$isOpened_;
        private _$isOpening_;
        private _$uph_;
        GetUPH(): UIPH;
        GetResKey(): string;
        $__i_InitByUPH(placeHolder: UIPH): void;
        $__i_CloseByUPH(): void;
        $__i_OnOpen(uiArgs: ARGS): void;
        protected abstract OnCreate(): void;
        protected abstract OnRelease(): void;
        protected abstract OnOpen(uiArgs: ARGS): void;
        Close(): void;
        private _m_BVList_;
        protected BindBV<T>(observer: BV<T>, callback: ValueChangedFunc<T>, callOnBinded: boolean): void;
        protected UnbindAllBV(): void;
        protected onDestroy(): void;
        private _guideNotify;
        SetGuideNotificationActive(active: boolean): void;
        private TryNotifyGuideEvent;
        __i_AutoCloseUIComp<T extends UIComp<any>>(uiComp: T): T;
        private _i_UICompQueue;
        private get _I_AutoCloseUICompQueue();
        private __i_CloseAllAutoCloseUIComp;
    }
}
declare namespace numas {
    namespace guide {
        const Event: {
            DRAG_START: string;
            DRAG_END: string;
        };
        const ActionType: {
            fade: string;
            up_down: string;
        };
        type ActionData<T> = {
            typ: string;
            delay: number;
            duration: number;
            from: T;
            to: T;
        };
        const PositionType: {
            related_to_node_id: string;
        };
        type PositionData = {
            typ: string;
            node_id: string;
            dx: number;
            dy: number;
        };
        type StepData = {
            typ: string;
            kv: {
                k: string;
                v: any;
            }[];
        };
        type GuideData = {
            steps: StepData[];
        };
        class Step {
            private m_Data;
            private m_Helper;
            private m_NextStepOnceFunc;
            get NextStep(): Function;
            constructor(data: StepData, helper: IGuidePlayer, nextStepOnceFunc: Function);
            GetV(k: string): any;
            GetVWithDefault(k: string, defaultV: any): any;
            get typ(): string;
            get kv(): {
                k: string;
                v: any;
            }[];
            get args(): any;
            get click_bg(): boolean;
            get color(): number;
            get col_row(): ITileData;
            get dir(): Dir;
            get dx(): number;
            get dy(): number;
            get enter_action(): ActionData<number>;
            get exit_action(): ActionData<number>;
            get path_action(): {
                from: PositionData;
                to: PositionData;
                duration: number;
                interval: number;
            };
            get position(): PositionData;
            get res_key(): string;
            get text(): string;
            get time(): number;
            get tiles(): ITileData[];
            get node_id(): string;
            get next_step_event(): string;
            get x(): number;
            get y(): number;
            get z(): number;
            GetNodePosition(node: cc.Node, positionData: PositionData): cc.Vec3;
            CheckColRow(oColRow: ITileData): boolean;
        }
        abstract class ActionUtil {
            static Run<T>(node: cc.Node, action: ActionData<T>, cb: Function): cc.Tween;
            private static RunFadeAction;
            private static RunUpDownAction;
        }
        interface IGuideDelegate {
            OnGuideFinished(): any;
            OnGuideGetNode(node_id: string): cc.Node;
            OnGuideStep(step: Step): any;
        }
        interface IGuideDialog {
            node: cc.Node;
            Show(step: Step, nextFunc: Function): any;
        }
        interface IGuideFinger {
            node: cc.Node;
            Show(step: Step): any;
            Hide(): any;
            OnDragStart(): any;
            OnDragEnd(): any;
        }
        type GuideUIPanelArgs = {
            guideCtrl: GuideCtrl;
            delegate: IGuideDelegate;
            guideData: GuideData;
            onCompleted: Function;
        };
        interface IGuidePlayer {
            GetNodePosition(node: cc.Node, positionData: PositionData): cc.Vec3;
            Step: Step;
        }
        abstract class GuidePlayerUIPanel extends UIPanel<GuideUIPanelArgs> implements IGuidePlayer {
            protected abstract get TransferRoot(): cc.Node;
            protected abstract get Background(): cc.Node;
            protected abstract get Dialog(): IGuideDialog;
            protected abstract get Finger(): IGuideFinger;
            protected get Delegate(): IGuideDelegate;
            private _stepIndex;
            protected get stepDatas(): StepData[];
            private _bInitNextStep;
            private _step;
            get Step(): Step;
            private m_OnBackgroundClick_;
            private m_NodeParentMap;
            protected abstract OnCreateSelf(): any;
            protected abstract OnReleaseSelf(): any;
            protected abstract SetBackgroundClickHandler(handler: Function): any;
            protected abstract OnOpenSelf(): any;
            protected OnCreate(): void;
            protected OnOpen(uiArgs: GuideUIPanelArgs): void;
            protected OnRelease(): void;
            protected onDestroy(): void;
            private nextStep;
            private __doStep;
            GetNodePosition(node: cc.Node, positionData: PositionData): cc.Vec3;
        }
        class GuideCtrl {
            private static _playingDict;
            static GetIsGuiding(guideKey: string): boolean;
            static SetIsGuiding(guideKey: string, isGuiding: boolean): void;
            private _guideKey;
            private _delegate;
            static Create(guideKey: string, delegate: IGuideDelegate): GuideCtrl;
            private constructor();
            Release(): void;
            IsGuided(): boolean;
            get IsGuiding(): boolean;
            StartGuide(pfbKey: string, guideData: GuideData): void;
            private FinishGuide;
            private _guidePlayer;
            get GuidePlayer(): IGuidePlayer;
            set GuidePlayer(guidePlayer: IGuidePlayer);
            get Step(): Step;
        }
    }
}
declare namespace numas {
    interface IDrag<T> {
        SetZIndex(zIndex: number): void;
        OnDragStart(event: cc.Event.EventTouch, delegate: IDragDelegate<T>): void;
        OnDragMove(event: cc.Event.EventTouch, delegate: IDragDelegate<T>): void;
        OnDragEnd(event: cc.Event.EventTouch, delegate: IDragDelegate<T>): void;
        DragTarget(): T;
    }
    interface IDragDelegate<T> {
        OnDragTouchStart(item: IDrag<T>, event: cc.Event.EventTouch): boolean;
        OnDragTouchMove(item: IDrag<T>, event: cc.Event.EventTouch): any;
        OnDragTouchEnd(item: IDrag<T>, event: cc.Event.EventTouch): any;
    }
}
declare namespace numas {
    interface ITileData {
        col: number;
        row: number;
    }
    interface ITile extends ITileData {
        col: number;
        row: number;
        Return(): void;
    }
}
declare namespace numas {
    class Tile implements IReference {
        col: number;
        row: number;
        static Borrow(): Tile;
        Return(): void;
        Reset(): void;
        Init(col: number, row: number): Tile;
    }
}
declare namespace numas {
    class HttpUtil {
        static xxxx(): void;
    }
}
declare namespace numas {
    class HttpWeChatUtil {
        static Get(url: string, data: {}, onSuccess: Resolve<any>, onFail: Reject<any>): void;
        static Post(url: string, data: {}, onSuccess: Resolve<any>, onFail: Reject<any>): void;
        private static request;
    }
}
declare namespace numas {
    class NetUtil {
        static IsWifi(): boolean;
    }
}
declare namespace numas {
    type LoadingADUIPanelArgs = {
        duration: number;
        cb: Function;
    };
    abstract class ALoadingADUIPanel<T extends LoadingADUIPanelArgs> extends UIPanel<T> {
        protected abstract OnOpenLoadingAD(args: T): any;
        protected OnOpen(args: T): void;
    }
}
declare namespace numas {
    class PlatformUtil {
        static get IsiOS(): boolean;
        static get IsWechat(): boolean;
        static OpenAppStore(cfg: TSDKCfg): void;
    }
}
declare namespace numas {
    abstract class SDKBase extends BaseComp {
        private _isInit;
        protected sdkCfg: TSDKCfg;
        Init(cfg: TSDKCfg): any;
        protected abstract OnInit(cfg: TSDKCfg): void;
    }
}
declare namespace numas {
    abstract class ADBase extends SDKBase implements IAD {
        abstract IsSupport(): boolean;
        protected abstract InitByScriptImpl(): void;
        protected abstract ShowBannerImpl(isShow: boolean): void;
        protected abstract IsInterstitialAvailableImpl(): boolean;
        protected abstract LoadInterstitialImpl(): void;
        protected abstract ShowInterstitialImpl(handler: InterstitialCallback): void;
        protected abstract IsRewardedVideoAvailableImpl(): boolean;
        protected abstract ShowRewardedVideoImpl(callback: (type: EInternalRewardedVideo, isRewared: boolean) => void): void;
        readonly RewardedVideoBV: BooleanBV;
        readonly RemoveAdsSecondsBV: NumberBV;
        private m_InitByScript;
        IsInitByScript(): boolean;
        InitByScript(): void;
        ShowBanner(isShow: boolean): void;
        IsInterstitialAvailable(): boolean;
        LoadInterstitial(): void;
        LoadInterstitialIfNotAvalable(): void;
        ShowInterstitialWithBlocker(callback: Function, blockerPrefabKey: string, blockDuration: number): void;
        ShowInterstitial(callback: Function): void;
        private __ShowInterstitial;
        IsRewardedVideoAvailable(): boolean;
        ShowRewardedVideo(callback: () => void): void;
        private m_Tmp_IsReceivedRewardedEvent;
        private m_Tmp_IsReceivedHideEvent;
        ShowRewardedVideoEx(callback: RewardedVideoCallback): void;
        RemoveAdsForSeconds(seconds: number): void;
        private __i_StartADTick;
        private __I_AD_TICK;
        IsAdRemoved(): boolean;
    }
}
declare namespace numas {
    abstract class PlatformBase extends cc.Component {
        private _isInit;
        protected sdkCfg: TSDKCfg;
        Init(cfg: TSDKCfg): PlatformBase;
        protected abstract GetUserClass(): any;
        get user(): IUser;
        private _user;
        protected abstract GetADClass(): any;
        get ad(): IAD;
        private _ad;
        protected abstract GetVibrateClass(): any;
        get vibrate(): IVibrate;
        private _vibrate;
    }
}
declare namespace numas {
    abstract class UserBase extends SDKBase implements IUser {
        protected OnInit(cfg: TSDKCfg): void;
        abstract IsAuthedUserInfo(): boolean;
        abstract AuthUserInfo(buttonNode: cc.Node, onSuccess: Function, onFail: Function): void;
        abstract LoginPlatform(loginCallback: PlatformLoginCallback, isAuthedUserInfo: boolean): void;
        private m_UserId;
        protected get uid(): string;
        private _serverLoginHelper;
        private UserDefaultServerLoginHelper;
        LoginServer(platformLoginResult: PlatformLoginResult, loginCallback: ServerLoginCallback): void;
        protected abstract OnLoginServerSuccess(): void;
        protected abstract OnLoginServerFailed(): void;
        private m_Dict;
        protected Key2UserKey(uid: string, key: string): string;
        protected DevKey2RealKey(devKey: string): string;
        protected RealKey2DevKey(realKey: string): string;
        private GetGameCenterBV;
        ReportScoreWithDevKey(devKey: string, score: number): void;
        protected abstract GetGameCenterCfg(): TGameCenterCfg;
        protected abstract ReportScore(realKey: string, score: number): any;
        GetGameCenterVal(devKey: string): number;
        SetGameCenterVal(devKey: string, val: number): void;
        private m_ToUploadGameTimeLS;
        UploadGameTime(): void;
        private m_GameTimeScheduler;
        private readonly TIME_INC_INTERVAL;
        private StartGameTimeScheduler;
        private StopGameSimeScheduler;
        private GameTimeTick;
        abstract FiveStar(): void;
        abstract IsSupportLeaderboard(): boolean;
        abstract ShowDefaultLeaderboard(): void;
        abstract IsSupportRateUsByOpenUrl(): boolean;
        abstract RateUsByOpenUrl(): void;
        abstract IsSupportContactUs(): boolean;
        abstract ContactUs(): void;
    }
}
declare namespace numas {
    abstract class VibrateBase extends SDKBase implements IVibrate {
        private _off;
        get off(): BooleanBV;
        Toggle(): boolean;
        protected OnInit(cfg: TSDKCfg): void;
        Default(): void;
        abstract DefaultImpl(): void;
    }
}
declare namespace numas {
    class CfgUtil {
        static k2v(kvs: TKV[], k: string): string;
        static v2k(kvs: TKV[], v: string): string;
    }
}
declare namespace numas {
    type TKV = {
        k: string;
        v: string;
        d: string;
    };
    type TGameCenterCfg = {
        Ranks: TKV[];
    };
    type TPlatformCfg = {
        AppId: string;
        GameCenter: TGameCenterCfg;
        kvs: TKV[];
    };
    type TSDKCfg = {
        iOS: TPlatformCfg;
        wx: TPlatformCfg;
    };
}
declare namespace numas {
    enum EInterstitial {
        NOT_AVAILABLE = 0,
        LOAD_ERROR = 1,
        SHOW = 2,
        SHOW_ERROR = 3,
        CLICK = 4,
        HIDE = 5
    }
    enum EInternalRewardedVideo {
        NOT_AVAILABLE = 0,
        SHOW_ERROR = 1,
        SHOW = 2,
        HIDE = 3,
        REWARDED = 4
    }
    enum ERewardedVideo {
        NOT_AVAILABLE = 0,
        SHOW = 1,
        HIDE = 2
    }
    type InterstitialCallback = (type: EInterstitial) => void;
    type RewardedVideoCallback = (type: ERewardedVideo, isRewared: boolean) => void;
    interface IAD {
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
        ShowInterstitial(callback: Function): any;
        IsRewardedVideoAvailable(): boolean;
        ShowRewardedVideo(callback: () => void): void;
        ShowRewardedVideoEx(callback: RewardedVideoCallback): void;
        RemoveAdsForSeconds(seconds: number): void;
    }
}
declare namespace numas {
    type PlatformLoginResult = {
        success: boolean;
        openid?: string;
        error?: string;
    };
    type PlatformLoginCallback = (args: PlatformLoginResult) => void;
    interface IUser {
        Init(cfg: TSDKCfg): void;
        GetGameCenterVal(devKey: string): number;
        SetGameCenterVal(devKey: string, val: number): void;
        IsAuthedUserInfo(): boolean;
        AuthUserInfo(buttonNode: cc.Node, onSuccess: Function, onFail: Function): void;
        LoginPlatform(loginCallback: PlatformLoginCallback, isAuthedUserInfo: boolean): void;
        LoginServer(platformLoginResult: PlatformLoginResult, loginCallback: ServerLoginCallback): void;
        UploadGameTime(): void;
        FiveStar(): void;
        IsSupportLeaderboard(): boolean;
        ShowDefaultLeaderboard(): void;
        IsSupportRateUsByOpenUrl(): boolean;
        RateUsByOpenUrl(): void;
        IsSupportContactUs(): boolean;
        ContactUs(): void;
    }
}
declare namespace numas {
    interface IVibrate {
        off: BooleanBV;
        Init(cfg: TSDKCfg): void;
        Toggle(): boolean;
        Default(): void;
    }
}
declare namespace numas {
    class DefaultServerLoginHelper implements IServerLoginHelper {
        Login(args: PlatformLoginResult, loginCallback: ServerLoginCallback): void;
    }
}
declare namespace numas {
    interface IServerLoginHelper {
        Login(args: PlatformLoginResult, loginCallback: ServerLoginCallback): void;
    }
}
declare namespace numas {
    type ServerLoginResult = {
        success: boolean;
        uid?: string;
        error?: string;
    };
    type ServerLoginCallback = (args: ServerLoginResult) => void;
}
declare namespace numas {
    class AndroidIronSource extends ADBase implements IAD {
        IsSupport(): boolean;
        protected InitByScriptImpl(): void;
        protected OnInit(): void;
        protected ShowBannerImpl(isShow: boolean): void;
        private DestroyBanner;
        protected IsInterstitialAvailableImpl(): boolean;
        protected LoadInterstitialImpl(): void;
        protected ShowInterstitialImpl(handler: InterstitialCallback): void;
        protected IsRewardedVideoAvailableImpl(): boolean;
        protected ShowRewardedVideoImpl(callback: (type: EInternalRewardedVideo, isRewared: boolean) => void): void;
    }
}
declare namespace numas {
    class DefaultAD extends ADBase implements IAD {
        private _i_RewardedVideoAvailable;
        private __I_SetRewardedVideoAvailable;
        IsSupport(): boolean;
        protected OnInit(): void;
        protected ShowBannerImpl(isShow: boolean): void;
        protected IsInterstitialAvailableImpl(): boolean;
        protected LoadInterstitialImpl(): void;
        protected ShowInterstitialImpl(handler: InterstitialCallback): void;
        protected IsRewardedVideoAvailableImpl(): boolean;
        protected ShowRewardedVideoImpl(callback: (type: EInternalRewardedVideo, isRewared: boolean) => void): void;
        protected InitByScriptImpl(): void;
    }
}
declare namespace numas {
    class DefaultPlatform extends PlatformBase {
        protected GetUserClass(): any;
        protected GetADClass(): any;
        protected GetVibrateClass(): typeof DefaultVibrate;
    }
}
declare namespace numas {
    class DefaultUser extends UserBase implements IUser {
        IsAuthedUserInfo(): boolean;
        AuthUserInfo(buttonNode: cc.Node, onSuccess: Function, onFail: Function): void;
        LoginPlatform(loginCallback: PlatformLoginCallback, isAuthedUserInfo: boolean): void;
        ReportScore(realKey: string, score: number): void;
        protected GetGameCenterCfg(): TGameCenterCfg;
        protected OnLoginServerSuccess(): void;
        protected OnLoginServerFailed(): void;
        FiveStar(): void;
        IsSupportLeaderboard(): boolean;
        ShowDefaultLeaderboard(): void;
        IsSupportRateUsByOpenUrl(): boolean;
        RateUsByOpenUrl(): void;
        IsSupportContactUs(): boolean;
        ContactUs(): void;
    }
}
declare namespace numas {
    class DefaultVibrate extends VibrateBase implements IVibrate {
        DefaultImpl(): void;
    }
}
declare namespace numas {
    class WeChatAD extends ADBase implements IAD {
        IsSupport(): boolean;
        protected InitByScriptImpl(): void;
        protected OnInit(cfg: TSDKCfg): void;
        protected ShowBannerImpl(isShow: boolean): void;
        protected IsInterstitialAvailableImpl(): boolean;
        protected LoadInterstitialImpl(): void;
        protected ShowInterstitialImpl(handler: InterstitialCallback): void;
        protected IsRewardedVideoAvailableImpl(): boolean;
        protected ShowRewardedVideoImpl(callback: (type: EInternalRewardedVideo, isRewared: boolean) => void): void;
    }
}
declare namespace numas {
    enum WeChatAuthScope {
        userInfo = 0,
        writePhotosAlbum = 1
    }
    class WeChatAuthUtil {
        static IsAuthed(typ: WeChatAuthScope): boolean;
        static AuthUserInfo(posNode: cc.Node, onSuccess: Function, onFail: Function): void;
        private static GetSetting;
        private static __IsAuth;
        private static __AuthUserInfo;
        private static convertToWxPos;
    }
}
declare namespace numas {
    class WeChatPlatform extends PlatformBase {
        protected GetUserClass(): any;
        protected GetADClass(): any;
        protected GetVibrateClass(): typeof WeChatVibrate;
    }
}
declare namespace numas {
    class WeChatUser extends UserBase implements IUser {
        IsAuthedUserInfo(): boolean;
        AuthUserInfo(buttonNode: cc.Node, onSuccess: Function, onFail: Function): void;
        LoginPlatform(loginCallback: PlatformLoginCallback, isAuthedUserInfo: boolean): void;
        private __GetUserInfo;
        protected OnLoginServerSuccess(): void;
        protected OnLoginServerFailed(): void;
        protected GetGameCenterCfg(): TGameCenterCfg;
        protected ReportScore(realKey: string, score: number): void;
        FiveStar(): void;
        IsSupportLeaderboard(): boolean;
        ShowDefaultLeaderboard(): void;
        IsSupportRateUsByOpenUrl(): boolean;
        RateUsByOpenUrl(): void;
        IsSupportContactUs(): boolean;
        ContactUs(): void;
    }
}
declare namespace numas {
    class WeChatVibrate extends VibrateBase implements IVibrate {
        DefaultImpl(): void;
        private vibrateShort;
        private vibrateLong;
    }
}
declare namespace numas {
    class iOSATT {
        private static _ins;
        static get ins(): iOSATT;
        Init(cfg: TSDKCfg): void;
        private iOSCallbackHandler;
        private HandleRequestTrackingAuthorizationResult;
        private m_RequestIDFACallback;
        RequestTrackingAuthorization(callback: (auth: boolean) => void, requestAuth: boolean): void;
    }
}
declare namespace numas {
    class iOSGameCenter {
        private static _ins;
        static get ins(): iOSGameCenter;
        Init(cfg: TSDKCfg): void;
        private m_LoginCallback;
        private InvokeLoginCallback;
        Login(loginCallback: PlatformLoginCallback): void;
        private iOSCallbackHandler;
        private HandleLogin;
        private m_sync_uid;
        private HandleRequestLocalPlayerScore;
        private m_SyncHandler;
        SyncGameCenter(uid: string, gameCenterCfg: TGameCenterCfg, handler: (reakKey: string, score: number) => void): void;
        private GetIsSynced;
        private SetIsSynced;
        private LoginGameCenter;
        private GetUserId;
        private IsAuthenticated;
        ReportScore(leaderboardIdentifier: string, score: number): void;
        ReportAchievement(achievementIdentifier: string, percentComplete: number): void;
        FiveStar(): void;
        ShowDefaultLeaderboard(): void;
        ShowLeaderboards(leaderboardIdentifier: string, timeScope: number): void;
        ShowAchievement(): void;
        RateUsByOpenUrl(app_id: string): void;
        RateUsWithinApp(app_id: string): void;
        RequestLocalPlayScore(leaderboardIdentifier: string): void;
    }
}
declare namespace numas {
    class iOSIronSourceAD extends ADBase implements IAD {
        IsSupport(): boolean;
        private _init_by_script;
        protected InitByScriptImpl(): void;
        protected OnInit(): void;
        protected ShowBannerImpl(isShow: boolean): void;
        private DestroyBanner;
        protected IsInterstitialAvailableImpl(): boolean;
        protected LoadInterstitialImpl(): void;
        protected ShowInterstitialImpl(handler: InterstitialCallback): void;
        protected IsRewardedVideoAvailableImpl(): boolean;
        protected ShowRewardedVideoImpl(callback: (type: EInternalRewardedVideo, isRewared: boolean) => void): void;
        onDestroy(): void;
        private m_ShowInterstitialCallback;
        private m_ShowRewardedVideoCallback;
        private ShowInterstitialCallback;
        private ShowRewardedVideoCallback;
        protected iOSCallbackHandler(jsonData: {
            type: string;
            event: string;
            rewarded?: boolean;
        }): void;
        private HandleBanner;
        private HandleInterstitial;
        private HandleRewardedVideo;
    }
}
declare namespace numas {
    class iOSMsgBridge extends cc.EventTarget {
        private static _ins;
        static get ins(): iOSMsgBridge;
        private EmitiOSEvent;
    }
}
declare namespace numas {
    class iOSPlatform extends PlatformBase {
        protected GetUserClass(): any;
        protected GetADClass(): any;
        protected GetVibrateClass(): typeof iOSVibrate;
        Init(cfg: TSDKCfg): iOSPlatform;
    }
}
declare namespace numas {
    class iOSUser extends UserBase implements IUser {
        protected OnInit(cfg: TSDKCfg): void;
        IsAuthedUserInfo(): boolean;
        AuthUserInfo(buttonNode: cc.Node, onSuccess: Function, onFail: Function): void;
        LoginPlatform(loginCallback: PlatformLoginCallback, isAuthedUserInfo: boolean): void;
        protected OnLoginServerSuccess(): void;
        protected OnLoginServerFailed(): void;
        protected GetGameCenterCfg(): TGameCenterCfg;
        protected ReportScore(realKey: string, score: number): void;
        FiveStar(): void;
        IsSupportLeaderboard(): boolean;
        ShowDefaultLeaderboard(): void;
        IsSupportRateUsByOpenUrl(): boolean;
        RateUsByOpenUrl(): void;
        IsSupportContactUs(): boolean;
        ContactUs(): void;
        private openSystemMailApp;
    }
}
declare namespace numas {
    class iOSVibrate extends VibrateBase implements IVibrate {
        DefaultImpl(): void;
        private vibrateNormal;
        private vibratePeek;
        private vibratePop;
        private vibrateContinue;
        private __bridgeVibrate;
        private tap_notification;
        private tap_selection;
        private tap_impact;
        private isSupportTapEngine;
    }
}
declare namespace numas {
    abstract class RandBase {
        private kMultiplier;
        private kModer;
        private kConstant;
        private kOriginRandomSeed;
        private kRandomSeed;
        private bIsDebug;
        private kRandomCount;
        constructor(kMultiplier: number, kModer: number, kConstant: number, randomSeed: number, debug?: boolean);
        get seed(): number;
        random(): number;
        range(inclusiveMin: number, exclusiveMax: number): number;
    }
    export class MCGRand extends RandBase {
        constructor(randomSeed: number, debug?: boolean);
        private static _ins;
        static get ins(): MCGRand;
    }
    export class rand {
        static IntBetween(inclusiveMin: number, exclusiveMax: number): number;
    }
    export {};
}
declare namespace numas {
    abstract class BaseBlockInputUIPanel extends UIPanel {
        protected OnCreate(): void;
        protected OnRelease(): void;
        protected OnOpen(): void;
        protected abstract OnActiveChanged(active: boolean): void;
    }
}
declare namespace numas {
    abstract class BaseLoadingUIPanel extends UIPanel {
        protected OnCreate(): void;
        protected OnRelease(): void;
        protected OnOpen(): void;
        private __OnLoading;
        protected abstract OnLoading(finishCount: number, totalCount: number): void;
        protected abstract OnActiveChanged(active: boolean): void;
    }
}
declare namespace numas {
    type MsgUIPanelArgs = {
        msg: string[];
    };
    abstract class BaseMsgUIPanel extends UIPanel<MsgUIPanelArgs> {
        protected abstract get ActionNode(): cc.Node;
        protected abstract get MsgLabel(): cc.Label;
        protected OnCreate(): void;
        protected OnRelease(): void;
        protected OnOpen(uiArgs: MsgUIPanelArgs): void;
    }
}
declare namespace numas {
    abstract class BaseWaitingUIPanel extends UIPanel {
        protected OnCreate(): void;
        protected OnRelease(): void;
        protected OnOpen(): void;
        protected abstract OnActiveChanged(active: boolean): void;
    }
}
declare namespace numas {
    function dirty(seconds: number): <T extends DataCache>(target: T, methodName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    abstract class DataCache extends BaseComp {
        protected abstract OnRegister(): any;
        protected abstract OnUnRegister(): any;
        protected abstract OnDirty(): any;
        private _i_Name;
        get DataCacheName(): string;
        set DataCacheName(dataCacheName: string);
        private _i_Dirty;
        private _i_DirtySeconds;
        private _i_MaxSecondsToSave;
        private __i_Tick;
        private __i_StopTick;
        protected __i_OnPreRegister(): void;
        __i_OnRegisterTo(): void;
        __i_OnUnRegister(): void;
        protected markDirty(maxSecondsToSave: number): void;
    }
    abstract class LSDataCache<DATA extends {} = any> extends DataCache {
        protected abstract get LSKey(): string;
        private _lsData;
        protected get data(): DATA;
        protected abstract get DefaultLSData(): DATA;
        protected Save(): void;
        protected OnDirty(): void;
        __i_OnPreRegister(): void;
    }
    abstract class Logic {
        protected static GetDataCache<T>(dataCacheName: any): T;
        protected static emitGlobal(key: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void;
    }
    abstract class Entity extends cc.EventTarget implements IReference {
        abstract Reset(): any;
        Return(): void;
        ReturnBy<SELF extends Entity>(target: IAutoReturn): SELF;
        AutoReturn<T extends IReference>(bv: T): T;
        private _i_AutoQueue;
        private get _I_AutoReleaseItemQueue();
        private Destroy_AutoRelease;
        private _m_BVList_;
        protected BindBV<T>(observer: BV<T>, callback: ValueChangedFunc<T>, callOnBinded: boolean): void;
        protected UnbindAllBV(): void;
    }
}
declare namespace numas {
    class ResKey2BundleName {
        private static _ins;
        static get ins(): ResKey2BundleName;
        private _m;
        GetBundleName(resKey: string): string;
        SetBundleName(resKey: string, bundleName: string): void;
        HasBundleName(resKey: string): boolean;
    }
}
declare namespace numas {
    class ResKey2ResType {
        private static _ins;
        static get ins(): ResKey2ResType;
        private _m;
        GetResType(resKey: string): EResType;
        SetResType(resKey: string, resType: EResType): void;
        HasResType(resKey: string): boolean;
    }
}
declare namespace numas {
    enum EResType {
        Asset = 0,
        Audio = 1,
        Json = 2,
        Prefab = 3,
        Stage = 4,
        SpriteFrame = 5,
        Anim = 6,
        Spine = 7,
        LangJson = 8,
        AutoAtlas = 9
    }
    function registerRes(resKey: string, bundleName: string, resType: EResType): void;
    function registerResDict(dict: StringKeyDict<string>, bundleName: string, resType: EResType): void;
    function resDict2ResKeyList(cfg: StringKeyDict<string>): string[];
    type TPrefabCfg = {
        panel: StringKeyDict<{
            key: string;
            z: UIZIndex;
        }>;
        comp: StringKeyDict<{
            key: string;
        }>;
    };
    function registerPrefabCfg(pfbCfg: TPrefabCfg, bundleName: string): void;
    function prefabCfg2ResKeyList(cfg: StringKeyDict<{
        key: string;
    }>): string[];
    function registerLangJsonCfg(langJsonCfg: StringKeyDict<string>, bundleName: string): void;
    enum EItemType {
        ResKey = 0,
        DataCache = 1,
        IReference = 2
    }
    class AutoReleaseItem implements IReference {
        resKey: any;
        resTyp: EItemType;
        static Borrow(key: any, typ: EItemType): AutoReleaseItem;
        Reset(): void;
        Return(): void;
    }
    class ResMgr extends cc.Component {
        static ins: ResMgr;
        onLoad(): void;
        private _i_AssetCache;
        AddResRef(resKey: string): void;
        DecResRef(resKey: string): void;
        GetRes<T extends cc.Asset>(resKey: string): T;
        HasRes(resKey: string): boolean;
        SetRes<T extends cc.Asset>(resKey: any, asset: T): void;
        HasRegister(resKey: string): boolean;
        GetOrLoadBundle(bundleName: string, resolve: (bundle: cc.AssetManager.Bundle) => void): void;
        private __Load;
        Load<T extends cc.Asset>(resKey: string, cb: (asset: T, resKey: string) => void): void;
        LoadWithEvent<T extends cc.Asset>(event: string, resKey: string): void;
        LoadWithEventByGroup<T extends cc.Asset>(event: string, resKey: string, group: string): void;
        private LoadByGroup;
        private __i_TryToLoadNextGroupItem;
        private _i_LoadingGroupCache;
        private AddLoadingGroup;
        private HasLoadingGroup;
        private GetLoadingGroup;
        private DecLoadingGroup;
        private _i_DataCacheCache;
        GetDataCache<T extends DataCache>(dataCacheName: string): T;
        AddDataCache<T extends DataCache>(dataCacheName: string, type: {
            new (): T;
        }): void;
        hasDataCache(dataCacheName: string): boolean;
        DecDataCache(dataCacheName: string): void;
        private _i_NextFrameToReleaseResQueue;
        private _i_Next2FrameToReleaseResQueue;
        private _i_TickScheduler;
        DestroyAutoReleaseItems(autoReleaseItemQueue: Queue<AutoReleaseItem>): void;
        GC(): void;
        private __i_StopTickSchedule;
        private __i_Tick;
        private m_bLoadingGame;
        private m_Current;
        LoadStage(gameBundleName: string, stageName: string, args?: any, onUICompleted?: Function): void;
        LoadBundleStage(gameBundleName: string, args?: any, onUICompleted?: Function): void;
        Debug(): void;
    }
}
declare namespace numas {
    abstract class UIComp<T> extends BaseUIComp implements IAutoCloseUIComp<T> {
        protected args: T;
        private _$isOpened_;
        private _$isOpening_;
        private _i_Close;
        $__internal_Create(): void;
        Close(): void;
        $__internal_OnOpen(uiArgs: T): void;
        protected abstract OnCreate(): void;
        protected abstract OnRelease(): void;
        protected abstract OnOpen(uiArgs: any): void;
        private _m_BVList_;
        protected BindBV<T>(observer: BV<T>, callback: ValueChangedFunc<T>, callOnBinded: boolean): void;
        protected UnbindAllBV(): void;
        CloseBy<SELF extends UIComp<T>>(target: IAutoCloseUIComp<any>): SELF;
        __i_AutoCloseUIComp<T extends UIComp<any>>(uiComp: T): T;
        private _i_UICompQueue;
        private get _I_AutoCloseUICompQueue();
        private __i_CloseAllAutoCloseUIComp;
        protected onDestroy(): void;
        private _im_StopCallLinkedList;
        private get _I_StopCallLinkedList();
        AddStopActionCall(stopCallback: (self: any) => void): void;
        RemoveStopCall(call: any): void;
        StopAllAction(): void;
        private InterrupteAction;
    }
}
declare namespace numas {
    function registerUIStage(prefabKey: string, bundleName: string): void;
    function registerUIPanel(prefabKey: string, zIndex: UIZIndex, bundleName: string): void;
    function registerUIComp(resKey: string, bundleName: string): void;
    class UIMgr extends cc.Component {
        static ins: UIMgr;
        private _zs;
        private _phs;
        onLoad(): void;
        onDestroy(): void;
        LoadStage(gameBundleName: string, stageName: string, args?: any, onUICompleted?: Function): void;
        LoadBundleStage(gameBundleName: string, args?: any, onUICompleted?: Function): void;
        Create<T extends UIComp<TARG>, TARG = any>(prefabKey: string, args?: TARG, parent?: cc.Node): T;
        Exist(prefabKey: string): boolean;
        Open<ARGS = any>(prefabKey: string, args?: ARGS, afterOnOpen?: Resolve<any> | Function): void;
        private __Open;
        Close(uiPanel: UIPanel): any;
        Close(prefabKey: string, isAll: boolean): any;
        private readonly waiting_ref;
        readonly waiting: BooleanBV;
        AddWaitingRef(): void;
        DecWaitingRef(): void;
        private readonly block_ref;
        AddBlockRef(): void;
        DecBlockRef(): void;
        readonly block: BooleanBV;
        blockSeconds(seconds: number, cb: Function): void;
        OpenDialog1(msg: string, btnFunc0?: Function, label0?: string, title?: string): void;
        OpenDialog2(msg: string, btnFunc0Cancel?: Function, btnFunc1Sure?: Function, label0?: string, label1?: string, title?: string): void;
        OpenDialog3(msg: string, btnFunc0?: Function, btnFunc1?: Function, btnFunc2?: Function, label0?: string, label1?: string, label2?: string, title?: string): void;
        ShowMsg(...msg: string[]): void;
        Debug(): void;
    }
}
declare namespace numas {
    class UIPH extends cc.Component {
        static Borrow(): UIPH;
        private _prefabKey;
        private _args;
        private _uiPanel;
        private _isLoading;
        private _isCloseAfterLoading;
        IsSameResKey(prefabKey: string): boolean;
        GetResKey(): string;
        OpenUI<ARGS>(zNode: cc.Node, prefabKey: string, args?: ARGS, cb?: Function | Resolve2<any, any>): void;
        CloseUI(): void;
        private __CloseUI;
    }
}
declare namespace numas {
    abstract class UIStage extends UIPanel {
        protected OnCreate(): void;
        protected OnRelease(): void;
        protected OnOpen(uiArgs: any): void;
        __i_Init(onUICompleted: Function, args?: any): void;
        private m_Initialized;
        protected abstract OnInit(onUICompleted: Function, args?: any): void;
        protected abstract GetDefaultEffectAudioKey(): string;
    }
}
declare namespace numas {
    class UIUtil {
        static getOrAddComponent<T extends cc.Component>(node: cc.Node, typ: {
            new (): T;
        }): T;
        static transferTo(node: cc.Node, targetParent: cc.Node, cleanup?: boolean): void;
        static positionInTarget(node: cc.Node, targetParent: cc.Node): cc.Vec3;
        static fadeInBackgroundAction(bg: cc.Node, opacity?: number, duration?: number): void;
        static fadeOutBackgroundAction(bg: cc.Node, cb?: Function, opacity?: number, duration?: number, delay?: number): void;
        static scaleAction(node: cc.Node, scale: number): void;
        static moveAction(node: cc.Node, isShow: boolean, hidePosition: cc.Vec3, duration?: number, cb?: Function, delay?: number, easing?: (t: number) => number): void;
        static hideAction(node: cc.Node, duration: number, to: {
            scale?: number;
            opacity?: number;
            easing?: string;
        }, cb?: Function, delay?: number, block?: boolean): void;
        static showAction(node: cc.Node, duration: number, to: {
            scale?: number;
            opacity?: number;
            easing?: string;
        }, cb?: Function, delay?: number, block?: boolean): void;
        private static BaseAction;
    }
}
declare namespace numas {
    type TweenProgressFunc<T> = (start: T, end: T, current: T, t: number) => T;
    type TweenProgress<T> = {
        progress: TweenProgressFunc<T>;
    };
    abstract class TweenUtil {
        static readonly LinearProgress: TweenProgress<number>;
        static readonly LinearFloorIntegerProgress: TweenProgress<number>;
        static readonly LinearCeilIntegerProgress: TweenProgress<number>;
        static readonly LinearRoundIntegerProgress: TweenProgress<number>;
        static IntegerTo(duration: number, start: number, end: number, handler: ValueChangedFunc<number>, callOnBind: boolean): void;
        static CeilIntegerTo(duration: number, start: number, end: number, handler: ValueChangedFunc<number>, callOnBind: boolean): void;
        static RoundIntegerTo(duration: number, start: number, end: number, handler: ValueChangedFunc<number>, callOnBind: boolean): void;
        private static __IntegerTo;
    }
}
import ii = numas;