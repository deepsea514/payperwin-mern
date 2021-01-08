const deepmerge = require('deepmerge');
const formatFixturesOdds = require('./formatFixturesOdds');
const formatLines = require('./formatLines');

const fixtures = {
  "sportId": 3,
  "last": 265612480,
  "league": [
    {
      "id": 246,
      "name": "MLB",
      "events": [
        {
          "id": 1116171401,
          "starts": "2020-03-24T01:05:00Z",
          "home": "NO Reg. Season Game by July 1, 2020",
          "away": "Reg. Season Game Played by July 1, 2020",
          "rotNum": "101",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 1,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1120190653,
          "starts": "2020-05-01T17:00:00Z",
          "home": "Test Team B",
          "away": "Test Team A",
          "rotNum": "123",
          "liveStatus": 2,
          "homePitcher": "E. Pitcher",
          "awayPitcher": "T. Pitcher",
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        }
      ]
    },
    {
      "id": 208753,
      "name": "Chinese Taipei - Professional League",
      "events": [
        {
          "id": 1122243469,
          "starts": "2020-05-09T09:05:00Z",
          "home": "Chinatrust Brothers",
          "away": "Rakuten Monkeys",
          "rotNum": "25019",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1119218462,
          "starts": "2020-04-14T05:00:00Z",
          "home": "Chinatrust Brothers 2",
          "away": "Fubon Guardians 2",
          "rotNum": "3703",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122364562,
          "starts": "2020-05-10T09:05:00Z",
          "home": "Chinatrust Brothers",
          "away": "Rakuten Monkeys",
          "rotNum": "25025",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122243470,
          "starts": "2020-05-09T09:05:00Z",
          "home": "Fubon Guardians",
          "away": "Uni-Lions",
          "rotNum": "25021",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1119218598,
          "starts": "2020-04-14T05:00:00Z",
          "home": "Wei Chuan Dragons 2",
          "away": "Rakuten Monkeys 2",
          "rotNum": "3707",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122124151,
          "starts": "2020-05-08T10:35:00Z",
          "home": "Chinatrust Brothers",
          "away": "Rakuten Monkeys",
          "rotNum": "25013",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122124150,
          "starts": "2020-05-08T10:35:00Z",
          "home": "Fubon Guardians",
          "away": "Uni-Lions",
          "rotNum": "25015",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122364563,
          "starts": "2020-05-10T09:05:00Z",
          "home": "Fubon Guardians",
          "away": "Uni-Lions",
          "rotNum": "25027",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        }
      ]
    },
    {
      "id": 6227,
      "name": "Korea Professional Baseball",
      "events": [
        {
          "id": 1122239545,
          "starts": "2020-05-09T08:00:00Z",
          "home": "NC Dinos",
          "away": "LG Twins",
          "rotNum": "1923",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122239548,
          "starts": "2020-05-09T08:00:00Z",
          "home": "Samsung Lions",
          "away": "Kia Tigers",
          "rotNum": "1925",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122349440,
          "starts": "2020-05-10T05:00:00Z",
          "home": "Lotte Giants",
          "away": "SK Wyverns",
          "rotNum": "1945",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122349438,
          "starts": "2020-05-10T05:00:00Z",
          "home": "Doosan Bears",
          "away": "KT Wiz Suwon",
          "rotNum": "1941",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122239543,
          "starts": "2020-05-09T08:00:00Z",
          "home": "Lotte Giants",
          "away": "SK Wyverns",
          "rotNum": "1919",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122349441,
          "starts": "2020-05-10T05:00:00Z",
          "home": "NC Dinos",
          "away": "LG Twins",
          "rotNum": "1947",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122349442,
          "starts": "2020-05-10T05:00:00Z",
          "home": "Kiwoom Heroes",
          "away": "Hanwha Eagles",
          "rotNum": "1949",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122239544,
          "starts": "2020-05-09T08:00:00Z",
          "home": "Kiwoom Heroes",
          "away": "Hanwha Eagles",
          "rotNum": "1921",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122349439,
          "starts": "2020-05-10T05:00:00Z",
          "home": "Samsung Lions",
          "away": "Kia Tigers",
          "rotNum": "1943",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122239547,
          "starts": "2020-05-09T08:00:00Z",
          "home": "Doosan Bears",
          "away": "KT Wiz Suwon",
          "rotNum": "1927",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122119269,
          "starts": "2020-05-08T09:30:00Z",
          "home": "Samsung Lions",
          "away": "Kia Tigers",
          "rotNum": "1907",
          "liveStatus": 0,
          "homePitcher": "Choi Chae Heung",
          "awayPitcher": "Drew Gagnon",
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122119268,
          "starts": "2020-05-08T09:30:00Z",
          "home": "NC Dinos",
          "away": "LG Twins",
          "rotNum": "1901",
          "liveStatus": 0,
          "homePitcher": "Lee Jae Hak",
          "awayPitcher": "Tyler Wilson",
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122119266,
          "starts": "2020-05-08T09:30:00Z",
          "home": "Lotte Giants",
          "away": "SK Wyverns",
          "rotNum": "1903",
          "liveStatus": 0,
          "homePitcher": "Noh Kyung Eun",
          "awayPitcher": "Moon Seung Won",
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122119267,
          "starts": "2020-05-08T09:30:00Z",
          "home": "Kiwoom Heroes",
          "away": "Hanwha Eagles",
          "rotNum": "1905",
          "liveStatus": 0,
          "homePitcher": "Lee Seung Ho",
          "awayPitcher": "Jang Min Jae",
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122119281,
          "starts": "2020-05-08T09:30:00Z",
          "home": "Doosan Bears",
          "away": "KT Wiz Suwon",
          "rotNum": "1909",
          "liveStatus": 0,
          "homePitcher": "Yu Hui Kwan",
          "awayPitcher": "So Hyeong Jun",
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        }
      ]
    },
    {
      "id": 208869,
      "name": "Nicaragua - CNBS",
      "events": [
        {
          "id": 1122222262,
          "starts": "2020-05-09T00:00:00Z",
          "home": "Jinotega",
          "away": "Chontales",
          "rotNum": "3625",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122331959,
          "starts": "2020-05-09T22:00:00Z",
          "home": "Tigres Del Chinandega",
          "away": "Rivas",
          "rotNum": "3637",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122331961,
          "starts": "2020-05-09T22:00:00Z",
          "home": "Carazo",
          "away": "Segovia",
          "rotNum": "3635",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122331956,
          "starts": "2020-05-09T22:00:00Z",
          "home": "Costa Caribe",
          "away": "Masaya",
          "rotNum": "3631",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122222261,
          "starts": "2020-05-09T00:00:00Z",
          "home": "Dantos",
          "away": "Matagalpa",
          "rotNum": "3625",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122222264,
          "starts": "2020-05-09T00:00:00Z",
          "home": "Rivas",
          "away": "Tigres Del Chinandega",
          "rotNum": "3627",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1119363868,
          "starts": "2020-04-17T19:00:00Z",
          "home": "Costa Caribe",
          "away": "Segovia",
          "rotNum": "3601",
          "liveStatus": 0,
          "status": "H",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122331957,
          "starts": "2020-05-09T22:00:00Z",
          "home": "Chontales",
          "away": "Jinotega",
          "rotNum": "3633",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122222266,
          "starts": "2020-05-09T00:00:00Z",
          "home": "Segovia",
          "away": "Carazo",
          "rotNum": "3629",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122222263,
          "starts": "2020-05-09T00:00:00Z",
          "home": "Costa Caribe",
          "away": "Masaya",
          "rotNum": "3629",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122222265,
          "starts": "2020-05-09T00:00:00Z",
          "home": "Esteli",
          "away": "Boer",
          "rotNum": "3627",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122331958,
          "starts": "2020-05-09T22:00:00Z",
          "home": "Boer",
          "away": "Esteli",
          "rotNum": "3631",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122331960,
          "starts": "2020-05-09T22:00:00Z",
          "home": "Matagalpa",
          "away": "Dantos",
          "rotNum": "3635",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1119380324,
          "starts": "2020-04-18T00:00:00Z",
          "home": "Rivas",
          "away": "Chontales",
          "rotNum": "3607",
          "liveStatus": 0,
          "status": "H",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122424860,
          "starts": "2020-05-10T16:00:00Z",
          "home": "Matagalpa",
          "away": "Dantos",
          "rotNum": "3605",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122424862,
          "starts": "2020-05-10T16:00:00Z",
          "home": "Tigres Del Chinandega",
          "away": "Rivas",
          "rotNum": "3605",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122424863,
          "starts": "2020-05-10T16:00:00Z",
          "home": "Carazo",
          "away": "Segovia",
          "rotNum": "3601",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122424859,
          "starts": "2020-05-10T16:00:00Z",
          "home": "Chontales",
          "away": "Jinotega",
          "rotNum": "3603",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122424858,
          "starts": "2020-05-10T16:00:00Z",
          "home": "Costa Caribe",
          "away": "Masaya",
          "rotNum": "3601",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        },
        {
          "id": 1122424861,
          "starts": "2020-05-10T16:00:00Z",
          "home": "Boer",
          "away": "Esteli",
          "rotNum": "3603",
          "liveStatus": 0,
          "status": "I",
          "parlayRestriction": 2,
          "altTeaser": false,
          "resultingUnit": "Regular"
        }
      ]
    },
    {
      "id": 214,
      "name": "MLB - Alternate Runlines",
      "events": [
        {
          "id": 1120204329,
          "starts": "2020-05-01T17:00:00Z",
          "home": "Test Team B",
          "away": "Test Team A",
          "rotNum": "123",
          "liveStatus": 2,
          "status": "I",
          "parlayRestriction": 2,
          "parentId": 1120190653,
          "altTeaser": false,
          "resultingUnit": "Regular"
        }
      ]
    }
  ]
};

