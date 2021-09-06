<template>
  <div class="flex justify-around bg-green-100 p-4">
    <router-link
        to="/competitions"
        class="link"
    >
      Соревнования
    </router-link>
    <router-link
        to="/teams"
        class="link"
    >
      Команды
    </router-link>
    <router-link
        to="/calendar/competition"
        class="link"
    >
      Календарь соревнования
    </router-link>
    <router-link
        to="/calendar/team"
        class="link"
    >
      Календарь команды
    </router-link>
  </div>
  <router-view/>
</template>

<script>
export default {
  name: "SelectionPage"
}
</script>

<style scoped>
.link {
  @apply border
  border-indigo-500
  text-indigo-500 rounded-md px-4 py-2 m-2 transition duration-500  select-none hover:text-white hover:bg-indigo-600 focus:outline-none
}
</style>
