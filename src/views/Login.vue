<template>
  <div class="container">
    <div class="login-container">
        <h1>Login to book an appointment</h1>
        <p>Username</p>
          <input class="input-field" type="username" placeholder="Enter your username" v-model="username" required />
        <p>Password</p>
          <input class="input-field" type="password" placeholder="Enter your password" v-model="password" required />
          <br />
        <button class="primary-btn">Login</button>
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
  export default {
    name: "Login-page",
  };
  </script>
  
  <style>
  @import url("../assets/styles/login-style.css");
  </style>
  