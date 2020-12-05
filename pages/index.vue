<template>
  <div>
    <Header :register="register" @toggle="updateRegStatus" />
    <div class="flip-card-inner" :class="{ rotate: !register }">
      <div class="flip-card-front">
        <LogIn />
      </div>
      <div class="flip-card-back">
        <SignUp />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      register: true,
    }
  },
  methods: {
    updateRegStatus(val) {
      this.register = val
    },
  },
}
</script>

<style>
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.rotate {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}
</style>
