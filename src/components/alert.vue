<template>
    <v-dialog
    v-model='alert' 
    hide-overlay
    :dark='darkMode'
    :max-width='maxWidth'
    :transition='transition'                                                                                
    @click:outside='clickOut'
    >
        <v-alert
        :max-width='maxWidth'
        class="mx-auto ma-0 white-text"
        style="text-align: center;"
        >
            <template v-slot:prepend>
                <v-icon>mdi-check-circle</v-icon>
            </template>        
            {{ text }}
        </v-alert>
    </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'alert',
    props: {
        text: String,
        type: String,
        watcher: Boolean,
        maxWidth:{
            type: Number,
            default: 550,
        },
        transition: {
            type: String,
            default: 'dialog-transition'
        }
    },
    data() {
        return {
            alert: false,
        };
    },
    computed: {
        ...mapState([
            "darkMode",
        ]),
    },
    methods: {
        clickOut() {
            this.$emit('clickOut');
        },
    },
    watch: {
        watcher(v) {
            this.alert = v;
        },
    }
}
</script>
