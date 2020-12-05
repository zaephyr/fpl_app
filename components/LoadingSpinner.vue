<template>
  <div class="lds-ring">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script>
export default {}
</script>

<style>
.lds-ring {
  display: inline-block;
  position: relative;
  width: 240px;
  height: 240px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 192px;
  height: 192px;
  margin: 8px;
  border: 16px solid #20bf6b;
  border-radius: 50%;
  animation: lds-ring 1.6s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #20bf6b transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.5s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
