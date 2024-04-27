<template>
    <a-card class="mt-4 shadow">
        <div class="flex gap-1.5">
            <a-avatar class="self-center" src="https://picsum.photos/50/50" size="small">
                <template #icon>
                    <a-skeleton-avatar />
                </template>
            </a-avatar>

            <div class="self-center">
                <a-typography-text class="!m-0 text-xs">{{ post?.user?.username || user?.username || username || 'deleteduser' }}</a-typography-text>
                <span class="mx-2 text-gray-400">•</span>
                <a-typography-text class="!m-0 text-xs text-gray-400">
                    {{ formatTimeAgo(post.createdAt) }}
                </a-typography-text>
            </div>
        </div>

        <a-typography-title class="!mb-0 mt-2" :level="3">{{ post.title }}</a-typography-title>
        <a-typography-paragraph class="secondary-text mt-2">{{ post.content }}</a-typography-paragraph>

        <template #actions>
            <a-typography-text class="">
                <HeartFilled class="text-gray-400" />
                0
                Reactions
            </a-typography-text>

            <a-typography-text class="">
                <MessageOutlined class="text-gray-400" />
                0
                Comments
            </a-typography-text>
        </template>
    </a-card>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/userStore';

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

function formatTimeAgo(date: string) {
    const currentDate = new Date();
    const postDate = new Date(date);
    const timeDifference = currentDate.getTime() - postDate.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const yearsDifference = Math.floor(daysDifference / 365);

    if (yearsDifference > 0) {
        return `${yearsDifference} year${yearsDifference > 1 ? 's' : ''} ago`;
    } else if (daysDifference > 0) {
        return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
    } else if (hoursDifference > 0) {
        return `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''} ago`;
    } else if (minutesDifference > 0) {
        return `${minutesDifference} minute${minutesDifference > 1 ? 's' : ''} ago`;
    } else {
        return `${secondsDifference} second${secondsDifference > 1 ? 's' : ''} ago`;
    }
}
const props = defineProps<{
    post: PostInfo;
    username?: string;
}>();

const { post } = toRefs(props);
</script>