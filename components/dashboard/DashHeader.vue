<template>
  <div class="h-16 border-b-2 flex justify-between border-primary">
    <span>Hello, {{ user.displayName ? user.displayName : user.email }}</span>
    <button class="btn-rev mr-4 my-2" @click="logout">Log Out</button>
  </div>
</template>

<script>
export default {
  props: ['user'],
  methods: {
    async logout() {
      try {
        await this.$fire.auth.signOut().then((user) => {
          this.$router.push({ path: '/' })
        })
      } catch (e) {
        alert(e)
      }
    },
  },
}
</script>

<style></style>
