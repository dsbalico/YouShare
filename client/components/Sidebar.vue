<template>
    <!-- Navigation Menu -->
    <div class="flex bg-white flex-wrap gap-1.5 mt-5">
        <a-button type="text"
            :class="{ 'active': current === 'admin-users' }"
            class="sider-btn" to="/users">
            <UserOutlined />
            Users
        </a-button>
        <a-button type="text" :class="{ 'active': current === 'posts'}" class="sider-btn" to="/users">
            <ProfileOutlined />
            Posts
        </a-button>
        <a-button type="text" :class="{ 'active': current === 'settings'}" class="sider-btn" to="/users">
            <SettingOutlined/>
            Settings
        </a-button>
        <a-button @click="deleteSession" type="text" class="sider-btn">
            <LogoutOutlined />
            Logout
        </a-button>
    </div>

    <div class="px-1.5 !mt-[14px]">
        <a-divider class="!my-2" />
    </div>

    <!-- Darkmode Switch -->
    <div class="flex pl-5 text-gray-500 gap-2 mt-4">
        <a-switch />
        Dark Mode
    </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/store/userStore';

const route = useRoute();

const current = ref<string>(route.name as string);
const userStore = useUserStore();

const { deleteSession } = userStore;


// Watch for route changes to set the current active route
watch(() => route.name, (to): void => {
    current.value = to as string;
});
</script>

<style lang="css" scoped>
.sider-btn {
    @apply w-full h-auto py-2 text-left;
}

.active {
    @apply bg-sky-100 text-blue-500 hover:!bg-sky-100 hover:!text-blue-500;
}
</style>