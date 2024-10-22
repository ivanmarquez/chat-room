<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <header class="p-4 flex justify-between items-center text-indigo-700">
                <h1 class="text-4xl font-bold">Chat Room</h1>
            </header>
        <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <h2 class="text-2xl font-semibold mb-6 text-center">Login</h2>
            <form @submit.prevent="login">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username</label>
                    <input v-model="username"
                        class="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username" type="text" placeholder="Enter your username" required>
                </div>
                <div class="flex items-center justify-between">
                    <button
                        class="w-full bg-indigo-700 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                        type="submit">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserLogin',
    data() {
        return {
            username: ''
        };
    },
    methods: {
        async login() {
            if (this.username) {
                const success = await this.$store.dispatch('login', this.username);
                if (success) {
                    this.$router.push('/chat');
                }
            }
        }
    }
};
</script>

<style scoped></style>