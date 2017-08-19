const axios = require("axios");
const DashButton = require("node-dash-button");

const HUE_HOST = process.env.HUE_HOST;
const HUE_USERNAME = process.env.HUE_USERNAME;
const DASH_BUTTON_MAC = process.env.DASH_BUTTON_MAC;

const dash = DashButton(DASH_BUTTON_MAC, null, null, "all");

// TODO: check if configuration is empty or not

dash.on("detected", async () => {
  try {
    const res = await axios.get(`http://${HUE_HOST}/api/${HUE_USERNAME}/lights`);
    const lights = res.data;
    const ids = Object.keys(lights);
    const on = Object.values(lights).map(l => l.state.on).reduce((a, b) => a || b, false);
    if (on) {
      console.log("turning off...");
      for (const id of ids) {
        axios.put(`http://${HUE_HOST}/api/${HUE_USERNAME}/lights/${id}/state`, {
          on: false,
        });
      }
    } else {
      console.log("turning on...");
      for (const id of ids) {
        axios.put(`http://${HUE_HOST}/api/${HUE_USERNAME}/lights/${id}/state`, {
          on: true,
          bri: 254,
          hue: 14910,
          sat: 144,
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
});

console.log("started");
