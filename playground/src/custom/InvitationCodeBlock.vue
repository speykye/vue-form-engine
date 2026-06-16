<script setup lang="ts">
import type { FormModel } from '@speykye/vue-form-engine';

const props = withDefaults(defineProps<{
  model: FormModel;
  invitationCodeKey?: string;
  invitationVerifiedKey?: string;
  disabled?: boolean;
}>(), {
  invitationCodeKey: 'invitationCode',
  invitationVerifiedKey: 'invitationVerified'
});

function verify() {
  props.model[props.invitationVerifiedKey] = props.model[props.invitationCodeKey] === 'FORM-ENGINE';
}
</script>

<template>
  <a-form-item label="Invitation Code">
    <a-input-group compact>
      <a-input
        style="width: calc(100% - 96px)"
        :value="model[invitationCodeKey]"
        :disabled="disabled"
        placeholder="Try FORM-ENGINE"
        @update:value="model[invitationCodeKey] = $event"
      />
      <a-button type="primary" :disabled="disabled" @click="verify">Verify</a-button>
    </a-input-group>
    <div class="hint" :class="{ ok: model[invitationVerifiedKey] }">
      {{ model[invitationVerifiedKey] ? 'Verified' : 'Not verified' }}
    </div>
  </a-form-item>
</template>

<style scoped>
.hint { margin-top: 6px; color: #b42318; }
.hint.ok { color: #027a48; }
</style>
