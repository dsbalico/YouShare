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
            <a-typography-title class="text-center text-2xl !mb-0 !font-bold" :level="2">Create an account!</a-typography-title>
            <a-typography-paragraph class="text-center">
                Already have an account? <NuxtLink to="/sign-in">Sign in</NuxtLink>
            </a-typography-paragraph>

            <div class="border border-solid border-gray-200 px-8 py-6 rounded-lg text-center w-[380px]">
                <a-typography-text>Welcome to YouShare, sign up with</a-typography-text>
                <NuxtLink to="http://localhost:5000/google">
                    <a-button class="w-full font-medium mt-2 rounded-full">
                        <google-outlined />
                        Google
                    </a-button>
                </NuxtLink>

                <a-divider class="!border-gray-300">or continue with</a-divider>

                <!-- Sign-up form -->
                <a-form 
                    :model="formState"
                    @finish="onFinish"
                >
                    <div class="flex gap-3">
                        <!-- Email -->
                        <a-form-item name="email" class="mb-3" :rules="[{ required: true, message: 'Email required' }, { type: 'email', message: 'Invalid email' }]">
                            <a-input v-model:value="formState.email" placeholder="Email">
                                <template #prefix>
                                    <MailOutlined class="site-form-item-icon" />
                                </template>
                            </a-input>
                        </a-form-item>

                        <!-- Username -->
                        <a-form-item name="username" class="mb-3" :rules="[{ required: true, message: 'Username required' }]">
                            <a-input v-model:value="formState.username" placeholder="Username">
                                <template #prefix>
                                    <UserOutlined class="site-form-item-icon" />
                                </template>
                            </a-input>
                        </a-form-item>
                    </div>

                    <!-- Password -->
                    <a-form-item name="password" class="mb-3"
                        :rules="[{ required: true, message: 'Password is required' }]">
                        <a-input-password v-model:value="formState.password" placeholder="Password">
                            <template #prefix>
                                <LockOutlined class="site-form-item-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <!-- Confirm Password -->
                    <a-form-item name="confirmPassword" :rules="[{ required: true, message: 'Password confirmation is required' }, { validator: validateConfirmPassword }]">
                        <a-input-password v-model:value="formState.confirmPassword" placeholder="Confirm Password">
                            <template #prefix>
                                <FileProtectOutlined class="site-form-item-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <!-- Submit BUtton -->
                    <a-form-item>
                        <a-button type="primary" :disabled="disabled" html-type="submit" class="w-full">
                            Submit
                        </a-button>
                    </a-form-item>

                    <a-typography-paragraph class="text-center">
                        By signing up, you agree to our <a>Terms of Service</a> and <a>Privacy Policy</a>.
                    </a-typography-paragraph>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/store/userStore';

const config = useRuntimeConfig();
const userStore = useUserStore();

onMounted(async () => {
    try {
        await userStore.fetchCurrentUser()
        await navigateTo({ path: '/feed' });
    }
    catch(error: any) {
        console.error(error);
    }
});

interface FormState {
    username: string;
    password: string;
    email: string;
    confirmPassword: string;
}

const formState = reactive<FormState>({
    username: '',
    password: '',
    email: '',
    confirmPassword: ''
});

async function onFinish(values: FormState): Promise<void> {
    try {
        message.loading({ content: 'Loading...', key: 'onSubmit' });

        await $fetch(`${config.public.API_URL}/users`, {
            method: 'POST',
            body: JSON.stringify(values)
        });

        message.success({ content: 'Sign up success! Sign in to continue to your account.', key: 'onSubmit', duration: 3 });
        await navigateTo({ path: '/sign-in' })
    }
    catch(error: any) {
        message.error({ content: error.response._data.message, key: 'onSubmit', duration: 4 });
    }
};

const disabled = computed(() => {
    return !(formState.username && formState.password && formState.email && (formState.password === formState.confirmPassword));
});

function validateConfirmPassword(_: any, value: string): Promise<void> {
    if (value !== formState.password) {
        return Promise.reject('Password does not match');
    }
    return Promise.resolve();
};

definePageMeta({ layout: "hcf" });
</script>