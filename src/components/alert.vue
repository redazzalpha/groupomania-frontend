<template>
    <v-dialog
    :value='watcher' 
    hide-overlay
    :dark='darkMode'
    :max-width='maxWidth'
    :transition='transition'                                                          
    @click:outside='clickOut'
    >
        <v-alert
        :color="darkMode? '' :  color"
        :dark='darkMode'          
        :max-width='maxWidth'
        class="mx-auto ma-0 white--text"
        style="text-align: center;"
        >
            <template v-slot:prepend>
                <v-icon color='white'>{{ icon }}</v-icon>
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
        watcher: Boolean,
        icon: {
            type: String,
            default: 'mdi-check-circle'
        },
        color:{
            type: String,
            default: 'green',
        },
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
            isActive: true,
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
}
</script>
