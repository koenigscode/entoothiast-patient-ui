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
          <input class="input-field" type="password" placeholder="Re-type your password" v-model="password" required />
          <br />
          <button class="primary-btn">Submit</button>
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
    export default {
      name: "SignUp-page",
    };
    </script>
    
    <style>
    @import url("../assets/styles/login-style.css");
    </style>
    