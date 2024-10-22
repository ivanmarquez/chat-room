<template>
    <router-view />
</template>

<script>


export default {
    name: 'App',
    created() {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
    },
    beforeUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    },
    methods: {
        handleBeforeUnload() {
            this.$store.dispatch('logout');
        }
    }
};
</script>

<style>
/* Add your global styles here */
</style>