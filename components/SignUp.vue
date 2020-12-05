<template>
  <form
    class="bg-white mt-12 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-4/5 sm:w-2/3 md:w-1/2 lg:w-1/3 mx-auto"
  >
    <div class="mb-4">
      <label class="block text-gray-600 text-sm font-bold mb-2" for="email">
        E-mail
      </label>
      <input
        v-model="signUpInfo.email"
        class="shadow appearance-none border border-primary rounded w-full py-2 px-3 text-gray-600"
        autocomplete="email"
        id="email_reg"
        type="email"
        placeholder="example@email.com"
      />
    </div>
    <div class="mb-6">
      <label class="block text-gray-600 text-sm font-bold mb-2" for="password">
        Password
      </label>
      <input
        v-model="signUpInfo.password"
        class="shadow appearance-none border border-primary rounded w-full py-2 px-3 text-gray-600 mb-3"
        autocomplete="current-password"
        id="password_reg"
        type="password"
        placeholder="******************"
      />
      <p class="text-red-500 text-xs italic" v-if="signUpInfo.error">
        {{ signUpInfo.error }}
      </p>
    </div>
    <div class="flex justify-end items-center">
      <button @click="createUser" class="btn-rev" type="button">Sign Up</button>
    </div>
  </form>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState({
      authUser: () => state.authUser,
    }),
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
    }),
  },
  data() {
    return {
      signUpInfo: {
        email: '',
        password: '',
        error: '',
      },
    }
  },
  methods: {
    async createUser() {
      try {
        await this.$fire.auth
          .createUserWithEmailAndPassword(
            this.signUpInfo.email,
            this.signUpInfo.password
          )
          .then((user) => {
            this.$fire.firestore.collection('users').doc(user.user.uid).set({
              fplID: '',
              leagues: [],
            })
            this.$router.push({ path: '/dashboard' })
          })
      } catch (err) {
        this.signUpInfo.error = err.message
      }
    },
  },
}
</script>

<style></style>
