<template>
  <body>
    <img src="../assets/entoothiast.png" class="logo">
    <div class="container">
      <h1>Settings</h1>
      <div class="columns">
        <div class="half-column">
            <p><b>Change name</b></p>
            
            <input class="input-field" type="name" placeholder="Enter new name" v-model="name" required />

            <p><b>Notifications</b></p>
            <div class="columns">
              <div class="on" @click="toggleNot(false)" :class="{ off: !isNotification }">On</div>
              <div class="on" @click="toggleNot(true)" :class="{ off: isNotification }">Off</div>
            </div>
        </div>

        <div class="half-column">
            <p><b>Change username</b></p>
       
            <input class="input-field" type="username" placeholder="Enter new username" v-model="username" required />

            <p><b>Confirm password</b></p>
            <input class="input-field" type="password" placeholder="Confirm new password" v-model="confirmPassword" required />
        </div>
    </div>

    <div class="columns">
      <button class="primary-btn" @click="updateInfo">Save</button>
      <button class="secondary-btn" @click="goBack">Back</button>
    </div>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>


    </div>
  </body>
</template>

<script>
import {Api} from '../Api';

export default {
    name: 'Settings-page',
    data() {
        return {
            username: '',
            name: '',
            darkMode: false,
            isNotification: true,
            errorMessage: '',
            successMessage: '',
        };
    },
  
    methods: {
      updateInfo() {
      this.errorMessage = '';
      this.successMessage = '';

      const userData = {
        name: this.name,
        username: this.username,
      };

      const userId = localStorage.getItem('userId');

      if (!userId) {
      this.errorMessage = "User ID not found. Please try logging in again.";
      return;
      }
      Api.patch(`/v1/users/${userId}`, userData)
        .then(response => {
          console.log(response.data);
          this.successMessage = "Profile info updated successfully.";
          
          // Reset form fields after successful update
          this.username = "";
          this.name = "";
          this.darkMode = false;
          this.isNotification = true;
        })
        .catch(error => {
          console.error(error.response.data);
          this.errorMessage = "Error during update. Please try again.";
        });
    },
        toggleDarkMode(value) {
          this.darkMode = value
        },
        toggleNot(value) {
          this.isNotification = value
        },
        goBack() {
          this.$router.go(-1)
        }
    }
};
</script>

<style>
@import url("../assets/styles/style.css");
</style>
