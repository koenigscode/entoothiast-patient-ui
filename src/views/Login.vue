<template>
  <div class="container">
    <div class="login-container">
        <h1>Login to book an appointment</h1>
        <p>Username</p>
          <input class="input-field" type="text" placeholder="Enter your username" v-model="username" required />
        <p>Password</p>
          <input class="input-field" type="password" placeholder="Enter your password" v-model="password" required />
          <br />
        <button class="primary-btn" @click="submitForm">Login</button>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        <br />
        <br />
        <a href="/signup" class="signup-link">Create an account here</a>
      </div> 
      <div class="image-container">
    <img src="../assets/login-img.png" class="centered-image">
  </div>
    </div> 
</template>
  
  <script>
   import {Api} from '../Api';
  export default {
    name: "Login-page",
data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    submitForm() {
      this.errorMessage = '';
      this.successMessage = '';

      const userData = {
        username: this.username,
        password: this.password
      };

      //Api.defaults.headers.common['Content-Type'] = 'application/json';
      //console.log('Request Headers:', Api.defaults.headers);

      Api.post('/v1/users/login', userData)
        .then(response => {
          console.log(response);

        const token = response.data.token;
        localStorage.setItem('authToken', token);

        const userId = response.data.user.id
        console.log("User ID:", userId)
        localStorage.setItem('userId', userId)


          this.successMessage = "Login successful";
          this.$router.push({ name: 'Home-page' }); 
          
        })
        .catch(error => {
          console.error(error);
          this.errorMessage = "Error during login. Please try again.";
        });
    },
  },
};
</script>
  
  <style>
  @import url("../assets/styles/login-style.css");
  </style>
  