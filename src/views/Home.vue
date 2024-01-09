<template>
    <body>
      <img src="../assets/entoothiast.png" class="logo">
      <div class="container">
        <div class="iconbar">
            <div v-if="showNotifications" class="notification-modal">
                <h2 style="color: black;">Notifications</h2>
                <ul>
    <li v-for="notification in notifications" :key="notification.id" :class="{ 'read-notification': notification.read }">
        <p>{{ notification.message }}</p><br>
    </li>
</ul>

                <button @click="markNotificationsAsRead" class="close">Mark as read</button>
            </div>

            <img :src="getNotificationIcon()" class="icon" @click="openNotifications">

          <router-link to="/settings"><img src="../assets/settings.png" class="icon"></router-link>
          <img src="../assets/logout.png" class="icon" @click="logout">
        </div>
          <h1>Welcome, {{ name }}</h1>
          
    <h2>Your Appointments</h2>
    <div class="columns" id="lessMargin">
      
        <select v-model="selectedTimespan" @change="filterByTimespan" id="timespanFilter" class="timespanFilter">
          <option value="upcoming">Upcoming Appointments</option>
          <option value="past">Past Appointments</option>
        </select>
      </div>


    <div class="columns">
      <ul id="appointment">
        <li v-for="appointment in filteredAppointments" :key="appointment.id">
          <div class="appointment">
            <p><b>Start Time:</b> {{ formatDateTime(appointment.start_time) }}</p>
            <p><b>End Time:</b> {{ formatDateTime(appointment.end_time) }}</p>
            <p><b>Dentist:</b> {{ appointment.dentist_name }}</p>
            <p><b>Clinic:</b> {{ appointment.clinic_name }}</p>
            <p v-if="isUpcomingAppointment(appointment)">
                <img src="../assets/cancel.png" class="book" @click="cancelAppointment(appointment.id)"> 
                Cancel appointment
            </p>
          </div>
        </li>
      </ul>
      <div v-if="noAppointmentsMessage" class="no-timeslots-message">{{ noAppointmentsMessage }}</div>
    </div>

  
          <h2>Book appointment</h2>
          <div class="columns" id="lessMargin">
              <div>
                <input type="date" v-model="selectedDate" @input="filterTimeslots" id="dateFilter" class="filter">
              </div>
              <div>
                <select v-model="selectedClinic" @change="filterTimeslots" id="clinicFilter" class="filter">
                    <option value="">All Clinics</option>
                    <option v-for="clinic in clinics" :key="clinic.id" :value="clinic.name">{{ clinic.name }}</option>
                </select>
              </div>
              <div>
                <select v-model="selectedDentist" @change="filterTimeslots" id="dentistFilter" class="filter">
                    <option value="">All Dentists</option>
                    <option v-for="dentist in dentists" :key="dentist.id" :value="dentist.name">{{ dentist.name }}</option>
                </select>
              </div>
          </div>
  
          <div class="columns">
              <ul id = "appointment">
                  <li v-for="timeslot in timeslots" :key="timeslot.id">
                      <div class="appointment">
                        <p><b>{{ formatDateTime(timeslot.start_time) }}</b><br>{{ timeslot.dentist_name }}</p>
                          <p><img src="../assets/book.png" class="book" @click="bookAppointment(timeslot)"> Book appointment</p>
                      </div>
                  </li>
              </ul>
              <div v-if="noTimeslotsMessage" class="no-timeslots-message">{{ noTimeslotsMessage }}</div>

              
          </div>
          <a href="/dentists">See all dentists</a>
  
          <div class="columns">
              <div class="half-column">
                  <h2>Statistics</h2>
                  <ul>
                      <li>You have a total of <b>{{ appointmentsThisYear }}</b> appointments this year.</li>
                      <li>Your most used dentist is <b>{{ mostUsedDentist }}</b>.</li>
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
                        <p class="clinic">{{ clinic.name }}</p>
                        <button @click="showTimeslots(`${clinic.name}`)" class="alert">Check for timeslots</button><br>
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

    import moment from 'moment';
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
        appointmentsThisYear: 0,
        mostUsedDentist: '',
        noTimeslotsMessage: '',
        selectedTimespan: 'upcoming',
        filteredAppointments: [],
        noAppointmentsMessage: '',
        hasUnreadNotifications: false,
        zoom: 11.5,
        hasFreeTimeslots: false,
        clinicsTimeslots: [],
        clinicsFreeTimeslots: {},
      }
    },
    mounted() {
        this.getUserData()
        this.getAllClinics()
        this.getAllDentists()
        this.filterByTimespan();
        this.getTimeslots(this.startTime)
        this.getUserStatistics()
        setInterval(() => {
    this.getTimeslots(this.startTime);
                }, 3000);
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
                this.filterByTimespan();
                this.getUsersNotifications();
                this.getTimeslots(this.startTime);
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


  filterByTimespan() {
      this.noAppointmentsMessage = ''; 
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('User ID not found in local storage.');
        return;
      }
      const timespan = this.selectedTimespan;

      Api.get(`/v1/users/${userId}/appointments?timespan=${timespan}`)
        .then(response => {
          this.filteredAppointments = response.data.appointments;
        this.filteredAppointments.length === 0
        ? `No upcoming appointments available.`
        : '';
})
        .catch(error => {
          console.error(error.response.data);
        });
    },

    cancelAppointment(appointmentId) {
   
    const cancelData = {
        cancelled: true
    };

    Api.patch(`/v1/appointments/${appointmentId}`, cancelData)
        .then(response => {
            console.log('Appointment canceled successfully:', response.data);
        
           window.location.reload();
        })
        .catch(error => {
            console.error('Error canceling appointment:', error.response.data);
        });
},

