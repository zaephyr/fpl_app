<template>
  <div>
    <Nuxt />
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: '',
    }
  },
  mounted() {
    this.$fire.auth.onAuthStateChanged((user) => {
      this.user = user
    })
  },
}
</script>

<style></style>
