# 一、使用该仓库需要安装

## 1、pnpm

请安装 pnpm@v8.15.4
安装 `npm install -g pnpm`

## 2、node

为了更好协作，请升级node版本到**v21.6.2**

## 3、turbo

安装`pnpm install turbo --global`或者`npm install turbo --global`

# 二、turbopepo

## 1、理解turbopepo目录结构

This Turborepo includes the following packages/apps:

### 1.1 Apps

该文件夹放应用（如主子应用、门户网站）

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app

### 1.2 Packages

该文件夹放npm包，如UI组件库、utils组件库

- `@zj-astro/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## 2、Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## 3、用法

### 3.1 依赖管理

使用pnpm

> 注意⚠️：不要用npm和yarn管理依赖，使用npm和yarn会报错❌

#### 安装现有依赖:

在任意仓库文件夹执行`pnpm i`

#### 添加依赖

给docs项目添加vue
在任意目录执行 `pnpm add vue -F docs`
或者在docs文件目录执行 `pnpm add vue`

#### 删除和更新依赖

同上，用uninstall/update

### 3.2 Develop

To develop **all apps and packages**, run the following command:

#### 不推荐用pnpm

```
cd astro-fe
pnpm dev
```

#### 推荐用turbo

```
turbo dev
```

启动某一个项目（如启动apps/docs)，执行`turbo dev -F=docs`或者：

```js
cd apps/docs
turbo dev
```

### 3.3 Build

To build all apps and packages, run the following command:

#### 不推荐用pnpm

```
cd astro-fe
pnpm build
```

#### 推荐用turbo

同dev

### 3.4 Remote Caching（暂时项目小，不需要用）

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd astro-fe
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## 4、Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

# 三、git流程规范

## 1、新建分支

首先，每次开发新功能，都应该新建一个单独的分支

```
# 获取主干最新代码
$ git checkout dev
$ git pull

# 新建一个开发分支myfeature
$ git checkout -b myfeature
```

## 2、提交分支 commit

分支修改后，就可以提交 commit 了。

```
$ git add --all
$ git status
$ git commit --verbose
```

## 3、撰写提交信息

提交 commit 时，必须给出完整扼要的提交信息。按照 ops: xxx 的格式填写，ops分为以下几类：

- `build` 修改项目构建系统(如 vite 的配置等)
- `ci` 修改项目持续集成流程(如 Jenkins，GitLab CI等)
- `perf` 优化/性能提升
- `feat` 新增功能
- `fix` bug 修复
- `refactor` 重构代码(既没有新增功能，也没有修复bug)
- `docs` docs 文档和注释相关
- `chore` 依赖更新及不属于其他类型的提交
- `style` 代码风格相关不影响程序逻辑的修改
- `merge` 分支合并
- `test` 测试相关

## 4、与主干同步

分支的开发过程中，要经常与主干保持同步。

```
$ git fetch origin
$ git rebase origin/dev
```

这边在 merge 之前先 rebase 主开发分支，保证自己的提交可以在主分支更新的 commit 之后以免乱序。

## 5、合并 commit

分支开发完成后，很可能有一堆 commit，但是合并到主干的时候，往往希望只有一个（或最多两三个）commit，这样不仅清晰，也容易管理。

那么，怎样才能将多个 commit 合并呢？这就要用到 git rebase 命令。

```
$ git rebase -i origin/dev
```

git rebase 命令的 i 参数表示互动（interactive），这时 git 会打开一个互动界面，进行下一步操作。

下面采用 Tute Costa 的例子，来解释怎么合并 commit。

```

pick 07c5abd Introduce OpenPGP and teach basic usage
pick de9b1eb Fix PostChecker::Post#urls
pick 3e7ee36 Hey kids, stop all the highlighting
pick fa20af3 git interactive rebase, squash, amend

# Rebase 8db7e8b..fa20af3 onto 8db7e8b
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

上面的互动界面，先列出当前分支最新的 4 个 commit（越下面越新）。每个 commit 前面有一个操作命令，默认是 pick，表示该行 commit 被选中，要进行 rebase 操作。

