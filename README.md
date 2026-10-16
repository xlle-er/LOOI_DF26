# LOOI DF26

[简体中文](#简体中文) · [English](#english)

## 简体中文

LOOI DF26 是以手机作为语音、视觉和表情界面的桌面机器人。本仓库的 **DF26 分支**提供中英双语网页端，支持 BLE 与局域网 Wi-Fi 控制，以及配网、电机方向校准和无线固件升级。最终底盘仅使用直流电机，不包含俯仰舵机或 I²C。

### 项目仓库

| 仓库 | 用途 |
| --- | --- |
| [网页程序 · DF26](https://github.com/xlle-er/LOOI_DF26/tree/DF26) | 本仓库：网页交互和本机设备桥接 |
| [iOS](https://github.com/xlle-er/LOOI-DF26-IOS) | SwiftUI 原生客户端 |
| [Android](https://github.com/xlle-er/LOOI-DF26-ANDROID) | Android 原生客户端 |
| [Firmware](https://github.com/xlle-er/LOOI-DF26-Firmware) | ESP32-S3 底盘固件、协议、配网面板和 OTA |

### 本机运行

需要 Node.js 22 或更新版本。

```sh
git clone -b DF26 https://github.com/xlle-er/LOOI_DF26.git
cd LOOI_DF26/looi-life-robot/backend
npm ci
npm start
```

打开 [http://localhost:3000](http://localhost:3000)。在右上角选择简体中文或 English，选择会保存在本机浏览器。

- 首次通过 USB 安装 Firmware 仓库中的 ESP32-S3 固件，严格使用 16 MB Flash 和双 3 MB OTA 分区；不要刷入旧 ESP32 固件。
- 手机或电脑连接 `LOOI-Setup-XXXXXX` 热点，打开 [http://192.168.4.1](http://192.168.4.1) 配网，或在原生 App 中通过 BLE 配网。初始管理用户名 `admin`，密码见固件说明。
- 在网页设置中的“设备管理”输入设备 IP 和管理密码，可通过 Wi-Fi 连接、扫描/配置网络、修改方向、点动测试、停止及 OTA。也可使用“连接蓝牙”。
- 先架空车轮，使用“接管控制”后再进行点动测试。停止、控制权切换及 OTA 会使旧运动失效，失联自动停车。
- OTA 支持本地应用 `.bin`，或从 [Firmware Releases](https://github.com/xlle-er/LOOI-DF26-Firmware/releases) 获取在线版本。网络密码只保存在设备，不通过状态接口返回。

Wi-Fi 桥接仅接受本机浏览器和私有 IPv4 设备地址。线上 HTTPS 网页不提供这个本机桥接；请使用 localhost 运行。AI 服务、密钥及摄像头设置沿用原程序，密钥不应提交到 Git。

详细运行说明见 [网页程序说明](looi-life-robot/README.md)。构建和测试不代表已经完成电机、供电及断电恢复的真机验证。

## English

LOOI DF26 is a desktop robot that uses a phone for voice, vision and facial animation. The **DF26 branch** provides a bilingual web client with BLE and LAN Wi-Fi control, Wi-Fi provisioning, motor calibration and OTA firmware updates. The final chassis uses DC motors only, with no pitch servo or I²C.

### Repositories

| Repository | Purpose |
| --- | --- |
| [Web · DF26](https://github.com/xlle-er/LOOI_DF26/tree/DF26) | This repository: web runtime and localhost device bridge |
| [iOS](https://github.com/xlle-er/LOOI-DF26-IOS) | Native SwiftUI client |
| [Android](https://github.com/xlle-er/LOOI-DF26-ANDROID) | Native Android client |
| [Firmware](https://github.com/xlle-er/LOOI-DF26-Firmware) | ESP32-S3 firmware, protocol, setup panel and OTA |

### Run locally

Use Node.js 22 or newer. Run the commands above, then open [http://localhost:3000](http://localhost:3000). Choose English or 简体中文 in the top-right corner; the selection persists in this browser.

Install the ESP32-S3 firmware over USB once, with **16 MB Flash and dual 3 MB OTA application partitions**. Join the `LOOI-Setup-XXXXXX` hotspot and open [http://192.168.4.1](http://192.168.4.1), or provision Wi-Fi through BLE in a native app. Check the Firmware README for the initial administrator password.

In **Device management**, enter the device IP and password to connect over Wi-Fi. Scan and configure networks, calibrate motor direction, run bounded motor tests, stop the chassis, and upload firmware. BLE remains available. Lift the wheels and select Take control before testing. Loss of connectivity stops the chassis, and changing controllers invalidates earlier movement.

OTA accepts a local application `.bin` or an online version from [Firmware Releases](https://github.com/xlle-er/LOOI-DF26-Firmware/releases). Wi-Fi passwords remain on the device and are never returned by status APIs. The bridge accepts only loopback browser requests and private IPv4 destinations. Use localhost; a remotely hosted HTTPS page does not include this local bridge.

AI provider, camera and credential settings retain their original behavior. Never commit API credentials. See the [web runtime guide](looi-life-robot/README.md) for details. Passing builds and tests does not replace physical motor, power and recovery testing.
