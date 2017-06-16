<template lang='jade'>
  #login-wrapper
    main.login-main
      img#logo(src="~@/assets/logo.png" alt="electron-vue")
      form.form(role='form')
        .form-group
          input.form-control(type='text' v-model='pixiv_id' placeholder='Pixiv Id')
          
          input.form-control(type='password' v-model='password' placeholder='Password')
        button.submit.btn.btn-block.btn-primary(type="submit" @click='login($event)') Sign in
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        password: '',
        pixiv_id: ''
      }
    },
    methods: {
      login ($event) {
        let btn = $($event.target)
        btn.button('loading')
        this.$pixiv
          .launch(this.pixiv_id, this.password)
          .then(result => {
            this.$router.push('/home')
            btn.button('reset')
          })
          .catch(err => {
            console.log(err)
            btn.button('reset')
          })
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style lang='sass'>
  html
    color: white
    background-color: #2f3241
  #logo 
    height: auto
    margin-bottom: 20px
    width: 250px
  .login-main
    display: inline-block
    position: fixed
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
  
  .submit
    background-image: linear-gradient(90deg, #7b81ec, #3bd1d3) !important
    background-color: transparent !important
    border: none
    outline: none !important
    border-radius: 20px
    font-size: 20px
    margin-top: 30px
    &:active
      box-shadow: 0 0 24px -4px #7b81ec
  
  .form-group
    margin: 0
    hr
      margin: 0 auto
      width: 100px
    input
      height: 37px
      font-size: 16px
      width: 100%
      background-color: darken(#2f3241, 0.5)
      color: white
      &:focus

      &[type='text']
        border-bottom: none
        border-bottom-left-radius: 0
        border-bottom-right-radius: 0
        &:focus
          box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 -4px 8px -2px rgba(102,175,233,.6)
      &[type='password']
        border-top: none
        border-top-left-radius: 0
        border-top-right-radius: 0
        &:focus
          box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 4px 8px -2px rgba(102,175,233,.6)
  form[role='form']
    margin: 10px 0 20px 0
</style>
