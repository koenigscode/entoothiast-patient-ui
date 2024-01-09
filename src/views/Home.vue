<template>
    <body>
      <img src="../assets/entoothiast.png" class="logo">
      <div class="container">
        <div class="iconbar">
            <div v-if="showNotifications" class="notification-modal">
                <h2 style="color: black;">Notifications</h2>
                <ul><li v-for="notification in notifications" :key="notification.id">
                        <p><b>{{ notification.timeslot_id }}</b></p><br>
                        <p>{{ notification.message }}</p>
                  </li></ul>
                <button @click="closeNotifications" class="close">Close notifications</button>
            </div>

          <img src="../assets/notification.png" class="icon" @click="openNotifications">
          <router-link to="/settings"><img src="../assets/settings.png" class="icon"></router-link>
          <img src="../assets/logout.png" class="icon" @click="logout">
        </div>
          <h1>Welcome, {{ this.username }}</h1>
          <div class="columns">
              <div class="half-column">
                  <h2>Your next appointment</h2>
                  <ul><li v-for="appointment in upcomingAppointments" :key="appointment.id">
                    <div class="appointment">
                          <p><b>{{ appointment.timeslot_id }}</b><br>{{ appointment.dentist_id }}</p>
                          <p><img src="../assets/cancel.png" class="book" @click="cancelAppointment(appointment.timeslot_id)"> Cancel appointment</p>
                      </div>
                  </li></ul>
              </div>
              <div class="half-column">
                <h2>Your past appointments</h2>
                <ul><li v-for="appointment in pastAppointments" :key="appointment.id">
                <div class="appointment">
                    <p><b>{{ appointment.timeslot_id }}</b><br> {{ appointment.dentist_id }}</p>
                </div></li></ul>
              </div>
          </div>
  
          <h2>Book appointment</h2>
          <div class="columns" id="lessMargin">
              <div>
                <input type="date" v-model="selectedDate" @change="filterByDate" id="dateFilter" class="filter">
              </div>
              <div>
                <select v-model="selectedClinic" @change="filterByClinic" id="clinicFilter" class="filter">
                    <option value="">All Clinics</option>
                    <option v-for="clinic in clinics.clinics" :key="clinic.id" :value="clinic.id">{{ clinic.name }}</option>
                </select>
              </div>
              <div>
                <select v-model="selectedDentist" @change="filterByDentist" id="dentistFilter" class="filter">
                    <option value="">All Dentists</option>
                    <option v-for="dentist in dentists.dentists" :key="dentist.id" :value="dentist.id">{{ dentist.name }}</option>
                </select>
              </div>
          </div>
  
          <div class="columns">
              <ul>
                  <li v-for="timeslot in timeslots" :key="timeslot.id">
                      <div class="appointment">
                          <p><b>{{ timeslot.start_time }} {{ timeslot.end_time }}</b><br>{{ timeslot.dentist_id }}</p>
                          <p><img src="../assets/book.png" class="book" @click="bookAppointment(timeslot.id)"> Book appointment</p>
                      </div>
                  </li>
              </ul>
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
                 <l-map ref="map" v-model:zoom="zoom" :center="[57.706413, 11.966846]">
                    <l-tile-layer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    layer-type="base"
                    name="OpenStreetMap"
                > </l-tile-layer>
                <l-control-scale position="topright" :imperial="true" :metric="true" ></l-control-scale>
                <l-marker v-for="clinic in clinics" :key="clinic.id" :lat-lng="[clinic.latitude, clinic.longitude]">
                <l-popup> 
                    <p class="clinic">
                    {{ clinic.name }}
                    </p>
                    <button class="clinic-btn" @click="goToClinicPage(clinic.id)">Clinic's Page</button>
                </l-popup>
               </l-marker>
                </l-map>       
            </div>
          </div>
      </div>
      </body>
    </template>
    
