<template>
    <body>
      <img src="../assets/entoothiast.png" class="logo">
      <div class="container">
        <div class="iconbar">
          <img src="../assets/notification.png" class="icon">
          <router-link to="/settings"><img src="../assets/settings.png" class="icon"></router-link>
          <img src="../assets/logout.png" class="icon">
        </div>
          <h1>Welcome, {{ users.name }}</h1>
          <div class="columns">
              <div class="half-column">
                  <h2>Your next appointment</h2>
                  <div class="appointment">
                      <p><b>Feb 2, 2024 12:00</b><br>Dentist Name, Dentist Clinic</p>
                      <p><img src="../assets/cancel.png" class="book">  Cancel appointment</p>
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
              <ul v-if="message !== 'No available timeslots.'">
                  <li v-for="timeslot in timeslots" :key="timeslot.id">
                      <div class="appointment">
                          <p><b>{{ timeslot.start_time }} {{ timeslot.end_time }}</b><br>{{ timeslot.dentist_id }}</p>
                          <p><img src="../assets/book.png" class="book" @click="bookTimeslot"> Book appointment</p>
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
    export default {
      name: "Home-page",
      data() {
      return {
        name: '',
        userId: '',
        timeslots: [],
      }
    },
    methods: {
      getUserInfo() {
          
      },
      getUsersAppointments() {
          
      },
      getTimeslots() {
          Api.get('v1/timeslots')
          .then(response => {
              console.log(response.data)
              this.timeslots = response.data
          })
          .catch(error => {
              console.error(error.response.data)
          })
      },
      bookTimeslot() {
        Api.post('v1/appointments')
      },
      cancelAppoitment() {
        Api.delete('v1/appointments')
      }
    },
    };
</script>
    
<style>
    @import url("../assets/styles/style.css");
</style>