4 个 commit 的下面是一大堆注释，列出可以使用的命令。

```
pick：正常选中
reword：选中，并且修改提交信息；
edit：选中，rebase时会暂停，允许你修改这个commit（参考这里）
squash：选中，会将当前commit与上一个commit合并
fixup：与squash相同，但不会保存当前commit的提交信息
exec：执行其他shell命令
```

上面这 6 个命令当中，squash 和 fixup 可以用来合并 commit。先把需要合并的 commit 前面的动词，改成 squash（或者 s）。

```
pick 07c5abd Introduce OpenPGP and teach basic usage
s de9b1eb Fix PostChecker::Post#urls
s 3e7ee36 Hey kids, stop all the highlighting
pick fa20af3 git interactive rebase, squash, amend
```

这样一改，执行后，当前分支只会剩下两个 commit。第二行和第三行的 commit，都会合并到第一行的 commit。提交信息会同时包含，这三个 commit 的提交信息。

```
# This is a combination of 3 commits.
# The first commit's message is:
Introduce OpenPGP and teach basic usage

# This is the 2nd commit message:
Fix PostChecker::Post#urls

# This is the 3rd commit message:
Hey kids, stop all the highlighting
```

如果将第三行的 squash 命令改成 fixup 命令。

```
pick 07c5abd Introduce OpenPGP and teach basic usage
s de9b1eb Fix PostChecker::Post#urls
f 3e7ee36 Hey kids, stop all the highlighting
pick fa20af3 git interactive rebase, squash, amend
```

运行结果相同，还是会生成两个 commit，第二行和第三行的 commit，都合并到第一行的 commit。但是，新的提交信息里面，第三行 commit 的提交信息，会被注释掉。

```
# This is a combination of 3 commits.
# The first commit's message is:
Introduce OpenPGP and teach basic usage

# This is the 2nd commit message:
Fix PostChecker::Post#urls

# This is the 3rd commit message:
# Hey kids, stop all the highlighting
```

## 6、推送到远程仓库

合并 commit 后，就可以推送当前分支到远程仓库了。

```
$ git push --force origin myfeature
```

git push 命令要加上 force 参数，因为 rebase 以后，分支历史改变了，跟远程分支不一定兼容，有可能要强行推送。

# 四、代码Review tips

## 1、消息自动推送机制

- 创建pr（不含重新打开）的时候，**机器人会自动推送消息到群里** -----> 自行点击去review代码 ----->

  > - 创建pr后，不需要添加评审人
  > - 推送消息发到群里后，有空闲时间的团队成员可回复[OK]表示会进行审查，若无法参与审查，可回复[送花花]表示支持但无法参与。

- 通过审核点击右上角的“评审”的approve，**机器人会自动推送消息到群里** -----> 提交代码的人自行合并
- 有comments则评论好之后点击右上角“评审”的comments，**机器人会自动推送消息到群里** -----> 提交代码的人修改代码-----> 私下提醒评审人改好了……

## 2、审查原则

- 强制审查：除特殊紧急情况外，所有自己提交的pull request（PR）必须经过至少一位其他人的代码审查，并在MR评论中收到**批准合并请求**后，方可可自行合并代码。
- 责任人审查：如果团队内成员都很忙，原则上应由与提交的MR相关功能接触最多或关系最紧密的人负责审查。
- 推进流程：代码审查及其合并流程应由代码提交人主动推进。
- 大问题沟通：审查过程中，如发现较大问题，审查者可以直接与代码提交人当面沟通或在团队沟通群内讨论。
- 小问题评论：对于小问题或建议，审查者应以comments的形式在PR中进行详细注释。

# 五、环境配置

- 环境配置目录：`apps/*/vite.config.ts`

## 1. Cockpit
### 1.1 API接口
- isMock设定为false，调用后端接口，如果是true，则调用yapi接口
```js
const isMock = false // 调用后端接口

const isMock = true  // 调用 Mock yapi 接口
```
