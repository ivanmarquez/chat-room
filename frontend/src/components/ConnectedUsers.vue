<template>
    <div>
        <div v-for="user in filteredUsers" :key="user.id" @click="selectUser(user)" :class="[
            'flex items-center mb-4 cursor-pointer hover:bg-indigo-900 p-2 rounded-lg',
            (user.id === activeUser?.id) ? 'bg-indigo-900' : ''
        ]">
            <div class="relative flex items-center justify-center w-12 h-12 bg-white rounded-full mr-3">
                <i class="material-icons icon-size text-indigo-700">person_pin</i>
                <span v-if=" isSendingMessages(user)" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-100 opacity-75"></span>
            </div>
            <div class="flex-1">
                <h2 class="text-white text-lg font-semibold">{{ user.username }}</h2>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'ConnectedUsers',
    computed: {
        users() {
            return this.$store.state.connectedUsers;
        },
        filteredUsers() {
            return this.users.filter(user => user.id !== this.$store.state.user.id);
        },
        activeUser() {
            return this.$store.state.selectedUser ? this.$store.state.selectedUser : null;
        },
        sendingUsers() {
            return this.$store.state.sendingUsers; // Assuming you have this state in your store
        }
    },
    methods: {
        selectUser(user) {
            this.$emit('userSelected', user);
        },
        isSendingMessages(user) {
            return this.sendingUsers.includes(user.id); // Check if the user is sending messages
        }
    },
    created() {
        //this.$store.dispatch('fetchConnectedUsers');
    }
};
</script>

<style scoped>
.icon-size{
    font-size: 2rem;
}
.sending-messages {
    border: 2px solid red; /* Example style */
}
</style>