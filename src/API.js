export {API}

class API {
    static async get(endpoint, filters) {
        const request = await fetch(`https://api.football-data.org/v2/${endpoint}${filters}`, {
            headers: {'X-Auth-Token': process.env.VUE_APP_API_TOKEN},
            dataType: 'json',
            type: 'GET',
        });
        return await request.json();
    }

    static async getCompetitions() {
        return await this.get('competitions', '?areas=2077');
    }

    static async getTeams() {
        return await this.get('teams', '?areas=2077');
    }

    static async getMatchesOfCompetition(id, dateFrom = '', dateTo = '') {
        return await this.get('competitions', `/${id}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`);
    }

    static async getMatchesOfTeam(id, dateFrom = '', dateTo = '') {
        return await this.get('teams', `/${id}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`);
    }
}




