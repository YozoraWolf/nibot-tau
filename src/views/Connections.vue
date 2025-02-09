<template>
    <div class="facebook-connection">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="8">
                    <v-card>
                        <v-card-title>
                            <v-icon large class="mr-3">mdi-facebook</v-icon>
                            Connect to Facebook
                        </v-card-title>
                        <v-card-text>
                            <v-btn color="primary" @click="connectToFacebook">
                                <v-icon left>mdi-link</v-icon>
                                Connect
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const connectToFacebook = () => {
    // Logic to connect to Facebook
    console.log('Connecting to Facebook...');
    // Redirect or perform other actions after connection
    router.push('/dashboard');
};
</script>

<style scoped>
.facebook-connection {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>