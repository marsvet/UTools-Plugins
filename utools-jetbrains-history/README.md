# JetBrains

快速打开 JetBrains 系列软件历史项目。

由于 Android Studio 基于 IDEA，所以也支持 Android Studio。

## 支持的软件

目前支持 IntelliJ IDEA、Android Studio、PyCharm、PyCharm Edu、WebStorm、PhpStorm、GoLand、AppCode、CLion、RubyMine。

其中 IntelliJ IDEA、Android Studio、PyCharm、WebStorm 是经过测试的，其他软件我不用所以没测试，不过理论上应该可以。

如果有哪个不能用，或者有支持更多软件的需求，以及有任何 bug，可以[联系我](#联系方式)。

## 使用说明（必看）

第一次安装插件后，需要先设置每个软件的 **recentProjects.xml 文件**路径和**可执行程序**的路径（关于这两个文件的说明见[问题](#问题)）。

设置方式有两种：

1. 唤出 uTools，输入 `JetSettings` 进入设置页，输入文件路径，选择要设置的项目按回车或鼠标左键进行设置。
2. 将文件拖入 uTools，选择 `JetSettings`，文件路径会自动粘贴到输入框，选择要设置的项目按回车或鼠标左键进行设置。

设置完成后，唤出 uTools，输入 `JetHistory` 即可看到所有已设置软件的历史项目，选择项目并按回车或鼠标左键可以打开项目。

## 问题

1. recentProjects.xml 文件在哪儿？

   windows 下一般在 **C:\\Users\\用户名\\AppData\\Roaming\\JetBrains\\软件名+版本号\\options** 目录 或 **C:\\Users\\用户名\\软件名+版本号\\config\\options** 目录

   linux 下一般在 **~/.config/JetBrains/软件名+版本号/options** 目录 或 **~/软件名+版本号/config/options**

   mac 没用过不太清楚，应该和 linux 差不多

2. 可执行程序的路径？

   以 IDEA 为例：

   windows：**软件安装目录\\bin** 下的 **idea.exe** 或 **idea64.exe**（如果是 64 位系统，就用 **idea64.exe**，如果是 32 位系统，就用 **idea.exe**）

   linux：**软件安装目录/bin** 下的 **idea.sh**

   mac 不太清楚

3. 为什么不为 recentProjects.xml 文件路径设置默认值？

   据我观察，不同系统、不同软件、甚至同一个软件装在不同的电脑上时，recentProjects.xml 文件的路径都有可能不同，且我也不可能把 JetBrains 全家桶都装上只为看看 recentProjects.xml 在哪儿 😶

   欢迎你将自己软件的 recentProjects.xml 文件路径反馈到猿料社区本插件的发布页或 Github，我会统计最常见的路径并设为默认值。

## 联系方式

Github 地址：[https://github.com/marsvet/uTools-plugins/tree/master/utools-jetbrains-history](https://github.com/marsvet/uTools-plugins/tree/master/utools-jetbrains-history)

猿料社区发布页：[https://yuanliao.info/d/2026](https://yuanliao.info/d/2026)

## 更新日志

### 0.1.2

适配更多版本。

### 0.1.1

修复 `JetSettings` 有重复项的 bug。
