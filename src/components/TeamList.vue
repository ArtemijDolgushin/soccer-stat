<template>
  <div class="flex justify-center p-4 bg-yellow-50">
    <label
        for="nameFilter"
        class="mr-4"
    >
      Поиск по названию</label><input
      id="nameFilter"
      v-model="nameFilter"
      class="border-2 border-blue-900 mr-4"
  >
    <label
        for="areaFilter"
        class="mr-4"
    >
      Поиск по стране</label><input
      id="areaFilter"
      v-model="areaFilter"
      class="border-2 border-blue-900 mr-4"
  >
  </div>


  <div
      v-if="dataLoading"
      class="loading-message"
  >
    Данные загружаются...
  </div>
  <div
      v-if="errorHappened"
      class="error-message"
  >
    Что-то пошло не так...
  </div>

  <div class="flex flex-wrap justify-center">
    <div
        v-for="team in filteredTeams"
        :key="team.id"
        class="card-available"
    >
      <h1 class="text-xl font-bold text-gray-700 mb-2">{{ team.name }}</h1>

      <div class="w-80 text-sm">
        <div>Страна: {{ team.area.name }}</div>
        <div>Адрес: {{ team.address }}</div>
        <div>Почта: {{ team.email }}</div>
        <div>Основана в {{ team.founded }} году</div>
        <div>Телефон: {{ team.phone }}</div>
        <div>Место сбора: {{ team.venue }}</div>
        <div>Сайт: {{ team.website }}</div>
      </div>


      <router-link
          :to="{ path: '/calendar/team', query: {teamID: team.id} }"
          class="link"
      >
        Матчи
      </router-link>
    </div>
  </div>
</template>

<script>
import {API} from "../API";

export default {
  name: "TeamList",
  data() {
    return {
      teams: [],
      nameFilter: '',
      areaFilter: '',
      dataLoading: false,
      errorHappened: false
    };
  },
  computed: {
    filteredTeams() {
      return this.teams.filter(team => team.name.match(this.getRegExpFromString(this.nameFilter)))
          .filter(team => team.area.name.match(this.getRegExpFromString(this.areaFilter)));
    }
  },
  watch: {
    nameFilter(newFilter) {
      this.$router.push({query: {name: newFilter, area: this.areaFilter}})
    },
    areaFilter(newFilter) {
      this.$router.push({query: {name: this.nameFilter, area: newFilter}})
    },
  },
  methods: {
    async getData() {
      try {
        this.dataLoading = true;
        const {teams: teams} = await API.getTeams();
        this.teams = teams;
        this.nameFilter = this.$route.query.name;
        this.areaFilter = this.$route.query.area;
      } catch (error) {
        this.errorHappened = true;
      } finally {
        this.dataLoading = false;
      }
    },
    getRegExpFromString(string) {
      return new RegExp(string, 'i');
    }
  },
  created() {
    this.getData();
  },
}
</script>

<style scoped>
.link {
  @apply border
  border-indigo-500
  text-indigo-500 rounded-md px-4 py-2 m-2 transition duration-500 text-center select-none hover:text-white hover:bg-indigo-600 focus:outline-none
}

.card-available {
  @apply m-5 p-3 bg-green-50  hover:bg-green-300 flex flex-col  space-x-6 rounded-lg shadow-md hover:scale-105 transition transform duration-500
}

.loading-message {
  @apply p-3 bg-green-50  hover:bg-green-300 flex flex-col items-center
  transition transform duration-500  rounded-lg shadow-md
}

.error-message {
  @apply p-3 bg-red-50  hover:bg-red-300 flex flex-col items-center
  transition transform duration-500 rounded-lg shadow-md
}
</style>
