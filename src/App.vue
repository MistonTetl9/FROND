<script setup lang="ts">
import { RouterView } from 'vue-router'
//import { useCounterStore } from '@/stores/counter'
import NavComponent from '@/components/NavComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
//const counter = useCounterStore()
</script>

<template>
  <NavComponent />
  <!--<div>
    <p>Contador: {{ counter.count }}</p>
    <p>Doble: {{ counter.doubleCount }}</p>
    <button @click="counter.increment">Incrementar</button>
  </div>-->

  <!--<nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>-->

  <RouterView />
  <FooterComponent />
</template>

<style scoped></style>
