<template>
    <v-dialog v-model="model"  persistent width="300">
        <v-card color="primary" dark>
            <v-card-text>
                Veuillez patienter...
                <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
                ></v-progress-linear>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "progressBar",
    props: {
        model: Boolean,
    },
}
</script>