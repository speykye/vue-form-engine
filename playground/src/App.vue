<script setup lang="ts">
import { computed, ref } from 'vue';
import BasicDemo from './demos/BasicDemo.vue';
import CustomDemo from './demos/CustomDemo.vue';
import ArrayDemo from './demos/ArrayDemo.vue';
import AsyncValidationDemo from './demos/AsyncValidationDemo.vue';

const demos = [
  { key: 'basic', label: 'Basic + Hidden Payload', component: BasicDemo },
  { key: 'custom', label: 'Custom Field / Block', component: CustomDemo },
  { key: 'array', label: 'Array Field', component: ArrayDemo },
  { key: 'async', label: 'Async Validation', component: AsyncValidationDemo }
];

const activeKey = ref(demos[0].key);
const activeDemo = computed(() => demos.find(demo => demo.key === activeKey.value)?.component ?? BasicDemo);
</script>

<template>
  <main class="app-shell">
    <header class="hero">
      <p class="eyebrow">Vue Form Engine · 0.1.0 Playground</p>
      <h1>UI-agnostic schema-driven form engine for Vue 3</h1>
      <p>
        This playground verifies schema rendering, conditional visibility, hidden payload strategy,
        custom field/block registration, array field, and async validation debounce.
      </p>
    </header>

    <nav class="tabs">
      <button
        v-for="demo in demos"
        :key="demo.key"
        :class="['tab', { active: activeKey === demo.key }]"
        type="button"
        @click="activeKey = demo.key"
      >
        {{ demo.label }}
      </button>
    </nav>

    <section class="demo-card">
      <component :is="activeDemo" />
    </section>
  </main>
</template>
