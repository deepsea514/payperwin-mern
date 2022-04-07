import FrontendAPI from "./frontendAPI";
import axios from 'axios';

// User
export function setPreferences(preference) {
    return FrontendAPI.post(`/preferences`, preference)
}

export function getUser() {
    return FrontendAPI.get(`/user`);
}

export function getAdminMessage() {
    return FrontendAPI.get(`/frontend/message`);
}

export function getAdminBanner() {
    return FrontendAPI.get(`/frontend/banner`);
}

export function toggleFavorites(data) {
    return FrontendAPI.post(`/favorites/toggle`, data)
}

export function googleLogin(token) {
    return FrontendAPI.post(`/googleLogin`, { token })
}

export function login(values) {
    return FrontendAPI.post(`/login`, values)
}

export function logoutAction() {
    return FrontendAPI.get('/logout');
}

export function verify2FACode(verification_code) {
    return FrontendAPI.post(`/verify-2fa-code`, { verification_code })
}

export function visitAffiliate(referrer) {
    return FrontendAPI.post('/visit-affiliate', { referrer });
}

export function resend2FACode() {
    return FrontendAPI.post(`${serverUrl}/resend-2fa-code`);
}

export function getMaintenanceMode() {
    return FrontendAPI.get(`/frontend/maintenance_mode`)
}

export function getUsernameTaken(username) {
    return FrontendAPI.get(`/usernameTaken`, { params: { username } });
}

export function getEmailTaken(email) {
    return FrontendAPI.get(`/emailTaken`, { params: { email } });
}

export function getReferralCodeExists(referral_code) {
    return FrontendAPI.get(`/referralCodeExist`, { params: { referral_code } });
}

export function submitTicket(postData) {
    return FrontendAPI.post(`/submitticket`, postData, {
        headers: { 'content-type': 'multipart/form-data' }
    })
}

export function submitDeposit(values) {
    return FrontendAPI.post(`/deposit`, values)
}

export function newPasswordFromToken(queryParams, password) {
    return FrontendAPI.post(`/newPasswordFromToken${queryParams}`, { password });
}

export function sendPasswordRecovery(email) {
    return FrontendAPI.get(`/sendPasswordRecovery`, { params: { email } });
}

export function phoneVerify(step, values) {
    return FrontendAPI.post(`/phone-verify`, values, { params: { step } })
}

export function getPrize() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();
    return FrontendAPI.get(`/prize`, { params: { date: new Date(year, month, date) } })
}

export function postPrize(prize) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();
    return FrontendAPI.post(`/prize`, { prize, date: new Date(year, month, date) },);
}

export function getProfile() {
    return FrontendAPI.get(`/profile`)
}

export function postProfile(values) {
    return FrontendAPI.post(`/profile`, values)
}

export function register(data) {
    return FrontendAPI.post(`/register`, data)
}

export function googleRegister(token, invite, referrer) {
    return FrontendAPI.post(`/googleRegister`, { token: token, invite, referrer })
}

export function enable2FA(value) {
    return FrontendAPI.post(`/enable-2fa`, { enable_2fa: value == 'true' })
}

export function changePassword(oldPassword, password) {
    return FrontendAPI.patch(`/changePassword`, { oldPassword, password })
}

export function selfExclusion(peorid) {
    return FrontendAPI.post(`/self-exclusion`, { peorid })
}

export function getTransactions(filter) {
    return FrontendAPI.post(`/transactions`, filter)
}

export function checkVerified() {
    return FrontendAPI.get(`/checkverified`)
}

export function getAddress() {
    return FrontendAPI.get(`/address`)
}

export function submitVerification(data, config = null) {
    return FrontendAPI.post(`/verification`, data, config)
}

export function checkFreeWithdraw() {
    return FrontendAPI.get(`/freeWithdraw`)
}

export function submitWithdraw(values) {
    return FrontendAPI.post(`/withdraw`, values)
}

// Meta Tag
export function getMetaTag(title) {
    return FrontendAPI.get(`/meta/`, { params: { title } });
}

// Bet Releated
export function getSportsDir() {
    return FrontendAPI.get(`/sportsdir`);
}

export function getBetStatus() {
    return FrontendAPI.get(`/frontend/bet_settings`);
}

export function getFeaturedSports() {
    return FrontendAPI.get(`/frontend/featured_sports`)
}

export function getCustomEvent(id) {
    return FrontendAPI.get(`/custombets`, { params: { id } })
}

export function joinHighStaker(id, amount) {
    return FrontendAPI.post(`/customBet/${id}/join`, { amount });
}

