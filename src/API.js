export {API}

class API {
    static token = '';

    static async get(endpoint, filters) {
        const request = await fetch(`https://api.football-data.org/v2/${endpoint}${filters}`, {
            headers: {'X-Auth-Token': this.token},
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

    static async getCompetitionByID(id) {
        return await this.get(`competitions`, `/${id}`);
    }

    static async getTeamByID(id) {
        return await this.get(`teams`, `/${id}`);
    }

    static async getMatchesOfCompetition(id, dateFrom, dateTo) {
        [dateFrom, dateTo] = [dateFrom ?? '', dateTo ?? ''];
        return await this.get('competitions', `/${id}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`);
    }

    static async getTeamsOfCompetition(id) {
        return await this.get('competitions', `/${id}/teams`);
    }

    static async getMatchesOfTeam(id, dateFrom, dateTo) {
        [dateFrom, dateTo] = [dateFrom ?? '', dateTo ?? ''];
        return await this.get('teams', `/${id}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`);
    }

    static async getMatchByID(id) {
        return await this.get('matches', `/${id}`);
    }

}




