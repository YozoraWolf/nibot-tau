<template>
  <div class="facebook-connection">
    <q-card class="q-pa-xl" style="max-width: 600px; width: 100%;">
      <div class="row items-center q-mb-xl">
        <q-icon name="mdi-facebook" size="40px" class="q-mr-lg" color="primary" />
        <div class="text-h5">Connect to Facebook</div>
      </div>

      <div class="q-mb-xl">
        <q-btn color="primary" @click="connectToFacebook" icon="mdi-link" label="Connect" size="lg" />
      </div>

      <!-- File picker + upload -->
      <q-file
        filled
        bottom-slots
        label="Select image to upload"
        accept="image/*"
        v-model="fileInput"
        class="q-mb-lg"
        @update:model-value="uploadFile"
      />

      <q-separator class="q-my-lg" />

      <div v-if="isConnected" class="q-mb-lg text-positive">
        <q-icon name="check_circle" color="positive" size="md" /> Connected as: <b>{{ user?.name }}</b>
      </div>
      <div v-else class="q-mb-lg text-negative">
        <q-icon name="warning" color="negative" size="md" /> Not connected to Facebook
      </div>

      <!-- Dev card for debugging -->
      <q-card v-if="isDev" class="q-mt-lg bg-grey-2">
        <q-card-section>
          <div class="text-caption text-weight-bold">[DEV] Facebook Auth Debug</div>
          <div>Status: <b>{{ isConnected ? 'Connected' : 'Not Connected' }}</b></div>
          <div>User: <pre>{{ user }}</pre></div>
          <div v-if="error" class="text-negative">Error: {{ error }}</div>
        </q-card-section>
      </q-card>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useFacebookAuth } from '@/composables/useFacebookAuth';
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { isFacebookConnected, getFacebookUser } from '@/utils/FacebookHelper';

const router = useRouter();
const $q = useQuasar();
const { login, postImageToFacebook, user, error, connected } = useFacebookAuth();

const fileInput = ref<File | null>(null);
const loading = ref(false);

const isConnected = computed(() => isFacebookConnected() && !!user.value);

const isDev = import.meta.env.MODE === 'development';

// Restore user info if token is present but user is not loaded (e.g. after route change)
onMounted(async () => {
  if (isFacebookConnected() && !user.value) {
    try {
      const fbUser = await getFacebookUser();
      user.value = fbUser;
      connected.value = true;
    } catch (err) {
      connected.value = false;
    }
  }
});

const connectToFacebook = async () => {
  loading.value = true;
  try {
    console.log('Triggering Facebook login...');
    await login();
    console.log('Connected as:', user.value?.name, user.value?.id);
  } catch (err) {
    console.error('Facebook login failed:', err);
    $q.notify({
      type: 'negative',
      message: 'Facebook login failed',
      position: 'top-right'
    });
  } finally {
    loading.value = false;
  }
};

const uploadFile = async () => {
  if (!fileInput.value) return;

  // QFile with v-model returns a single File or an array of Files depending on multiple prop
  const file = Array.isArray(fileInput.value) ? fileInput.value[0] : fileInput.value;
  if (!file) return;

  try {
    const result = await postImageToFacebook('Test upload from dev', file);
    console.log('Photo uploaded with id:', result.id);
    $q.notify({
      type: 'positive',
      message: 'Image uploaded!',
      position: 'top-right'
    });
    // Optionally clear the file input after upload
    fileInput.value = null;
  } catch (err) {
    console.error('Upload failed:', err);
    $q.notify({
      type: 'negative',
      message: 'Upload failed, check console.',
      position: 'top-right'
    });
  }
};
</script>

<style scoped>
.facebook-connection {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
