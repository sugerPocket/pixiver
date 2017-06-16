<template lang='jade'>
  #main
    button.btn.btn-primary(@click='fetch()') 抓取
    button.btn.btn-primary(@click='download()') 下载
    img.img-responsive(v-for='url in urls' v-bind:src='url')
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    data () {
      return {
        originalUrls: [],
        urls: []
      }
    },
    methods: {
      download () {
        let urls = []
        this.originalUrls.forEach(url => {
          if (typeof url.length !== 'undefined') url.forEach(url => urls.push(url))
          else urls.push(url)
        })
        this.$pixiv
          .exportResources(urls.map(url => url.original || url.original_image_url))
          .then(images => {
            this.urls = images
          })
          .catch(err => console.log(err))
      },
      fetch () {
        this.$pixiv
          .queryUrls('byRank', new Date(2017, 6, 13), null, 0, 10)
          .then(urls => {
            this.originalUrls = urls
          })
          .catch(err => console.log(err))
      }
    }
  }
</script>

<style lang='sass'>
  body
    color: white
    background-color: #2b2e3b
</style>
