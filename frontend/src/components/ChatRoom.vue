<template>
    <div class="flex h-screen overflow-hidden">
        <div class="w-1/4 bg-indigo-700 text-white flex flex-col p-4">
            <header class="p-4 flex justify-between items-center bg-indigo-700 text-white">
                <h1 class="text-2xl font-semibold">Chat Room</h1>
            </header>

            <SearchMessages :sender="currentUser" :recipient="selectedUser"
                @messageSelected="handleMessageSelected" />
            <ConnectedUsers @userSelected="selectUser" />
            <LogoutButton @user-logged-out="handleUserLoggedOut" />
        </div>

        <ChatInterface v-if="selectedUser" @closeChat="handleCloseChat" ref="chatInterface" />
    </div>
</template>

<script>
import ConnectedUsers from './ConnectedUsers.vue';
import LogoutButton from './LogoutButton.vue';
import ChatInterface from './ChatInterface.vue';
import SearchMessages from './SearchMessages.vue';

export default {
    name: 'ChatRoom',
    components: {
        ConnectedUsers,
        LogoutButton,
        ChatInterface,
        SearchMessages
    },
    computed: {
        selectedUser() {
            return this.$store.state.selectedUser;
        },
        currentUser() {
            return {
                id: this.$store.state.user.id,
                username: this.$store.state.username,
            };
        },
    },
    methods: {
        async handleUserLoggedOut() {

        },
        async selectUser(user) {
            await this.$store.dispatch('selectUser', user);
        },
        async handleMessageSelected(message) {
            if(message.sender.id === this.currentUser.id) {
                await this.selectUser(message.recipient);
            } else {
                await this.selectUser(message.sender);
            }

            this.$nextTick(() => {
                this.$refs.chatInterface.scrollToMessage(message.id);
            });
        },
        handleCloseChat() {
            this.$store.commit('setSelectedUser', null);
        }
    }
};
</script>

<style scoped>
.chat-room {
    display: flex;
    height: 100vh;
}

.sidebar {
    width: 20%;
    background-color: #f4f4f4;
    padding: 10px;
}

.chat-area {
    width: 80%;
    padding: 10px;
}
</style>