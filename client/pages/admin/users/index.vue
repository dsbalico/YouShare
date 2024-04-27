<template>
    <template v-if="userStore.user?.role !== 'admin' || userStore.user === null">
        <div class="h-screen flex justify-center">
            <div class="self-center text-center">
                <LoadingOutlined class="text-3xl text-blue-500" />
            </div>
        </div>
    </template>
    <template v-else>
        <div class="px-4 mt-5">
            <a-breadcrumb>
                <a-breadcrumb-item>Users</a-breadcrumb-item>
            </a-breadcrumb>

            <!-- Title -->
            <a-typography-title class="!my-0 dark:text-white" :level="2">
                Manage Users ({{ users?.data?.totalUsers }})

                <!-- Loading state -->
                <!-- <a-tag v-show="loading" color="blue">
                <loading-outlined /> Loading...
            </a-tag> -->
            </a-typography-title>

            <a-typography-text class="text-gray-400">Manage all registered users in the system here.</a-typography-text>

            <!-- Search -->
            <a-input-search class="mt-4" placeholder="Search Users" />
        </div>

        <div class="mt-4 text-right mx-4">
            <a-button @click="showCreateUserModal">Add User</a-button>
        </div>

        <!-- Users Table -->
        <a-table class="mt-2 mx-4" sticky :columns="columns" :data-source="users?.data?.users" :scroll="{ x: 1500 }">
            <template #bodyCell="{ column, text, record }">
                <!-- All columns that can be updated -->
                <template 
                    v-if="[ 'firstName', 'middleName', 
                            'lastName', 'username', 
                            'email', 'role', 
                            'title', 'country', 
                            'phone'].includes(column.dataIndex as string)
                            // To not change the password cell to input field if the user sign-in method is google
                            || (['password'].includes(column.dataIndex as string) && record.googleId === null)">
                    <div>
                        <template v-if="editableData[record.id]">
                            <!-- For Password -->
                            <a-input-password class="border-blue-500" v-if="column.dataIndex == 'password'"
                                :placeholder="(column.title as string)"
                                v-model:value="editableData[record.id][column.dataIndex]" />
                            
                            <!-- For other fields -->
                            <a-input :type="column.dataIndex === 'phone' ? 'number': text" class="border-blue-500" v-else :placeholder="(column.title as string)"
                                v-model:value="editableData[record.id][column.dataIndex as string || '']" />
                        </template>
                        <template v-else>
                            <!-- If the column sign-in method is not google -->
                            <span class="text-blue-500 text-xs"
                                v-if="column.dataIndex === 'password' && record.googleId === null">
                                Edit column to update password
                            </span>
                            <span v-else>{{ text }}</span>
                        </template>
                    </div>
                </template>

                <!-- If the user sign-in method is google, then display this -->
                <span class="text-blue-500 text-xs"
                    v-if="column.dataIndex === 'password' && record.googleId !== null">
                    Google sign-in doesn't require password
                </span>

                <!-- If text has no value except for password and action column display empty -->
                <span class="text-xs text-gray-500"
                    v-if="(text === undefined || text === null || text === '') 
                    && column.dataIndex !== 'password' && column.dataIndex !== 'action' && !editableData[record.id]">empty</span>

                    <!-- Format Date -->
                <template v-if="column.dataIndex === 'createdAt' || column.dataIndex === 'updatedAt'">
                    <span>{{ new Date(text).toLocaleString() }}</span>
                </template>
                
                <!-- Actions -->
                <template v-else-if="column.dataIndex === 'action'">
                    <div>
                        <div class="flex" v-if="editableData[record.id]">
                            <!-- Save button -->
                            <a-button class="text-blue-500 hover:!text-blue-500" type="text"
                                @click="saveChanges(record.id)">Save</a-button>

                            <!-- Cancel Button -->
                            <a-popconfirm title="Sure to cancel?" @confirm="cancelEdit(record.id)">
                                <a-button type="text">Cancel</a-button>
                            </a-popconfirm>
                        </div>
                        <div v-else class="flex gap-1.5">
                            <!-- Edit Button -->
                            <a-button class="text-blue-500 hover:!text-blue-500" type="text"
                                @click="editUser(record.id)">Edit</a-button>

                            <!-- Delete button -->
                            <a-popconfirm v-if="users.data.totalUsers" title="Sure to delete?"
                                @confirm="deleteUser(record.id)">
                                <a-button type="text" danger>Delete</a-button>
                            </a-popconfirm>
                        </div>
                    </div>
                </template>
            </template>
        </a-table>
    </template>

    <!-- Modal for create user -->
    <a-modal v-model:open="createUserModal" title="Create User" ok-text="Create" @ok="createUser"
        :ok-button-props="{ disabled, loading: createUserBtnLoading }">
        <!-- Create user form -->
        <a-form :model="formState" layout="vertical">
            <!-- Names -->
            <div class="flex gap-2">
                <a-form-item ref="firstName" label="Firstname" name="firstname">
                    <a-input v-model:value="formState.firstName" placeholder="Firstname" />
                </a-form-item>

                <a-form-item ref="firstName" label="Middlename" name="middlename">
                    <a-input v-model:value="formState.middleName" placeholder="Middlename" />
                </a-form-item>

                <a-form-item ref="firstName" label="Lastname" name="lastname">
                    <a-input v-model:value="formState.lastName" placeholder="Lastname" />
                </a-form-item>
            </div>

            <!-- Username & Email -->
            <div class="flex gap-2">
                <a-form-item ref="username" label="Username" name="username"
                    :rules="[{ required: true, message: 'Username is required' }]">
                    <a-input v-model:value="formState.username" placeholder="Username" />
                </a-form-item>

                <a-form-item ref="email" label="Email" name="email"
                    :rules="[{ required: true }, { type: 'email', message: 'Invalid email' }]">
                    <a-input v-model:value="formState.email" placeholder="Email" />
                </a-form-item>
            </div>

            <!-- Title, Country, & Phone -->
            <div class="flex gap-2">
                <a-form-item ref="title" label="Title" name="title">
                    <a-input v-model:value="formState.title" placeholder="Title" />
                </a-form-item>

                <a-form-item ref="country" label="Country" name="country">
                    <a-input v-model:value="formState.country" placeholder="Country" />
                </a-form-item>

                <a-form-item ref="phone" label="Phone" name="phone">
                    <a-input v-model:value="formState.phone" placeholder="Phone" type="number" />
                </a-form-item>
            </div>

            <!-- Password & Role -->
            <div class="flex gap-2">
                <a-form-item class="w-full" ref="password" label="Password" name="password"
                    :rules="[{ required: true, message: 'Password is required' }]">
                    <a-input-password v-model:value="formState.password" placeholder="Password" />
                </a-form-item>

                <a-form-item ref="role" label="Role" name="role">
                    <a-radio-group v-model:value="formState.role" class="w-full flex" button-style="solid">
                        <a-radio-button value="user">User</a-radio-button>
                        <a-radio-button value="admin">Admin</a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash-es';
