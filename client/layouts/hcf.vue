<template>
    <a-layout>
        <Navbar />

        <a-layout-content>
            <slot />
        </a-layout-content>

        <a-layout-footer
            class="w-full !px-4 lg:!px-0 !bg-white absolute bottom-0 border-0 border-t border-solid border-gray-200">
            <div class="flex justify-between lg:w-[1080px] lg:mx-auto">
                <div class="self-center flex gap-2">
                    <ShareAltOutlined class="self-center text-lg text-blue-500" />
                    <a-typography-text
                        class="self-center text-lg font-bold hidden md:block">YouShare</a-typography-text>
                </div>
                <div class="self-center flex gap-4">
                    <a-typography-text class="self-center text-sm text-gray-500">© 2024 DSBalico. All Rights
                        Reserved</a-typography-text>
                    <a class="self-center text-sm hidden md:block">Terms of Service</a>
                    <a class="self-center text-sm hidden md:block">Privacy Policy</a>
                </div>
            </div>
        </a-layout-footer>
    </a-layout>
</template>
