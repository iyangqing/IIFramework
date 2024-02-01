# 说明
用来生成 Creator 2.4.4 ii 插件的工程

# 框架规范



# 如何构建 ii.js 和 ii.d.ts
## 第一次使用
初始化 node_modules:

```sh
yarn install
```

## 后续构建
- 命令行模式

```sh
yarn run
```

## VSCode Run Task 方式构建
在 `.vscode` 文件夹中，添加任务：
```json
{
    "label": "[IIFramework] 构建 IIFramework 生成 ii 插件",
    "type": "npm",
    "script": "build",
    "path": "plugins/IIFramework/",
    // "group": {
    //     "kind": "build",
    //     "isDefault": true
    // },
    "problemMatcher": [],
    "detail": "gulp build"
}
```

上述命令将在 bin 文件夹中输出插件脚本 ii.js 和 ii.d.ts
