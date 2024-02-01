namespace numas {
    export namespace task {
        export type TaskFunc = (resolve: Function, reject?: Function)=>void;
        export enum ETaskStatus {
            NONE = 0,
            RUNNING = 1,
            DONE = 2,
            ERROR = 3
        }
        class Task implements IReference {
            private m_Func: TaskFunc = null;
            private m_Status: ETaskStatus = ETaskStatus.NONE;

            static Borrow(func: TaskFunc): Task { return ReferencePool.Borrow(Task).Init(func); }
            Reset(): void {
                this.m_Status = ETaskStatus.NONE;
                this.m_Func = null;
            }
            Return(): void {
                ReferencePool.Return(Task, this);
            }

            private Init(func: TaskFunc): Task {
                this.m_Func = func;
                return this;
            }
            Run(): Task {
                if(this.m_Status === ETaskStatus.NONE) {
                    this.m_Func(this.Resolve.bind(this), this.Reject.bind(this));
                }
                return this;
            }

            private Resolve() {
                this.m_Status = ETaskStatus.DONE;
            }

            private Reject() {
                this.m_Status = ETaskStatus.ERROR;
                console.warn("任务失败")
            }

            IsCompleted(): boolean {
                return this.m_Status === ETaskStatus.DONE;
            }
        }

        export class TaskComponent extends cc.Component {
            private _m_TaskQueue: Queue<Task> = null;
            private get TaskQueue(): Queue<Task> {
                if(this._m_TaskQueue === null) {
                    this._m_TaskQueue = AnyQueue.Borrow();
                }
                return this._m_TaskQueue;
            }
            private _m_RunningTaskQueue: Queue<Task> = null;
            private get RunningTaskQueue(): Queue<Task> {
                if(this._m_RunningTaskQueue === null) {
                    this._m_RunningTaskQueue = AnyQueue.Borrow();
                }
                return this._m_RunningTaskQueue;
            };
            private m_TaskScheduler: Function = null;
            private _m_CallbackQueue: Queue<Function> = null;
            private get CallbackQueue(): Queue<Function> {
                if(this._m_CallbackQueue === null) {
                    this._m_CallbackQueue = AnyQueue.Borrow();
                }
                return this._m_CallbackQueue;
            };

            AddFunc(func: TaskFunc): TaskComponent {
                let t = Task.Borrow(func);
                this.TaskQueue.Enqueue(t);
                return this;
            }

            Run(parallelCount: number, onCompleted?: Function): TaskComponent {
                if(onCompleted != null) {
                    this.CallbackQueue.Enqueue(onCompleted)
                }
                this.StartTaskScheduler(parallelCount);
                return this;
            }

            RemoveSelf() {
                // 删除或者回收自己
                this.node.removeComponent(this);
            }

            private StartTaskScheduler(parallelCount: number) {
                if(this.m_TaskScheduler === null) {
                    this.m_TaskScheduler = _ => this.UpdateLoading(parallelCount);
                    this.schedule(this.m_TaskScheduler, 0, cc.macro.REPEAT_FOREVER, 0);
                }
            }

            private StopTaskScheduler() {
                if(this.m_TaskScheduler !== null) {
                    this.unschedule(this.m_TaskScheduler);
                    this.m_TaskScheduler = null;
                }
            }

            private UpdateLoading(parallelCount: number) {
                while(this.TaskQueue.Count > 0) {
                    this.RunningTaskQueue.Enqueue(this.TaskQueue.Dequeue().Run());
                    --parallelCount;
                    if(parallelCount <= 0) {
                        return;
                    }
                }

                if(this.RunningTaskQueue.Count > 0) {
                    this.RunningTaskQueue.Remove(t=>t.IsCompleted(), t=>t.Return());
                    return;
                }
                
                this.StopTaskScheduler();
                if(this.CallbackQueue !== null) {
                    while(this.CallbackQueue.Count > 0) {
                        this.CallbackQueue.Dequeue()();
                    }
                } 
            }

            onDestroy() {
                this.StopTaskScheduler();
                if(this._m_TaskQueue !== null) { this._m_TaskQueue.Return(); }
                if(this._m_RunningTaskQueue !== null) { this._m_RunningTaskQueue.Return(); }
                if(this._m_CallbackQueue !== null) { this._m_CallbackQueue.Return(); }
            }
        }
    }
}
