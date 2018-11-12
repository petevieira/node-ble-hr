# Receive heart rate and RRI via BLE HR using Node

This simple example uses [Noble-mac](https://github.com/Timeular/noble-mac) (or with simple documented modification [Noble] (https://github.com/sandeepmistry/noble)) to listen to heart rate and beat-to-beat interval (aka RRI or IBI) data transimitted from any device which speaks the [Bluetooth Heart Rate Service](https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.service.heart_rate.xml&u=org.bluetooth.service.heart_rate.xml) protocol. A list of such devices currently includes: 

- Polar H10
- Polar H7
- Wahoo TICKR(X)
- Zephyr HxM (BT4.0 version only)
- 4iiii Viiiiva

and several others (see Notes below)

## Overview

`index.js` is pretty short and thoroughly commented. The code is very basic: it just finds the first bluetooth peripheral transmitting the bluetooth heart rate service and listens for and parses out the measurement data.

## How to use this

- [Install node](https://nodejs.org/en/download/)
- Clone this repo
- In the root directory, run `npm install` to install noble
- Put on device and run `node index.js`
- After a few seconds, you should see RRI data printed to the terminal

## Notes
I searched for a good Python-based solution (in late 2018) and found nothing suitable. This was the best option available and plays nice with Python via the `subprocess` module and pipe of stdout. (see [here](https://stackoverflow.com/a/52940833/695804) for some example code). 

Based on [node-h7-hr](https://github.com/jakelear/node-h7-hr), which pulls HR only and uses noble. Took some time to figure out how the bytes were laid out for RRI, but I've documented it. 

After upgrading macOS and Node versions, I had trouble getting things to work anymore. However in the end there was a relatively simple solution, using the [noble-mac](https://github.com/Timeular/noble-mac) package instead of noble, which is more stable on macOS between versions. Those without macOS can make the simple documented changes in `index.js` and `package.json` to use [noble] (https://github.com/sandeepmistry/noble) instead. 

If you have trouble with Node versions, unfortunately, this can be a wormwhole. However, I can recommend the [node-reinstall](https://github.com/brock/node-reinstall/) package for both re-installing and installing first time. Also: run commands without `sudo`. 

I have tested with the H7 and the Tickr. This _should_ function with other Bluetooth heart rate sensors that broadcast the Heart Rate (180d) service. This does not include Fitbit or Apple products, which are more locked-down on the data side unfortunately.

Example lists of devices this should be compatible with (mostly HR straps) can be found at [EliteHRV](https://elitehrv.com/compatible-devices) and [Sweetwater](http://www.sweetwaterhrv.com/healthsensors.shtml)

## Resources

- [Bluetooth Heart Rate Measurement Spec](https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.characteristic.heart_rate_measurement.xml)
- [Polar developer information for H7,H10 etc.](https://developer.polar.com/wiki/H6,_H7_and_H10_Heart_rate_sensors) (including the important information about units for RRI data!)
- If you are interested in accurate R-R interval data (for HRV, for example) be careful which devices you use. Most optical devices (e.g. wrist-worn) provide insufficiently accurate RRI data. ECG is generally a better method for this purpose. See [Marco Altini's great writeup](https://www.hrv4training.com/blog/hardware-for-hrv-what-sensor-should-you-use) for more nuanced analysis and discussion.

