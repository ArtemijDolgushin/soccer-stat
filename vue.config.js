process.env.VUE_APP_API_TOKEN = '';
process.env.VUE_APP_API_AVAILABLE_TIERS = 'TIER_ONE';
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/soccer-stat/'
        : '/'
}
