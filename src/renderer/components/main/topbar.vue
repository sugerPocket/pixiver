<template lang='jade'>
  nav.navbar.navbar-inverse(role='navigation')
    .navbar-header
      a.navbar-brand Pixiver
    .btn-group.navbar-right.navbar-btn
      button.btn.btn-warning(@click='selectDir') 选择目录
      button.btn.btn-primary(@click='download') 导出
    form.navbar-form.navbar-right(role="search")
      .form-group
        input.form-control(v-model='path' placeholder="目录")
</template>

<script>
  export default {
    data () {
      return {
        path: ''
      }
    },
    methods: {
      selectDir () {
        let { dialog } = this.$electron.remote
        dialog.showOpenDialog({
          properties: ['openDirectory', 'createDirectory']
        },
        paths => {
          if (paths) this.path = paths[0]
        })
      },
      download () {
        if (this.path) this.$store.dispatch('downloadOriginalImages', this.path + '/')
      }
    }
  }
</script>

<style scoped lang='sass'>
  .navbar
    background-color: #2b2e3b
    border-radius: 0
    border: 0
  .btn-group
    margin-right: 20px
  .btn
    height: 37px
  input.form-control
    border-color: #999
    line-height: 37px
</style>
