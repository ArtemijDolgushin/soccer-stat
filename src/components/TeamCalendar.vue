<template>
  <div class="flex justify-center p-4 bg-gray-50">
    <label
        for="nameFilterText"
        class="mr-4"
    >
      Название команды</label><input
      id="nameFilterText"
      v-model="nameFilter"
      class="border-2 border-blue-900 mr-4"
  >

    <label
        for="nameFilterSelection"
        class="mr-4"
    >
      Выбрать команду</label>
    <select
        id="nameFilterSelection"
        v-model="nameFilter"
        class="border-2 border-blue-900 mr-4"
    >
      <option
          v-if="teams.length === 0"
          disabled
          value=""
      >
        Данные загружаются...
      </option>
      <option
          v-for="team in filteredTeams"
          :key="team.name"
          :value="team.name"
      >
        {{ team.name }}
      </option>
    </select>

    <label
        for="dateFromFilter"
        class="mr-4"
    >
      Выбрать матчи с </label><input
      id="dateFromFilter"
      v-model="dateFromFilter"
      type="date"
      class="border-2 border-blue-900 mr-4"
  >
    <label
        for="dateToFilter"
        class="mr-4"
    >
      по </label><input
      id="dateToFilter"
      v-model="dateToFilter"
      type="date"
      class="border-2 border-blue-900 mr-4"
  >

    <button
        v-if="nameFilterIsValid"
        class="button"
        @click="getData"
    >
      Найти матчи
    </button>
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
  <div
      v-if="matchesNotFound"
      class="matches-not-found-message"
  >
    Матчей по заданным параметрам не найдено
  </div>

  <div class="flex flex-wrap justify-center">
    <div
        v-for="match in matches"
        :key="match.id"
        class="card"
    >
      <div class="mb-6">
        <router-link
            :to="{ path: '/teams', query: {name: match.homeTeam.name}}"
            class="link"
        >
          {{ match.homeTeam.name }}
        </router-link>
        vs
        <router-link
            :to="{ path: '/teams', query: {name: match.awayTeam.name}}"
            class="link"
        >
          {{ match.awayTeam.name }}
        </router-link>
      </div>

      <div
          v-if="match.score.winner"
          class="mb-6"
      >
        <span>Результат: </span>
        <span v-if="match.score.winner !== 'DRAW'"> Победила команда </span>
        <router-link
            v-if="match.score.winner === 'HOME_TEAM'"
            :to="{ path: '/teams', query: {name: match.homeTeam.name}}"
            class="link"
        >
          {{ match.homeTeam.name }}
        </router-link>
        <router-link
            v-if="match.score.winner === 'AWAY_TEAM'"
            :to="{ path: '/teams', query: {name: match.awayTeam.name}}"
            class="link"
        >
          {{ match.awayTeam.name }}
        </router-link>
        <span v-if="match.score.winner === 'DRAW'">Ничья</span>
      </div>

      <div class="mb-6">Соревнование:
        <router-link
            :to="{ path: '/competitions', query: {name: match.competition.name}}"
            class="link"
        >
          {{ match.competition.name }}
        </router-link>
      </div>


      <div>Дата: {{ match.utcDate.substr(0, 10) }}</div>

    </div>
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
      errorHappened: false,
      matchesNotFound: false
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
        this.errorHappened = false;
        this.dataLoading = true;
        const {matches} = await API.getMatchesOfTeam(
            this.teamID, this.dateFromFilter, this.dateToFilter
        );
        if (matches.length === 0) this.matchesNotFound = true;
        this.matches = matches;
      } catch (error) {
        this.errorHappened = true;
      } finally {
        this.dataLoading = false;
      }
    },
    async getDataFromUrl() {
      try {
        this.errorHappened = false;
        this.dataLoading = true;
        const {matches} = await API.getMatchesOfTeam(
            this.$route.query.teamID, this.$route.query.dateFrom, this.$route.query.dateTo
        );
        if (matches.length === 0) this.matchesNotFound = true;
        this.matches = matches;
      } catch (error) {
        this.errorHappened = true;
      } finally {
        this.dataLoading = false;
      }
    },
    async getTeams() {
      try {
        this.errorHappened = false;
        const {teams} = await API.getTeams();
        this.teams = teams;
      } catch (error) {
        this.errorHappened = true;
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
.link {
  @apply border
  border-indigo-500
  text-indigo-500 rounded-md px-4 py-2 m-2 transition duration-500 text-center select-none hover:text-white hover:bg-indigo-600 focus:outline-none
}

.button {
  @apply border
  border-green-500
  text-green-500 rounded-md px-2 py-1 m-2 transition duration-500 text-center select-none hover:text-white hover:bg-green-600 focus:outline-none
}

.card {
  @apply m-5 p-3 border-2 border-blue-900  text-center flex flex-col  space-x-6 rounded-lg shadow-md hover:scale-105 transition transform duration-500
}

.loading-message {
  @apply p-3   hover:bg-green-300 flex flex-col items-center
  transition transform duration-500  rounded-lg shadow-md
}

.error-message {
  @apply p-3   hover:bg-red-300 flex flex-col items-center
  transition transform duration-500 rounded-lg shadow-md
}

.matches-not-found-message {
  @apply p-3   hover:bg-yellow-300 flex flex-col items-center
  transition transform duration-500 rounded-lg shadow-md
}
</style>
