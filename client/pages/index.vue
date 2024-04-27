<template>
    <div class="dotted-bg h-[80vh] flex justify-center px-4 lg:px-12 lg:text-center">
        <div class="self-center">
            <a-typography-paragraph class="!font-bold text-4xl lg:text-5xl !mb-0">
                Your <span class="text-blue-500">Go-To </span>Spot for Sharing Anything
            </a-typography-paragraph>

            <a-typography-paragraph class="text-lg lg:text-xl mt-4 !mb-6 lg:w-[60%] mx-auto">
                Empower your social connections with YouShare, the ultimate online sharing platform that provides a
                go-to spot for sharing anything, from ideas and experiences to memories and dreams, fostering creativity
                and community engagement.
            </a-typography-paragraph>

            <div class="flex gap-2 lg:justify-center">
                <NuxtLink to="/sign-in">
                    <a-button type="primary" ghost class="!bg-white h-auto py-2 text-lg px-8 font-bold">
                        Sign in
                    </a-button>
                </NuxtLink>
                <NuxtLink to="/sign-up">
                    <a-button type="primary" class="h-auto py-2 text-lg px-8 font-bold">
                        Get Started
                    </a-button>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: "hcf" });
</script>