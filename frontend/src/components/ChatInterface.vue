<template>
    <div class="flex-1" v-if="selectedUser">
        <!-- Chat Header -->
        <header ref="header" class="relative bg-white p-4 text-gray-700">
            <h1 class="text-2xl font-semibold">
                Chatting with {{ selectedUser.username }}
            </h1>
            <button @click="closeChat" 
            class="absolute right-0 top-1/2 transform -translate-y-1/2 text-indigo-700 hover:text-gray-700 mr-2">
                    <span class="material-icons">cancel</span>
            </button>
        </header>

        <!-- Chat Messages -->
        <div id="chat-messages" ref="messagesContainer" class="h-screen overflow-y-auto p-4 pb-36">


            <div v-for="message in filteredMessages" :key="message.id" :ref="message.id" class="message">

                <div v-if="message.sender.id === selectedUser.id" class="flex mb-4">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                        <i class="material-icons icon-size text-gray-800 mt-3">person_pin</i>
                    </div>
                    <div class="flex flex-col">
                        <div class="flex flex-col max-w-96 bg-white rounded-lg p-3 gap-3">
                            <p class="text-gray-800">
                                <strong>{{ message.sender.username }}:</strong> {{ message.text }}

                                <template v-if="message.fileUrl">
                                    <template v-if="isImage(message.fileUrl)">
                                        <img :src="message.fileUrl" alt="Image" class="max-w-full h-auto mt-2">
                                    </template>
                                    <template v-else>
                                        <a :href="message.fileUrl" target="_blank" class="flex items-center mt-2">
                                            <i class="material-icons">file_download</i> Download File
                                        </a>
                                    </template>
                                </template>
                            </p>
                        </div>

                        <div class="text-xs text-left mt-1 text-gray-500">{{ formatTimestamp(message.timestamp) }}</div>
                    </div>
                </div>

                <div v-else class="flex justify-end mb-4">
                    <div class="flex flex-col">
                        <div class="flex max-w-96 bg-indigo-700 text-white rounded-lg p-3 gap-3">
                            <p>
                                <strong>{{ message.sender.username }}:</strong> {{ message.text }}

                                <template v-if="message.fileUrl">
                                    <template v-if="isImage(message.fileUrl)">
                                        <img :src="message.fileUrl" alt="Image" class="max-w-full h-auto mt-2">
                                    </template>
                                    <template v-else>
                                        <a :href="message.fileUrl" target="_blank" class="flex items-center mt-2">
                                            <i class="material-icons">file_download</i> Download File
                                        </a>
                                    </template>
                                </template>
                            </p>

                        </div>

                        <div class="text-xs text-right mt-1 text-gray-500">{{ formatTimestamp(message.timestamp) }}
                        </div>
                    </div>


                    <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                        <i class="material-icons icon-size text-indigo-700 mt-3">person_pin</i>
                    </div>
                </div>

            </div>
        </div>

        <!-- Chat Input -->
        <footer class="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-3/4">
            <div class="flex items-center">
                <input type="text" id="messageInput" v-model="newMessage" placeholder="Type a message..."
                    class="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
                    @keydown.enter="sendMessage">
                <input class="bg-indigo-700 text-white cursor-pointer px-4 py-2 rounded-md ml-2" id="sendButton"
                    type="button" @click="sendMessage" value="Send" />

                <label for="uploadFileButton"
                    class="flex bg-indigo-700 hover:bg-indigo-500 text-white px-4 py-2 ml-2 outline-none rounded-md w-max cursor-pointer mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 fill-white inline" viewBox="0 0 32 32">
                        <path
                            d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                            data-original="#000000"></path>
                        <path
                            d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                            data-original="#000000"></path>
                    </svg>
                    <input type="file" id="uploadFileButton" class="hidden" @change="handleFileUpload">
                </label>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'ChatInterface',
    props: {
        searchQuery: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            newMessage: ''
        };
    },
    computed: {
        selectedUser() {
            return this.$store.state.selectedUser;
        },
        messages() {
            return this.$store.state.messages;
        },
        filteredMessages() {
            return this.messages
                .filter(
                    message =>
                        (message.sender.id === this.$store.state.user.id && message.recipient.id === this.selectedUser.id) ||
                        (message.sender.id === this.selectedUser.id && message.recipient.id === this.$store.state.user.id)
                )
                .filter(
                    message =>
                        message.text.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        message.sender.username.toLowerCase().includes(this.searchQuery.toLowerCase())
                )
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sort messages by timestamp
        }
    },
    methods: {
        sendMessage() {
            if (this.newMessage.trim() !== '') {
                this.$store.dispatch('sendMessage', {
                    text: this.newMessage,
                    recipient: this.selectedUser
                });
                this.newMessage = '';
            }
        },
        closeChat() {
            this.$emit('closeChat');
        },
        async handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            await this.$store.dispatch('uploadFile', {
                file,
                recipient: this.selectedUser
            });
        },
        isImage(fileUrl) {
            if (!fileUrl) return false;

            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
            const extension = fileUrl.split('.').pop().toLowerCase();
            return imageExtensions.includes(extension);
        },
        formatTimestamp(timestamp) {
            const date = new Date(timestamp);
            const today = new Date();

            const isToday = date.toDateString() === today.toDateString();

            if (isToday) {
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else {
                return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.messagesContainer;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            });
        },
        scrollToMessage(messageId) {
            this.$nextTick(() => {
                const messageElement = this.$refs[messageId];
                const messagesContainer = this.$refs.messagesContainer;
                const headerElement = this.$refs.header; // Reference to the header element

                if (messageElement && messageElement[0] && messagesContainer) {
                    const messagePosition = messageElement[0].offsetTop;
                    const headerHeight = headerElement ? headerElement.offsetHeight : 0;

                    messagesContainer.scrollTo({
                        top: messagePosition - headerHeight,
                        behavior: 'smooth'
                    });

                    // Add flash class
                    messageElement[0].classList.add('flash');

                    // Remove flash class after 1 second
                    setTimeout(() => {
                        messageElement[0].classList.remove('flash');
                    }, 2000);
                }
            });
        }
    },
    watch: {
        filteredMessages() {
            this.scrollToBottom();
        }
    },
    mounted() {
        this.scrollToBottom();
    },
    updated() {
        this.scrollToBottom();
    }
};
</script>

<style scoped>
.icon-size {
    font-size: 2.5rem !important;
}

.flash {
    animation: flash 2s ease-in-out;
}

@keyframes flash {
    0% {
        background-color: #312e81;
    }

    100% {
        background-color: transparent;
    }
}
</style>
