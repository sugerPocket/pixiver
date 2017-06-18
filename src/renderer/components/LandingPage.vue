<template lang='jade'>
  #main
    .btn-group
      button.btn.btn-primary(@click='fetch()') 抓取
      button.btn.btn-success(@click='download()') 下载
    img.img-responsive(v-for='url in displayImagesData' v-bind:src='url')
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import { mapState } from 'vuex'

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    computed: mapState({
      displayImagesData: state => state.pixiv.displayImagesData
    }),
    methods: {
      download () {
        let { dialog } = this.$electron.remote
        dialog.showOpenDialog({
          properties: ['openDirectory', 'createDirectory']
        },
        paths => {
          if (paths) {
            this.$store.dispatch('downloadOriginalImages', paths[0] + '/')
              .catch(err => console.log(err))
          }
        })
      },
      fetch () {
        this.$store.dispatch('query', {
          command: 'ByRank',
          mode: 'day',
          from: 0,
          to: 10
        })
      }
    }
  }
</script>

<style lang='sass'>
  body
    color: white
    background-color: #2b2e3b
</style>
