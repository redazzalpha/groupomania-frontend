<template>
    <v-row>
        <v-card-actions>
            <v-btn tag="button" @click="eventAtClick">{{ text }}</v-btn>
        </v-card-actions>
    </v-row>
</template>

<script>
export default {
    name: "btnClose",
    props: {
        text: {
            type: String,
            required: true,
        },
        eventAtClick: Function,
    },
}
</script>
