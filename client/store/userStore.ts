// ~/store/userStore.ts
import { defineStore } from 'pinia';
import type { UserInfo } from '~/types';

export const useUserStore = defineStore('user', () => {
    const config = useRuntimeConfig();
    
    const user: Ref<UserInfo | null> = ref(null);
    
    const fetchCurrentUser = async (): Promise<UserInfo> => {
        const response = await $fetch<any>(`${config.public.API_URL}/sessions`, {
            credentials: 'include',
        });

        user.value = response.data;
        return response.data;
    };

    const createSession = async (data: { credential: string, password: string }): Promise<UserInfo> => {
        const response = await $fetch<any>(`${config.public.API_URL}/sessions`, {
            method: 'POST',
            body: JSON.stringify(data),
            credentials: 'include'
        });

        user.value = response.data.user;

        return response.data.user;
    };

    const deleteSession = async () => {
        await $fetch(`${config.public.API_URL}/sessions`, {
            method: 'DELETE',
            credentials: 'include',
        });

        user.value = null;
    };

    const deleteUser = async (id: string) => {
        await $fetch(`${config.public.API_URL}/users/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
    };

    const updateUser = async (id: string, data: {[k: string]: any}) => {
        const response = await $fetch<any>(`${config.public.API_URL}/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            credentials: 'include',
        });

        return response;
    }

    return { user, createSession, fetchCurrentUser, deleteSession, updateUser, deleteUser };
})
