//Form
const form = document.getElementById("form");
const addres = document.getElementById("input_addres");
// Text View
const ipView = document.getElementById("ip");
const locationAdd = document.getElementById("location");
const timezoneAs = document.getElementById("timezone");
const ispText = document.getElementById("isp");

// Urls
const apiKey = "at_Fql6DQcKuZWmJS5WDyZrm6TVq43wu";
const apiIp = "https://api.ipify.org?format=json";

let iconLoca = L.icon({
    iconUrl: "./images/icon-location.svg",
    iconSize: [42, 50],
});
let map = L.map("map");
let marker = L.marker([0, 0], { icon: iconLoca }).addTo(map);

async function getIp() {
    const res = await fetch(apiIp);
    const data = await res.json();
    const { ip } = data;
    return {
        ip,
    };
}

async function getLocation(ip) {
    const res = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ip}`
    );
    const data = await res.json();
    const { location, isp } = data;
    return {
        location,
        isp,
    };
}

function MapCoords(lat, lng) {
    marker.setLatLng([lat,lng])

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
}

async function initialApp() {
    const { ip } = await getIp();
    const { location, isp } = await getLocation(ip);
    ipView.innerHTML = ip;
    locationAdd.innerHTML = `${location.region}, ${location.city}`;
    ispText.innerHTML = isp;
    timezoneAs.innerHTML = `UTC ${location.timezone}`;

    map.setView([location.lat, location.lng], 13);
    MapCoords(location.lat, location.lng);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ip = addres.value;
    const { location, isp } = await getLocation(ip);
    addres.value = "";

    ipView.innerHTML = ip;
    locationAdd.innerHTML = `${location.region}, ${location.city}`;
    ispText.innerHTML = isp;
    timezoneAs.innerHTML = `UTC ${location.timezone}`;

    map.flyTo([location.lat, location.lng], 13, {
        animate: true,
        duration: 2, // in seconds
    });

    MapCoords(location.lat, location.lng);
});

window.addEventListener("DOMContentLoaded", async () => {
    await initialApp();
});
