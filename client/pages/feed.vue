<template>
    <a-layout-content class="">
        <div class="px-3 lg:w-[1080px] lg:mx-auto mb-20">
            
            <Post v-for="post in feedPosts" :key="post.id" :post="post" />

            <div class="mt-48" v-show="feedPosts.length < 1">
                <a-empty>
                    <template #description>
                        No posts yet.
                    </template>
                </a-empty>
            </div>
        </div>
    </a-layout-content>
</template>

<script lang="ts" setup>
import { usePostStore } from '~/store/postStore';

const createPostStore = usePostStore();
const { feedPosts } = storeToRefs(createPostStore);

onMounted(() => {
    createPostStore.fetchPosts();
});
</script>