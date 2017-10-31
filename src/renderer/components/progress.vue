<template lang="jade">
.modal.fade.download-progress(role='dialog' date-backdrop='static')
  .modal-dialog
    .modal-content
      .modal-body
        .progress-data(v-bind:style="{ transform: 'translateX(' + (computedProgress * 100 - 50) + '%)' }")
          .progress-meta
            | {{ computedProgress * 100 || 0 }}%
        .progress.progress-striped.progress-lg
          .progress-bar.progress-bar-success(role="progressbar" v-bind:aria-valuenow="successItemsCount" v-bind:aria-valuemin="0" v-bind:aria-valuemax="total" v-bind:style="{ width: '' + successItemsCount / total * 100 + '%' }")
          .progress-bar.progress-bar-danger(role="progressbar" v-bind:aria-valuenow="failedItemsCount" v-bind:aria-valuemin="0" v-bind:aria-valuemax="total" v-bind:style="{ width: '' + failedItemsCount / total * 100 + '%' }")
        h4.text-center.flex
          | 正在下载
          span.dots
            span.dot .
            span.dot .
            span.dot .
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'downloadModalProgress',
  computed: mapState({
    inProgress: ({ pixiv }) => pixiv.downloadInProgress,
    total: ({ pixiv }) => pixiv.curDownImagesNum,
    successItemsCount: ({ pixiv }) => pixiv.curDownImagesSuccessCount,
    failedItemsCount: ({ pixiv }) => pixiv.curDownImagesFailCount,
    computedProgress ({ pixiv }) {
      return Math.floor(pixiv.curDownImagesFailCount + pixiv.curDownImagesSuccessCount / pixiv.curDownImagesNum * 100) / 100
    }
  }),
  watch: {
    inProgress (on, old) {
      if (on) $(this.$el).modal('show')
      else $(this.$el).modal('hide')
    }
  }
}
</script>

<style lang="stylus" scoped>
@keyframes downloading
  0
    transform: translate(0,0)
  16%
    transform: translate(0,-2px)
  33%
    transform: translate(0,0)

@keyframes progressing
 0%
  background-position: 0px 0px
 100%
  background-position: 0px -40px

.modal-content
  padding: 0 40px


.download-progress
  position: absolute
  top: 50%
  transform: translateY(-50%)
  .modal-content
    border-radius: 2px
    background-color: #2b3652
  .progress
    background-color: darken(#2b3652, 5%)
  .progress-bar
    animation: progressing linear 0.5s 0.2s infinite
  .progress-bar-success
    background-color: #4dc7a0
  .flex
    display: flex
    align-items: center
    justify-content: center
    margin-bottom: 5px
  .progress-data
    text-align: center
    transform: translateX(-50%)
    transition: all 0.5s
    .progress-meta
      padding: 10px
      border-radius: 5px
      background: darken(#2b3652, 5%)
      text-align: left
    &:after
      display: block
      border-top: 10px solid darken(#2b3652, 5%)
      border-left: 8px solid transparent
      border-right: 8px solid transparent
      margin: 0 auto
      width: 0
      content: " "
  .progress-meta
    border-radius: 50%
    text-align: center
    display: inline-block
    position: relative
  
  .dots
    .dot
      display: inline-block
    .dot:nth-child(1)
      animation: downloading 1s 0.2s infinite
    .dot:nth-child(2)
      animation: downloading 1s 0.4s infinite
    .dot:nth-child(3)
      animation: downloading 1s 0.6s infinite
    
  
</style>
