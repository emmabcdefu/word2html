var results = [{
    "name": "AUT",
    "percentfull": 90,
    "gastorage": 86.02,
}, {
    "name": "BEL",
    "percentfull": 98,
    "gastorage": 8.78,
}, {
    "name": "BGR",
    "percentfull": 98,
    "gastorage": 6.14,
}, {
    "name": "HRV",
    "percentfull": 85,
    "gastorage": 4.93,
}, {
    "name": "CZE",
    "percentfull": 98,
    "gastorage": 35.22,
}, {
    "name": "DNK",
    "percentfull": 96,
    "gastorage": 10.35,
}, {
    "name": "FRA",
    "percentfull": 97,
    "gastorage": 127.58,
}, {
    "name": "DEU",
    "percentfull": 94,
    "gastorage": 212.75,
}, {
    "name": "HUN",
    "percentfull": 97,
    "gastorage": 67.88,
}, {
    "name": "ITA",
    "percentfull": 98,
    "gastorage": 193.33,
}, {
    "name": "LVA",
    "percentfull": 83,
    "gastorage": 21.21,
}, {
    "name": "NLD",
    "percentfull": 91,
    "gastorage": 127.39,
}, {
    "name": "POL",
    "percentfull": 99,
    "gastorage": 35.30,
}, {
    "name": "PRT",
    "percentfull": 100,
    "gastorage": 3.63,
}, {
    "name": "ROU",
    "percentfull": 90,
    "gastorage": 30.39,
}, {
    "name": "SRB",
    "percentfull": 0,
    "gastorage": 0,
}, {
    "name": "SVK",
    "percentfull": 92,
    "gastorage": 39.18,
}, {
    "name": "ESP",
    "percentfull": 95,
    "gastorage": 32.42,
}, {
    "name": "SWE",
    "percentfull": 78,
    "gastorage": 0.08,
}, {
    "name": "GBR",
    "percentfull": 56,
    "gastorage": 9.02,
}];

var countryNames = {
    "AUT": "Austria",
    "BEL": "Belgium",
    "BGR": "Bulgaria",
    "HRV": "Croatia",
    "CZE": "Czechia",
    "DNK": "Denmark",
    "FRA": "France",
    "DEU": "Germany",
    "HUN": "Hungary",
    "ITA": "Italy",
    "LVA": "Latvia",
    "NLD": "Netherlands",
    "POL": "Poland",
    "PRT": "Portugal",
    "ROU": "Romania",
    "SRB": "Serbia",
    "SVK": "Slovakia",
    "ESP": "Spain",
    "SWE": "Sweden",
    "GBR": "United Kingdom",
};

var colorGradient = ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"];

function setResults() {
      var countryResults = {};

      results.forEach(function (country) {
        var countryName = country.name;
        var colorIndex = country.percentfull == 100 ? 6 : country.percentfull >= 90 ? 5 : country.percentfull >= 80 ? 4 : country.percentfull >= 70 ? 3 : country.percentfull >= 60 ? 2 : country.percentfull >= 50 ? 1 : 0;
        var styleObject = {
          "background-color": colorGradient[colorIndex],
          "label": {
            "font-size": 14
          },
          "tooltip": {
            "text": countryNames[countryName] + " has " + country.gastorage + 'TWh Gas in their storages wich represent ' + country.percentfull + "% of their capicity.",
            "width": 200,
            "wrap-text": true,
            "text-align": "left",
            "font-size": 18
          }
        };
        countryResults[countryName] = styleObject;
      });

    return {
        "background-color": "#FFF",
        "globals": {
            "font-family": "Open Sans Condensed",
            "shadow": false
        },
        "title": {
            "text": "Inventory Level on 30th September",
            "background-color": "#FFF",
            "color": "#333",
            "font-size": 24,
            "text-align": "left",
            "offset-x": 40,
        },
        "legend": {
            "toggle-action": "none",
            "offset-y": -10,
            "border-width": 1,
            "background-color": "none",
            "vertical-align": "bottom",
            "marker": {
                "type": "rectangle",
                "width": 20,
                "height": 10,
            },
            "item": {
                "font-size": 16
            }
        },
        "series": [ // render legend items
            {
                "legend-item": {
                    "text": "no info"
                },
                "legend-marker": {
                    "background-color": "#dddddd",
                }
            },
            {
                "legend-item": {
                    "text": "40%"
                },
                "legend-marker": {
                    "background-color": "#feebe2",
                }
            },
            {
                "legend-item": {
                    "text": "50%"
                },
                "legend-marker": {
                    "background-color": "#fcc5c0",
                }
            },
            {
                "legend-item": {
                    "text": "60%"
                },
                "legend-marker": {
                    "background-color": "#fa9fb5",
                }
            },
            {
                "legend-item": {
                    "text": "70%"
                },
                "legend-marker": {
                    "background-color": "#f768a1",
                }
            },
            {
                "legend-item": {
                    "text": "80%"
                },
                "legend-marker": {
                    "background-color": "#dd3497",
                }
            },
            {
                "legend-item": {
                    "text": "90%"
                },
                "legend-marker": {
                    "background-color": "#ae017e",
                }
            },
            {
                "legend-item": {
                    "text": "100%"
                },
                "legend-marker": {
                    "background-color": "#7a0177",
                }
            }
        ],
        "shapes": [ // render map
            {
                "type": "zingchart.maps",
                "options": {
                    zoom: 1.5,
                    offsetY: -150,
                    id: "map",
                    name: 'world.countries',
                    ignore: ['TUR', 'CYP', 'RUS', 'ISL'],
                    groups: ['EUROPE'],
                    "scale": true,
                    "style": {
                        "hover-country": {
                            "background-color": "#FFF",
                            "alpha": 0.3,
                            "border-width": 3
                        },
                        "border-color": "#FFF",
                        "items": countryResults
                    }
                }
            }
        ]
    }
}


// renders chart
zingchart.loadModules('maps, maps-world-countries', function (e) {
    zingchart.render({
        id: 'myChart',
        data: setResults(),
        height: 800,
        width: 1200
    });
});