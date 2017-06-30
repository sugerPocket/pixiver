<template lang="jade">
form(role='form')
  .form-group.input-group
    label.control-label.input-group-addon 日期
    input.form-control(type='date')
  .form-group.input-group
    label.control-label.input-group-addon 类型
    select.form-control()
      option(value='') 插画
      option(value='manga') 漫画
  .form-group.radios
    label.col-xs-6.text-center
      input(type="radio" name='R18' checked)
      span.radio
        span.radio-checked
      span 正常向
    label.col-xs-6.text-center
      input(type="radio" name='R18')
      span.radio
        span.radio-checked
      span R18
  
  
</template>

<script>

const mapToConfigs = () => {}

export default {
  name: 'rankConfig',
  data () {
    return {
      type: '',
      date: '',
      dateMode: '',
      R18: false
    }
  },
  watch: {
    type: mapToConfigs,
    date: mapToConfigs
  },
  props: {
    configs: Object
  }
}
</script>

<style lang="sass" scoped>
.input-group-addon
  background-color: #4dc7a0
  color: white
  border-color: transparent
.form-control
  background: rgba(0, 0, 0, 0.2)
  border-color: transparent
  color: white
  outline: 0px

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
