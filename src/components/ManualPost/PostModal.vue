<template>
  <q-dialog
    v-bind:model-value="modelValue"
    v-on:update:model-value="val => emit('update:modelValue', val)"
  >
    <q-card style="min-width:350px;max-width:500px;">
      <q-card-section>
        <q-img :src="post?.image" ratio="1" />
        <q-input v-model="caption" label="Caption" type="textarea" class="q-mt-md" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn color="primary" label="Post to Facebook" @click="postToFacebook" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
// TODO: Use Facebook posting logic
const props = defineProps<{ modelValue: boolean, post: any, page: any }>();
const emit = defineEmits(['update:modelValue']);

const caption = ref('');

watch(() => props.modelValue, val => {
  if (val) caption.value = '';
});

function postToFacebook() {
  // TODO: Implement actual post logic
  emit('update:modelValue', false);
}
</script>
