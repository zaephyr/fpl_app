<template>
  <form
    class="bg-white mt-12 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-4/5 sm:w-2/3 md:w-1/2 lg:w-1/3 mx-auto"
  >
    <div class="mb-4">
      <label class="block text-gray-600 text-sm font-bold mb-2" for="email">
        E-mail
      </label>
      <input
        v-model="loginInfo.email"
        class="shadow appearance-none border border-primary rounded w-full py-2 px-3 text-gray-600"
        autocomplete="email"
        id="email"
        type="email"
        placeholder="example@email.com"
      />
    </div>
    <div class="mb-6">
      <label class="block text-gray-600 text-sm font-bold mb-2" for="password">
        Password
      </label>
      <input
        v-model="loginInfo.password"
        class="shadow appearance-none border border-primary rounded w-full py-2 px-3 text-gray-600 mb-3"
        autocomplete="current-password"
        id="password"
        type="password"
        placeholder="******************"
      />
      <p class="text-red-500 text-xs italic" v-if="loginInfo.error">
        {{ loginInfo.error }}
      </p>
    </div>
    <div class="flex items-center justify-between">
      <button @click.prevent="submitLogin" class="btn" type="button">
        Log In
      </button>
      <a
        class="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-primary"
        href="#"
      >
        Forgot Password?
      </a>
    </div>
  </form>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState({
      authUser: (state) => state.authUser,
    }),
  },
  data() {
    return {
      loginInfo: {
        email: '',
        password: '',
        error: '',
      },
    }
  },
  methods: {
    async submitLogin() {
      try {
        await this.$fire.auth
          .signInWithEmailAndPassword(
            this.loginInfo.email,
            this.loginInfo.password
          )
          .then((user) => {
            this.$router.push({ path: '/dashboard' })
          })
      } catch (error) {
        this.loginInfo.error = error.message
      }
    },
  },
}
</script>

<style></style>
