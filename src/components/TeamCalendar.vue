<template>
  <label for="nameFilterText">Название команды</label><input
    id="nameFilterText"
    v-model="nameFilter"
>

  <label for="nameFilterSelection">Выбрать команду</label>
  <select
      id="nameFilterSelection"
      v-model="nameFilter"
  >
    <option
        v-if="teams.length === 0"
        disabled
        value=""
    >Данные загружаются...
    </option>
    <option
        v-for="team in filteredTeams"
        :key="team.name"
        :value="team.name"
    >
      {{ team.name }}
    </option>
  </select>

  <label for="dateFromFilter">Выбрать матчи с </label><input
    id="dateFromFilter"
    v-model="dateFromFilter"
    type="date"
>
  <label for="dateToFilter"> по </label><input
    id="dateToFilter"
    v-model="dateToFilter"
    type="date"
>

  <button
      v-if="nameFilterIsValid"
      @click="getData"
  >Найти матчи
  </button>

  <div v-if="dataLoading">Данные загружаются...</div>
  <div v-if="error">Произошла ошибка: {{ error }}</div>
  <div
      v-for="match in matches"
      :key="match.id"
      class="m-5"
  >
    <div>
      <router-link :to="{ path: '/teams', query: {name: match.homeTeam.name}}">{{ match.homeTeam.name }}
      </router-link>
      <div>vs</div>
      <router-link :to="{ path: '/teams', query: {name: match.awayTeam.name}}">{{ match.awayTeam.name }}
      </router-link>
    </div>

    <div v-if="match.score.winner">
      <span>Результат: </span>
      <router-link
          v-if="match.score.winner === 'HOME_TEAM'"
          :to="{ path: '/teams', query: {name: match.homeTeam.name}}"
      >Победила команда {{ match.homeTeam.name }}
      </router-link>
      <router-link
          v-if="match.score.winner === 'AWAY_TEAM'"
          :to="{ path: '/teams', query: {name: match.awayTeam.name}}"
      >Победила команда {{ match.awayTeam.name }}
      </router-link>
      <span v-if="match.score.winner === 'DRAW'">Ничья</span>
    </div>

    <span>Соревнование: </span>
    <router-link :to="{ path: '/competitions', query: {name: match.competition.name}}">{{ match.competition.name }}
    </router-link>

    <span>Дата: </span>
    <span>{{ match.utcDate.substr(0, 10) }}</span>
  </div>
</template>

<script>
import {API} from "../API";

export default {
  name: "TeamCalendar",
  data() {
    return {
      teams: [],
      matches: [],
      nameFilter: '',
      dateFromFilter: '',
      dateToFilter: '',
      dataLoading: false,
      error: null
    };
  },
  computed: {
    filteredTeams() {
      return this.teams.filter(
          selector => selector.name.match(
              this.getRegExpFromString(this.nameFilter)
          )
      );
    },
    nameFilterIsValid() {
      return this.teams.some(
          competition => competition.name === this.nameFilter
      );
    },
    teamID() {
      return this.teams.find(
          team => team.name === this.nameFilter
      ).id;
    }
  },
  methods: {
    getData() {
      this.$router.push({
        query: {
          teamID: this.teamID,
          dateFrom: this.dateFromFilter,
          dateTo: this.dateToFilter
        }
      })
      this.getDataFromSearch();
    },
    async getDataFromSearch() {
      try {
        this.dataLoading = true;
        const {matches} = await API.getMatchesOfTeam(
            this.teamID, this.dateFromFilter, this.dateToFilter
        );
        this.matches = matches;
      } catch (error) {
        this.error = error;
      } finally {
        this.dataLoading = false;
      }
    },
    async getDataFromUrl() {
      try {
        this.dataLoading = true;
        const {matches} = await API.getMatchesOfTeam(
            this.$route.query.teamID, this.$route.query.dateFrom, this.$route.query.dateTo
        );
        this.matches = matches;
      } catch (error) {
        this.error = error;
      } finally {
        this.dataLoading = false;
      }
    },
    async getTeams() {
      try {
        this.dataLoading = true;
        const {teams} = await API.getTeams();
        this.teams = teams;
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
    if (Object.keys(this.$route.query).length) this.getDataFromUrl();
    this.getTeams();
  },
}
</script>

<style scoped>

</style>
