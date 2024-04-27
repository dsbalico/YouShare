<template>
    <a-layout-content class="pt-5 mb-20 lg:mt-0">
        <!-- Load this if user exists -->
        <div v-if="user !== null" class="px-3 lg:w-[800px] lg:mx-auto">
            <div class=" px-2 md:p-5 bg-white rounded-md">
                <div class="relative sm:flex">
                    <div class="flex-wrap md:flex-nowrap flex w-full gap-4">
                        <!-- User's Image -->
                        <div class="w-44 ">
                            <a-image class="w-full rounded-lg" src="https://picsum.photos/200/200">
                                <template #placeholder>
                                    <a-skeleton-image />
                                </template>
                            </a-image>
                        </div>

                        <!-- User Info -->
                        <div class="self-center">
                            <a-typography-paragraph class="flex gap-2 !mb-0">
                                <span>@{{ user?.data?.username }}</span>
                                <a-tag v-show="user?.data?.role === 'admin'" color="red">Admin</a-tag>
                            </a-typography-paragraph>
                            <a-typography-paragraph class="!mb-0 text-4xl font-semibold">
                                {{ user?.data?.firstName || 'Unamed' }} {{ user?.data?.middleName }} {{
                                    user?.data?.lastName || 'User' }}
                            </a-typography-paragraph>
                            <a-typography-paragraph class="!mb-0 text-base">
                                {{ user?.data?.title || 'N/A' }}
                            </a-typography-paragraph>

                            <!-- User Contact Info -->
                            <a-typography-paragraph class="!mb-0 mt-4">
                                <MailOutlined />
                                Email Address: {{ user?.data?.email }}
                            </a-typography-paragraph>
                            <a-typography-paragraph class="!mb-0">
                                <PhoneOutlined />
                                Phone: {{ user?.data?.phone || 'N/A' }}
                            </a-typography-paragraph>
                            <a-typography-paragraph class="!mb-0">
                                <HomeOutlined /> Location:
                                {{ user?.data?.country || 'N/A' }}
                            </a-typography-paragraph>
                        </div>
                    </div>
                </div>
            </div>

            <a-divider />

            <!-- User's Posts -->
            <Post v-for="post in profilePosts" :key="post.id" :post="post" :username="(username as string)" />

            <div class="flex justify-center text-center" v-show="profilePosts.length < 1">
                <div>
                    <svg style="" width="154" height="122" viewBox="0 0 184 152" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g transform="translate(24 31.67)"><ellipse fill-opacity=".8" fill="#F5F5F7" cx="67.797" cy="106.89" rx="67.797" ry="12.668"></ellipse><path d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z" fill="#AEB8C2"></path><path d="M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z" fill="url(#linearGradient-1)" transform="translate(13.56)"></path><path d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="#F5F5F7"></path><path d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z" fill="#DCE0E6"></path></g><path d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z" fill="#DCE0E6"></path><g transform="translate(149.65 15.383)" fill="#FFF"><ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815"></ellipse><path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"></path></g></g></svg>
                    <a-typography-paragraph class="text-center text-gray-500">No posts yet.</a-typography-paragraph>
                    <a-button @click="cpOpenModal" v-show="currentUser?.username === username" type="primary">Create
                        Now</a-button>
                    </div>
            </div>
        </div>

        <!-- Load this if user does not exists -->
        <div v-else class="h-[90vh] flex justify-center">
            <div class="self-center text-center p-10 border border-solid border-gray-300 rounded-lg shadow-lg">
                <StopOutlined class="text-5xl text-gray-500" />
                <a-typography-paragraph class="mt-2 !mb-0 text-xl text-gray-500 font-medium">This user does not
                    exist.</a-typography-paragraph>
                
                <NuxtLink to="/feed">
                    <a-button type="primary" ghost class="mt-3 w-full">Go to feed</a-button>
                </NuxtLink>
            </div>
        </div>
    </a-layout-content>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/store/userStore';
import { usePostStore } from '~/store/postStore';

const config = useRuntimeConfig();
const { username } = useRoute().params;
const userStore = useUserStore();
const postStore = usePostStore();

const { cpOpenModal } = postStore;

const { user: currentUser } = storeToRefs(userStore);
const { profilePosts } = storeToRefs(postStore);

// Fetch the user in route params
const { data: user } = await useFetch<any>(`${config.public.API_URL}/users/${username}`, {
    credentials: 'include'
});

onMounted(async () => {
    await postStore.fetchProfilePosts(user.value.data.id);
});
</script>