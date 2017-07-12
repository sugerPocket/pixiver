<template lang='jade'>
  nav.navbar.navbar-inverse(role='navigation')
    .navbar-header
      a.navbar-brand Pixiver
    .btn-group.navbar-right
      button.btn.navbar-btn(@click='selectDir($event)' data-loading-text='选择中... ') 选择目录
      button.btn.navbar-btn(@click='download($event)' data-loading-text='正在导出...') &nbsp;导出到本地&nbsp;
    form.navbar-form.navbar-right(role="search")
      .form-group
        input.directory.form-control(v-model='path' placeholder="目录" disabled)
</template>

<script>
  export default {
    data () {
      return {
        path: ''
      }
    },
    methods: {
      selectDir ($event) {
        let target = $($event.target)
        let { dialog } = this.$electron.remote

        target.button('loading')

        dialog.showOpenDialog({
          properties: ['openDirectory', 'createDirectory']
        },
        paths => {
          if (paths) this.path = paths[0]
          target.button('reset')
        })
      },
      download ($event) {
        if (this.path) {
          let target = $($event.target)
          target.button('loading')
          this
            .$store
            .dispatch('downloadOriginalImages', this.path + '/')
            .then(() => target.button('reset'))
        }
      }
    }
  }
</script>

<style scoped lang='sass'>
  .navbar
    padding: 0 15px
    background-color: #2b2e3b
    border-radius: 0
    border: 0
    height: 50px
    overflow: hidden
  .btn-group
    margin-right: 0px
    button
      background-color: rgba(77, 12 * 16 + 7, 160, 0.8)
      border-color: transparent
      color: white
      &:focus
        outline-color: rgb(77, 12 * 16 + 7, 160)
  input.form-control
    border-color: #999
    line-height: 37px
</style>
