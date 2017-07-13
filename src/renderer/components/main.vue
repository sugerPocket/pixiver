<template lang='jade'>
  .main
    modal-progress
    .wrapper
      topbar
      section.illusts-wrapper.row.clearfix
        .none-img(v-show="!queryResult.length")
          h1 There are no image
        section.illust-item.col-xs-12.col-sm-12.col-lg-4.col-md-4.text-center(v-for='result in queryResult')
          .illust-container
            img.img-responsive.work(v-show='result.work.displayImageDataUrl' v-bind:src='result.work.displayImageDataUrl' v-bind:title='\'illust id: \' + result.work.id')
            .load-failed(
              :style='calTopPadding(result.work.height, result.work.width)'
              v-show='!result.queryInProgress && !result.work.displayImageDataUrl'
              @click='reloadOne(result)'
              )
              span
                i.fa.fa-close.fa-2x
                br
                | 加载失败
                br
                | 点击重新加载
            .loading(:style='calTopPadding(result.work.height, result.work.width, !result.queryInProgress)' v-show='result.queryInProgress')
              span
                i.fa.fa-spinner.fa-pulse.fa-2x
                br
                | 加载中..
            header.illust-title
              h5 {{ result.work.title }}
            .user-meta(:title='\'pixiv id: \' + result.work.user.id')
              img.profile(v-bind:src='result.work.user.proflieImageDataUrl')
              span.name {{ result.work.user.name }}
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
    computed: {
      ...mapState('pixiv', [
        'queryResult'
      ])
    },
    methods: {
      calTopPadding (height, width, ignore) {
        if (ignore) return {}

        return {
          'padding-top': `${height / width * 100}%`
        }
      },
      reloadOne (work) {
        this.$store.dispatch('pixiv/loadOne', work)
      }
    }
  }
</script>

<style lang='sass'>
  body
    background: linear-gradient(to bottom right, #d9f46b, #4dc7a0 80%)
  .main
    display: flex
    height: 100vh
    min-height: 563px
    justify-content: space-between
  .illust-item
    display: inline-block
    vertical-align: top
    float: none
    margin-bottom: 50px
    border-radius: 3px
  .illust-title
    & > h5
      white-space: nowrap
      text-overflow : ellipsis
      overflow: hidden
  .illust-container
    display: inline-block
    border-radius: 1%
    padding: 2%
    width: 90%
    background-color: rgb(77, 12 * 16 + 7, 160)
  .load-failed
    cursor: pointer
  .load-failed, .loading
    position: relative
    span
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
  img.work
    display: inline-block
  .user-meta
    display: inline-block
    margin-bottom: 5px
    overflow: hidden
    white-space: nowrap
    text-overflow : ellipsis
    max-width: 100%
    img.profile
      border-radius: 10%
      width: 35px
      height: 35px
      displsy: inline-block
      background: rgba(0, 0, 0, 0.1)
    .name
      max-width: 100%
      padding-left: 10px
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
    @media (min-width: 767px)
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
    border-radius: 2px
    position: relative
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
