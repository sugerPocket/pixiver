<template lang='jade'>
  .main
    modal-progress
    .wrapper
      topbar
      section.illusts-wrapper.clearfix
        .none-img(v-show="!displayImagesData.length")
          h1 There are no image
        .illust-item.col-xs-12.col-sm-12.col-lg-4.col-md-4(v-for='url in displayImagesData')
          img.img-responsive(v-bind:src='url')
    side.hidden-xs.side
</template>

<script>
  import topbar from './main/topbar'
  import side from './side'
  import progress from './progress'
  import { mapState } from 'vuex'

  export default {
    name: 'main',
    components: { topbar, side, modalProgress: progress },
    computed: mapState({
      displayImagesData: state => state.pixiv.displayImagesData
    })
  }
</script>

<style lang='sass'>
  body
    background: linear-gradient(to bottom right, #d9f46b, #4dc7a0 80%)
  .main
    display: flex
    height: 100vh
    min-height: 720px
    justify-content: space-between
  .illust-item
    margin-bottom: 50px
    //background-color: #4dc7a0
    border-radius: 3px
    img
      width: 90%
      margin: 0 5%
  .wrapper
    display: flex
    flex-direction: column
    align-items: stretch
    background-color: #2b3652
    flex-grow: 1
    margin: 5vh
    padding-bottom: 10px
    height: 90vh
    min-height: 90%
    @media (max-width: 767px)
      height: 100%
      margin: 0
    border-radius: 2px
    position: relative
    &:before, &:after
      background: rgba(43, 54, 82, 0.3)
      content: ""
      height: 100%
      position: absolute
      top: 5px
      border-radius: 50px
      z-index: -1
      filter: blur(14px)
      left: -5px
      right: -5px
  .side
    flex-grow: 0
    flex: 0 0 335px
  .illusts-wrapper
    flex-grow: 1
    padding: 0 5px
    margin: 20px 15px
    overflow-y: scroll
    position: relative
    &::-webkit-scrollbar
      width: 12px
    &::-webkit-scrollbar-thumb
      background-color: rgba(77, 12 * 16 + 7, 160, 0.7)
      border-radius: 6px
  .none-img
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    color: rgba(255, 255, 255, 0.4)
    text-align: center
</style>
