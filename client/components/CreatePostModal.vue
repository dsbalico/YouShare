<template>
    <a-modal v-model:open="cpModal"  title="Create Post" ok-text="Post" @ok="createPost">
        <a-input v-model:value="postTitle" show-count :maxlength="80" placeholder="Title" />
        <a-textarea v-model:value="postContent" class="mt-2 mb-12" :rows="4"  show-count :maxlength="1280" placeholder="Content" />
    </a-modal>
</template>

<script lang="ts" setup>
import { usePostStore } from '~/store/postStore';

const postStore = usePostStore();
const { cpModal } = storeToRefs(postStore);

const postTitle = ref<string>('');
const postContent = ref<string>('');

async function createPost(): Promise<void> {
    try {
        await postStore.createPost({ title: postTitle.value, content: postContent.value });
        
        message.success({ content: 'Post created!', key: 'createPost', duration: 2 });

        postTitle.value = '';
        postContent.value = '';
    }
    catch(error: any) {
        message.error({ content: error.message, key: 'createPost' });
    }
}


</script>