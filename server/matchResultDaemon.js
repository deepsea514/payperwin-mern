const dotenvresult = require('dotenv').config();
const mongoose = require('mongoose');
const BetPool = require('./models/betpool');
const Bet = require('./models/bet');
const User = require('./models/user');
const Admin = require('./models/admin');
const ApiCache = require('./models/apiCache');
const axios = require('axios');
const getLineFromPinnacleData = require('./libs/getLineFromPinnacleData');
const simpleresponsive = require('./emailtemplates/simpleresponsive');
const config = require('../config.json');

// const cachedResult = {
//   "sportId": 32,
//   "last": 5856753,
//   "leagues": [
//     {
//       "id": 208839,
//       "events": [
//         {
//           "id": 1122662700,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856619,
//               "settledAt": "2020-05-09T17:57:12.497Z",
//               "team1Score": 0,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122662701,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856620,
//               "settledAt": "2020-05-09T17:57:34.82Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122722415,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856621,
//               "settledAt": "2020-05-09T17:58:31.167Z",
//               "team1Score": 3,
//               "team2Score": 2
//             }
//           ]
//         },
//         {
//           "id": 1122722421,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856622,
//               "settledAt": "2020-05-09T17:58:59.34Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122662696,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856623,
//               "settledAt": "2020-05-09T17:59:34.4Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122662703,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856624,
//               "settledAt": "2020-05-09T17:59:55.087Z",
//               "team1Score": 3,
//               "team2Score": 2
//             }
//           ]
//         },
//         {
//           "id": 1122662693,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856625,
//               "settledAt": "2020-05-09T18:00:09.493Z",
//               "team1Score": 1,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122662698,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856626,
//               "settledAt": "2020-05-09T18:00:19.18Z",
//               "team1Score": 3,
//               "team2Score": 0
//             }
//           ]
//         },
//         {
//           "id": 1122722412,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856627,
//               "settledAt": "2020-05-09T18:00:36.46Z",
//               "team1Score": 0,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122722420,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856630,
//               "settledAt": "2020-05-09T18:00:54.773Z",
//               "team1Score": 1,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122685415,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856631,
//               "settledAt": "2020-05-09T18:01:07.743Z",
//               "team1Score": 3,
//               "team2Score": 0
//             },
//             {
//               "number": 1,
//               "status": 1,
//               "settlementId": 5856632,
//               "settledAt": "2020-05-09T18:02:01.567Z",
//               "team1Score": 11,
//               "team2Score": 9
//             }
//           ]
//         },
//         {
//           "id": 1122722419,
//           "periods": [
//             {
//               "number": 1,
//               "status": 1,
//               "settlementId": 5856633,
//               "settledAt": "2020-05-09T18:03:20.307Z",
//               "team1Score": 8,
//               "team2Score": 11
//             },
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856634,
//               "settledAt": "2020-05-09T18:03:30.387Z",
//               "team1Score": 1,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122722417,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856635,
//               "settledAt": "2020-05-09T18:03:50.95Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122685414,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856667,
//               "settledAt": "2020-05-09T18:23:46.793Z",
//               "team1Score": 3,
//               "team2Score": 2
//             }
//           ]
//         },
//         {
//           "id": 1122685413,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856695,
//               "settledAt": "2020-05-09T18:37:39.23Z",
//               "team1Score": 0,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122685416,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856696,
//               "settledAt": "2020-05-09T18:37:47.73Z",
//               "team1Score": 3,
//               "team2Score": 0
//             }
//           ]
//         }
//       ]
//     },
//     {
//       "id": 208771,
//       "events": [
//         {
//           "id": 1122684218,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856636,
//               "settledAt": "2020-05-09T18:05:08.13Z",
//               "team1Score": 2,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122684260,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856637,
//               "settledAt": "2020-05-09T18:05:24.783Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122684273,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856638,
//               "settledAt": "2020-05-09T18:05:32.203Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122684241,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856639,
//               "settledAt": "2020-05-09T18:05:45.94Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122684250,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856640,
//               "settledAt": "2020-05-09T18:05:55.66Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122684265,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856641,
//               "settledAt": "2020-05-09T18:06:02.44Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122684229,
//           "periods": [
//             {
//               "number": 1,
//               "status": 1,
//               "settlementId": 5856642,
//               "settledAt": "2020-05-09T18:06:36.637Z",
//               "team1Score": 11,
//               "team2Score": 4
//             },
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856694,
//               "settledAt": "2020-05-09T18:36:27.14Z",
//               "team1Score": 1,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122684227,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856643,
//               "settledAt": "2020-05-09T18:06:56.357Z",
//               "team1Score": 3,
//               "team2Score": 0
//             }
//           ]
//         },
//         {
//           "id": 1122684244,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856644,
//               "settledAt": "2020-05-09T18:07:12.78Z",
//               "team1Score": 2,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122684272,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856645,
//               "settledAt": "2020-05-09T18:07:25.897Z",
//               "team1Score": 3,
//               "team2Score": 2
//             }
//           ]
//         },
//         {
//           "id": 1122684257,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856646,
//               "settledAt": "2020-05-09T18:07:43.693Z",
//               "team1Score": 2,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122684258,
//           "periods": [
//             {
//               "number": 0,
//               "status": 2,
//               "settlementId": 5856648,
//               "settledAt": "2020-05-09T18:08:03.46Z",
//               "team1Score": 0,
//               "team2Score": 3,
//               "cancellationReason": {
//                 "code": "FBS_CW_234",
//                 "details": {
//                   "correctTeam1Score": "0",
//                   "correctTeam2Score": "3"
//                 }
//               }
//             }
//           ]
//         },
//         {
//           "id": 1122684232,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856697,
//               "settledAt": "2020-05-09T18:39:51.277Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122684222,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856726,
//               "settledAt": "2020-05-09T18:51:30.207Z",
//               "team1Score": 3,
//               "team2Score": 0
//             }
//           ]
//         },
//         {
//           "id": 1122684239,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856727,
//               "settledAt": "2020-05-09T18:51:41.27Z",
//               "team1Score": 1,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122684251,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856728,
//               "settledAt": "2020-05-09T18:51:53.847Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122684248,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856750,
//               "settledAt": "2020-05-09T19:17:11.893Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122684221,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856753,
//               "settledAt": "2020-05-09T19:17:25.88Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         }
//       ]
//     },
//     {
//       "id": 208853,
//       "events": [
//         {
//           "id": 1122684622,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856657,
//               "settledAt": "2020-05-09T18:21:53.447Z",
//               "team1Score": 2,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122684626,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856658,
//               "settledAt": "2020-05-09T18:22:11.167Z",
//               "team1Score": 3,
//               "team2Score": 2
//             }
//           ]
//         },
//         {
//           "id": 1122684630,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856659,
//               "settledAt": "2020-05-09T18:22:18.073Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122684621,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856660,
//               "settledAt": "2020-05-09T18:22:23.66Z",
//               "team1Score": 0,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122684624,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856661,
//               "settledAt": "2020-05-09T18:22:30.503Z",
//               "team1Score": 1,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122684615,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856662,
//               "settledAt": "2020-05-09T18:22:36.41Z",
//               "team1Score": 1,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122684619,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856663,
//               "settledAt": "2020-05-09T18:22:45.317Z",
//               "team1Score": 1,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122684614,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856664,
//               "settledAt": "2020-05-09T18:22:52.13Z",
//               "team1Score": 3,
//               "team2Score": 0
//             }
//           ]
//         },
//         {
//           "id": 1122684611,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856665,
//               "settledAt": "2020-05-09T18:23:01.723Z",
//               "team1Score": 3,
//               "team2Score": 2
//             }
//           ]
//         },
//         {
//           "id": 1122684610,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856666,
//               "settledAt": "2020-05-09T18:23:06.32Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         }
//       ]
//     },
//     {
//       "id": 208761,
//       "events": [
//         {
//           "id": 1122662167,
//           "periods": [
//             {
//               "number": 1,
//               "status": 1,
//               "settlementId": 5856668,
//               "settledAt": "2020-05-09T18:24:53.127Z",
//               "team1Score": 6,
//               "team2Score": 11
//             },
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856674,
//               "settledAt": "2020-05-09T18:25:45.463Z",
//               "team1Score": 0,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122684209,
//           "periods": [
//             {
//               "number": 1,
//               "status": 1,
//               "settlementId": 5856669,
//               "settledAt": "2020-05-09T18:25:03.33Z",
//               "team1Score": 11,
//               "team2Score": 3
//             },
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856679,
//               "settledAt": "2020-05-09T18:26:14.353Z",
//               "team1Score": 3,
//               "team2Score": 0
//             }
//           ]
//         },
//         {
//           "id": 1122662163,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856670,
//               "settledAt": "2020-05-09T18:25:16.753Z",
//               "team1Score": 3,
//               "team2Score": 0
//             }
//           ]
//         },
//         {
//           "id": 1122662177,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856671,
//               "settledAt": "2020-05-09T18:25:28.087Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122662173,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856672,
//               "settledAt": "2020-05-09T18:25:33.807Z",
//               "team1Score": 3,
//               "team2Score": 2
//             }
//           ]
//         },
//         {
//           "id": 1122662164,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856673,
//               "settledAt": "2020-05-09T18:25:39.18Z",
//               "team1Score": 3,
//               "team2Score": 2
//             }
//           ]
//         },
//         {
//           "id": 1122662166,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856675,
//               "settledAt": "2020-05-09T18:25:49.62Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122662165,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856676,
//               "settledAt": "2020-05-09T18:25:55.9Z",
//               "team1Score": 3,
//               "team2Score": 2
//             }
//           ]
//         },
//         {
//           "id": 1122684205,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856677,
//               "settledAt": "2020-05-09T18:26:01.057Z",
//               "team1Score": 0,
//               "team2Score": 3
//             }
//           ]
//         },
//         {
//           "id": 1122684213,
//           "periods": [
//             {
//               "number": 0,
//               "status": 1,
//               "settlementId": 5856678,
//               "settledAt": "2020-05-09T18:26:08.433Z",
//               "team1Score": 3,
//               "team2Score": 1
//             }
//           ]
//         },
//         {
//           "id": 1122756609,
//           "periods": [
//             {
//               "number": 0,
//               "status": 5,
//               "settlementId": 5856680,
//               "settledAt": "2020-05-09T18:27:54.663Z",
//               "team1Score": 0,
//               "team2Score": 0
//             }
//           ]
//         },
//         {
//           "id": 1122756601,
//           "periods": [
//             {
//               "number": 0,
//               "status": 5,
//               "settlementId": 5856690,
//               "settledAt": "2020-05-09T18:33:00.94Z",
//               "team1Score": 0,
//               "team2Score": 0
//             }
//           ]
//         },
//         {
//           "id": 1122756602,
//           "periods": [
//             {
//               "number": 0,
//               "status": 5,
//               "settlementId": 5856691,
//               "settledAt": "2020-05-09T18:33:08.097Z",
//               "team1Score": 0,
//               "team2Score": 0
//             }
//           ]
//         },
//         {
//           "id": 1122756598,
//           "periods": [
//             {
//               "number": 0,
//               "status": 5,
//               "settlementId": 5856692,
//               "settledAt": "2020-05-09T18:33:16.77Z",
//               "team1Score": 0,
//               "team2Score": 0
//             }
//           ]
//         },
//         {
//           "id": 1122756605,
//           "periods": [
//             {
//               "number": 0,
//               "status": 5,
//               "settlementId": 5856693,
//               "settledAt": "2020-05-09T18:33:26.683Z",
//               "team1Score": 0,
//               "team2Score": 0
//             }
//           ]
//         }
//       ]
//     }
//   ]
// };

