<template>
    <!--dialog-error-auth-window-->
    <v-dialog v-model="modelFct" max-width=500  persistent dark transition="dialog-top-transition" >
        <v-card>
            <v-container class="d-flex flex-column align-center">

                <v-row class="text-center" no-gutters>
                    <v-card-title class="white--text">{{ title }} &#x2757;</v-card-title>
                </v-row>
                <v-row class="text-center" no-gutters>
                    <v-card-text class="red--text" >{{ text }}</v-card-text>
                </v-row>
                <slot></slot>
                <slot name="bottom"></slot>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "errordial",
    props: {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        model: {
            type: Boolean,
            required: true,
        },
   },
    data() {
        return {
            dialog: false,
        };
    },
    computed: {
        modelFct: { 
            get() { 
                return  this.model;
            }, 
            set() {} 
        }
    },
    methods: {
    }
}
</script>
