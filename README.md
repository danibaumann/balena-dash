# FSAS-Player Image

- [Introduction](#introduction)
- [Hardware required](#hardware-required)
- [Using WiFi Connect](#using-wifi-connect)
- [Controlling content](#controlling-content)
- [HDMI Audio Settings](#hdmi-audio-settings)

## Introduction

This Install Image for the Balena Cloud is based on the official Balena-Dash Project. It uses two different docker container. One is for the Kiosk environment with istalled x11vnc package for remove VNC over VPN. The second one is wifi-connect which checks the internet connection and sets up a Wifi access point to fix/change the Wifi password. See [Using WiFi Connect](#using-wifi-connect) for further details.

## Hardware required

This project was built for the Raspberry Pi 3 B+ but was modified to be used with an Intel NUC. The orgiginal FSAS-Player V2 is Intel NUC based with a dual core i3 CPU and does work. Please note the Audio settings when sound output is not working.

The minimum Specs are:

- Dual Core > 1.5 GHz
- 4GB RAM
- 16GB Hard Drive
- Wifi 5
- x64 Architecture CPU

## Setup and configuration

You can deploy this project to a new balenaCloud application in one click using the button below:
[Deploy with Balena](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/balenalabs/balena-dash)

Or, you can create an application in your balenaCloud dashboard and `balena push` this code to it the traditional way. Just be aware that balenaDash requires that you allocate more memory to the GPU. This is achieved by adding (or editing the existing) the **Device configuration variable** `RESIN_HOST_CONFIG_gpu_mem`, for this project we recommend setting it to `128`. (on RPi)

## Using WiFi Connect

The balenaDash project includes [wifi-connect](https://github.com/balena-io/wifi-connect) which enables your device to operate as a WiFi access point and allow you to join a different WiFi network using captive portal functionality. Although you can specify a WiFi network to join when you first add your device and download the image from the balenaCloud dashboard, there may be situations where you need to change that.

WiFi Connect periodically tests for a functional internet connection. If nothing is found, the device sets itself up as a WiFi access point named `fsas-access` that you can join with a mobile device.

To use WiFi Connect you need to join the `fsas-access` network and you should see a captive portal popup. The passphrase is `fsas-access`. If not, ensure that you remain connected to the `fsas-access` network and visit the IP address of the device in a browser on port `80`. For example `http://<ip of balenaDash device>`. This will allow you to access WiFi Connect, perform a site survey and join a different WiFi network.

## Controlling content

### Loading a URL

To configure the URL displayed by webkit, set the **`LAUNCH_URL`** environment
variable. If nothing is set, balenaDash will display the balenaOS logo on the screen.

### Switching URLs quickly using your web browser or Slack

Your balenaDash device is also running a small webserver on port 8080. The screen will show the URL configured at `LAUNCH_URL` normally, but the webserver allows you to put other URLs on screen quickly and easily. If you tell balenaCloud to expose your device's public URL, then you can even control it with Slack (or `curl`, or anything that can use webhooks). [More details](https://github.com/mozz100/tohora/blob/master/README.md)

## HDMI Audio Settings

If you have problems with HDMI Audio on an Intel NUC or any x64 based system, please check if the hardware is detected correctl by connecting to the kiosk container and enter `aplay -l` to get a list of all soundcards and digital audio devices. `aplay -L` will give you a list of the device names.
Here is a sample output from a NUC7i3:

```
**** List of PLAYBACK Hardware Devices ****
card 0: PCH [HDA Intel PCH], device 0: ALC283 Analog [ALC283 Analog]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 0: PCH [HDA Intel PCH], device 1: ALC283 Digital [ALC283 Digital]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 0: PCH [HDA Intel PCH], device 3: HDMI 0 [HDMI 0]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 0: PCH [HDA Intel PCH], device 7: HDMI 1 [HDMI 1]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 0: PCH [HDA Intel PCH], device 8: HDMI 2 [HDMI 2]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 0: PCH [HDA Intel PCH], device 9: HDMI 3 [HDMI 3]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 0: PCH [HDA Intel PCH], device 10: HDMI 4 [HDMI 4]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
```

In this example we use the `hw:3,0` to select device 3 and HDMI 0. To use this Audio device, please got to your Balena Dashboard and add a device variable called `AUDIO_HW` with a value of `pcm.!default { type hw card 0 device 3 }`. The start.sh script will then write this value into the '/etc/asound.conf' on container boot and the audio should work. If not, please check [this link](https://forums.balena.io/t/no-audio-hdmi-3-5mm/156833/12) for news.
