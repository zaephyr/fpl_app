<template>
  <div class="h-16 border-b-2 border-primary">
    <transition name="mode-fade" mode="out-in">
      <button v-if="register" class="mr-4 mt-2 float-right btn" @click="toggle">
        Sign Up
      </button>
      <button v-else class="mr-4 mt-2 float-right btn-rev" @click="toggle">
        Sign In
      </button>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    register: {
      type: Boolean,
    },
  },
  data() {
    return {
      btnReg: 'Sign Up',
      btnLog: 'Log In',
    }
  },
  methods: {
    toggle() {
      this.register = !this.register
      this.$emit('toggle', this.register)
      console.log(this.register)
    },
  },
}
</script>

<style>
.mode-fade-enter-active,
.mode-fade-leave-active {
  transition: opacity 0.5s ease;
}

.mode-fade-enter-from,
.mode-fade-leave-to {
  opacity: 0;
}
</style>
