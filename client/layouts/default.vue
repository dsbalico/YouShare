<template>
    <a-layout>
        <Navbar />

        <a-layout-content>
            <slot />
        </a-layout-content>

        <a-tooltip placement="topRight">
            <template #title>
                <span>Create Post</span>
            </template>
            <a-float-button @click="cpOpenModal" type="primary">
                <template #icon>
                    <PlusOutlined />
                </template>
            </a-float-button>
        </a-tooltip>
    </a-layout>

    <CreatePostModal />
</template>

<script lang="ts" setup>
import { usePostStore } from '~/store/postStore';

const postStore = usePostStore();

const { cpOpenModal } = postStore;
</script>