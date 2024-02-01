/// <reference path="../Res/UIZIndex.ts" />

namespace numas {
    export const IIStartPrefabCfg = {
        dft: {
            panel: {
                DialogUIPanel: { key: "DialogUIPanel", z: UIZIndex.TopMsg }
                , MsgUIPanel: { key: "MsgUIPanel", z: UIZIndex.SystemModule }
                , BlockInputUIPanel: { key: "BlockInputUIPanel", z: UIZIndex.SystemModule }
                , LoadingUIPanel: { key: "LoadingUIPanel", z: UIZIndex.SystemModule }
                , WaitingUIPanel: { key: "WaitingUIPanel", z: UIZIndex.SystemModule }
            }
            ,comp: { }
        }
        // ,hotupdate: {
        //     panel: {
        //         HotUpdateUIPanel: { key: "HotUpdateUIPanel", z: UIZIndex.PopUp }
        //     }
        //     ,comp: {
        //         HotUpdateUIChecking: { key: "HotUpdateUIChecking" }
        //         , HotUpdateUIUpdating: { key: "HotUpdateUIUpdating" }
        //     }
        // }
    }
}