const odds = {
  "sportId": 3,
  "last": 997487181,
  "leagues": [
    {
      "id": 6227,
      "events": [
        {
          "id": 1122119269,
          "periods": [
            {
              "lineId": 997487148,
              "number": 0,
              "cutoff": "2020-05-08T09:30:00Z",
              "maxSpread": 250.0,
              "maxMoneyline": 300.0,
              "maxTotal": 250.0,
              "maxTeamTotal": 100.0,
              "status": 1,
              "spreads": [
                {
                  "hdp": 1.5,
                  "home": -144.0,
                  "away": 123.0
                },
                {
                  "altLineId": 12960927316,
                  "hdp": 3.0,
                  "home": -318.0,
                  "away": 236.0
                },
                {
                  "altLineId": 12960927318,
                  "hdp": 2.5,
                  "home": -234.0,
                  "away": 184.0
                },
                {
                  "altLineId": 12960927320,
                  "hdp": 2.0,
                  "home": -193.0,
                  "away": 158.0
                },
                {
                  "altLineId": 12960927322,
                  "hdp": 1.0,
                  "home": -111.0,
                  "away": -107.0
                }
              ],
              "moneyline": {
                "home": 119.0,
                "away": -140.0
              },
              "totals": [
                {
                  "points": 8.5,
                  "over": -101.0,
                  "under": -115.0
                },
                {
                  "altLineId": 12960927317,
                  "points": 7.0,
                  "over": -189.0,
                  "under": 158.0
                },
                {
                  "altLineId": 12960927319,
                  "points": 7.5,
                  "over": -142.0,
                  "under": 121.0
                },
                {
                  "altLineId": 12960927321,
                  "points": 8.0,
                  "over": -121.0,
                  "under": 103.0
                },
                {
                  "altLineId": 12960927323,
                  "points": 9.0,
                  "over": 123.0,
                  "under": -145.0
                },
                {
                  "altLineId": 12960927325,
                  "points": 9.5,
                  "over": 146.0,
                  "under": -173.0
                },
                {
                  "altLineId": 12960927327,
                  "points": 10.0,
                  "over": 177.0,
                  "under": -212.0
                }
              ],
              "teamTotal": {
                "home": {
                  "points": 3.5,
                  "over": -107.0,
                  "under": -109.0
                },
                "away": {
                  "points": 4.5,
                  "over": 112.0,
                  "under": -131.0
                }
              }
            },
            {
              "lineId": 997487164,
              "number": 1,
              "cutoff": "2020-05-08T09:30:00Z",
              "maxSpread": 100.0,
              "maxTotal": 100.0,
              "maxTeamTotal": 100.0,
              "status": 1,
              "spreads": [
                {
                  "hdp": 0.0,
                  "home": 125.0,
                  "away": -146.0
                },
                {
                  "altLineId": 12960927574,
                  "hdp": 1.0,
                  "home": -169.0,
                  "away": 137.0
                },
                {
                  "altLineId": 12960927576,
                  "hdp": 0.5,
                  "home": -116.0,
                  "away": -102.0
                },
                {
                  "altLineId": 12960927578,
                  "hdp": -0.5,
                  "home": 163.0,
                  "away": -199.0
                },
                {
                  "altLineId": 12960927580,
                  "hdp": -1.0,
                  "home": 237.0,
                  "away": -312.0
                }
              ],
              "totals": [
                {
                  "points": 4.5,
                  "over": -103.0,
                  "under": -113.0
                },
                {
                  "altLineId": 12960927575,
                  "points": 3.5,
                  "over": -177.0,
                  "under": 149.0
                },
                {
                  "altLineId": 12960927577,
                  "points": 4.0,
                  "over": -139.0,
                  "under": 118.0
                },
                {
                  "altLineId": 12960927579,
                  "points": 5.0,
                  "over": 128.0,
                  "under": -150.0
                },
                {
                  "altLineId": 12960927581,
                  "points": 5.5,
                  "over": 157.0,
                  "under": -186.0
                }
              ],
              "teamTotal": {
                "home": {
                  "points": 1.5,
                  "over": -122.0,
                  "under": 104.0
                },
                "away": {
                  "points": 2.5,
                  "over": 116.0,
                  "under": -136.0
                }
              }
            }
          ]
        },
        {
          "id": 1122119268,
          "periods": [
            {
              "lineId": 997487144,
              "number": 0,
              "cutoff": "2020-05-08T09:30:00Z",
              "maxSpread": 250.0,
              "maxMoneyline": 300.0,
              "maxTotal": 250.0,
              "maxTeamTotal": 100.0,
              "status": 1,
              "spreads": [
                {
                  "hdp": 1.5,
                  "home": -156.0,
                  "away": 133.0
                },
                {
                  "altLineId": 12960927241,
                  "hdp": 3.0,
                  "home": -379.0,
                  "away": 272.0
                },
                {
                  "altLineId": 12960927243,
                  "hdp": 2.5,
                  "home": -268.0,
                  "away": 208.0
                },
                {
                  "altLineId": 12960927245,
                  "hdp": 2.0,
                  "home": -219.0,
                  "away": 178.0
                },
                {
                  "altLineId": 12960927247,
                  "hdp": 1.0,
                  "home": -115.0,
                  "away": -104.0
                }
              ],
              "moneyline": {
                "home": 122.0,
                "away": -143.0
              },
              "totals": [
                {
                  "points": 8.0,
                  "over": 101.0,
                  "under": -118.0
                },
                {
                  "altLineId": 12960927242,
                  "points": 6.5,
                  "over": -194.0,
                  "under": 162.0
                },
                {
                  "altLineId": 12960927244,
                  "points": 7.0,
                  "over": -158.0,
                  "under": 134.0
                },
                {
                  "altLineId": 12960927246,
                  "points": 7.5,
                  "over": -119.0,
                  "under": 102.0
                },
                {
                  "altLineId": 12960927248,
                  "points": 8.5,
                  "over": 120.0,
                  "under": -141.0
                },
                {
                  "altLineId": 12960927250,
                  "points": 9.0,
                  "over": 150.0,
                  "under": -178.0
                },
                {
                  "altLineId": 12960927253,
                  "points": 9.5,
                  "over": 172.0,
                  "under": -207.0
                }
              ],
              "teamTotal": {
                "home": {
                  "points": 3.5,
                  "over": -106.0,
                  "under": -110.0
                },
                "away": {
                  "points": 3.5,
                  "over": -133.0,
                  "under": 113.0
                }
              }
            },
            {
              "lineId": 997487156,
              "number": 1,
              "cutoff": "2020-05-08T09:30:00Z",
              "maxSpread": 100.0,
              "maxTotal": 100.0,
              "maxTeamTotal": 100.0,
              "status": 1,
              "spreads": [
                {
                  "hdp": 0.0,
                  "home": 140.0,
                  "away": -166.0
                },
                {
                  "altLineId": 12960927446,
                  "hdp": 1.0,
                  "home": -161.0,
                  "away": 131.0
                },
                {
                  "altLineId": 12960927448,
                  "hdp": 0.5,
                  "home": -107.0,
                  "away": -111.0
                },
                {
                  "altLineId": 12960927450,
                  "hdp": -0.5,
                  "home": 183.0,
                  "away": -226.0
                },
                {
                  "altLineId": 12960927452,
                  "hdp": -1.0,
                  "home": 269.0,
                  "away": -362.0
                }
              ],
              "totals": [
                {
                  "points": 4.0,
                  "over": -110.0,
                  "under": -106.0
                },
                {
                  "altLineId": 12960927447,
                  "points": 3.0,
                  "over": -219.0,
                  "under": 182.0
                },
                {
                  "altLineId": 12960927449,
                  "points": 3.5,
                  "over": -145.0,
                  "under": 124.0
                },
                {
                  "altLineId": 12960927451,
                  "points": 4.5,
                  "over": 120.0,
                  "under": -141.0
                },
                {
                  "altLineId": 12960927453,
                  "points": 5.0,
                  "over": 163.0,
                  "under": -195.0
                }
              ],
              "teamTotal": {
                "home": {
                  "points": 1.5,
                  "over": -101.0,
                  "under": -115.0
                },
                "away": {
                  "points": 2.5,
                  "over": 128.0,
                  "under": -150.0
                }
              }
            }
          ]
        },
        {
          "id": 1122119266,
          "periods": [
            {
              "lineId": 997487139,
              "number": 0,
              "cutoff": "2020-05-08T09:30:00Z",
              "maxSpread": 250.0,
              "maxMoneyline": 300.0,
              "maxTotal": 250.0,
              "maxTeamTotal": 100.0,
              "status": 1,
              "spreads": [
                {
                  "hdp": 1.5,
                  "home": -161.0,
                  "away": 137.0
                },
                {
                  "altLineId": 12960927172,
                  "hdp": 3.0,
                  "home": -354.0,
                  "away": 257.0
                },
                {
                  "altLineId": 12960927174,
                  "hdp": 2.5,
                  "home": -259.0,
                  "away": 202.0
                },
                {
                  "altLineId": 12960927176,
                  "hdp": 2.0,
                  "home": -217.0,
                  "away": 176.0
                },
                {
                  "altLineId": 12960927178,
                  "hdp": 1.0,
                  "home": -125.0,
                  "away": 105.0
                }
              ],
              "moneyline": {
                "home": 109.0,
                "away": -127.0
              },
              "totals": [
                {
                  "points": 9.5,
                  "over": 102.0,
                  "under": -120.0
                },
                {
                  "altLineId": 12960927173,
                  "points": 8.0,
                  "over": -183.0,
                  "under": 154.0
                },
                {
                  "altLineId": 12960927175,
                  "points": 8.5,
                  "over": -151.0,
                  "under": 129.0
                },
                {
                  "altLineId": 12960927177,
                  "points": 9.0,
                  "over": -123.0,
                  "under": 105.0
                },
                {
                  "altLineId": 12960927179,
                  "points": 10.0,
                  "over": 122.0,
                  "under": -144.0
                },
                {
                  "altLineId": 12960927181,
                  "points": 10.5,
                  "over": 140.0,
                  "under": -166.0
                },
                {
                  "altLineId": 12960927183,
                  "points": 11.0,
                  "over": 177.0,
                  "under": -212.0
                }
              ],
              "teamTotal": {
                "home": {
                  "points": 4.5,
                  "over": 108.0,
                  "under": -126.0
                },
                "away": {
                  "points": 4.5,
                  "over": -102.0,
                  "under": -114.0
                }
              }
            },
            {
              "lineId": 997487160,
              "number": 1,
              "cutoff": "2020-05-08T09:30:00Z",
              "maxSpread": 100.0,
              "maxTotal": 100.0,
              "maxTeamTotal": 100.0,
              "status": 1,
              "spreads": [
                {
                  "hdp": 0.0,
                  "home": 104.0,
                  "away": -121.0
                },
                {
                  "altLineId": 12960927510,
                  "hdp": 1.0,
                  "home": -190.0,
                  "away": 153.0
                },
                {
                  "altLineId": 12960927512,
                  "hdp": 0.5,
                  "home": -133.0,
                  "away": 111.0
                },
                {
                  "altLineId": 12960927514,
                  "hdp": -0.5,
                  "home": 136.0,
                  "away": -163.0
                },
                {
                  "altLineId": 12960927516,
                  "hdp": -1.0,
                  "home": 191.0,
                  "away": -243.0
                }
              ],
              "totals": [
                {
                  "points": 5.0,
                  "over": -115.0,
                  "under": -102.0
                },
                {
                  "altLineId": 12960927511,
                  "points": 4.0,
                  "over": -207.0,
                  "under": 172.0
                },
                {
                  "altLineId": 12960927513,
                  "points": 4.5,
                  "over": -147.0,
                  "under": 125.0
                },
                {
                  "altLineId": 12960927515,
                  "points": 5.5,
                  "over": 113.0,
                  "under": -132.0
                },
                {
                  "altLineId": 12960927517,
                  "points": 6.0,
                  "over": 150.0,
                  "under": -178.0
                }
              ],
              "teamTotal": {
                "home": {
                  "points": 2.5,
                  "over": 118.0,
                  "under": -138.0
                },
                "away": {
                  "points": 2.5,
                  "over": 101.0,
                  "under": -118.0
                }
              }
            }
          ]
        },
        {
          "id": 1122119267,
          "periods": [
            {
              "lineId": 997487177,
              "number": 0,
              "cutoff": "2020-05-08T09:30:00Z",
              "maxSpread": 250.0,
              "maxMoneyline": 300.0,
              "maxTotal": 250.0,
              "maxTeamTotal": 100.0,
              "status": 1,
              "spreads": [
                {
                  "hdp": -1.5,
                  "home": -108.0,
                  "away": -108.0
                },
                {
                  "altLineId": 12960927816,
                  "hdp": -1.0,
                  "home": -157.0,
                  "away": 131.0
                },
                {
                  "altLineId": 12960927818,
                  "hdp": -2.0,
                  "home": 114.0,
                  "away": -136.0
                },
                {
                  "altLineId": 12960927820,
                  "hdp": -2.5,
                  "home": 135.0,
                  "away": -166.0
                },
                {
                  "altLineId": 12960927822,
                  "hdp": -3.0,
                  "home": 165.0,
                  "away": -211.0
                }
              ],
              "moneyline": {
                "home": -205.0,
                "away": 171.0
              },
              "totals": [
                {
                  "points": 9.0,
                  "over": -118.0,
                  "under": 101.0
                },
                {
                  "altLineId": 12960927813,
                  "points": 7.5,
                  "over": -196.0,
                  "under": 164.0
                },
                {
                  "altLineId": 12960927815,
                  "points": 8.0,
                  "over": -172.0,
                  "under": 146.0
                },
                {
                  "altLineId": 12960927817,
                  "points": 8.5,
                  "over": -142.0,
                  "under": 121.0
                },
                {
                  "altLineId": 12960927819,
                  "points": 9.5,
                  "over": 103.0,
                  "under": -120.0
                },
                {
                  "altLineId": 12960927821,
                  "points": 10.0,
                  "over": 118.0,
                  "under": -138.0
                },
                {
                  "altLineId": 12960927823,
                  "points": 10.5,
                  "over": 131.0,
                  "under": -154.0
                }
              ],
              "teamTotal": {
                "home": {
                  "points": 5.5,
                  "over": 107.0,
                  "under": -126.0
                },
                "away": {
                  "points": 3.5,
                  "over": -108.0,
                  "under": -108.0
                }
              }
            },
            {
              "lineId": 997487181,
              "number": 1,
              "cutoff": "2020-05-08T09:30:00Z",
              "maxSpread": 100.0,
              "maxTotal": 100.0,
              "maxTeamTotal": 100.0,
              "status": 1,
              "spreads": [
                {
                  "hdp": 0.0,
                  "home": -177.0,
                  "away": 149.0
                },
                {
                  "altLineId": 12960927878,
                  "hdp": 1.0,
                  "home": -371.0,
                  "away": 274.0
                },
                {
                  "altLineId": 12960927880,
                  "hdp": 0.5,
                  "home": -229.0,
                  "away": 185.0
                },
                {
                  "altLineId": 12960927882,
                  "hdp": -0.5,
                  "home": -125.0,
                  "away": 105.0
                },
                {
                  "altLineId": 12960927884,
                  "hdp": -1.0,
                  "home": 106.0,
                  "away": -129.0
                }
              ],
              "totals": [
                {
                  "points": 5.0,
                  "over": -117.0,
                  "under": 100.0
                },
                {
                  "altLineId": 12960927879,
                  "points": 4.0,
                  "over": -212.0,
                  "under": 176.0
                },
                {
                  "altLineId": 12960927881,
                  "points": 4.5,
                  "over": -150.0,
                  "under": 128.0
                },
                {
                  "altLineId": 12960927883,
                  "points": 5.5,
                  "over": 111.0,
                  "under": -129.0
                },
                {
                  "altLineId": 12960927885,
                  "points": 6.0,
                  "over": 146.0,
                  "under": -173.0
                }
              ],
              "teamTotal": {
                "home": {
                  "points": 2.5,
                  "over": -128.0,
                  "under": 109.0
                },
                "away": {
                  "points": 1.5,
                  "over": -134.0,
                  "under": 114.0
                }
              }
            }
          ]
        },
        {
          "id": 1122119281,
          "periods": [
            {
              "lineId": 997486950,
              "number": 0,
              "cutoff": "2020-05-08T09:30:00Z",
              "maxSpread": 250.0,
              "maxMoneyline": 300.0,
              "maxTotal": 250.0,
              "maxTeamTotal": 100.0,
              "status": 1,
              "spreads": [
                {
                  "hdp": -1.5,
                  "home": 101.0,
                  "away": -117.0
                },
                {
                  "altLineId": 12960923938,
                  "hdp": -1.0,
                  "home": -145.0,
                  "away": 121.0
                },
                {
                  "altLineId": 12960923940,
                  "hdp": -2.0,
                  "home": 124.0,
                  "away": -148.0
                },
                {
                  "altLineId": 12960923942,
                  "hdp": -2.5,
                  "home": 144.0,
                  "away": -178.0
                },
                {
                  "altLineId": 12960923944,
                  "hdp": -3.0,
                  "home": 176.0,
                  "away": -227.0
                }
              ],
              "moneyline": {
                "home": -193.0,
                "away": 162.0
              },
              "totals": [
                {
                  "points": 9.0,
                  "over": -108.0,
                  "under": -108.0
                },
                {
                  "altLineId": 12960923935,
                  "points": 7.5,
                  "over": -180.0,
                  "under": 152.0
                },
                {
                  "altLineId": 12960923937,
                  "points": 8.0,
                  "over": -159.0,
                  "under": 134.0
                },
                {
                  "altLineId": 12960923939,
                  "points": 8.5,
                  "over": -133.0,
                  "under": 113.0
                },
                {
                  "altLineId": 12960923941,
                  "points": 9.5,
                  "over": 113.0,
                  "under": -133.0
                },
                {
                  "altLineId": 12960923943,
                  "points": 10.0,
                  "over": 132.0,
                  "under": -155.0
                },
                {
                  "altLineId": 12960923945,
                  "points": 10.5,
                  "over": 147.0,
                  "under": -174.0
                }
              ],
              "teamTotal": {
                "home": {
                  "points": 4.5,
                  "over": -133.0,
                  "under": 114.0
                },
                "away": {
                  "points": 3.5,
                  "over": -115.0,
                  "under": -101.0
                }
              }
            },
            {
              "lineId": 997486954,
              "number": 1,
              "cutoff": "2020-05-08T09:30:00Z",
              "maxSpread": 100.0,
              "maxTotal": 100.0,
              "maxTeamTotal": 100.0,
              "status": 1,
              "spreads": [
                {
                  "hdp": 0.0,
                  "home": -159.0,
                  "away": 135.0
                },
                {
                  "altLineId": 12960924000,
                  "hdp": 1.0,
                  "home": -343.0,
                  "away": 257.0
                },
                {
                  "altLineId": 12960924002,
                  "hdp": 0.5,
                  "home": -210.0,
                  "away": 171.0
                },
                {
                  "altLineId": 12960924004,
                  "hdp": -0.5,
                  "home": -113.0,
                  "away": -105.0
                },
                {
                  "altLineId": 12960924006,
                  "hdp": -1.0,
                  "home": 120.0,
                  "away": -146.0
                }
              ],
              "totals": [
                {
                  "points": 4.5,
                  "over": -119.0,
                  "under": 102.0
                },
                {
                  "altLineId": 12960924001,
                  "points": 3.5,
                  "over": -210.0,
                  "under": 174.0
                },
                {
                  "altLineId": 12960924003,
                  "points": 4.0,
                  "over": -166.0,
                  "under": 140.0
                },
                {
                  "altLineId": 12960924005,
                  "points": 5.0,
                  "over": 112.0,
                  "under": -131.0
                },
                {
                  "altLineId": 12960924007,
                  "points": 5.5,
                  "over": 143.0,
                  "under": -169.0
                }
              ],
              "teamTotal": {
                "home": {
                  "points": 2.5,
                  "over": -104.0,
                  "under": -113.0
                },
                "away": {
                  "points": 1.5,
                  "over": -123.0,
                  "under": 105.0
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": 208753,
      "events": [
        {
          "id": 1122124150,
          "periods": [
            {
              "lineId": 997483553,
              "number": 0,
              "cutoff": "2020-05-08T10:35:00Z",
              "maxSpread": 100.0,
              "maxMoneyline": 100.0,
              "maxTotal": 100.0,
              "maxTeamTotal": 100.0,
              "status": 1,
              "spreads": [
                {
                  "hdp": -1.5,
                  "home": -114.0,
                  "away": -127.0
                }
              ],
              "moneyline": {
                "home": -169.0,
                "away": 115.0
              },
              "totals": [
                {
                  "points": 14.0,
                  "over": -127.0,
                  "under": -114.0
                }
              ],
              "teamTotal": {
                "home": {
                  "points": 7.5,
                  "over": -126.0,
                  "under": -124.0
                },
                "away": {
                  "points": 6.5,
                  "over": -103.0,
                  "under": -154.0
                }
              }
            },
            {
              "lineId": 997483558,
              "number": 1,
              "cutoff": "2020-05-08T10:35:00Z",
              "maxSpread": 100.0,
              "maxTotal": 100.0,
              "maxTeamTotal": 100.0,
              "status": 1,
              "spreads": [
                {
                  "hdp": 0.0,
                  "home": -167.0,
                  "away": 114.0
                }
              ],
              "totals": [
                {
                  "points": 7.5,
                  "over": -119.0,
                  "under": -121.0
                }
              ],
              "teamTotal": {
                "home": {
                  "points": 4.5,
                  "over": 103.0,
                  "under": -164.0
                },
                "away": {
                  "points": 3.5,
                  "over": -116.0,
                  "under": -135.0
                }
              }
            }
          ]
        }
      ]
    }
  ]
};

// function mergeFixturesAndOdds(fixtures, odds) {
//   // loop through events and find the corresponding event object and combine
//   if (fixtures) {
//     if (odds) {
//       odds.leagues.forEach((oddsLeague) => {
//         fixtures.oddsLast = odds.last;
//         fixtures.league.forEach((fixturesLeague) => {
//           if (oddsLeague.id === fixturesLeague.id) {
//             oddsLeague.events.forEach((oddsEvent) => {
//               fixturesLeague.events.forEach((fixturesEvent, fei) => {
//                 if (oddsEvent.id === fixturesEvent.id) {
//                   // add props from odds event to fixtures event
//                   fixturesLeague.events[fei] = {
//                     ...fixturesEvent,
//                     ...oddsEvent,
//                   };
//                 }
//               });
//             });
//           }
//         });
//       });
//     }
//     return fixtures;
//   }
// }

// function formatSportData(fixtures, odds) {
//   const mergedData = mergeFixturesAndOdds(fixtures, odds);
//   if (mergedData) {
//     const sportData = {
//       pinnacleSportId: mergedData.sportId,
//       pinnacleFixturesLast: mergedData.last,
//       pinnacleOddsLast: mergedData.oddsLast,
//       pinnacleSportId: mergedData.sportId,
//       leagues: [],
//     };
//     mergedData.league.forEach(league => {
//       const leagueData = {
//         pinnacleId: league.id,
//         name: league.name,
//         events: [],
//       };
//       sportData.leagues.push(leagueData);
//       league.events.forEach(event => {
//         const {
//           id,
//           starts,
//           home,
//           away,
//           // rotNum,
//           // liveStatus,
//           // status,
//           // parlayRestriction,
//           // altTeaser,
//           // resultingUnit,
//           periods,
//         } = event;
//         const parsedEvent = {
//           // sportName: ,
//           // leagueName: league.name,
//           // pinnacleLeagueId: league.id,
//           // pinnacleFixturesLast: mergedData.last,
//           // pinnacleOddsLast: mergedData.oddsLast,
//           // pinnacleSportId: mergedData.sportId,
//         };
//         if (id) parsedEvent.pinnacleId = id;
//         if (starts) parsedEvent.startDate = starts;
//         if (home) parsedEvent.teamA = home;
//         if (away) parsedEvent.teamB = away;
//         if (periods) {
//           parsedEvent.lines = [];
//           periods.forEach(period => {
//             const {
//               lineId,
//               number,
//               cutoff,
//               maxSpread,
//               maxMoneyline,
//               maxTotal,
//               maxTeamTotal,
//               status,
//               spreads,
//               moneyline,
//               totals,
//               teamTotal,
//             } = period;

//             const line = {};
//             if (lineId) line.pinnacleId = lineId;
//             // if (number) line.number = number;
//             if (cutoff) line.endDate = cutoff;
//             if (maxSpread) line.maxSpread = maxSpread;
//             if (maxMoneyline) line.maxMoneyline = maxMoneyline;
//             if (maxTotal) line.maxTotal = maxTotal;
//             if (maxTeamTotal) line.maxTeamTotal = maxTeamTotal;
//             if (status) line.status = status;
//             if (spreads) line.spreads = spreads;
//             if (moneyline) line.moneyline = moneyline;
//             // console.log('moneyline', moneyline);
//             // console.log(spreads);
//             if (totals) line.totals = totals;
//             if (teamTotal) line.teamTotal = teamTotal;
//             parsedEvent.lines.push(line);
//           });
//         }
//         // console.log('event:');
//         // console.log(parsedEvent);
//         leagueData.events.push(parsedEvent);
//         // console.log(event);
//       });
//     });
//     return sportData;
//   }
// }

// const formattedSportData = formatLines(fixtures, odds);
const formattedSportData = formatFixturesOdds(fixtures, odds);
console.log(JSON.stringify(formattedSportData));
// console.log(JSON.stringify(mergeFixturesAndOdds(fixtures, odds)));
// console.log(mergedData);
