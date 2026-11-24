# Convert a Bluetooth temperature and humidity sensor to BTHome

**English** · [日本語](./overview.ja.md)

[Detailed walkthrough with screenshots (Japanese)](./index.md)

We chose the Xiaomi Smart Temperature and Humidity Monitor 3 Mini (model `MJWSD06MMC`, product number `QBH4312GL`). At the time, it was the least expensive option we compared that was easy to buy in Japan and carried Japan's technical conformity mark (技適). [Xiaomi specifications](https://www.mi.com/jp/product/xiaomi-smart-temperature-and-humidity-monitor-3-mini/specs/) · [Xiaomi user guide with the conformity mark](https://www.mi.com/jp/support/user-guide-pdf/xiaomi-%E3%82%B9%E3%83%9E%E3%83%BC%E3%83%88%E6%B8%A9%E6%B9%BF%E5%BA%A6%E8%A8%88-3-mini/)

The stock firmware required frequent use of Xiaomi Home in this setup. To check readings in one place, we flashed pvvx firmware and switched to **BTHome v2**, an open specification for Bluetooth sensor broadcasts that Home Assistant supports. [BTHome specification](https://bthome.io/) · [Home Assistant BTHome integration](https://www.home-assistant.io/integrations/bthome/)

## What we verified

| Check | Result |
| --- | --- |
| Bluetooth Device Information read on Ubuntu | Model `MJWSD06MMC`, hardware `V1.3`, firmware and software revision strings `0009` |
| Stock Bluetooth broadcasts | Xiaomi MiBeacon product ID `0x5BEA`. Both presence-only and encrypted measurement advertisements were observed. |
| BTHome conversion (2026-11-25 JST) | Flashed pvvx `MJ6_v59.bin` over Bluetooth on this `MJWSD06MMC` (`V1.3`, stock firmware and software revisions `0009`). Home Assistant added it through the BTHome integration as `MJ6 D95B`. Over about 25 seconds, temperature changed from **27.48 °C to 27.43 °C** and humidity from **45.49% to 45.53%**. |

We skipped backing up this unit's stock firmware. Restoring the stock firmware remains unverified.

The `0009` strings match the revision used by the upstream `2.1.1_0009` OTA instructions. The full version string in Xiaomi Home was unverified. `0x5BEA` identifies the advertised product and cannot establish the board revision. [Upstream OTA notes and reports](https://github.com/pvvx/ATC_MiThermometer/issues/636)

## 1. Retrieve the stock Bluetooth credentials

1. Add the sensor to **Xiaomi Home** on your phone. This binding is needed for the documented stock `0009` OTA route. If already added, use the existing binding.
2. On Windows, run `token_extractor.exe` from the [Xiaomi Cloud Tokens Extractor release](https://github.com/PiotrMachowski/Xiaomi-cloud-tokens-extractor/releases/tag/v1.5.1). At `p/q:`, enter `q`. Scan the QR code shown by the tool and approve the sign-in with the same Xiaomi account. Select the Xiaomi Home region, or press Enter at the server prompt to check all regions.
3. Match the result to the sensor's Bluetooth address. The flasher uses `TOKEN` and `BLE KEY` from that device's entry. Keep the output private. A factory reset or new binding can change the credentials.

## 2. Flash the pvvx Bluetooth firmware

**Check compatibility before writing.** Upstream has reports of successful conversions, GATT errors with `V1.3` / `0009`, and a unit that stopped responding after flashing. Review the hardware variants and the recovery instructions for your board. Recovery may require opening the case and wiring to the board. Proceed only when you have identified a compatible build and a recovery method. [OTA reports](https://github.com/pvvx/ATC_MiThermometer/issues/636), [hardware notes](https://pvvx.github.io/MJWSD06MMC/), [reported flash failure](https://github.com/pvvx/ATC_MiThermometer/discussions/814)

1. Put the sensor near a Bluetooth-capable computer and close its detail screen in Xiaomi Home. Open [pvvx Telink BLE OTA Flasher](https://pvvx.github.io/ATC_MiThermometer/TelinkMiFlasher.html) in Chrome or Edge on Windows. Set **BLE device name prefix filter(s)** to `MJWSD06MMC`, then select **Connect** and choose the sensor. A short button press can help with discovery. Holding the button for about seven seconds resets the sensor. [Xiaomi FAQ](https://www.mi.com/global/support/faq/details/KA-573296/)
2. Check the model and hardware, firmware, and software revisions in the connection log. For the documented `0009` route, enter the extracted `TOKEN` in **Mi Token** (24 hex characters) and `BLE KEY` in **Mi Bind Key** (32 hex characters). Click **Login** and wait for `Login successful`. Stop before flashing if the device or revision differs from the intended target, or if the connection or login fails.
3. In **Select Firmware**, select the compatible `MJ6_vNN.bin` Bluetooth image from the pvvx project. Click **Start Flashing** and leave the sensor powered and within range until the update finishes and the sensor restarts. [pvvx project and firmware](https://github.com/pvvx/ATC_MiThermometer), [firmware catalog](https://github.com/pvvx/ATC_MiThermometer/blob/master/firmware.json)

## 3. Enable BTHome and add it to Home Assistant

1. Reconnect in the flasher to the sensor advertising as `MJ6_…`. Add `MJ6` to the name filter if needed.
2. Set **Advertising type** to **BTHome v2**. For key-free setup, clear **Encrypted beacon**. Anyone within Bluetooth range can read unencrypted broadcasts. Click **Send Config**, then **Disconnect**. [BTHome v2 format](https://bthome.io/format/)
3. In Home Assistant, go to **Settings → Devices & services** and add the discovered **BTHome** device. You can also choose **Add integration → BTHome**. The sensor broadcasts directly to the Home Assistant Bluetooth adapter or a supported Bluetooth proxy. Xiaomi account access is only needed for obtaining the stock credentials in this procedure. [Home Assistant BTHome setup](https://www.home-assistant.io/integrations/bthome/)
4. Open the new device and check temperature, humidity, and battery if reported. Compare temperature and humidity with the LCD, then verify that the readings update after a measurement change and at the intended installation location. If discovery fails, first check that the flasher is disconnected, the sensor is in range, and the advertising type was saved.
