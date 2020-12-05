<template>
  <div>
    <span>league: {{ $store.state.activeLeague }}</span>
  </div>
</template>

<script>
export default {
  props: ['user', 'userData'],
  data() {
    return {
      league: '',
    }
  },
  computed: {},
}
</script>

<style></style>
