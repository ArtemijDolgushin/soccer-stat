# soccer-stat

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Уровни доступа по тарифу

В файле vue.config.js в переменную VUE_APP_API_AVAILABLE_TIERS необходимо записать через пробел все доступные по
текущему тарифу уровни API сервиса https://www.football-data.org/ .

Тариф | Доступные уровни
------------ | -------------
Free | 'TIER_ONE'
49 € | 'TIER_ONE TIER_TWO'
99 € | 'TIER_ONE TIER_TWO TIER_THREE'
249 € | 'TIER_ONE TIER_TWO TIER_THREE TIER_FOUR'

По умолчанию сервис работает по тарифу Free, переменная VUE_APP_API_AVAILABLE_TIERS имеет значение 'TIER_ONE'. На этом
тарифе стоит ограничение: 10 запросов/мин.

Также в файле vue.config.js в переменную VUE_APP_API_TOKEN необходимо записать API ключ для доступа к
сервису https://www.football-data.org/

