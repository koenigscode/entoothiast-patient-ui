<template>
    <div class="container">
      <div class="login-container">
          <h1>Create an account</h1>
          <p>Name</p>
          <input class="input-field" type="name" placeholder="Enter your name" v-model="name" required />
          <p>Username</p>
          <input class="input-field" type="username" placeholder="Enter your username" v-model="username" required />
          <p>Password</p>
          <input class="input-field" type="password" placeholder="Enter your password" v-model="password" required />
          <p>Re-type password</p>
          <input class="input-field" type="password" placeholder="Re-type your password" v-model="repeatedPassword" required />
          <br />
          <button class="primary-btn" @click="submitForm">Submit</button>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
          <br />
        <br />
        <a href="/login" class="signup-link">Login here</a>
        </div> 
        <div class="image-container">
      <img src="../assets/login-img.png" class="centered-image">
    </div>
      </div> 
  </template>
    
    <script>
    import {Api} from '../Api';
    export default {
      name: "SignUp-page",
      data() {
    return {
      name: '',
      username: '',
      password: '',
      repeatedPassword: '',
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    submitForm() {
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
      Api.post('/v1/users/register', userData)
        .then(response => {
          console.log(response);
          this.successMessage = "User registered. You can log in now.";
        })
        .catch(error => {
          console.error(error);
          this.errorMessage = "Error during registration. Please try again.";
        });
    },
  },
};
</script>
    
    <style>
    @import url("../assets/styles/login-style.css");
    .error-message {
  color: red;
}
.success-message {
  color: green;
}
    </style>
    