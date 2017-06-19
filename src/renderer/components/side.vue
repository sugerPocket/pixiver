<template lang='jade'>
  .side
    button.btn.btn-block.btn-success(@click='fetch()') 获取
</template>

<script>
  export default {
    name: 'side',
    methods: {
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
  .side
    top: 54px
    right: 0
    position: fixed
    height: 100%
    background-color: #2b2e3b
    width: 410px
    border-top: 1px solid #555
    padding: 0 20px
</style>
