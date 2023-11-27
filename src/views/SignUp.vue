<template>
    <div class="container">
      <div class="login-container">
          <h1>Create an account</h1>
          <p>Name</p>
            <div class="input-field"></div>
          <p>Email</p>
            <div class="input-field"></div>
          <p>Password</p>
            <div class="input-field"></div>
          <p>Re-type password</p>
            <div class="input-field"></div>
          <button class="primary-btn">Submit</button>
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
    