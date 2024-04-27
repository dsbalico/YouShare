<template>
  <a-extract-style>
    <div class="h-screen flex justify-center" v-if="pageLoading">
        <div class="self-center text-center">
            <LoadingOutlined class="text-3xl text-blue-500" />
        </div>
    </div>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </a-extract-style>
</template>

<script lang="ts" setup>
import { useUserStore } from './store/userStore';

const userStore = useUserStore();

const { fetchCurrentUser } = userStore;
const { user } = storeToRefs(userStore);
const pageLoading = ref(true);

onMounted(async () => {
  pageLoading.value = false;

  try {
    if (user.value === null) await fetchCurrentUser();

  } catch(error: any) {
    console.error(error);
  }
});
</script>

