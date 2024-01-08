<template>
    <body>
      <img src="../assets/entoothiast.png" class="logo">
      <div class="container">
        <div class="iconbar">
            <div v-if="showNotifications" class="notification-modal">
                <h2 style="color: black;">Notifications</h2>
                <ul><li v-for="notification in notifications" :key="notification.id">
                        <p>{{ notification.message }}</p><br>
                  </li></ul>
                <button @click="markNotificationsAsRead" class="close">Mark as read</button>
            </div>

          <img src="../assets/notification.png" class="icon" @click="openNotifications">
          <router-link to="/settings"><img src="../assets/settings.png" class="icon"></router-link>
          <img src="../assets/logout.png" class="icon" @click="logout">
        </div>
          <h1>Welcome, {{ name }}</h1>
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
                        <p><b>{{ formatDateTime(timeslot.start_time) }}</b><br>{{ timeslot.dentist_id }}</p>
                          <p><img src="../assets/book.png" class="book" @click="bookAppointment(timeslot)"> Book appointment</p>
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
                  <h2>Find your way</h2>
                  <iframe class="border-radius" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d37624.51290945841!2d11.951633712337204!3d57.70577925453717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464f8e67966c073f%3A0x4019078290e7c40!2zR8O2dGVib3Jn!5e0!3m2!1sfi!2sse!4v1699993100652!5m2!1sfi!2sse" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              </div>
          </div>
      </div>
      </body>
    </template>
    
<script>
    import {Api} from '../Api';
    import moment from 'moment';
    export default {
      name: "Home-page",
      data() {
      return {
        username: '',
        name: '',
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
        const userId = localStorage.getItem('userId')
        
        if (token && userId) {
            Api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            Api.get(`/v1/users/${userId}`)
            .then(response => {
                const userData = response.data.message[0];
                this.username = userData.username;
                this.name = userData.name;
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
            const userId = localStorage.getItem('userId');

            if (!userId) {
            console.error('User ID not found in local storage.');
            return;
            }

            Api.get(`/v1/users/${userId}/appointments`)
            .then(response => {
                const allAppointments = response.data.message
                
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
        const userId = localStorage.getItem('userId');

        if (!userId) {
            console.error('User ID not found in local storage.');
            return;
        }

        this.fetchNotifications(userId);

        // Set up interval to fetch notifications every 5 seconds
        this.notificationInterval = setInterval(() => {
            this.fetchNotifications(userId);
        }, 5000);
    },

    fetchNotifications(userId) {
        Api.get(`/v1/users/${userId}/notifications`)
            .then(response => {
                this.notifications = response.data.notifications;
                console.log(response.data.notifications);
            })
            .catch(error => {
                console.error(error.response.data);
            });
    },

    beforeDestroy() {
        clearInterval(this.notificationInterval);
    },

    markNotificationsAsRead() {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            console.error('User ID not found in local storage.');
            return;
        }
        Api.patch(`/v1/users/${userId}/notifications`)
            .then(response => {
                console.log('Notifications marked as read:', response.data);
                this.showNotifications = false;
            })
            .catch(error => {
                console.error('Error marking notifications as read:', error.response.data);
            });
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
            const userId = localStorage.getItem('userId');
            console.log('Timeslot object:', timeslot);
            var newAppointment = {
                timeslot_id: timeslot.id,
                patient_id: userId,
                dentist_id: timeslot.dentist_id,
                cancelled: false,
                confirmed: true
            }
            console.log(newAppointment)
            Api.post('/v1/appointments', newAppointment)
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
                    console.log(response.data)
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
  formatDateTime(dateTime) {
      return moment(dateTime).format('DD-MM-YYYY HH:mm');
    },
    }
}
</script>
    
<style>
    @import url("../assets/styles/style.css");
</style>