export function getLiveSports(sportName, league) {
    return FrontendAPI.get(`/livesport`, {
        params: league ?
            { name: sportName, leagueId: league } :
            { name: sportName }
    })
}

export function getSports(sportName, league) {
    return FrontendAPI.get(`/sport`, {
        params: league ?
            { name: sportName, leagueId: league } :
            { name: sportName }
    })
}

export function getSportsLine(live, sportName, leagueId, eventId) {
    return FrontendAPI.get(`/${live ? 'livesport' : 'sport'}`,
        {
            params: {
                name: sportName,
                leagueId,
                eventId
            }
        })
}

export function getSportLeagues(name) {
    return FrontendAPI.get(`/sportleague`, { params: { name } });
}

export function getBetSlipLastOdds(betSlip) {
    return FrontendAPI.post(`/getSlipLatestOdds`, betSlip)
}

export function searchSports(name) {
    return FrontendAPI.get(`/searchsports`, { params: { name } });
}

export function searchEvent(filter) {
    return axios.get('https://app.heatscore.co/events/search', { params: filter });
}

export function getBets(filter) {
    return FrontendAPI.post(`/bets`, filter)
}

export function shareLine(data) {
    return FrontendAPI.put(`/share-line`, data)
}

export function getLatestOdds(bodyData) {
    return FrontendAPI.post(`/getLatestOdds`, bodyData)
}

export function forwardBet(id) {
    return FrontendAPI.post(`/bets/${id}/forward`)
}

export function search(param) {
    return FrontendAPI.get(`/search`, { params: { param } })
}

export function cancelBet(id) {
    return FrontendAPI.post(`/bets/${id}/cancel`)
}

export function voteEvent(event_id, pick) {
    return FrontendAPI.post(`/events/${event_id}/vote`, { pick: pick });
}

// Articles
export function getArticle(permalink) {
    return FrontendAPI.get(`/article/detail`, { params: { permalink } })
}

export function getArticles() {
    return FrontendAPI.get(`/articles/home`)
}

export function getRecentArticles() {
    return FrontendAPI.get(`/articles/recent`)
}

export function getPopularArticles() {
    return FrontendAPI.get(`/articles/popular`)
}

export function getArticleCategories() {
    return FrontendAPI.get(`/article-category`)
}

export function getArticleCategory(categoryname) {
    return FrontendAPI.get(`/articles/categories/${categoryname}`)
}

// Betslip
export function placeBets(betSlip) {
    return FrontendAPI.post(`/placeBets`, { betSlip })
}

export function placeParlayBets(betSlip, totalStake, totalWin) {
    return FrontendAPI.post(`/placeParlayBets`, { betSlip, totalStake, totalWin })
}

export function placeTeaserBets(teaserBetSlip, totalStake, totalWin) {
    return FrontendAPI.post(`/placeTeaserBets`, { teaserBetSlip, totalStake, totalWin })
}

export function createCustomBet(data) {
    return FrontendAPI.post(`/customBet`, data)
}

// FAQ
export function getFAQArticle(id) {
    return FrontendAPI.get(`/faq_article/${id}`);
}

export function getFAQArticles(search = '') {
    return FrontendAPI.get(`/faqs_general${search}`)
}

export function getFAQSubject(id) {
    return FrontendAPI.get(`/faq_subject/${id}`)
}

export function getFAQSubjects() {
    return FrontendAPI.get(`/faqs`)
}

// Autobet
export function getAutobet(daterange) {
    return FrontendAPI.get(`/autobet`, { params: daterange })
}

export function updateAUtobetSetting(newValues) {
    return FrontendAPI.post(`/autobet/settings`, newValues)
}

// Promotion
export function getPromotionBanners() {
    return FrontendAPI.get('/promotion/banners');
}

// Cashback
export function getCashbak() {
    return FrontendAPI.get(`/cashback`)
}

// Inbox
export function getInbox() {
    return FrontendAPI.get(`/inbox`)
}

export function getInboxDetail(id) {
    return FrontendAPI.get(`/inbox/${id}`)
}

export function deleteInbox(id) {
    return FrontendAPI.delete(`/inbox/${id}`)
}

// Team
export function getTeamMembers() {
    return FrontendAPI.get('/members');
}

// Loyalty
export function getLoyaltyPoints() {
    return FrontendAPI.get(`/loyalty`);
}

export function claimReward(points) {
    return FrontendAPI.post(`/claims`, {points});
}

export function getClaims() {
    return FrontendAPI.get(`/claims`);
}