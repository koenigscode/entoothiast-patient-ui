<template>
  <body>
      <img src="../assets/entoothiast.png" class="logo">
      <div class="container">
          <h1>All dentists</h1>
          <div class="columns">
              <div class="half-column">

                  <ul><li v-for="dentist in dentists.dentists" :key="dentist.id">
                    <div class="dentist-list">
                          <img src="../assets/dentists.png" class="dentist-icon">
                          <p><b>{{ dentist.name }}</b><br></p>
                          <div class="rating-container">
                            <Rating v-model="dentist.rating" readonly :cancel="false" />
                          </div>
                      </div>
                  </li></ul>
              </div>



      </div>
      <button class="secondary-btn" style="margin-top: 5rem; width: 10rem;" @click="goBack">Back</button>
    </div>
  </body>
</template>
  
  <script>
  // eslint-disable-next-line
import Rating from 'primevue/rating';
import {Api} from '../Api';
  export default {
    name: "AllDentists",
    data() {
        return {
            dentists: [],
            clinicName: '',
            showNotifications: false,
        }
    },
    mounted() {
      this.getAllDentists()
    },
    methods: {
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

        goBack() {
          this.$router.go(-1)
        },
    }
  };

  </script>
  
  <style>
 @import url("../assets/styles/style.css");
  </style>
  