<template>
  <label for="nameFilterText">Название соревнования</label><input
    id="nameFilterText"
    v-model="nameFilter"
>

  <label for="nameFilterSelection">Выбрать соревнование</label>
  <select
      id="nameFilterSelection"
      v-model="nameFilter"
  >
    <option
        v-if="competitions.length === 0"
        disabled
        value=""
    >Данные загружаются...
    </option>
    <option
        v-for="competition in filteredCompetitions"
        :key="competition.name"
        :value="competition.name"
    >
      {{ competition.name }}
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
  <div v-if="error">Произошла ошибка: {{error}}</div>
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
    <router-link :to="{ path: '/competitions', query: {name: competitionName}}">{{ competitionName }}
    </router-link>

    <span>Дата: </span>
    <span>{{ match.utcDate.substr(0, 10) }}</span>
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
      error: null
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
        const {matches} = await API.getMatchesOfCompetition(
            this.$route.query.competitionID, this.$route.query.dateFrom, this.$route.query.dateTo
        );
        this.matches = matches;
      } catch (error) {
        this.error = error;
      } finally {
        this.dataLoading = false;
      }
    },
    async getCompetitions() {
      try {
        this.dataLoading = true;
        const {competitions} = await API.getCompetitions();
        this.competitions = competitions.filter(
            competition => this.tiers.includes(competition.plan)
        );
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
    this.getCompetitions();
  },
}
</script>

<style scoped>

</style>
