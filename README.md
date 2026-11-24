# Xiaomi MJWSD06MMC to BTHome

**English** · [日本語](README.ja.md)

Run the Xiaomi Smart Temperature and Humidity Monitor 3 Mini (`QBH4312GL`, model `MJWSD06MMC`) as a local Bluetooth sensor in Home Assistant. The stock firmware works with the **Xiaomi BLE** integration and a per-device key. This guide also covers flashing the pvvx firmware and broadcasting measurements over **BTHome v2**. [Xiaomi specifications](https://www.mi.com/jp/product/xiaomi-smart-temperature-and-humidity-monitor-3-mini/specs/)

## What we verified

| Check | Result |
| --- | --- |
| Bluetooth Device Information read on Ubuntu | Model `MJWSD06MMC`, hardware `V1.3`, firmware and software revision strings `0009` |
| Stock Bluetooth broadcasts | Xiaomi MiBeacon product ID `0x5BEA`. Both presence-only and encrypted measurement advertisements were observed. |
| Home Assistant with stock firmware | Xiaomi BLE discovered the device. Temperature, humidity, and battery entities appeared after key entry. The last check still showed them as unavailable, so live readings on stock firmware remain unverified. |
| BTHome conversion | Flashing and BTHome readings are untested on this unit. The steps below follow the firmware project's documentation. |

The `0009` strings match the revision used by the upstream `2.1.1_0009` OTA instructions. The full version string in Xiaomi Home was unverified. `0x5BEA` identifies the advertised product and cannot establish the board revision. [Upstream OTA notes and reports](https://github.com/pvvx/ATC_MiThermometer/issues/636)

## 1. Retrieve the stock Bluetooth credentials

1. Add the sensor to **Xiaomi Home** on your phone. This binding is needed for the documented stock `0009` OTA route. If already added, use the existing binding.
2. On Windows, run `token_extractor.exe` from the [Xiaomi Cloud Tokens Extractor release](https://github.com/PiotrMachowski/Xiaomi-cloud-tokens-extractor/releases/tag/v1.5.1). At `p/q:`, enter `q`. Scan the QR code shown by the tool and approve the sign-in with the same Xiaomi account. Select the Xiaomi Home region, or press Enter at the server prompt to check all regions.
3. Match the result to the sensor's Bluetooth address. The flasher uses `TOKEN` and `BLE KEY` from that device's entry. Keep the output private. A factory reset or new binding can change the credentials.

### Keep the stock firmware

In Home Assistant, go to **Settings → Devices & services**, open the discovered **Xiaomi BLE** device, and choose **Enter encryption key manually** when offered during setup or reauthentication. Enter the 32-character `BLE KEY`. Home Assistant stores the key for ongoing local use, including after a restart. If only discovery works, bring the sensor near the Home Assistant Bluetooth receiver and wait for a measurement advertisement. If values stay unavailable, check the selected device's key and reception separately. [Home Assistant Xiaomi BLE encryption guide](https://www.home-assistant.io/integrations/xiaomi_ble/#encryption)

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
