<script setup>
const items = [
  {
    icon: 'mdi-account',
    text: 'Social',
  },
  {
    icon: 'mdi-alert-octagon',
    text: 'Spam',
  },
  {
    icon: 'mdi-lock',
    text: 'Inappropriate',
  },
]
</script>
<template>
    <v-list>
      <v-list-subheader>設定</v-list-subheader>

      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        rounded="xl"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title v-text="item.text" link href="#"></v-list-item-title>
      </v-list-item>
    </v-list>
</template>