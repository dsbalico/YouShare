import { defineStore } from 'pinia';

export const usePostStore = defineStore('post', () => {
    const config = useRuntimeConfig();

    const cpModal: Ref<boolean> = ref(false);
    const feedPosts: Ref<PostInfo[]> = ref([]);
    const profilePosts: Ref<PostInfo[]> = ref([]);

    const cpOpenModal = (): void => {
        cpModal.value = true;
    }

    const cpCloseModal = (): void => {
        cpModal.value = false;
    }

    async function createPost(data: { title: string, content: string }): Promise<PostInfo> {
        const createdPost = await $fetch<any>(`${config.public.API_URL}/posts`, {
            method: 'POST',
            body: JSON.stringify(data),
            credentials: 'include'
        });

        cpCloseModal();

        feedPosts.value.unshift(createdPost.data);
        profilePosts.value.unshift(createdPost.data);

        return createdPost.data;
    }

    async function fetchPosts(): Promise<void> {
        const posts = await $fetch<any>(`${config.public.API_URL}/posts`, {
            credentials: 'include'
        });

        feedPosts.value = posts.data.posts;
    }

    async function fetchProfilePosts(id: string) {
        const posts = await $fetch<any>(`${config.public.API_URL}/posts/users/${id}`);
        profilePosts.value = posts.data.posts;
    }

    
    return { cpModal, feedPosts, profilePosts, fetchPosts, fetchProfilePosts, createPost, cpOpenModal, cpCloseModal };
});