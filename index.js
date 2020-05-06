var noble = require('noble-mac'); //change to require('noble') for non-macOS

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    // Seek for peripherals broadcasting the heart rate service
    // This will pick up a Polar H7 and should pick up other ble heart rate bands
    // Will use whichever the first one discovered is if more than one are in range
    noble.startScanning(["180d"]);
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  // Once peripheral is discovered, stop scanning
  noble.stopScanning();

  // connect to the heart rate sensor
  peripheral.connect(function(error) {
    // 180d is the bluetooth service for heart rate:
    // https://developer.bluetooth.org/gatt/services/Pages/ServiceViewer.aspx?u=org.bluetooth.service.heart_rate.xml
    var serviceUUIDs = ["180d"];
    // 2a37 is the characteristic for heart rate measurement
    // https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.heart_rate_measurement.xml
    var characteristicUUIDs = ["2a37"];
    let time = 0;
    console.log("Time (s), RRI (BPM), Heart Rate (BPM)");

    // use noble's discoverSomeServicesAndCharacteristics
    // scoped to the heart rate service and measurement characteristic
    peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, function(error, services, characteristics) {
      characteristics[0].notify(true, function(error) {
        characteristics[0].on('data', function(data, isNotification) {
          // Upon receiving data (array of bytes), decode the HR (in bpm) and the RRIs included
          // console.log('length: ' + data.length)
          // console.log('[0] flags: ' + (data[0]).toString(2)); //(conv this to binary) see: https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.heart_rate_measurement.xml
          // console.log('[1] bpm8: ' + data[1]);
          console.log(data);
          rriIndex = 2;
          RRITxt = ''//'R-to-R Interval: '
    		  for (var i = rriIndex; i < data.length; i+=2) { //loop over RRI entries (2 indicies per val)
 	          RRITxt = ' ' + (data[i] + 256*data[i+1]); //2nd bit is most significant
            RRITxtBPM = RRITxtBPM / 1000.0 * 60.0; // RRI in bpm
            console.log(time + ", " + RRITxtBPM + ", " + data[1]);
            time += (RRITxt / 1000.0);
   	      }
        });
      });
    });
  });
});

/**
 * Wahoo TICKR
 * Flags: 10110
 *   [0]  =  0: Heart Rate Value Format is set to UINT8. Units: beats per minute (bpm)
 *   [12] = 11: Sensor Contact feature is supported and contact is detected
 *   [3]  =  0: Energy Expended field is not present
 *   [4]  =  1: One or more RR-Interval values are present.
 * Fields:
 *   [0]: Flags
 *   [1]: Heart Rate Measurement Value (uint8)
 *   [2]: R-R Interval
 */
