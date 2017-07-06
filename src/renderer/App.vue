<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import 'bootstrap'
  import 'bootstrap/dist/css/bootstrap.min.css'

  export default {
    name: 'pixiver',
    async mounted () {
      let user = localStorage.getItem('$pixiver')
      try {
        if (user) {
          user = JSON.parse(user)
          await this.$store.dispatch('user/login', user)
        } else throw (new Error())
      } catch (e) {
        this.$router.replace('/login')
      }
    }
  }
</script>

<style lang='sass'>
body
  background-color: lighten(#2f3241, 12%)
  color: white
  min-width: 320px
.popover
  color: #292b2c

.font-green
  color: #68a692
.bg-green
  background-color: #68a692
.bg-black
  background-color: #192b3c 

</style>