isUpcomingAppointment(appointment) {
        const currentTime = new Date();
        const appointmentStartTime = new Date(appointment.start_time);
        return appointmentStartTime > currentTime;
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
                console.log(response.data);

                const index = this.timeslots.findIndex(slot => slot.id === timeslot.id);
                if (index !== -1) {
                    this.timeslots.splice(index, 1);
                }
                //this.filterByTimespan();
                window.location.reload();
            })
            .catch(error => {
                console.error(error.response.data)
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
        },3000);
    },

    fetchNotifications(userId) {
  Api.get(`/v1/users/${userId}/notifications`)
    .then(response => {
      this.notifications = response.data.notifications;
      this.hasUnreadNotifications = this.notifications.some(notification => !notification.read);
    })
    .catch(error => {
      console.error(error.response.data);
    });
},

getNotificationIcon() {
    return require(`@/assets/${this.hasUnreadNotifications ? 'new-notification.png' : 'notification.png'}`);
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
            this.notifications = [];
        })
        .catch(error => {
            console.error('Error marking notifications as read:', error.response.data);
        });
},


getTimeslots(startTime) {
    console.log('calling timeslots');

    const params = { startTime: startTime };

    if (this.selectedClinic) {
      params.clinic = this.selectedClinic;
    }

    if (this.selectedDentist) {
      params.dentist = this.selectedDentist;
    }

    Api.get('/v1/timeslots', { params: params })
      .then(response => {
        console.log(response.data.timeslots);
        const newCounter = response.data.timeslots.length;
        if (newCounter > this.timeslotCounter) {
          this.timeslotCounter = newCounter;
          window.location.reload();
          //this.filterByTimespan();
        }
        
        this.timeslots = response.data.timeslots.map(timeslot => ({
          ...timeslot,
          dentist: timeslot.dentist_name,
        }));
      })
      .catch(error => {
        console.error(error.response.data);
      });
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

         showTimeslots(clinicName) {
    // try {
    //     const response = await Api.get('/v1/timeslots?clinic=' + clinicName);
    //     console.log(response.data.timeslots)
    //     const clinicsTimeslots = response.data.timeslots;

    //     // Update the data property with information about free time slots for this clinic
    //     this.$set(this.clinicsFreeTimeslots, clinicName, clinicsTimeslots.length > 0);
    //     return clinicsTimeslots.length > 0;
    // } catch (error) {
    //     console.log(error);
    //     return false;
    // }

            Api.get('/v1/timeslots?clinic=' + clinicName)
                .then(response => {
                    let clinicsTimeslots = response.data.timeslots
                    console.log('free timeslots ' + clinicName, clinicsTimeslots)
                    console.log(clinicsTimeslots.length)
                    
                    if(clinicsTimeslots.length > 0){
                        alert("They have free timeslots, yayy! :)")
                    } else {
                    alert("Currently no free timeslots at this clinic :(")
                }})
                .catch(error => {
                    console.error(error.response.data)
                })
        },

        getAllDentists() {
            Api.get('/v1/dentists')
            .then(response => {
                console.log(response.data)
                this.dentists = response.data.dentists
            })
            .catch(error => {
                console.error(error.response.data)
            })
        },

        filterTimeslots() {
    const currentDate = new Date(this.selectedDate);
    const formattedDate = moment(currentDate).format('YYYY-MM-DD');
    const startTime = `${formattedDate}T05:00:00`;

    const params = {
        startTime: startTime,
        clinic: this.selectedClinic,
        dentist: this.selectedDentist
    };

    // Remove empty parameters
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    Api.get('/v1/timeslots', { params: params })
        .then(response => {
            this.timeslots = response.data.timeslots;
            this.noTimeslotsMessage = this.timeslots.length === 0 ? "No timeslots available for selected filters." : "";
        })
        .catch(error => {
            console.error('Error fetching timeslots:', error);
        });
},

        
        filterByClinic() {
            const clinicName = this.selectedClinic
            const currentDate = new Date();
            const startTime = currentDate.toISOString();

            if (!clinicName) {
            this.getTimeslots(startTime); 
            return;
        }
            Api.get(`/v1/timeslots?clinic=${clinicName}&&startTime=${startTime}`)
            .then(response => {
                this.timeslots = response.data.timeslots;
                this.noTimeslotsMessage = this.timeslots.length === 0 ? "No timeslots available for selected clinic." : "";
            })
            .catch(error => {
                console.error('Error fetching timeslots:', error);
            })
        },

        filterByDate() {
            console.log('Selected Date:', this.selectedDate);
            const currentDate = new Date(this.selectedDate);
            const formattedDate = moment(currentDate).format('YYYY-MM-DD');
            const startTime = `${formattedDate}T05:00:00`;
            
            Api.get(`/v1/timeslots?startTime=${startTime}`)
            .then(response => {
                this.timeslots = response.data.timeslots;
                this.noTimeslotsMessage = this.timeslots.length === 0 ? "No timeslots available for selected date." : "";
            })
            .catch(error => {
                console.error('Error fetching timeslots:', error);
            })
        },

        filterByDentist() {
        const selectedDentistName = this.selectedDentist;
        const currentDate = new Date();
        const startTime = currentDate.toISOString();

        if (!selectedDentistName) {
            this.getTimeslots(startTime); 
            return;
        }

        Api.get(`/v1/timeslots?dentist=${encodeURIComponent(selectedDentistName)}&startTime=${startTime}`)
            .then(response => {
                this.timeslots = response.data.timeslots;
                this.noTimeslotsMessage = this.timeslots.length === 0 ? "No timeslots available for selected dentist." : "";
            })
            .catch(error => {
                console.error('Error fetching timeslots:', error);
            });
    },

        openNotifications() {
            this.showNotifications = true;
        },
        closeNotifications() {
            this.showNotifications = false;
  },
 
  getUserStatistics() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in local storage.');
      return;
    }

    Api.get(`/v1/statistics/appointments-in-year/users/${userId}`)
      .then(response => {
        this.appointmentsThisYear = response.data.numberOfAppointments;
      })
      .catch(error => {
        console.error('Error fetching user statistics:', error.response.data);
      });

    Api.get(`/v1/statistics/most-used-dentist/users/${userId}`)
      .then(response => {
        this.mostUsedDentist = response.data.name;
      })
      .catch(error => {
        console.error('Error fetching most used dentist statistics:', error.response.data);
      });
  },

  formatDateTime(dateTime) {
      return moment(dateTime).format('DD-MM-YYYY HH:mm');
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