<script>
    import "leaflet/dist/leaflet.css";
    import { LMap, LTileLayer, LMarker, LControlScale, LPopup } from "@vue-leaflet/vue-leaflet";
    import { Api } from "@/Api";

    export default {
      name: "Home-page",
      components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        LControlScale
    },
      data() {
      return {
        username: '',
        userId: '',
        timeslots: [],
        startTime: new Date().toISOString().slice(0, 19).replace("T", " "),
        upcomingAppointments: [],
        pastAppointments: [],
        notifications: [],
        selectedClinic: '',
        selectedDate: new Date().toISOString().split('T')[0],
        selectedDentist: '',
        clinics: [],
        dentists: [],
        showNotifications: false,
        zoom: 11.5,
      }
    },
    mounted() {
        this.getUserData()
        this.getAllClinics()
        this.getAllDentists()
        this.getTimeslots(this.startTime)
    },
    methods: {
        getUserData() {
        const token = localStorage.getItem('authToken')
        this.userId = localStorage.getItem('userId')
        
        if (token && this.userId) {
            Api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            Api.get(`/v1/users/${this.userId}`)
            .then(response => {
                this.username = response.data.username

                this.getUsersAppointments()
                this.getUsersNotifications()
            })
            .catch(error => {
                console.error('Error fetching user data:', error)
            })
        }
        },

        logout() {
            localStorage.removeItem('authToken')
            this.$router.push('/login')
        },

        getUsersAppointments() {
            Api.get(`/v1/users/${this.userId}/appointments`)
            .then(response => {
                const allAppointments = response.data
                
                allAppointments.forEach(appointment => {
                    const timeslotId = appointment.timeslot_id

                    Api.get(`/v1/timeslots/${timeslotId}`)
                    .then(response => {
                        const timeslotEndTime = new Date(response.data.end_time)
                        
                        if (timeslotEndTime > this.startTime) {
                            this.upcomingAppointments.push(appointment)
                        } else {
                            this.pastAppointments.push(appointment)
                        }
                    })
                    .catch(error => {
                        console.error(error.response.data)
                    })
                })
            })
            .catch(error => {
                console.error(error.response.data);
            })
        },

        getUsersNotifications() {
            Api.get(`/v1/users/${this.userId}/notifications`)
            .then(response => {
                this.notifications = response.data
            })
            .catch(error => {
                console.error(error.response.data)
            })
        },

        getTimeslots(startTime) {
            console.log('calling timeslots')
            Api.get('/v1/timeslots', { params: { startTime: startTime }})
            .then(response => {
                console.log(response.data.timeslots)
                this.timeslots = response.data.timeslots
            })
            .catch(error => {
                console.error(error.response.data)
            })
        },

        bookAppointment(timeslot) {
            var newAppointment = {
                timeslot_id: timeslot,
                patient_id: this.userId,
                dentist_id: '',
                cancelled: false,
                confirmed: true
            }
            Api.post('/v1/appointments/', newAppointment)
            .then(response => {
                console.log(response.data)
                newAppointment = response.data
            })
            .catch(error => {
                console.error(error.response.data)
            })
        },

        cancelAppointment(timeslot) {
            const cancelledAppointment = {
                timeslot_id: timeslot,
                cancelled: true
            }
            Api.patch(`/v1/appointments/`, cancelledAppointment)
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.error(error.response.data)
            })
        },

        getAllClinics() {
            Api.get('/v1/clinics')
                .then(response => {
                    console.log(response.data.clinics)
                    this.clinics = response.data.clinics
                })
                .catch(error => {
                    console.error(error.response.data)
                })
        },

        getAllDentists() {
            Api.get('/v1/dentists')
            .then(response => {
                console.log(response.data)
                this.dentists = response.data
            })
            .catch(error => {
                console.error(error.response.data)
            })
        },

        filterByClinic() {
            const clinicId = this.selectedClinic
            const currentDate = new Date()
            const startTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            
            Api.get(`/v1/timeslots?clinic=${clinicId}&startTime=${startTime}`)
            .then(response => {
                this.timeslots = response.data;
            })
            .catch(error => {
                console.error('Error fetching timeslots:', error);
            })
        },

        filterByDate() {
            const currentDate = new Date(this.selectedDate)
            const startTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            
            Api.get(`/v1/timeslots?startTime=${startTime}`)
            .then(response => {
                this.timeslots = response.data;
            })
            .catch(error => {
                console.error('Error fetching timeslots:', error);
            })
        },

        filterByDentist() {
            const dentistId = this.selectedDentist
            const currentDate = new Date()
            const startTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            
            Api.get(`/v1/timeslots?dentist=${dentistId}&startTime=${startTime}`)
            .then(response => {
                this.timeslots = response.data;
            })
            .catch(error => {
                console.error('Error fetching timeslots:', error);
            })
        },

        openNotifications() {
            this.showNotifications = true;
        },
        closeNotifications() {
            this.showNotifications = false;
        },
        
        goToClinicPage(clinicId) {
             this.$router.push('/clinics/' + clinicId)
        }
    }
}
</script>
    
<style>
    @import url("../assets/styles/style.css");
</style>
