<template>
  <div>
    <router-link to="/competitions">Соревнования</router-link>
    <router-link to="/teams">Команды</router-link>
    <router-link to="/calendar/competition">Календарь соревнования</router-link>
    <router-link to="/calendar/team">Календарь команды</router-link>
  </div>
  <router-view/>
</template>

<script>
export default {
  name: "SelectionPage"
}
</script>

<style scoped>

</style>