import type { TableColumnsType } from 'ant-design-vue';
import type { UnwrapRef } from 'vue';

import { useUserStore } from '~/store/userStore';
import { AdminTableColumns } from '~/utils/AdminTableColumns';

const config = useRuntimeConfig();
const userStore = useUserStore();

const { data: users } = useFetch<any>(`${config.public.API_URL}/users`);
const columns = ref<TableColumnsType>(AdminTableColumns);
const createUserModal = ref<boolean>(false);

const editableData: UnwrapRef<Record<string | number, UserInfo>> = reactive({});

onMounted(async () => {
    try {
        const user = await userStore.fetchCurrentUser()

        if (user.role !== 'admin') return await navigateTo({ path: '/feed' });
    }
    catch (error: any) {
        return await navigateTo({ path: '/' });
    }
});

function showCreateUserModal() { createUserModal.value = true; };

function editUser(id: string) {
    editableData[id] = cloneDeep(users.value.data.users.filter((item: UserInfo) => id === item.id)[0]);
};

function cancelEdit(key: string) { delete editableData[key]; };

async function saveChanges(id: string) {
    try {
        const _originalUserData = users.value.data.users.find((item: UserInfo) => item.id === id);

        const originalUserData: Record<string, UserInfo> = Object.assign({}, _originalUserData);
        const newUserData: Record<string, UserInfo> = Object.assign({}, editableData[id]);

        const updatePayload: Partial<Record<string, UserInfo>> = {};

        // Return only the updated fields
        for (const key in newUserData) {
            if (newUserData[key] !== originalUserData[key])
                updatePayload[key] = newUserData[key];
            else if (!(key in originalUserData))
                updatePayload[key] = newUserData[key];
        }

        if (Object.keys(updatePayload).length === 0) {
            return message.error({ content: 'No changes detected', key: 'onSubmit', duration: 3 })
        }

        await userStore.updateUser(id, updatePayload)

        Object.assign(users.value.data.users.filter((item: UserInfo) => id === item.id)[0], editableData[id]);
        delete editableData[id];
    }
    catch (error: any) {
        message.error({ content: error.response._data.message, key: 'onSubmit', duration: 3 });
    }
};

async function deleteUser(id: string) {
    await userStore.deleteUser(id);

    users.value.data.totalUsers -= 1;
    users.value.data.users = users.value.data.users.filter((item: any) => item.id !== id);
};

/* ======= Creating User ======= */

interface FormState {
    [key: string]
    firstName: string;
    middleName: string;
    lastName: string;
    username: string;
    email: string;
    title: string;
    country: string;
    phone: string;
    role: string;
    password: string;
}

const INITIAL_STATE = {
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    email: '',
    title: '',
    country: '',
    phone: '',
    role: 'user',
    password: ''
}

const formState = reactive<FormState>(INITIAL_STATE);
const createUserBtnLoading = ref<boolean>(false);

async function createUser(): Promise<void> {
    try {
        createUserBtnLoading.value = true;

        message.loading({ content: 'Loading...', key: 'onSubmit' });

        const { data } = await $fetch<UserInfo>(`${config.public.API_URL}/users`, {
            method: 'POST',
            body: JSON.stringify(formState)
        });

        // ==== Create user success ==== //

        users.value.data.totalUsers += 1;
        users.value.data.users.unshift(data);
        createUserModal.value = false;

        // Reset form state
        Object.keys(formState).forEach((key) => {
            if (key === 'role') formState[key] = 'user';
            else formState[key] = '';
        });

        await message.success({ content: 'User Created!', key: 'onSubmit', duration: 3 });
        createUserBtnLoading.value = false;
    }
    catch (error: any) {
        createUserBtnLoading.value = false;
        message.error({ content: error.response._data.message, key: 'onSubmit', duration: 4 });
    }
};

const disabled = computed(() => {
    return !(formState.username && formState.password && formState.email && formState.role);
});

definePageMeta({ layout: "admin" });
</script>