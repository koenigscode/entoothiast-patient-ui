<template>
  <body>
    <img src="../assets/entoothiast.png" class="logo">
    <div class="container">
      <div class="iconbar">
        <img src="../assets/settings.png" class="icon">
        <img src="../assets/logout.png" class="icon">
      </div>
        <h1>Welcome, user</h1>
        <div class="columns">
            <div class="half-column">
                <h2>Your next appointment</h2>
                <div class="appointment">
                    <p><b>Feb 2, 2024 12:00</b><br>Dentist Name, Dentist Clinic</p>
                    <p>Cancel appointment</p>
                </div>
            </div>
            <div class="half-column">
                <h2>Your past appointments</h2>
                <p><b>Feb 2, 2024 12:00</b><br>Dentist Name, Dentist Clinic</p>
                <p><b>Feb 2, 2024 12:00</b><br>Dentist Name, Dentist Clinic</p>
            </div>
        </div>

        <h2>Book appointment</h2>
        <div class="columns">
            <div class="filter">
                <b>Date</b>
            </div>
            <div class="filter">
                <b>Dentist Clinic</b>
            </div>
            <div class="filter">
                <b>Dentist Name</b>
            </div>
        </div>

        <div class="columns">
            <div class="appointment">
                <p><b>Feb 2, 2024 12:00</b><br>Dentist Name, Dentist Clinic</p>
                <p>Book appointment</p>
            </div>

            <div class="appointment">
                <p><b>Feb 2, 2024 12:00</b><br>Dentist Name, Dentist Clinic</p>
                <p>Book appointment</p>
            </div>

            <div class="appointment">
                <p><b>Feb 2, 2024 12:00</b><br>Dentist Name, Dentist Clinic</p>
                <p>Book appointment</p>
            </div>
        </div>

        <div class="columns">
            <div class="appointment">
                <p><b>Feb 2, 2024 12:00</b><br>Dentist Name, Dentist Clinic</p>
                <p>Book appointment</p>
            </div>

            <div class="appointment">
                <p><b>Feb 2, 2024 12:00</b><br>Dentist Name, Dentist Clinic</p>
                <p>Book appointment</p>
            </div>

            <div class="appointment">
                <p><b>Feb 2, 2024 12:00</b><br>Dentist Name, Dentist Clinic</p>
                <p>Book appointment</p>
            </div>
        </div>

        <div class="columns">
            <div class="appointment">
                <p><b>Feb 2, 2024 12:00</b><br>Dentist Name, Dentist Clinic</p>
                <p>Book appointment</p>
            </div>

            <div class="appointment">
                <p><b>Feb 2, 2024 12:00</b><br>Dentist Name, Dentist Clinic</p>
                <p>Book appointment</p>
            </div>

            <div class="appointment">
                <p><b>Feb 2, 2024 12:00</b><br>Dentist Name, Dentist Clinic</p>
                <p>Book appointment</p>
            </div>
        </div>

        <div class="columns">
            <div class="half-column">
                <h2>Statistics</h2>
                <ul>
                    <li>Total of <b>2</b> appointments this year.</li>
                    <li>Your most used dentist is <b>Dentist Name</b>.</li>
                </ul>
            </div>
            <div class="half-column">
             <div class="map-container" style="height:300px; width:500px">
                <l-map ref="map" v-model:zoom="zoom" :center="[57.706413, 11.966846]">
                    <l-tile-layer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    layer-type="base"
                    name="OpenStreetMap"
                > </l-tile-layer>
                <l-control-scale position="topright" :imperial="true" :metric="true" ></l-control-scale>
                <l-marker v-for="clinic in clinics" :key="clinic.id" :lat-lng="[clinic.latitude, clinic.longitude]">
                <l-tooltip> {{ clinic.name }}</l-tooltip>
               </l-marker>
                </l-map>  
            </div>    
            </div>
        </div>
    </div>
    </body>
  </template>
  
  <script>
  import "leaflet/dist/leaflet.css";
  import { LMap, LTileLayer, LMarker, LTooltip, LControlScale } from "@vue-leaflet/vue-leaflet";
  import { Api } from "@/Api";

  export default {
    name: "Home-page",
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LTooltip,
        LControlScale
    },
    data() {
        return {
        zoom: 11.5,
        clinics: []
        }
  },
  created() {
    this.getAllClinics()
  },
methods: {
getAllClinics() {
Api.get('/v1/clinics')
.then((res) => {
    this.clinics = res.data.clinics
    console.log(res.data.clinics)
})
.catch((err) => {
    console.log(err)
})
}
  }
  
}
  </script>
  
  <style>
  @import url("../assets/styles/style.css");
  </style>
  