<script setup>
const items = [
  {
    icon: 'notifications',
    text: 'LoL通知設定',
    link: '/settings/lol'
  },
  {
    icon: 'task_alt',
    text: 'リマインダー',
    link: '/settings/reminder'
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
        link
        :to="item.link"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
</template>