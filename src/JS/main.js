let device; // Global variable to store the connected device

// Function to connect to the USB device
async function connectToDevice() {
    try {
        device = await navigator.usb.requestDevice({ filters: [] });
        if (device) {
            console.log("Device:", device);
            console.log("Access:", device.opened ? "Yes" : "No");

            console.log("Connected to device:", device.productName);
        }
    } catch (error) {
        console.error("Error connecting to the device:", error);
    }
}

// Function to send an APDU command
async function sendApdu() {
    if (!device) {
        console.error("No device connected. Connect to a device first.");
        return;
    }

    // Ensure the device is opened and the correct interface is claimed
    if (!device.opened) {
        await device.open();
    }

    // Select the right configuration if the device has more than one
    if (device.configuration === null) {
        await device.selectConfiguration(1);
    }

    // Claim the interface (replace 0 with the correct interface number)
    await device.claimInterface(0);

    let apduCommand = new Uint8Array([0x00, 0xA4, 0x04, 0x00, 0x0A, 0xA0, 0x00, 0x00, 0x62, 0x03, 0x01, 0x0C, 0x06, 0x01]); // Example APDU

    // Send the APDU command (replace endpointNumber with the correct number)
    let result = await device.transferOut(endpointNumber, apduCommand);

    // Read the response from the smartcard (replace endpointNumber and expectedResponseLength with the correct values)
    let response = await device.transferIn(endpointNumber, expectedResponseLength);

    // Close the connection to the device (optional)
    await device.close();

    console.log("APDU Response:", response.data);
}

document.addEventListener('DOMContentLoaded', () => {
    let connectButton = document.getElementById('connect-button');
    connectButton.addEventListener('click', connectToDevice);

    let readButton = document.getElementById('read-button');
    readButton.addEventListener('click', sendApdu);
});

  