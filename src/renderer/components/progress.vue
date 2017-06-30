<template lang="jade">
.modal.fade.download-progress(role='dialog' date-backdrop='static')
  .modal-dialog
    .modal-content
      .modal-body
        div.text-center.flex
          .progress-data.failed
            span failed  
            span {{ failedItemsCount }}
          h3.text 正在下载
            span.dots
              span.dot .
              span.dot .
              span.dot .
          .progress-data.success
            span success 
            span {{ successItemsCount }} / {{ total }}
        .progress.progress-striped.progress-lg
          .progress-bar.progress-bar-success(role="progressbar" v-bind:aria-valuenow="successItemsCount" v-bind:aria-valuemin="0" v-bind:aria-valuemax="total" v-bind:style="{ width: '' + successItemsCount / total * 100 + '%' }")
          .progress-bar.progress-bar-danger(role="progressbar" v-bind:aria-valuenow="failedItemsCount" v-bind:aria-valuemin="0" v-bind:aria-valuemax="total" v-bind:style="{ width: '' + failedItemsCount / total * 100 + '%' }")
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'downloadModalProgress',
  computed: mapState({
    inProgress: ({ pixiv }) => pixiv.downloadInProgress,
    total: ({ pixiv }) => pixiv.curDownImagesNum,
    successItemsCount: ({ pixiv }) => pixiv.curDownImagesSuccessCount,
    failedItemsCount: ({ pixiv }) => pixiv.curDownImagesFailCount
  }),
  watch: {
    inProgress (on, old) {
      if (on) $(this.$el).modal('show')
      else $(this.$el).modal('hide')
    }
  }
}
</script>

<style lang="sass">
@keyframes downloading
  0
    transform: translate(0,0)
  16%
    transform: translate(0,-2px)
  33%
    transform: translate(0,0)

.download-progress
  position: absolute
  top: 50%
  transform: translateY(-50%)
  .modal-content
    border-radius: 2px
    background-color: #2b3652
  .progress
    height: 12px
  .progress-bar-success
    background-color: #4dc7a0
  div.flex
    display: flex
    align-items: center
    justify-content: space-between
    margin-bottom: 20px
  .text
    height: 100%
  .progress-data
    border-radius: 50%
    text-align: center
    display: inline-block
    position: relative
    &.success
      right: 0
      background-color: #4dc7a0
      height: 140px
      width: 140px
      &:before
        background: rgba(77, 12 * 16 + 7, 160, 0.15)
        content: ""
        height: 100%
        position: absolute
        top: 5px
        border-radius: 50px
        filter: blur(18px)
        right: -5px
        left: -5px
      & > span
        display: block
      & > span:nth-child(1)
        font-size: 20px
        line-height: 50px
      & > span:nth-child(2)
        font-size: 36px
    &.failed
      background-color: #d9534f
      height: 84px
      width: 84px
      &:before
        background: rgba(14 * 16 + 9, 83, 79, 0.15)
        content: ""
        height: 100%
        position: absolute
        top: 5px
        border-radius: 50px
        filter: blur(18px)
        right: -5px
        left: -5px
      & > span
        display: block
      & > span:nth-child(1)
        font-size: 16px
        line-height: 36px
      & > span:nth-child(2)
        font-size: 32px
  
  .dots
    .dot
      display: inline-block
      font-size: 40px
    .dot:nth-child(1)
      animation: downloading 1s 0.2s infinite
    .dot:nth-child(2)
      animation: downloading 1s 0.4s infinite
    .dot:nth-child(3)
      animation: downloading 1s 0.6s infinite
    
  
</style>
