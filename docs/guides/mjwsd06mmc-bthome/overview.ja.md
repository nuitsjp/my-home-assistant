# Xiaomi MJWSD06MMCのBTHome化

[English](./overview.en.md) · **日本語**

[スクリーンショット付きの詳細手順書](./index.md)

Xiaomi スマート温湿度計 3 Mini（`QBH4312GL`、型番 `MJWSD06MMC`）にpvvxのファームウェアを書き込み、**BTHome v2** でHome Assistantに測定値を届ける手順です。 [Xiaomi公式仕様](https://www.mi.com/jp/product/xiaomi-smart-temperature-and-humidity-monitor-3-mini/specs/)

## 実機で確認した内容

| 確認項目 | 結果 |
| --- | --- |
| Ubuntuで読み取ったBluetooth機器情報 | 型番 `MJWSD06MMC`、ハードウェア `V1.3`、ファームウェアとソフトウェアのリビジョン表示はいずれも `0009` |
| 純正のBluetoothアドバタイズ | Xiaomi MiBeacon製品IDは `0x5BEA`。機器の存在を知らせるパケットと、暗号化された測定値を含むパケットの両方を受信。 |
| BTHome化（2026年11月25日） | 純正リビジョン `0009` の実機に、pvvxの `MJ6_v59.bin` をBluetoothで書き込んだ。Home Assistantで `MJ6 D95B` をBTHome機器として追加し、温度が **27.48 °Cから27.43 °C**、湿度が **45.49%から45.53%** に更新されたことを確認した。 |

今回の作業では、この個体の純正ファームウェアのバックアップを省略しました。純正ファームウェアへの書き戻しは未検証です。

`0009` は開発元の `2.1.1_0009` 向けOTA手順が対象とするリビジョンです。Xiaomi Home上の完全なバージョン表記は未確認です。`0x5BEA` は電波で通知される製品IDで、基板のリビジョンを判定するには実機の情報が必要です。 [開発元のOTA手順と動作報告](https://github.com/pvvx/ATC_MiThermometer/issues/636)

## 1. 純正ファームウェアのBluetooth認証情報を取得する

1. スマートフォンの **Xiaomi Home** に温湿度計を追加します。開発元が案内する純正 `0009` からの無線書き換えには、この登録が必要です。登録済みならそのまま使います。
2. Windowsで [Xiaomi Cloud Tokens Extractorのリリース](https://github.com/PiotrMachowski/Xiaomi-cloud-tokens-extractor/releases/tag/v1.5.1) から `token_extractor.exe` を取得して実行します。`p/q:` で `q` を入力し、表示されたQRコードを読み取って同じXiaomiアカウントでログインを承認します。Xiaomi Homeで使っている地域を選ぶか、サーバー選択画面でEnterを押して全地域を検索します。
3. 実機のBluetoothアドレスと照合し、該当する機器の `TOKEN` と `BLE KEY` を控えます。出力は手元で管理してください。初期化や再登録で認証情報が変わる場合があります。

## 2. pvvxのBluetoothファームウェアを書き込む

**書き込み前に互換性を確認してください。** 開発元にはBTHome化の成功例に加え、`V1.3` / `0009` でのGATTエラーや書き込み後に機器が応答しなくなった例も報告されています。基板の種類と復旧方法を確認してください。復旧にケースの分解や基板への配線が必要になる場合があります。対応するファームウェアと復旧方法を確認できてから進めます。 [OTAの動作報告](https://github.com/pvvx/ATC_MiThermometer/issues/636)、[基板の資料](https://pvvx.github.io/MJWSD06MMC/)、[書き込み失敗の報告](https://github.com/pvvx/ATC_MiThermometer/discussions/814)

1. 温湿度計をBluetooth対応PCの近くに置き、スマートフォンのXiaomi Homeで機器の詳細画面を閉じます。WindowsのChromeまたはEdgeで [pvvx Telink BLE OTA Flasher](https://pvvx.github.io/ATC_MiThermometer/TelinkMiFlasher.html) を開きます。**BLE device name prefix filter(s)** を `MJWSD06MMC` に設定し、**Connect** から温湿度計を選びます。見つかりにくい場合は本体ボタンを短く押します。約7秒間長押しすると初期化されます。 [Xiaomi公式FAQ](https://www.mi.com/global/support/faq/details/KA-573296/)
2. 接続ログで型番とハードウェア・ファームウェア・ソフトウェアのリビジョンを確認します。純正 `0009` 向けの手順では、**Mi Token** に `TOKEN`（16進数24文字）、**Mi Bind Key** に `BLE KEY`（16進数32文字）を入力します。**Login** を押し、`Login successful` を待ちます。対象機器やリビジョンが想定と異なる場合、または接続やログインに失敗する場合は、書き込み前に中断します。
3. **Select Firmware** で対応するpvvxのBluetooth用イメージ `MJ6_vNN.bin` を選択します。**Start Flashing** を押し、書き込みが完了して温湿度計が再起動するまで、電源を入れたまま電波の届く範囲で待ちます。 [pvvxプロジェクトとファームウェア](https://github.com/pvvx/ATC_MiThermometer)、[ファームウェア一覧](https://github.com/pvvx/ATC_MiThermometer/blob/master/firmware.json)

## 3. BTHomeを有効にしてHome Assistantに追加する

1. Flasherで `MJ6_…` と表示される温湿度計に接続し直します。必要に応じて名前フィルターに `MJ6` を追加します。
2. **Advertising type** で **BTHome v2** を選びます。キー入力なしで使う場合は **Encrypted beacon** のチェックを外します。暗号化しない場合、電波の届く範囲で第三者も測定値を受信できます。**Send Config** を押し、続けて **Disconnect** を押します。 [BTHome v2の仕様](https://bthome.io/format/)
3. Home Assistantの **設定 → デバイスとサービス** で、検出された **BTHome** 機器を追加します。**統合を追加 → BTHome** からも追加できます。温湿度計の電波はHome AssistantのBluetoothアダプターか対応するBluetoothプロキシで受信します。この手順でXiaomiアカウントを使うのは、純正の認証情報を取得するときだけです。 [Home AssistantのBTHome設定ガイド](https://www.home-assistant.io/integrations/bthome/)
4. 追加した機器を開き、温度・湿度と、配信されていればバッテリー残量を確認します。温度・湿度を本体の液晶表示と照合し、測定値が変化したときや設置場所でも更新されることを確認します。検出されない場合は、まずFlasherとの接続が切れているか、受信範囲内か、配信形式の設定が保存されたかを確認します。
