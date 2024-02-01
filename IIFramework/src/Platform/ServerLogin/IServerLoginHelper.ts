
namespace numas {
    export interface IServerLoginHelper {
        Login(args: PlatformLoginResult, loginCallback: ServerLoginCallback): void;
    }
}
