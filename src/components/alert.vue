<template>
    <v-dialog
    hide-overlay
    v-model='alert' 
    :max-width='maxWidth'
    :transition='transition'
    @click:outside='clickOut'
    >
        <v-alert 
        :type='type' 
        :max-width='maxWidth'
        class="mx-auto ma-0"
        style="text-align: center;"
        >{{ text }}</v-alert>
    </v-dialog>
</template>

<script>
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
