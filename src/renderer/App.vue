<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import 'bootstrap'
  import 'bootstrap/dist/css/bootstrap.min.css'

  export default {
    name: 'pixiver'
  }
</script>

<style lang='sass'>
body
  background-color: lighten(#2f3241, 12%)
  color: white
  min-width: 320px

.font-green
  color: #68a692
.bg-green
  background-color: #68a692
.bg-black
  background-color: #192b3c 

</style>
