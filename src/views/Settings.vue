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
                <div class="on">On</div>
                <div class="off">Off</div>
            </div>
        </div>

        <div class="half-column">
            <p><b>Change username</b></p>
            <p>New username</p>
            <input class="input-field" type="username" placeholder="Enter new username" v-model="username" required />

            <p><b>Dark mode</b></p>
            <div class="columns">
                <div class="off">On</div>
                <div class="on">Off</div>
            </div>
        </div>
    </div>

    <div class="columns">
      <button class="primary-btn" @click="updateInfo">Save</button>
      <button class="secondary-btn">Back</button>
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
      password: '',
    }
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
    console.log(Api)
      Api.put('/v1/users/register', userData)
        .then(response => {
          console.log(response.data);
          this.successMessage = "Infor updated.";
        })
        .catch(error => {
          console.error(error.response.data);
          this.errorMessage = "Error during update. Please try again.";
        });
    }
  }
};
</script>

<style>
@import url("../assets/styles/style.css");
</style>
