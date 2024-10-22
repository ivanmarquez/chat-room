<template>
    <div class="mt-auto">
        <a href="#" class="flex items-center text-white hover:text-indigo-200  text-xl" @click="logout">
            <span class="material-icons mr-3">settings</span>
            Log out
        </a>
    </div>
</template>

<script>

export default {
    name: 'LogoutButton',
    methods: {
        async logout() {
            try {
                this.$store.dispatch('logout');
                this.$emit('user-logged-out');
                this.$router.push('/');
            } catch (error) {
                console.error('Error logging out:', error);
            }
        }
    },
    props: {
    }
};
</script>

<style scoped>
button {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
}

button:hover {
    background-color: #ff1a1a;
}
</style>