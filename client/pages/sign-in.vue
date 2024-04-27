<template>
    <div v-if="userStore.user !== null">
        <div class="h-screen flex justify-center">
            <div class="self-center text-center">
                <LoadingOutlined class="text-3xl text-blue-500" />
            </div>
        </div>
    </div>

    <div v-else class="h-[80vh] flex justify-center px-4 lg:px-12 lg:text-center">
        <div class="self-center">
            <a-typography-title class="text-center text-2xl !mb-0 !font-bold" :level="2">Welcome
                back!</a-typography-title>
            <a-typography-paragraph class="text-center">
                Don't have an account yet? <NuxtLink to="/sign-up">Create account</NuxtLink>
            </a-typography-paragraph>

            <div class="border border-solid border-gray-200 px-8 py-6 rounded-lg text-center w-[380px]">
                <a-typography-text>Welcome to YouShare, sign in with</a-typography-text>
                <NuxtLink to="http://localhost:5000/google">
                    <a-button class="w-full font-medium mt-2 rounded-full">
                        <google-outlined />
                        Google
                    </a-button>
                </NuxtLink>

                <a-divider class="!border-gray-300">or continue with</a-divider>

                <!-- Sign-in Form -->
                <a-form :model="formState" @finish="onFinish">
                    <!-- Username or Email -->
                    <a-form-item name="credential" class="mb-3"
                        :rules="[{ required: true, message: 'Username or email is required' }]">
                        <a-input v-model:value="formState.credential" placeholder="Email or Username">
                            <template #prefix>
                                <UserOutlined class="site-form-item-icon" />
                            </template>
                        </a-input>
                    </a-form-item>

                    <!-- Password -->
                    <a-form-item name="password" :rules="[{ required: true, message: 'Password is required' }]">
                        <a-input-password v-model:value="formState.password" placeholder="Password">
                            <template #prefix>
                                <LockOutlined class="site-form-item-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <!-- Submit Button -->
                    <a-form-item>
                        <a-button :loading="buttonLoading" :disabled="disabled" type="primary" html-type="submit"
                            class="w-full">
                            Submit
                        </a-button>
                    </a-form-item>

                    <a-typography-paragraph class="text-center">
                        By signing in, you agree to our <a>Terms of Service</a> and <a>Privacy Policy</a>.
                    </a-typography-paragraph>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/store/userStore';

interface FormState {
    credential: string;
    password: string;
}

const formState = reactive<FormState>({
    credential: '',
    password: '',
});

const buttonLoading = ref<boolean>(false);

const userStore = useUserStore();
const { query } = useRoute();

onMounted(async () => {
    if(query.error && query.error === 'emailError')
        message.error({ content: 'This account uses manual sign-in.', key: 'onSubmit', duration: 4 });

    try {
        await userStore.fetchCurrentUser()

        await navigateTo({ path: '/feed' });
    }
    catch (error: any) {
        console.error(error);
    }
});

const onFinish = async (values: FormState): Promise<void> => {
    try {
        buttonLoading.value = true;
        message.loading({ content: 'Loading...', key: 'onSubmit' });

        const userInSession = await userStore.createSession(values);

        await message.success({ content: 'Sign in success!', key: 'onSubmit', duration: 1 });
        
        if (userInSession.role === 'admin') await navigateTo({ path: '/admin/users' });
        else await navigateTo({ path: `/feed` })
        
    }
    catch (error: any) {
        buttonLoading.value = false;
        message.error({ content: error.response._data.message, key: 'onSubmit', duration: 3 });
    }
};

const disabled = computed(() => {
    return !(formState.credential && formState.password);
});

definePageMeta({ layout: "hcf" });
</script>