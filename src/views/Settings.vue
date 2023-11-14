<template>
    <div class="container">
      <h1>Settings</h1>
      <div class="columns">
        <div class="half-column">
            <p><b>Change password</b></p>
            <p>New password</p>
            <div class="input-field"></div>

            <p>New password again</p>
            <div class="input-field"></div>

            <p><b>Notifications</b></p>
            <div class="columns">
                <div class="on">On</div>
                <div class="off">Off</div>
            </div>
        </div>

        <div class="half-column">
            <p><b>Change email</b></p>
            <p>New email</p>
            <div class="input-field"></div>

            <p>New email again</p>
            <div class="input-field"></div>

            <p><b>Dark mode</b></p>
            <div class="columns">
                <div class="off">On</div>
                <div class="on">Off</div>
            </div>
        </div>
    </div>

    <button class="primary-btn">Save</button>
    <button class="secondary-btn">Back</button>

  </div>
</template>

<script>
export default {
  name: "Settings-page",
};
</script>

<style>
@import url("../assets/styles/style.css");
</style>
