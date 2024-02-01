// namespace numas {
//     /**
//      * 热更新管理器
//      */
//     export class HotUpdateMgr extends cc.Component {
//         private m_BundleName: string = null;
//         static ins: HotUpdateMgr = null;
//         onLoad() {
//             if(CC_DEBUG) {
//                 console.info(">> HotUpdateMgr::onLoad")
//             }
//             if(HotUpdateMgr.ins === null) {
//                 HotUpdateMgr.ins = this;
//             }
//             else {
//                 this.destroy();
//             }
//         }

//         private m_HotUpdateVersion: string = "";
//         set HotUpdateVersion(version: string) { this.m_HotUpdateVersion = version; }
//         get HotUpdateVersion(): string { return this.m_HotUpdateVersion; }

//         Init(bundleName: string): HotUpdateMgr {
//             this.m_BundleName = bundleName;
//             return this;
//         }

//         /**
//          * 当前平台是否支持热更新
//          * 不是原生平台的话，直接跳过热更新
//          * @returns 支持与否
//          */
//         get IsSupportHotUpdate(): boolean {
//             if(typeof window.jsb === 'object') {
//                 return true;
//             }
//             return false;
//         }

//         /**
//          * 热更新入口函数，接手游戏流程
//          * @param entryFunc 不需要热更新时的入口函数
//          */
//         public CheckHotUpdate(entryFunc: Function) {
//             /**
//              * 条件判断：不是原生平台的话，直接跳过热更新
//              */
//             if(!this.IsSupportHotUpdate) {
//                 entryFunc();
//                 return;
//             }
//             console.info("热更新 >> 进入热更新流程")
//             //! 注册语言包 
//             LangUtil.AddLangCfg(_LangCfg_HotUpdateJson);
//             //! 注册版本文件
//             registerResDict(HotUpdateAssetCfg, this.m_BundleName, EResType.Asset);
//             /**
//              * 原生平台 (iOS, Android) 需要热更新机制，通过 HotUpdateUIPanel 组件实现逻辑
//              */
//             UIMgr.ins.Open<hotupdate.AHotUpdateUIPanelArgs>(IIStartPrefabCfg.hotupdate.panel.HotUpdateUIPanel.key, {
//                 onCompleted: entryFunc
//             })
//         }
//     }
// }