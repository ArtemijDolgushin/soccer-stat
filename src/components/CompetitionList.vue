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
      class="border-2 border-blue-900"
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

  <div class="pb-20  flex flex-wrap justify-center">
    <div
        v-for="competition in filteredAvailableCompetitions"
        :key="competition.id"
        class="card-available"
    >
      <h1 class="text-xl font-bold text-gray-700 mb-2">{{ competition.name }}</h1>

      <div class="w-80 text-sm">
        <div>Место: {{ competition.area.name }}</div>

        <div>Текущий сезон: c <span>{{ competition.currentSeason.startDate }}</span>
          по
          <span>{{ competition.currentSeason.endDate }}</span>
        </div>
      </div>


      <router-link
          :to="{ path: '/calendar/competition', query: {competitionID: competition.id}}"
          class="link"
      >
        Матчи
      </router-link>
    </div>
  </div>


  <div class="flex flex-wrap justify-center">
    <div
        v-for="competition in filteredUnavailableCompetitions"
        :key="competition.id"
        class="card-unavailable"
    >
      <h1 class="text-xl font-bold text-gray-700 mb-2">{{ competition.name }}</h1>

      <div class="w-80 text-sm">
        <span>Страна: </span>
        <span>{{ competition.area.name }}</span>
        <div>Информация о матчах недоступна на текущем тарифе
        </div>
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
      areaFilter: '',
      dataLoading: false,
      errorHappened: false
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
        this.dataLoading = true;
        const {competitions} = await API.getCompetitions();
        this.competitions = competitions;
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

.card-unavailable {
  @apply m-5 p-3 bg-pink-50  hover:bg-pink-300 flex flex-col  space-x-6 rounded-lg shadow-md hover:scale-105 transition transform duration-500
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
