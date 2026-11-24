# XiaomiのBluetooth温湿度計をBTHome化する

[English](./overview.en.md) · **日本語**

[スクリーンショット付きの詳細手順書](./index.md)

対象は **Xiaomi スマート温湿度計 3 Mini**（型番 `MJWSD06MMC`、製品番号 `QBH4312GL`）です（[公式仕様](https://www.mi.com/jp/product/xiaomi-smart-temperature-and-humidity-monitor-3-mini/specs/) / [技適表示のある取扱説明書](https://www.mi.com/jp/support/user-guide-pdf/xiaomi-%E3%82%B9%E3%83%9E%E3%83%BC%E3%83%88%E6%B8%A9%E6%B9%BF%E5%BA%A6%E8%A8%88-3-mini/)）。国内で手に入りやすく、技適マークが付いている候補を比べたところ、購入時点で最も安価でした。

純正ファームウェアのままではXiaomi Homeアプリを頻繁に操作する必要があったため、pvvxファームウェアを書き込み、測定値の配信を公開仕様の **BTHome v2** に切り替えました（[BTHome仕様](https://bthome.io/) / [Home AssistantのBTHome統合](https://www.home-assistant.io/integrations/bthome/)）。

## 実機での確認記録

| 項目 | 確認結果 |
| --- | --- |
| Ubuntuで取得したBluetooth機器情報 | 型番 `MJWSD06MMC`、ハードウェア `V1.3`、ファームウェア・ソフトウェアともリビジョン `0009` |
| 純正のBluetooth配信 | Xiaomi MiBeacon製品IDは `0x5BEA`。機器の存在通知パケットと暗号化済み測定値パケットの両方を確認 |
| BTHome化（2026年11月25日） | 純正 `0009` の実機にpvvxの `MJ6_v59.bin` をBluetoothで書き込み、Home Assistantに `MJ6 D95B` として追加。温度が **27.48 °C → 27.43 °C**、湿度が **45.49% → 45.53%** へ更新されることを確認 |

今回の作業では純正ファームウェアのバックアップを行っておらず、純正への書き戻しは未検証です。

`0009` は開発元の純正 `2.1.1_0009` 向けOTA手順の対象リビジョンと一致します（Xiaomi Home上の完全な版数は未確認です）。なお、`0x5BEA` は配信上の製品IDであり、基板の種類までは判別できません（[開発元のOTA手順と報告](https://github.com/pvvx/ATC_MiThermometer/issues/636)）。

## 1. 純正ファームウェアの認証情報を取得する

1. スマートフォンの **Xiaomi Home** に温湿度計を登録します（登録済みならそのまま使います）。純正 `0009` からの無線書き換えに必要です。
2. Windowsで [Xiaomi Cloud Tokens Extractor v1.5.1](https://github.com/PiotrMachowski/Xiaomi-cloud-tokens-extractor/releases/tag/v1.5.1) の `token_extractor.exe` を実行します。`p/q:` で `q` を入力してQRコードを読み取り、同じXiaomiアカウントでサインインを承認します。サーバー選択ではXiaomi Homeの地域を選ぶか、空欄のままEnterを押して全地域を検索します。
3. 対象の `MAC`（Bluetoothアドレス）に該当する **`TOKEN`** と **`BLE KEY`** を控えます。出力は外部に公開せず手元で管理してください。初期化や再登録を行うとキーが変わります。

## 2. pvvxファームウェアを書き込む

書き込む前に、対象機種との互換性と復旧方法を確認してください。`V1.3` / `0009` でのGATTエラーや、書き換え後に無応答になった事例があり、復旧にはケースの分解と基板への配線が必要になる場合があります（[OTA報告](https://github.com/pvvx/ATC_MiThermometer/issues/636) / [基板資料](https://pvvx.github.io/MJWSD06MMC/) / [無応答の報告](https://github.com/pvvx/ATC_MiThermometer/discussions/814)）。

1. 温湿度計をPCの近くに置き、Xiaomi Homeで機器の詳細画面を閉じます。ChromeまたはEdgeで [pvvx Telink BLE OTA Flasher](https://pvvx.github.io/ATC_MiThermometer/TelinkMiFlasher.html) を開き、**BLE device name prefix filter(s)** に `MJWSD06MMC` を入力して **Connect** から選びます。見つからないときは本体ボタンを短く押します（約7秒長押しすると初期化されます。参考: [Xiaomi公式FAQ](https://www.mi.com/global/support/faq/details/KA-573296/)）。
2. 接続ログで型番と各リビジョンを確認します。**Mi Token** に `TOKEN`（24文字）、**Mi Bind Key** に `BLE KEY`（32文字）を入力し、**Login** を押して `Login successful` を待ちます。リビジョンが想定と違う場合やログインに失敗する場合は、ここで中止します。
3. **Custom Firmware**（または **Select Firmware**）から対象向けの `MJ6_vNN.bin` を選び、**Start Flashing** を押します。書き込みが完了して再起動するまで、電池を抜かずPCの近くに置いて待ちます（[pvvxプロジェクト](https://github.com/pvvx/ATC_MiThermometer) / [ファームウェア一覧](https://github.com/pvvx/ATC_MiThermometer/blob/master/firmware.json)）。

## 3. BTHome v2を設定してHome Assistantに追加する

1. Flasherのフィルターを `MJ6` に変え、再起動後の `MJ6_…` に再接続します。
2. **Advertising type** を **BTHome v2** にします（[BTHome v2仕様](https://bthome.io/format/)）。キー入力を省く場合は **Encrypted beacon** のチェックを外します（電波が届く範囲では第三者も測定値を読めます）。**Send Config** を押してから **Disconnect** で切断します。
3. Home Assistantの **設定 → デバイスとサービス** で検出された **BTHome** 機器を追加します（**統合を追加 → BTHome** からも追加できます）。測定値はHome AssistantのBluetoothアダプターまたは対応プロキシで直接受信するため、設定後にXiaomiアカウントは不要です（[BTHome統合ガイド](https://www.home-assistant.io/integrations/bthome/)）。
4. 追加した機器を開き、温度・湿度（表示されていればバッテリー残量も）が液晶と一致すること、値が変化したときや設置場所でも更新されることを確かめます。見つからない場合は、Flasherが切断済みか、受信範囲内か、配信設定が保存されているかを確認します。
