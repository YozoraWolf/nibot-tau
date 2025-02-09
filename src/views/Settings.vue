<template>
    <div class="settings">
        <h1>Settings</h1>
        <ul class="bot-list">
            <li v-for="bot in bots" :key="bot.id" class="bot-item" @click="openModal(bot)">
                <img :src="bot.avatar || 'https://via.placeholder.com/50'" alt="Avatar" class="avatar" />
                {{ bot.name }}
                <q-btn flat icon="delete" @click.stop="confirmDelete(bot.id)" />
            </li>
        </ul>
        <button @click="openModal()">Create New Bot</button>
        <q-dialog v-model="isModalOpen">
            <q-card>
                <q-card-section>
                    <div class="text-h6">{{ selectedBot ? 'Edit Bot' : 'Create New Bot' }}</div>
                </q-card-section>
                <q-card-section>
                    <q-input v-model="botForm.name" label="Name" />
                    <q-input v-model="botForm.description" label="Description" />
                    <q-input v-model="botForm.system_prompt" label="System Prompt" />
                    <div class="cips">
                        <q-chip v-for="tag in botForm.tags" :key="tag" removable @remove="botForm.tags.splice(botForm.tags.indexOf(tag), 1)">
                            {{ tag }}
                        </q-chip>                    
                    </div>
                    <q-file v-model="fileInput" label="Avatar" />
                    <q-input v-model="botForm.note" label="Note" />
                </q-card-section>
                <q-card-actions>
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Save" @click="saveBot" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QDialog, QCard, QCardSection, QCardActions, QInput, QBtn, useQuasar } from 'quasar';
import { Bot } from '@/interfaces/Bot';

const $q = useQuasar();

const settings = ref({
    username: '',
    email: '',
    notifications: false
});

const bots = ref<Bot[]>([
    { id: '1', name: 'Bot 1', description: 'Description 1', system_prompt: '', tags: [], created_at: '', updated_at: '', avatar: '', note: '' },
    { id: '2', name: 'Bot 2', description: 'Description 2', system_prompt: '', tags: [], created_at: '', updated_at: '', avatar: '', note: '' }
]);

const isModalOpen = ref(false);
const selectedBot = ref<Bot | null>(null);
const botForm = ref<Partial<Bot>>({ name: '', description: '', system_prompt: '', tags: [], avatar: '', note: '' });
const fileInput = ref<File | null>(null);

const openModal = (bot: Bot | null = null) => {
    selectedBot.value = bot;
    botForm.value = bot ? { ...bot } : { name: '', description: '', system_prompt: '', tags: [], avatar: '', note: '' };
    isModalOpen.value = true;
};

const saveBot = () => {
    if (selectedBot.value) {
        // Update existing bot
        const index = bots.value.findIndex(bot => bot.id === selectedBot.value!.id);
        if (index !== -1) {
            bots.value[index] = { ...botForm.value, id: selectedBot.value.id } as Bot;
        }
    } else {
        // Create new bot
        const newBot: Bot = { ...botForm.value, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Bot;
        bots.value.push(newBot);
    }
    isModalOpen.value = false;
    console.log('Bot saved:', botForm.value);

    const file = fileInput.value;
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            botForm.value.avatar = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
};

const confirmDelete = (botId: string) => {
    console.log('Delete bot:', botId);
    $q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to delete this bot?',
        ok: {
            label: 'Yes',
            color: 'negative'
        },
        cancel: {
            label: 'No',
            color: 'primary'
        },
        persistent: true
    }).onOk(() => {
        deleteBot(botId);
    });
};

const deleteBot = (botId: string) => {
    bots.value = bots.value.filter(bot => bot.id !== botId);
    console.log('Bot deleted:', botId);
};
</script>

<style scoped lang="scss">
@use 'sass:color';

.bot-list {
    list-style: none;
    padding: 0;
}

.bot-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    cursor: pointer;
}

.bot-item:hover {
    background-color: color.adjust($dark, $lightness: 10%);
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}
</style>