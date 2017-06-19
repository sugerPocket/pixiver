<template lang='jade'>
  #main
    topbar
    side
    .wrapper
      section.illusts-wrapper
        img.img-responsive.illust-item(v-for='url in displayImagesData' v-bind:src='url')
</template>

<script>
  import topbar from './main/topbar'
  import side from './side'
  import { mapState } from 'vuex'

  export default {
    name: 'main',
    components: { topbar, side },
    computed: mapState({
      displayImagesData: state => state.pixiv.displayImagesData
    })
  }
</script>

<style lang='sass'>
  body
    color: white
    background-color: #2f3241
  .illust-item
    width: 40%
    margin: 5%
    display: inline-block
  .wrapper
    margin-right: 440px
    margin-left: 20px
</style>