// Database
mongoose.Promise = global.Promise;
const databaseName = 'PayPerWinDev'
// const databaseName = process.env.NODE_ENV === 'development' ? 'PayPerWinDev' : 'PayPerWin';
console.info('Using database:', databaseName);
mongoose.connect(`mongodb://localhost/${databaseName}`, {
  authSource: "admin",
  user: config.mongo.username,
  pass: config.mongo.password,
  useMongoClient: true,
});


const reqConfig = {
  maxRedirects: 999,
  headers: {
    'User-Agent': 'PostmanRuntime/7.24.1',
    'Authorization': 'Basic SkIxMDUyNzIyOkN1cnpvbjg4OA==',
    'Accept': 'application/json',
  },
};

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + (h * 60 * 60 * 1000));
  return this;
}

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fromEmailName = 'PAYPER Win';
const fromEmailAddress = 'donotreply@payperwin.ca';

async function doStuff() {
  // Check  betpools
  const betpools = await BetPool.find(
    // settle matches that started before 3 hours ago
    { matchStartDate: { $lt: new Date().addHours(3) }, result: { $exists: false } }
  );

  // console.log(betpools);
  // loop through betpools
  if (!betpools || betpools.length === 0) {
    console.log('no eligible betpools');
  }
  for (const betpool of betpools) {
    const {
      homeBets,
      awayBets,
      uid,
      sportId,
      leagueId,
      eventId,
      lineId,
      lineType,
      teamA,
      teamB,
      points
    } = betpool;
    console.log(betpool);
    let matchCancelled = false;
    if (homeBets.length > 0 && awayBets.length > 0) {
      // checkmatchresult
        try {
          const url = `${config.pinnacleApiHost}/v1/fixtures/settled?sportId=${sportId}&leagueIds=${leagueId}`;
          console.log('getting', url);
          let result = await ApiCache.findOne({ url });
          if (!result || (result.updatedAt && new Date() - new Date(result.updatedAt) > 1000 * 60 * 59)) {
            // TODO: last/since
            // if (result && result.data && result.data.last) {
            // add since to url query
            // }
            result = await axios.get(url, reqConfig);
            // TODO: last/since merge previous
            console.log(result.data);
            if (result) {
              await ApiCache.findOneAndUpdate({ url }, result, { upsert: true });
            }
          }
          const { data } = result;
          if (!data) {
            console.log('no data from api/cache for this line');
          }
          const matchResult = getLineFromPinnacleData(data, leagueId, eventId);
          if (matchResult) {
            const { homeScore, awayScore, cancellationReason } = matchResult;
            if (cancellationReason) {
              matchCancelled = true;
            }
            if (!cancellationReason) {
              let moneyLineWinner = null;
              if (homeScore > awayScore) moneyLineWinner = 'home';
              else if (awayScore > homeScore) moneyLineWinner = 'away';
              const bets = await Bet.find({
                _id:
                  {
                    $in: [
                      // mongoose.Types.ObjectId('4ed3ede8844f0f351100000c'), might have to use this syntax
                      ...homeBets,
                      ...awayBets,
                    ]
                  }
              });
              for (const bet of bets) {
                const { _id, userId, bet: betAmount, toWin, pick, payableToWin } = bet;
                let betWin;
                if (lineType === 'moneyline') {
                  betWin = pick === moneyLineWinner;  
                  console.log(lineType, 'betWin:', betWin, pick, moneyLineWinner);
                } else if (lineType === 'spread') {
                  const spread = {
                    home: points,
                    away: points * -1,
                  };
                  const homeScoreHandiCapped = homeScore + spread.home;
                  const awayScoreHandiCapped = awayScore + spread.away;
                  let spreadWinner;
                  console.log(homeScore, spread.home);
                  console.log(homeScoreHandiCapped, awayScoreHandiCapped);
                  if (homeScoreHandiCapped > awayScoreHandiCapped) spreadWinner = 'home';
                  else if (awayScoreHandiCapped > homeScoreHandiCapped) spreadWinner = 'away';
                  betWin = pick === spreadWinner;
                  console.log(lineType, 'betWin:', betWin, pick, spreadWinner);
                } else if (lineType === 'total') {
                  const totalPoints = homeScore + awayScore;
                  const overUnderWinner = totalPoints > points ? 'home' : 'away';
                  betWin = pick === overUnderWinner;
                  console.log(lineType, 'betWin:', betWin, pick, overUnderWinner);
                }

                if (betWin === true) {
                  // TODO: credit back bet ammount
                  const user = await User.findById(userId);
                  const { balance, email } = user;
                  const betChanges = {
                    $set: {
                      status: 'Settled - Win',
                      walletBeforeCredited: balance,
                      credited: betAmount + payableToWin,
                      homeScore,
                      awayScore,
                    }
                  }
                  console.log(betChanges);
                  await Bet.findOneAndUpdate({ _id }, betChanges);
                  await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount + payableToWin } });
                  await Admin.findOneAndUpdate({}, {
                    $inc: {
                      userWallet: betAmount + payableToWin,
                      betsWallet: (betAmount + payableToWin) * -1,
                      // TODO: update fee wallet
                    }
                  });
                  // TODO: email winner
                  const msg = {
                    from: `"${fromEmailName}" <${fromEmailAddress}>`,
                    to: email,
                    subject: 'You won a wager!',
                    text: `Congratulations! You won $${payableToWin.toFixed(2)}. View Result Details: http://dev.payperwin.ca/history`,
                    html: simpleresponsive(`
                      <p>
                        Congratulations! You won $${payableToWin.toFixed(2)}. View Result Details:
                      </p>
                    `,
                    { href: 'http://dev.payperwin.ca/history', name: 'Settled Bets' }
                    ),
                  };
                  sgMail.send(msg);
                } else if (betWin === false) {
                  const betChanges = {
                    $set: {
                      status: 'Settled - Lose',
                      homeScore,
                      awayScore,
                    }
                  }
                  const unplayableBet = payableToWin < toWin
                    ? ((1 - (payableToWin / toWin)) * betAmount).toFixed(2) : null;
                  if (unplayableBet) {
                    betChanges.$set.credited = unplayableBet;
                    await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: unplayableBet } });
                  }
                  console.log(betChanges);
                  await Bet.findOneAndUpdate({ _id }, betChanges);
                } else {
                  console.log('error: somehow', lineType, 'bet did not result in win or loss. betWin value:', betWin);
                }
                await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Settled' } });
              }
            }
          } else {
            console.log('no match result found');
          }
        } catch (e) {
          console.log(e);
        }
    } else {
      matchCancelled = true;
    }
    if (matchCancelled) {
      // cancel or not enough bettors
      // refund bettors
      for (const betId of homeBets) {
        const bet = await Bet.findOne({ _id: betId });
        const { _id, userId, bet: betAmount } = bet;
        console.log('betObj', bet, betAmount);
        // refund user
        await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
        await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount } });
        await Admin.findOneAndUpdate({}, { $inc: {
          betsWallet: betAmount * -1,
          userWallet: betAmount,
          // TODO: update fee wallet
        } });
      }
      for (const betId of awayBets) {
        const bet = await Bet.findOne({ _id: betId });
        const { _id, userId, bet: betAmount } = bet;
        console.log('betObj', bet, betAmount);
        // refund user
        await Bet.findOneAndUpdate({ _id }, { status: 'Cancelled' });
        await User.findOneAndUpdate({ _id: userId }, { $inc: { balance: betAmount } });
        await Admin.findOneAndUpdate({}, {
          $inc: {
            betsWallet: betAmount * -1,
            userWallet: betAmount,
            // TODO: update fee wallet
          }
        });
      }
      // // set bet as cancelled 'minimum bets not met'
      await BetPool.findOneAndUpdate({ uid }, { $set: { result: 'Cancelled' } });
    }
  }
  console.log('finished checking betpools', new Date().toLocaleString());
}


const intervalTime = 1000 * 60 * 60;
doStuff();
setInterval(doStuff, intervalTime);
