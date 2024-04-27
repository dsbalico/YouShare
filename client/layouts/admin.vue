<template>
    <a-layout class="h-screen">
        <Navbar />

        <a-layout>
            <a-layout-sider class="hidden md:block">
                <Sidebar />
            </a-layout-sider>

            <a-layout-content ref="content" class="overflow-y-scroll">
                <slot />

            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
import { LayoutContent } from 'ant-design-vue';

const content = ref<InstanceType<typeof LayoutContent>>();

function scrollToTop(): void {
    content.value?.$el.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style lang="css" scoped>

</style>