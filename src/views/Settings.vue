<template>
  <body>
    <img src="../assets/entoothiast.png" class="logo">
    <div class="container">
      <div class="iconbar">
        <img src="../assets/notification.png" class="icon">
        <img src="../assets/settings.png" class="icon">
        <img src="../assets/logout.png" class="icon">
      </div>
      <h1>Settings</h1>
      <div class="columns">
        <div class="half-column">
            <p><b>Change password</b></p>
            <p>New password</p>
            <input class="input-field" type="password" placeholder="Enter new password" v-model="password" required />

            <p>New password again</p>
            <input class="input-field" type="password" placeholder="Confirm new password" v-model="repeatedPassword" required />

            <p><b>Notifications</b></p>
            <div class="columns">
              <div class="on" @click="toggleNot(false)" :class="{ off: !isNotification }">On</div>
              <div class="on" @click="toggleNot(true)" :class="{ off: isNotification }">Off</div>
            </div>
        </div>

        <div class="half-column">
            <p><b>Change username</b></p>
            <p>New username</p>
            <input class="input-field" type="username" placeholder="Enter new username" v-model="username" required />

            <p><b>Dark mode</b></p>
            <div class="columns">
              <div class="on" @click="toggleDarkMode(false)" :class="{ off: !darkMode }">On</div>
              <div class="on" @click="toggleDarkMode(true)" :class="{ off: darkMode }">Off</div>
            </div>
        </div>
    </div>

    <div class="columns">
      <button class="primary-btn" @click="updateInfo">Save</button>
      <RouterLink to="/" class="secondary-btn">Back</RouterLink>
    </div>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>


    </div>
  </body>
</template>

<script>
import { RouterLink } from 'vue-router';
import {Api} from '../Api';

export default {
    name: 'Settings-page',
    data() {
        return {
            username: '',
            password: '',
            darkMode: false,
            isNotification: true,
        };
    },
    methods: {
        updateInfo() {
            this.errorMessage = '';
            this.successMessage = '';
            if (this.password !== this.repeatedPassword) {
                this.errorMessage = "Passwords do not match";
                return;
            }
            const userData = {
                name: this.name,
                username: this.username,
                password: this.password,
                role: "patient"
            };
            console.log(Api);
            Api.put('/v1/users/register', userData)
                .then(response => {
                console.log(response.data);
                this.successMessage = "Infor updated.";
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
        }
    },
    components: { RouterLink }
};
</script>

<style>
@import url("../assets/styles/style.css");
</style>
