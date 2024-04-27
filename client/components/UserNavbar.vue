<template>
    <div class="self-center flex gap-3">
        <NuxtLink to="/feed" class="self-cente flex gap-2">
            <ShareAltOutlined class="self-center text-xl text-blue-500" />
            <a-typography-text class="self-center text-lg font-bold">
                YouShare
            </a-typography-text>
        </NuxtLink>

        <a-input-search class="hidden md:block self-center w-64" v-show="user?.role !== 'admin'"
            placeholder="Search YouShare" enter-button />
        <a-button type="primary" class="rounded-full md:hidden">
            <SearchOutlined />
        </a-button>
    </div>

    <div class="flex gap-5 self-center">
        <NuxtLink to="/feed">
            <a-button type="primary" v-show="current !== 'feed'" ghost class="self-center">
                <GlobalOutlined />
                Feed
            </a-button>
        </NuxtLink>

        <div @click="cpOpenModal" v-show="current !== 'admin-users'">
            <a-button type="primary" class="self-center !hidden sm:!inline-block">
                <PlusOutlined />
                Create Post
            </a-button>
        </div>

        <a-badge class="self-center" :dot="true">
            <BellOutlined class="text-xl secondary-text h-4" />
        </a-badge>

        <a-dropdown :trigger="['click']">
            <!-- Dropdown Button -->
            <a class="ant-dropdown-link" @click.prevent>
                <a-avatar class="bg-blue-500" :size="32">
                    <template #icon>
                        <UserOutlined />
                    </template>
                </a-avatar>
            </a>

            <!-- Dropdown Items -->
            <template #overlay>
                <a-menu>
                    <a-menu-item key="1">
                        <NuxtLink :to="`/profile/${user?.username}`">
                            <UserOutlined class="bg-blue-500 p-1 text-white rounded-full mr-0.5" />
                            {{ user?.username }}
                        </NuxtLink>
                    </a-menu-item>

                    <a-menu-divider />


                    <span v-show="user?.role === 'admin' && current !== 'admin-users'">
                        <a-menu-item key="2">
                            <NuxtLink to="/admin/users">Manage Users</NuxtLink>
                        </a-menu-item>
                    </span>

                    <a-menu-item @click="showUpdateUserModal" key="3">Profile Settings</a-menu-item>

                    <a-menu-item @click="deleteSession" class="!text-red-500" key="4">Logout</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>

    <a-modal v-model:open="updateUserModal" title="Update User" ok-text="Update" @ok="updateUser"
        :ok-button-props="{ loading: updateUserBtnLoading }" @cancel="() => {
            userFormState['password'] = '';
            userFormState['currentPassword'] = '';
        }">
        <a-form :model="userFormState" layout="vertical">
            <div class="flex gap-2">
                <a-form-item ref="firstName" label="Firstname" name="firstname">
                    <a-input v-model:value="userFormState.firstName" placeholder="Firstname" />
                </a-form-item>
                <a-form-item ref="firstName" label="Middlename" name="middlename">
                    <a-input v-model:value="userFormState.middleName" placeholder="Middlename" />
                </a-form-item>
                <a-form-item ref="firstName" label="Lastname" name="lastname">
                    <a-input v-model:value="userFormState.lastName" placeholder="Lastname" />
                </a-form-item>
            </div>

            <div class="flex gap-2">
                <a-form-item ref="username" label="Username" name="username">
                    <a-input v-model:value="userFormState.username" placeholder="Username" />
                </a-form-item>

                <a-form-item ref="title" label="Title" name="title">
                    <a-input v-model:value="userFormState.title" placeholder="Title" />
                </a-form-item>
            </div>

            <div class="flex gap-2">
                <a-form-item ref="country" label="Country" name="country">
                    <a-input v-model:value="userFormState.country" placeholder="Country" />
                </a-form-item>
                <a-form-item ref="phone" label="Phone" name="phone">
                    <a-input v-model:value="userFormState.phone" placeholder="Phone" type="number" />
                </a-form-item>
            </div>

            <a-divider class="mt-0 mb-4" />

            <div v-show="user?.googleId === null" class="flex gap-2">
                <a-form-item ref="currentPassword" label="Current Password" name="current-password">
                    <a-input-password v-model:value="userFormState.currentPassword" placeholder="Current Password" />
                </a-form-item>

                <a-form-item ref="password" label="Password" name="password">
                    <a-input-password v-model:value="userFormState.password" placeholder="Password" />
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/userStore';
import { usePostStore } from '~/store/postStore';

const userStore = useUserStore();
const postStore = usePostStore();
const route = useRoute();

const { user } = storeToRefs(userStore);
const { cpOpenModal } = postStore;
const current = ref<string>(route.name as string);

const updateUserModal = ref<boolean>(false);

function showUpdateUserModal(): void {
    updateUserModal.value = true;
}

async function deleteSession(): Promise<void> {
    await userStore.deleteSession();

    await message.success({ content: 'Logout success!', duration: 1 });

    await navigateTo({ path: '/sign-in' });
}

watch(() => route.name, (to): void => {
    current.value = to as string;
});

// ======= Update Current user =======
interface IUserFormState {
    [key: string]: any;
    firstName: string;
    middleName: string;
    lastName: string;
    username: string;
    title: string;
    country: string;
    phone: string;
    currentPassword: string;
    password: string;
};

const userFormState = reactive<IUserFormState>({
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    title: '',
    country: '',
    phone: '',
    currentPassword: '',
    password: ''
});

const updateUserBtnLoading = ref<boolean>(false);

watchEffect(() => {
    userFormState.firstName = user.value?.firstName || '';
    userFormState.middleName = user.value?.middleName || '';
    userFormState.lastName = user.value?.lastName || '';
    userFormState.username = user.value?.username || '';
    userFormState.title = user.value?.title || '';
    userFormState.country = user.value?.country || '';
    userFormState.phone = user.value?.phone || '';
});

async function updateUser(): Promise<void> {
    updateUserBtnLoading.value = true;
    try {
        const originalUserData: Record<string, UserInfo> = Object.assign({}, user.value);
        const newUserData: IUserFormState = Object.assign({}, userFormState);

        const updatePayload: Partial<IUserFormState> = {};

        for (const key in newUserData) {
            if (key === 'password' && newUserData[key] === '') continue;
            if (newUserData[key] !== originalUserData[key])
                updatePayload[key] = newUserData[key];
        }

        if (Object.keys(updatePayload).length === 0) {
            updateUserBtnLoading.value = false;
            return message.error({ content: 'No changes detected', key: 'onSubmit', duration: 3 })
        }

        await userStore.updateUser(user?.value?.id as string, updatePayload);

        message.success({ content: 'Profile updated successfully!', duration: 2 });
        
        if(current.value === 'profile-username') {
            await refreshNuxtData()
            await navigateTo({ path: `/profile/${newUserData.username}` });
        }
            

        userFormState['password'] = '';
        userFormState['currentPassword'] = '';
        
        updateUserModal.value = false;
        updateUserBtnLoading.value = false;
    }
    catch (error: any) {
        message.error({ content: error.response._data.message, key: 'onSubmit', duration: 4 });
        updateUserBtnLoading.value = false;
    }
}
</script>