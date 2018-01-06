<template>
  <b-list-group>
    <b-list-group-item
      v-for="comment in comments"
      :key="comment.id">
      <router-link :to="comment.user.username">{{ comment.user.username }}</router-link>
      {{ comment.text }}
    </b-list-group-item>
  </b-list-group>
</template>

<script>
export default {
  name: 'Comments',
  props: {
    comments: {
      type: Array,
      required: true,
    },
  },
};
</script>

