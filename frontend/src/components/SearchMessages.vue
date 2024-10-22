<template>
    <div class="search-messages text-gray-900 mb-5 relative">
        <div class="relative">
            <input type="text" v-model="query" @input="searchMessages" 
                   placeholder="Search messages..."
                   class="p-2 w-full rounded-lg pr-10" />

            <button v-if="query" @click="clearQuery" 
                    class="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 mr-2">
                    <span class="material-icons">close</span>
            </button>
        </div>

        <div ref="searchMessagesResult" v-if="results.length" class="mt-1 rounded-lg p-2 bg-white absolute w-full z-50 shadow-lg">
            <ul>
                <li v-for="message in results" :key="message.id" class="p-2 cursor-pointer border-b hover:bg-slate-300"
                    @click="selectMessage(message)">
                    <strong>{{ message.sender.username }}:</strong> {{ message.text }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        sender: {
            type: Object,
            required: true,
        },
        recipient: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            query: '',
        };
    },
    computed: {
        results() {
            return this.$store.state.searchMessagesResults ?? [];
        },
    },
    methods: {
        searchMessages() {
            if (this.recipient || this.sender) {
                this.$store.dispatch('searchMessages', {
                    query: this.query,
                    sender: this.sender
                });
            }
        },
        clearQuery() {
            this.query = '';
            this.$store.commit('resetSearchMessagesResults');
        },
        selectMessage(message) {
            this.$emit('messageSelected', message);
        },
    },
};
</script>

<style scoped>

</style>