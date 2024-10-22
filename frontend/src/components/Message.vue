<template>
    <div class="message" :class="{ 'sent': isSent, 'received': !isSent }">
        <div class="message-content">
            <p>{{ content }}</p>
            <span class="timestamp">{{ timestamp }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: String,
        timestamp: String,
        isSent: Boolean
    }
};
</script>

<style scoped>
.sent {
    background-color: #e1ffc7;
}

.received {
    background-color: #ffffff;
}

.message {
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
}

.timestamp {
    font-size: 0.8em;
    color: #888;
}
</style>