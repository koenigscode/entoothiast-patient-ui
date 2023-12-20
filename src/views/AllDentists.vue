<template>
  <div class="container">
    <div class="iconbar">
        <img src="../assets/settings.png" class="icon">
        <img src="../assets/logout.png" class="icon">
      </div>
    <div class="login-container">
        <h1>All dentists</h1>
        <div class="columns">
            <div class="half-column">
                <h2>Dentists</h2>
                <div class="dentists">
                  
                  <div class="oneDentist">
                <div class="dentist-info">
                <img src="../assets/dentists.png" class="dentist-image">
                <div>
                 <p><b>Dentist Name</b></p>
                <p>Dentist Clinic</p>
               </div>
              </div>
               <div class="rating-container">
               <Rating v-model="value" readonly :cancel="false" />
               </div>
              </div>

                <br />
                <div class="oneDentist">
                <div class="dentist-info">
                <img src="../assets/dentists.png" class="dentist-image">
                <div>
                 <p><b>Dentist Name</b></p>
                <p>Dentist Clinic</p>
               </div>
              </div>
               <div class="rating-container">
               <Rating v-model="value" readonly :cancel="false" />
               </div>
              </div>

                  <br />
                  <button class="secondary-btn">Load more</button>

                </div>
            </div>
            <div class="half-column">
                <h2>Your favourite dentists</h2>
                <div class="dentists">
                <div class="oneDentist">
                <div class="dentist-info">
                <img src="../assets/favorite.png" class="dentist-image">
                <div>
                 <p><b>Dentist Name</b></p>
                <p>Dentist Clinic</p>
               </div>
              </div>
            </div>
              <br />

              <div class="oneDentist">
                <div class="dentist-info">
                <img src="../assets/favorite.png" class="dentist-image">
                <div>
                 <p><b>Dentist Name</b></p>
                <p>Dentist Clinic</p>
               </div>

            </div>
            </div>
          </div>
        </div>
  </div>
    </div> 
  </div> 
</template>
  
  <script>
  // eslint-disable-next-line
  import Rating from 'primevue/rating';
  export default {
    name: "AllDentists",
    data() {
        return {
            value: 3
        }
    }
  };

  </script>
  
  <style>
 @import url("../assets/styles/allDentists-style.css");
  </style>
  