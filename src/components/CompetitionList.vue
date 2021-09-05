<template>
  <label for="nameFilter">Поиск по названию</label><input id="nameFilter" v-model="nameFilter">
  <label for="areaFilter">Поиск по стране</label><input id="areaFilter" v-model="areaFilter">
  <div class="mb-20">
    <div class="m-5" v-for="competition in filteredAvailableCompetitions" :key="competition.id">
      <div>{{ competition.name }}</div>

      <span>Страна: </span>
      <span>{{ competition.area.name }}</span>

      <span>Текущий сезон: c </span>
      <span>{{ competition.currentSeason.startDate }}</span>
      <span> по </span>
      <span>{{ competition.currentSeason.endDate }}</span>

      <router-link :to="{ path: '/calendar/competition', query: {competitionID: competition.id}}">Матчи
      </router-link>
    </div>
  </div>
  <div>
    <div class="m-5" v-for="competition in filteredUnavailableCompetitions" :key="competition.id">
      <div>{{ competition.name }}</div>

      <span>Страна: </span>
      <span>{{ competition.area.name }}</span>

      <div>Информация о матчах недоступна на текущем тарифе
      </div>
    </div>
  </div>
</template>

<script>
import {API} from "../API";


export default {
  name: "CompetitionList",
  data() {
    return {
      competitions: [],
      tiers: process.env.VUE_APP_API_AVAILABLE_TIERS.split(' '),
      nameFilter: '',
      areaFilter: ''
    };
  },
  computed: {
    filteredAvailableCompetitions() {
      return this.competitions.filter(competition => this.tiers.includes(competition.plan))
          .filter(competition => competition.name.match(this.getRegExpFromString(this.nameFilter)))
          .filter(competition => competition.area.name.match(this.getRegExpFromString(this.areaFilter)));
    },
    filteredUnavailableCompetitions() {
      return this.competitions.filter(competition => !this.tiers.includes(competition.plan))
          .filter(competition => competition.name.match(this.getRegExpFromString(this.nameFilter)))
          .filter(competition => competition.area.name.match(this.getRegExpFromString(this.areaFilter)));
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
        const {competitions: competitions} = await API.getCompetitions();
        this.competitions = competitions;
        this.nameFilter = this.$route.query.name;
        this.areaFilter = this.$route.query.area;
      } catch (error) {
        console.log(error);
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
