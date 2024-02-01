namespace numas {
    export class DialogUIPanelArgs {
        btnCount: number = 1;
        msg: string = "";
        title: string = ""; // 多语言情况下的 key: module.special
        label0: string = "";
        label1: string = "";
        label2: string = "";
        btnFunc0?: Function;
        btnFunc1?: Function;
        btnFunc2?: Function;
    
        public static Create1(msg: string, btnFunc0?: Function, label0: string = LangCfg.dft.dialog_lablel0_ok, title: string = LangCfg.dft.dialog_title) : DialogUIPanelArgs {
            let m = new DialogUIPanelArgs();
            m.btnCount = 1;
            m.msg = msg;
            m.title = title;
            m.label0 = label0;
            m.btnFunc0 = btnFunc0;
            return m;
        }
    
        public static Create2(msg: string, btnFunc0?: Function, btnFunc1?: Function, label0: string = LangCfg.dft.dialog_lablel_cancel, label1: string = LangCfg.dft.dialog_lablel_sure, title: string = LangCfg.dft.dialog_title) : DialogUIPanelArgs {
            let m = new DialogUIPanelArgs();
            m.btnCount = 2;
            m.msg = msg;
            m.title = title;
            m.label0 = label0;
            m.btnFunc0 = btnFunc0;
            m.label1 = label1;
            m.btnFunc1 = btnFunc1;
            return m;
        }
    
        public static Create3(msg: string, btnFunc0?: Function, btnFunc1?: Function, btnFunc2?: Function, label0: string = LangCfg.dft.dialog_lablel_cancel, label1: string = LangCfg.dft.dialog_lablel_sure, label2?: string, title: string = LangCfg.dft.dialog_title) : DialogUIPanelArgs {
            let m = new DialogUIPanelArgs();
            m.btnCount = 3;
            m.msg = msg;
            m.title = title;
            m.label0 = label0;
            m.btnFunc0 = btnFunc0;
            m.label1 = label1;
            m.btnFunc1 = btnFunc1;
            m.label2 = label2 ?? m.label2;
            m.btnFunc2 = btnFunc2;
            return m;
        }
    }
}
