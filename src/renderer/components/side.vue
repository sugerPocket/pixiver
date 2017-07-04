<template lang='jade'>
.side
  nav
    h1 排名
    h3 查询配置
  section
    component(:is="mode" @queryBegin='' v-bind:dispatch="fetch") 
  footer
    button.btn.btn-block.btn-success(@click='fetch($event)' data-loading-text='正在查找...') 查找图片
    
</template>

<script>
import rank from './side/rank'

export default {
  name: 'side',
  data () {
    return {
      path: '',
      configs: {},
      mode: 'rank',
      getConfigs () {}
    }
  },
  methods: {

    fetch ($event) {
      let target = $($event.target)
      target.button('loading')
      this.$store.dispatch('query', {
        command: 'ByRank',
        mode: 'day',
        from: 0,
        to: 10
      })
      .then(() => target.button('reset'))
    }
  },
  components: {
    rank
  }
}
</script>

<style lang='sass'>
  .side
    display: flex
    flex-direction: column
    align-items: stretch
    justify-content: space-between
    margin: 5vh 0
    height: 90vh
    padding-right: 40px
    @media (max-height: 720px)
      height: 90%
    //background-color: #44495f//#2f3241//#2b2e3b
    width: 335px

    nav
      padding-bottom: 10px
      h1
        margin-top: 0
    section
      flex-grow: 1
      overflow-y: scroll
      overflow-x: hidden
      &::-webkit-scrollbar
        width: 8px
      &::-webkit-scrollbar-thumb
        background-color: rgba(26, 13 * 16 + 13, 91, 0.9)
        border-radius: 6px
    footer
      margin: 10px 0 0 0
    button
      background-color: #f9ad04!important
      border: none
      height: 42px
      border-radius: 0
      font-size: 18px
      position: relative
      &:before
        background: rgba(15*16 + 9, 173, 4, 0.6)
        content: ""
        height: 100%
        position: absolute
        top: 5px
        border-radius: 50px
        z-index: -1
        filter: blur(18px)
        right: -5px
        left: -5px
</style>
