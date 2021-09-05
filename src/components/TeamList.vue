<template>
  <label for="nameFilter">Поиск по названию</label><input
    id="nameFilter"
    v-model="nameFilter"
>
  <label for="areaFilter">Поиск по стране</label><input
    id="areaFilter"
    v-model="areaFilter"
>

  <div v-if="dataLoading">Данные загружаются...</div>
  <div v-if="error">Произошла ошибка: {{ error }}</div>
  <div class="flex flex-wrap">
    <div
        v-for="team in filteredTeams"
        :key="team.id"
        class="m-5 border-2 rounded-l-xl"
    >
      <div>{{ team.name }}</div>

      <div>Страна: {{ team.area.name }}</div>

      <div>Адрес: {{ team.address }}</div>
      <div>Почта: {{ team.email }}</div>
      <div>Основана в {{ team.founded }} году</div>
      <div>Телефон: {{ team.phone }}</div>
      <div>Место сбора: {{ team.venue }}</div>
      <div>Сайт: {{ team.website }}</div>
      <router-link :to="{ path: '/calendar/team', query: {teamID: team.id} }">Матчи
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
      error: null
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
        this.error = error;
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

</style>
