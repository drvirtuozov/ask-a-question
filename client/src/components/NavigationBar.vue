<template>
  <b-navbar
    toggleable="md"
    type="dark"
    variant="info">
    <b-navbar-toggle target="nav_collapse" />
    <b-navbar-brand href="#">Ask a Question</b-navbar-brand>
    <b-collapse
      is-nav
      id="nav_collapse">
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-form-input
            size="sm"
            class="mr-sm-2"
            type="text"
            placeholder="Search" />
          <b-button
            size="sm"
            class="my-2 my-sm-0"
            type="submit">Search</b-button>
        </b-nav-form>
        <b-nav-item-dropdown right>
          <template slot="button-content">{{ user }}</template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Signout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'NavigationBar',
  data() {
    return {
      user: 'test',
    };
  },
};
</script>
