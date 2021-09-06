<template>
  <div class="card">
    Добро пожаловать на сайт SoccerStat! Здесь вы сможете узнать передовую статистику ведущих европейских турниров по
    футболу. Выберите нужную информацию из списка.
  </div>
</template>

<script>
export default {
  name: "HomePage"
}
</script>

<style scoped>
.card {
  @apply m-5 p-3 border-2 border-blue-900  flex flex-col  space-x-6 rounded-lg shadow-md
}
</style>
