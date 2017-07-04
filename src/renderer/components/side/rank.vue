<template lang="jade">
form.rank(role='form' v-on:queryBegin.stop="dispatch($data)")
  .form-group.input-group
    label.control-label.input-group-addon.picker-popover(data-placement="top" data-toggle="popover" name='date' data-container="body"
			data-content="选择的日期不能大于今日") 日期
    datepicker.picker(type='text' v-model="date" @input='updateDate' language='zh')
  .form-group.input-group
    label.control-label.input-group-addon 类型
    select.form-control(v-model="dateMode" name='dateMode' @input='update')
      option(value='day') 每日
      option(value='week') 每周
      option(value='month') 每月
  .form-group.input-group
    label.control-label.input-group-addon 范围
    select.form-control(v-model="mode" name='mode' @input='update')
      option(value='') 全部
      option(value='male') 男性向
      option(value='female') 女性向
      option(value='original') 原创
      option(value='rookie') 新人
  .form-group.input-group(v-show='dateMode === "day"')
    label.control-label.input-group-addon 类型
    select.form-control(v-model="type" name='type' @input='update')
      option(value='') 插画
      option(value='manga') 漫画
      option(value='ugoira') 动图
  .form-group.radios
    label.col-xs-6.text-center
      input(type="radio" name='R18' v-model='R18' value='' @input='update' checked)
      span.radio
        span.radio-checked
      span 正常向
    label.col-xs-6.text-center
      input(type="radio" name='R18' v-model='R18' value='R18' @input='update')
      span.radio
        span.radio-checked
      span R18
  
  
</template>

<script>
import datepicker from 'vuejs-datepicker'
import { mapState } from 'vuex'

export default {
  name: 'rankConfig',
  computed: {
    ...mapState('configs/ranking', {
      R18: 'R18',
      date: 'date',
      dateMode: 'dateMode',
      mode: 'mode',
      type: 'type',
      from: 'from',
      to: 'to'
    })
  },
  methods: {
    updateDate (date) {
      let warning = command => $(this.$el).find('.picker-popover').popover(command)
      if (date.valueOf() > Date.now()) warning('show')
      else {
        this.$store.commit('configs/ranking/UPDATE', { date })
        warning('hide')
      }
    },
    update ($event) {
      let { name } = $event.target
      let { value } = $event.target
      this.$store.commit('configs/ranking/UPDATE', { [name]: value })
    }
  },
  props: {
    dispatch: Function
  },
  components: { datepicker }
}
</script>

<style lang="sass">
.rank
  .form-group
    overflow-x: visible
  .input-group-addon
    background-color: #4dc7a0
    color: white
    border-color: transparent
  .form-control:not(.vdp-datepicker)
    background: rgba(0, 0, 0, 0.2)
    border-color: transparent
    color: white
    outline: 0px
  
  .picker
    color: black
  .picker input
    background: rgba(0, 0, 0, 0.2)
    border-color: transparent
    color: white
    outline: 0px
    height: 34px
    padding: 6px 12px
    font-size: 14px
    width: 100%
  .picker .vdp-datepicker__calendar
    transform: scale(0.78)
    transform-origin: top left
  .picker .vdp-datepicker__calendar .cell
    &.selected
      background: #4dc7a0
      color: white
    &:not(.blank):not(.disabled)
      &.day, &.month, &.month
        &:hover
          border: 1px solid #4dc7a0

  option:not(:checked)
    background-color: rgba(77, 12 * 16 + 7, 160, 0.6)
  option:checked, option:hover
    background-color: rgb(77, 12 * 16 + 7, 160)

  .form-group.radios span
    vertical-align: middle
  .form-group.radios > label
    cursor: pointer
  .form-group.radios input[type='radio']
    position: absolute
    z-index: -1
    margin: 0
    opacity: 0
    &:checked ~ span.radio > .radio-checked
      background: rgb(77, 12 * 16 + 7, 160)
  .radio-checked
    height: 60%
    width: 60%
    top: 50%
    left: 50%
    border-radius: 50%
    transform: translate(-50%, -50%)
    position: absolute
    display: inline-block
    vertical-align: middle
  .form-group.radios span.radio
    display: inline-block
    border-radius: 50%
    position: relative
    height: 24px
    width: 24px
    margin: 0 10px 0 0
    vertical-align: middle
    background-color: rgba(0, 0, 0, 0.2)



</style>
