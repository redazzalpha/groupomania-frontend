<template>
    <v-dialog :value="model" persistent width="300">
        <v-card  :color='darkMode? "" : "primary"' :dark='darkMode'>
            <v-card-text class="white--text">
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
import { mapState } from 'vuex';
export default {
    name: "progressBar",
    props: {
        model: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...mapState([
            "darkMode",
        ]),
    },
}
</script>