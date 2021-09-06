<template>
  <div class="flex justify-center p-4 bg-yellow-50">
    <label
        for="nameFilterText"
        class="mr-4"
    >
      Название соревнования</label><input
      id="nameFilterText"
      v-model="nameFilter"
      class="border-2 border-blue-900 mr-4"
  >

    <label
        for="nameFilterSelection"
        class="mr-4"
    >
      Выбрать соревнование</label>
    <select
        id="nameFilterSelection"
        v-model="nameFilter"
        class="border-2 border-blue-900 mr-4"
    >
      <option
          v-if="competitions.length === 0"
          disabled
          value=""
      >
        Данные загружаются...
      </option>
      <option
          v-for="competition in filteredCompetitions"
          :key="competition.name"
          :value="competition.name"
      >
        {{ competition.name }}
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
        class="card-available"
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
        Победила команда
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
            :to="{ path: '/competitions', query: {name: competitionName}}"
            class="link"
        >
          {{ competitionName }}
        </router-link>
      </div>

      <div>Дата: {{ match.utcDate.substr(0, 10) }}</div>
    </div>
  </div>


</template>

<script>
import {API} from "../API";

export default {
  name: "CompetitionCalendar",
  data() {
    return {
      competitions: [],
      matches: [],
      tiers: process.env.VUE_APP_API_AVAILABLE_TIERS.split(' '),
      nameFilter: '',
      dateFromFilter: '',
      dateToFilter: '',
      dataLoading: false,
      errorHappened: false,
      matchesNotFound: false
    };
  },
  computed: {
    filteredCompetitions() {
      return this.competitions.filter(
          competition => competition.name.match(
              this.getRegExpFromString(this.nameFilter)
          )
      );
    },
    nameFilterIsValid() {
      return this.competitions.some(
          competition => competition.name === this.nameFilter
      );
    },
    competitionID() {
      return this.competitions.find(
          competition => competition.name === this.nameFilter
      ).id;
    },
    competitionName() {
      return this.competitions.find(
          competition => competition.id === +this.$route.query.competitionID
      )?.name;
    }
  },
  methods: {
    getData() {
      this.$router.push({
        query: {
          competitionID: this.competitionID,
          dateFrom: this.dateFromFilter,
          dateTo: this.dateToFilter
        }
      })
      this.getDataFromSearch();
    },
    async getDataFromSearch() {
      try {
        this.dataLoading = true;
        const {matches} = await API.getMatchesOfCompetition(
            this.competitionID, this.dateFromFilter, this.dateToFilter
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
        this.dataLoading = true;
        const {matches} = await API.getMatchesOfCompetition(
            this.$route.query.competitionID, this.$route.query.dateFrom, this.$route.query.dateTo
        );
        if (matches.length === 0) this.matchesNotFound = true;
        this.matches = matches;
      } catch (error) {
        this.errorHappened = true;
      } finally {
        this.dataLoading = false;
      }
    },
    async getCompetitions() {
      try {
        const {competitions} = await API.getCompetitions();
        this.competitions = competitions.filter(
            competition => this.tiers.includes(competition.plan)
        );
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
    this.getCompetitions();
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

.matches-not-found-message {
  @apply p-3 bg-yellow-50  hover:bg-yellow-300 flex flex-col items-center
  transition transform duration-500 rounded-lg shadow-md
}
</style>
