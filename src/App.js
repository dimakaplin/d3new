import React, {Component} from 'react';
import './App.css';
import * as d3 from "d3";
import jsPDF from "jspdf"
import canvg from "canvg";
import {Button, Col, Container, Form, Row} from "react-bootstrap";


const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
};

const dataCustom = [{
    name: "ExBuild",
    steps: [
        {date: "2017-11-17", step: "монтаж1"},
        {date: "2018-11-18", step: "монтаж2"},
        {date: "2019-05-19", step: "монтаж3"},
        {date: "2020-11-20", step: "монтаж4"},
        {date: "2021-11-21", step: "монтаж5"},
        {date: "2022-3-22", step: "монтаж6"},
        {date: "2023-11-23", step: "монтаж7"},
        {date: "2024-05-24", step: "монтаж8"},
    ],
    real: [

        {date: "2017-11-17", step: "монтаж1", status: "done"},
        {date: "2018-12-18", step: "монтаж2", status: "bad"},
        {date: "2019-05-19", step: "монтаж3", status: "done"},
        {date: "2020-11-20", step: "монтаж4", status: "plan"},
        {date: "2021-12-21", step: "монтаж5", status: "plan"},
        {date: "2022-7-22", step: "монтаж6", status: "plan"},
        {date: "2023-11-23", step: "монтаж7", status: "plan"},
        {date: "2024-8-24", step: "монтаж8", status: "plan"},
    ]
},
    {
        name: "ExBuild2",
        steps: [
            {date: "2017-3-17", step: "монтаж1"},
            {date: "2018-11-18", step: "монтаж2"},
            {date: "2019-05-19", step: "монтаж3"},
            {date: "2020-5-20", step: "монтаж4"},
            {date: "2021-11-21", step: "монтаж5"},
            {date: "2022-3-22", step: "монтаж6"},
            {date: "2023-9-23", step: "монтаж7"},

        ],
        real: [

            {date: "2017-3-17", step: "монтаж1", status: "done"},
            {date: "2018-12-18", step: "монтаж2", status: "bad"},
            {date: "2019-05-19", step: "монтаж3", status: "done"},
            {date: "2020-5-20", step: "монтаж4", status: "plan"},
            {date: "2021-12-21", step: "монтаж5", status: "plan"},
            {date: "2022-7-22", step: "монтаж6", status: "plan"},
            {date: "2023-9-23", step: "монтаж7", status: "plan"},

        ]
    },
    {
        name: "ExBuild3",
        steps: [
            {date: "2017-3-17", step: "монтаж1"},
            {date: "2018-2-18", step: "монтаж2"},
            {date: "2019-05-19", step: "монтаж3"},
            {date: "2020-5-20", step: "монтаж4"},
            {date: "2021-11-21", step: "монтаж5"},
            {date: "2022-3-22", step: "монтаж6"},
            {date: "2023-9-23", step: "монтаж7"},

        ],
        real: [

            {date: "2017-4-17", step: "монтаж1", status: "bad"},
            {date: "2018-6-18", step: "монтаж2", status: "bad"},
            {date: "2019-05-19", step: "монтаж3", status: "done"},
            {date: "2020-5-20", step: "монтаж4", status: "plan"},
            {date: "2021-12-21", step: "монтаж5", status: "plan"},
            {date: "2022-7-22", step: "монтаж6", status: "plan"},
            {date: "2023-9-23", step: "монтаж7", status: "plan"},

        ]
    },

];


class App extends Component {

    state = {
        startFirst: '',
        endFirst: '',
        startSecond: '',
        endSecond: '',

        dataFirst: [],
        dataSecond: [],
        yearsFirst: [],
        yearsSecond: [],
        allData: [],
        rangeValidFirst: true,
        rangeValidSecond: true,

        firstSelector: "#first-info",
        secondSelector: "#second-info",

        showFirst: true,
        showSecond: true,

    }

    componentDidMount() {
        this.createLegend();
        this.initCharts();

    }

    initCharts = () => {
        this.setState(() => ({
                dataFirst: dataCustom[0], startFirst: dataCustom[0].steps[0].date.substring(0, 4),
                endFirst: dataCustom[0].steps[dataCustom[0].steps.length - 1].date.substring(0, 4),
                dataSecond: dataCustom[1], startSecond: dataCustom[1].steps[0].date.substring(0, 4),
                endSecond: dataCustom[1].steps[dataCustom[1].steps.length - 1].date.substring(0, 4)
            }),
            () => {
                let dataFirst = this.state.dataFirst;
                let dataSecond = this.state.dataSecond;
                let yearsFirst = [];
                let yearsSecond = [];
                dataFirst.steps.forEach((d) => {
                    let year = d.date.substring(0, 4);
                    if (!yearsFirst.includes(year)) {
                        yearsFirst.push(year);
                    }
                });
                dataSecond.steps.forEach((d) => {
                    let year = d.date.substring(0, 4);
                    if (!yearsSecond.includes(year)) {
                        yearsSecond.push(year);
                    }
                });
                let namesArr = dataCustom.map((d) => {
                    return d.name;
                })

                this.setState({yearsFirst: yearsFirst, yearsSecond: yearsSecond, allData: namesArr});

                let startIndexFirst = this.finedIndexes(dataFirst.steps, this.state.startFirst); // years.indexOf(this.state.start);
                let endIndexFirst = this.finedIndexes(dataFirst.real, this.state.endFirst); // years.indexOf(this.state.end);
                let stepsFirst = dataFirst.steps.slice(startIndexFirst[0], endIndexFirst[endIndexFirst.length - 1] + 1);
                let realFirst = dataFirst.real.slice(startIndexFirst[0], endIndexFirst[endIndexFirst.length - 1] + 1);
                dataFirst = {name: dataFirst.name, steps: stepsFirst, real: realFirst};
                this.createChart(dataFirst, this.state.firstSelector);

                let startIndexSecond = this.finedIndexes(dataSecond.steps, this.state.startSecond); // years.indexOf(this.state.start);
                let endIndexSecond = this.finedIndexes(dataSecond.real, this.state.endSecond); // years.indexOf(this.state.end);
                let stepsSecond = dataSecond.steps.slice(startIndexSecond[0], endIndexFirst[endIndexSecond.length - 1] + 1);
                let realSecond = dataSecond.real.slice(startIndexSecond[0], endIndexSecond[endIndexSecond.length - 1] + 1);
                dataSecond = {name: dataSecond.name, steps: stepsSecond, real: realSecond};
                this.createChart(dataSecond, this.state.secondSelector);
            });
    }

    svgToPdf = () => {
        let doc = new jsPDF('landscape', 'pt', 'a4');
        let canvas = document.createElement('canvas');
        canvas.setAttribute('width', "1200");
        canvas.setAttribute('height', "1000");

        let svg = document.querySelectorAll("svg");


        Array.from(svg).forEach((d, i) => {
            canvg(canvas, d.innerHTML);
            let image = canvas.toDataURL('image/png');
            if (i === 0) {
                doc.addImage(image, 'PNG', 20, 30, 800, 600);
            } else if (i === 1) {
                doc.addImage(image, 'PNG', 20, 60, 800, 600);
            } else {
                doc.addImage(image, 'PNG', 20, 190, 800, 600);
            }

        });

        doc.save('build-plan.pdf');


    };

    changeBuild = (e) => {

        let id = e.target.id;
        let name = e.target.value;
        let index = this.state.allData.indexOf(name);

        switch (id) {
            case "build-first":
                this.setState(() => ({
                        dataFirst: dataCustom[index], startFirst: dataCustom[index].steps[0].date.substring(0, 4),
                        endFirst: dataCustom[index].steps[dataCustom[index].steps.length - 1].date.substring(0, 4)
                    }),
                    () => {
                        let data = this.state.dataFirst;
                        let years = [];
                        data.steps.forEach((d) => {
                            let year = d.date.substring(0, 4);
                            if (!years.includes(year)) {
                                years.push(year);
                            }
                        });
                        this.setState({yearsFirst: years});
                        if (this.state.showSecond) {
                            this.updateSVG(this.state.firstSelector)
                        }
                    });
                break;
            case "build-second":
                this.setState(() => ({
                        dataSecond: dataCustom[index], startSecond: dataCustom[index].steps[0].date.substring(0, 4),
                        endSecond: dataCustom[index].steps[dataCustom[index].steps.length - 1].date.substring(0, 4)
                    }),
                    () => {
                        let data = this.state.dataSecond;
                        let years = [];
                        data.steps.forEach((d) => {
                            let year = d.date.substring(0, 4);
                            if (!years.includes(year)) {
                                years.push(year);
                            }
                        });
                        this.setState({yearsSecond: years});
                        if (this.state.showSecond) {
                            this.updateSVG(this.state.secondSelector)
                        }


                    });
                break;

        }


    }

    updateSVG = (selector) => {

        this.deleteSVG(selector);
        this.createSVG(selector);

    }

    createLegend = () => {
        const legendInfo = [
            {status: "done", name: "пройденные вехи в срок"},
            {status: "bad", name: "срыв"},
            {status: "plan", name: "даты согласно контрактного графика"},
            {status: "realPlan", name: "прогноз"},
        ];
        let svg = d3.select("#info")
            .append("svg")
            .attr("id", "legend")
            .attr("width", 1230)
            .attr("height", 40)
            .append("g")
            .attr("transform",
                "translate(" + 0 + "," + 10 + ")");
        let legend = svg.selectAll(".legend-elem")
            .data(legendInfo).enter()
            .append("g")
            .attr("class", "legend-elem")

            .attr("transform", (d, i) => {
                if (i === 0) {
                    return "translate(13 , 5)";
                } else if (legendInfo[i - 1].name.length > 30) {
                    return "translate(" + (275 * i) + ", 5)";
                } else {
                    return "translate(" + 200 * i + ", 5)";
                }
            });

        legend.append("text")
            .attr("font-size", 12)
            .attr("transform", "translate(15 , 14)")
            .text((d) => "- " + d.name)


        legend.append("rect").attr("transform", "rotate(45)")
            .attr("height", 14)
            .attr("width", 14)
            .attr("fill", (d, i) => {

                if (d.status === "done") {
                    return "#00ab4f";
                } else if (d.status === "bad") {
                    return "#ff0a00"
                } else if (d.status === "plan") {
                    return "#1f497d";
                } else if (d.status === "realPlan") {
                    return "#a5a5a5"
                }
            }).attr("stroke", (d) => {

            if (d.status === "done") {
                return "#1f497d";
            } else if (d.status === "bad") {
                return "#1f497d"
            } else if (d.status === "plan") {
                return "#1f497d";
            } else if (d.status === "realPlan") {
                return "#676767"
            }
        }).attr("stroke-width", 2);

        legendInfo.forEach((item, i) => {
            if (item.status !== "plan" && item.status !== "realPlan") {
                let tickerElemCoords;
                let elemY = 14;
                if (i === 0) {
                    tickerElemCoords = [{x: 13 - 4.9, y: elemY + 1.1},
                        {x: 13, y: elemY + 5.4}, {
                            x: 13 + 6,
                            y: elemY - .3
                        }];
                } else if (legendInfo[i - 1].name.length > 30) {
                    tickerElemCoords = [{x: (275 * i) - 4.9, y: elemY + 1.1}, {x: (275 * i), y: elemY + 5.4}, {
                        x: (275 * i) + 6,
                        y: elemY - .3
                    }];
                } else {
                    tickerElemCoords = [{x: (200 * i) - 4.9, y: elemY + 1.1}, {x: (200 * i), y: elemY + 5.4}, {
                        x: (200 * i) + 6,
                        y: elemY - .3
                    }];
                }
                let legendTickerElem = svg.append("g");

                legendTickerElem.append("path").datum(tickerElemCoords)
                    .attr("class", "line")
                    .attr("fill", "none")
                    .attr("stroke", "#1f497d")
                    .attr("stroke-width", 2)
                    .attr("d", d3.line()
                        .x(function (d, i) {
                            return d.x
                        })
                        .y(function (d, i) {
                            return d.y
                        })
                    )
            }

        })
    }

    createSVG = (selector) => {
        if (selector === this.state.firstSelector) {
            let data = this.state.dataFirst;
            let startIndex = this.finedIndexes(data.steps, this.state.startFirst); // years.indexOf(this.state.start);
            let endIndex = this.finedIndexes(data.real, this.state.endFirst); // years.indexOf(this.state.end);
            let steps = data.steps.slice(startIndex[0], endIndex[endIndex.length - 1] + 1);
            let real = data.real.slice(startIndex[0], endIndex[endIndex.length - 1] + 1);
            data = {name: data.name, steps: steps, real: real};
            this.createChart(data, selector);
        } else if (selector === this.state.secondSelector) {
            let data = this.state.dataSecond;
            let startIndex = this.finedIndexes(data.steps, this.state.startSecond); // years.indexOf(this.state.start);
            let endIndex = this.finedIndexes(data.real, this.state.endSecond); // years.indexOf(this.state.end);
            let steps = data.steps.slice(startIndex[0], endIndex[endIndex.length - 1] + 1);
            let real = data.real.slice(startIndex[0], endIndex[endIndex.length - 1] + 1);
            data = {name: data.name, steps: steps, real: real};
            this.createChart(data, selector);
        }


    };

    finedIndexes = (data, year) => {
        let indexes = [];
        data.forEach((d, i) => {
            if (+d.date.substring(0, 4) === +year) {
                indexes.push(i);
            }
        })
        return indexes;
    }

    hideCharts = (e) => {
        let id = e.target.id;
        switch (id) {
            case "show-first":
                this.setState(() => ({
                    showFirst: !this.state.showFirst,
                }), () => {
                    if (this.state.showFirst) {
                        this.createSVG(this.state.firstSelector);
                    } else {
                        this.deleteSVG(this.state.firstSelector);
                    }
                })
                break;
            case "show-second":
                this.setState(() => ({
                    showSecond: !this.state.showSecond,
                }), () => {
                    if (this.state.showSecond) {
                        this.createSVG(this.state.secondSelector);
                    } else {
                        this.deleteSVG(this.state.secondSelector);
                    }
                })
                break;
        }

    }

    changeInterval = (e) => {
        let id = e.target.id;
        let value = e.target.value;

        switch (id) {
            case "start-first":

                if (+value < +this.state.endFirst) {
                    this.setState(() => ({startFirst: value}), () => {
                        if (this.state.showFirst) {
                            this.updateSVG(this.state.firstSelector);
                        }
                    })
                }

                break;
            case "end-first":
                if (+value > +this.state.startFirst) {
                    this.setState(() => ({endFirst: value}), () => {
                        if (this.state.showFirst) {
                            this.updateSVG(this.state.firstSelector);
                        }
                    })
                }
                break;
            case "start-second":
                if (+value < +this.state.endSecond) {
                    this.setState(() => ({startSecond: value}), () => {
                        if (this.state.showSecond) {
                            this.updateSVG(this.state.secondSelector);
                        }
                    })
                }
                break;
            case "end-second":
                if (+value > +this.state.startSecond) {
                    this.setState(() => ({endSecond: value}), () => {
                        if (this.state.showSecond) {
                            this.updateSVG(this.state.secondSelector);
                        }
                    })
                }
                break;
        }
    };

    deleteSVG = (selector) => {
        let parent = document.querySelector(selector);
        parent.querySelector('svg').remove();
    };

    createChart = (obj, selector) => {
        console.log(obj);
        let dataPlan = obj.steps;
        // console.log(data.steps[0].date);

        let margin = {top: 0, right: 0, bottom: 30, left: 0},
            width = 1200 - margin.left - margin.right,
            gridHeight = 180,
            titleHeight = 30,
            legendHeight = 2,
            titleTextBaseLine = 21,
            planLineY = 80 + legendHeight,
            realLineY = 160 + legendHeight;

        let svg = d3.select(selector)
            .append("svg")
            .attr("width", 1230)
            .attr("height", 220)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        dataPlan = dataPlan.map((d) => {
            return {date: d3.timeParse("%Y-%m-%d")(d.date), step: d.step}
        });

        let startDate = new Date();
        startDate.setDate(1);
        startDate.setMonth(0);
        startDate.setFullYear(dataPlan[0].date.getFullYear());
        startDate.setHours(0);
        startDate.setMinutes(0);

        let lastDate = new Date();
        lastDate.setDate(31);
        lastDate.setMonth(11);
        lastDate.setFullYear(dataPlan[dataPlan.length - 1].date.getFullYear());
        lastDate.setHours(0);
        lastDate.setMinutes(0);


        dataPlan.push({date: lastDate});
        dataPlan.unshift({date: startDate});

        let emptyFirstDate = new Date();
        emptyFirstDate.setDate(1);
        emptyFirstDate.setMonth(0);
        emptyFirstDate.setFullYear(dataPlan[0].date.getFullYear() - 1);
        emptyFirstDate.setHours(0);
        emptyFirstDate.setMinutes(0);

        dataPlan.unshift({date: emptyFirstDate});


        let x = d3.scaleTime()
            .domain(d3.extent(dataPlan, function (d) {
                return d.date;
            }))
            .range([0, width]);

        let x1 = d3.scaleTime()
            .domain(d3.extent(dataPlan, function (d) {
                return d.date;
            }))
            .range([x(dataPlan[2].date), x(dataPlan[dataPlan.length - 2].date)]);
        let x2 = d3.scaleTime()
            .domain(d3.extent(dataPlan, function (d) {
                return d.date;
            }))
            .range([x(dataPlan[1].date), x(dataPlan[dataPlan.length - 1].date)]);

        let yearsArr = [];

        dataPlan.forEach((d) => {
            let year = d.date.getFullYear();

            if (!yearsArr.includes(year)) {
                yearsArr.push(year);
            }

        });


        let titles = svg.append("g");
        let grid = svg.append("g");

        titles.selectAll("rect").data(yearsArr).enter()
            .append("rect")
            .attr("width", width / yearsArr.length)
            .attr("height", titleHeight)
            .attr("x", (d, i) => {
                return width / yearsArr.length * i
            })
            .attr("y", legendHeight)
            .attr("fill", "white")
            .attr('stroke', "steelblue")
            .attr("opacity", 0.3)

        titles.selectAll("text")
            .data(yearsArr).enter()
            .append("text")
            .text((d) => d)
            .attr("text-anchor", "middle")
            .attr("x", (d, i) => {
                return (width / yearsArr.length * i) + width / yearsArr.length / 2
            })
            .attr("y", titleTextBaseLine + legendHeight)

        grid.selectAll("rect").data(yearsArr).enter()
            .append("rect")
            .attr("width", width / yearsArr.length)
            .attr("height", gridHeight)
            .attr("x", (d, i) => {
                return width / yearsArr.length * i
            })
            .attr("y", titleHeight + 1 + legendHeight)
            .attr("fill", (d) => {
                let now = new Date();
                if (d === now.getFullYear()) {
                    return "white";
                } else {
                    return "#b0dcff"
                }
            })
            .attr('stroke', "grey")
            .attr("opacity", 0.3)


        let baseLine = svg.append('g');

        baseLine.append("path")
            .datum(dataPlan)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d, i) {
                    return x2(d.date)
                })
                .y(function (d, i) {
                    return gridHeight / 2 + titleHeight + legendHeight;
                })
            ).attr("opacity", 0.3)


        /*    let xAxis = svg.append("g")
                .attr("transform", "translate(0,15)")
                .call(d3.axisTop(x));*/

        let planLine = svg.append('g');

        planLine.append("path")
            .datum(dataPlan)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#4f4f4f")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d, i) {
                    return x1(d.date)
                })
                .y(function (d, i) {
                    return planLineY;
                })
            );

        let realData = obj.real;

        realData = realData.map((d) => {
            return {date: d3.timeParse("%Y-%m-%d")(d.date), step: d.step, status: d.status}
        });

        let planTicksData = [];
        planTicksData = planTicksData.concat(dataPlan);

        planTicksData.splice(0, 2);
        planTicksData.splice(planTicksData.length - 1, 1);


        planTicksData.forEach((item, i) => {
            let line = svg.append("g");
            let realVSplanCoords = [{x: item.date, y: planLineY + 10}, {x: realData[i].date, y: realLineY - 4}];
            line.append("path").datum(realVSplanCoords)
                .attr("class", "line")  // I add the class line to be able to modify this line later on.
                .attr("fill", "none")
                .attr("stroke", "grey")
                .attr("stroke-width", 1.5)
                .attr("stroke-dasharray", "4 2")
                .attr("d", d3.line()
                    .x(function (d, i) {
                        return x(d.x) - 1.5
                    })
                    .y(function (d, i) {
                        return d.y
                    })
                );
        });

        let planTicks = svg.append("g");

        planTicks.selectAll(".plan-tick").data(planTicksData).enter().append("rect")
            .attr("class", "plan-tick")
            .attr("id", (d, i) => "plan" + i)
            .attr("x", (d) => x(d.date)).attr("y", (d) => planLineY - 9)
            .attr("height", 14)
            .attr("width", 14)
            .attr("fill", "#1f497d")
            .attr("transform", (d) => "rotate(45," + x(d.date) + "," + (planLineY - 12) + ")")
            .attr("stroke", "#1f497d")
            .attr("stroke-width", 2);

        planTicks.selectAll(".plan-date")
            .data(planTicksData).enter()
            .append("text")
            .attr("class", "plan-date")
            .attr("x", (d, i) => {
                let thisCoordsX = x(d.date);
                if (i < planTicksData.length - 1 && x(planTicksData[i + 1].date) - thisCoordsX < 70) {
                    return thisCoordsX - 40;
                } else {
                    return thisCoordsX;
                }
            })
            .attr("y", (d, i) => {
                let thisCoordsY = planLineY - 15;
                if (i < planTicksData.length - 1 && x(planTicksData[i + 1].date) - x(d.date) < 70) {
                    return thisCoordsY - 5;
                } else {
                    return thisCoordsY;
                }
            })
            .attr("text-anchor", "middle")
            .attr("font-size", 10)
            .text((d) => d.date.toLocaleString("ru", options));

        planTicks.selectAll(".plan-name")
            .data(planTicksData).enter()
            .append("text")
            .attr("class", "plan-name")
            .attr("x", (d, i) => {
                let thisCoordsX = x(d.date);
                if (i < planTicksData.length - 1 && x(planTicksData[i + 1].date) - thisCoordsX < 70) {
                    return thisCoordsX - 40;
                } else {
                    return thisCoordsX;
                }
            })
            .attr("y", (d, i) => {
                let thisCoordsY = planLineY - 29;
                if (i < planTicksData.length - 1 && x(planTicksData[i + 1].date) - x(d.date) < 70) {
                    return thisCoordsY - 5;
                } else {
                    return thisCoordsY;
                }
            })
            .attr("text-anchor", "middle")
            .attr("font-size", 14)
            .text((d) => d.step)


        let realLine = svg.append("g");

        realLine.append("path")
            .datum(realData)
            .attr("class", "line")  // I add the class line to be able to modify this line later on.
            .attr("fill", "none")
            .attr("stroke", "#a5a5a5")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d, i) {
                    return x(d.date)
                })
                .y(function (d, i) {
                    return realLineY;
                })
            );

        let realTicks = svg.append("g");

        realTicks.selectAll(".real-tick").data(realData).enter().append("rect")
            .attr("class", "real-tick")
            .attr("id", (d, i) => "real" + i)
            .attr("x", (d) => x(d.date))
            .attr("y", (d) => realLineY - 9)
            .attr("height", 14)
            .attr("width", 14)
            .attr("fill", (d, i) => {

                if (d.status === "done") {
                    return "#00ab4f";
                } else if (d.status === "bad") {
                    return "#ff0a00"
                } else if (d.status === "plan") {
                    return "#a5a5a5"
                }
            })
            .attr("transform", (d) => "rotate(45," + x(d.date) + "," + (realLineY - 12) + ")")
            .attr("stroke", (d, i) => {
                if (d.status !== "plan") {
                    return "#1f497d";
                } else {
                    return "#676767"
                }
            })
            .attr("stroke-width", 2);

        realTicks.selectAll(".real-date")
            .data(realData).enter()
            .append("text")
            .attr("class", "real-date")
            .attr("x", (d, i) => {
                let thisCoordsX = x(d.date);
                if (i < realData.length - 1 && x(realData[i + 1].date) - thisCoordsX < 70) {
                    return thisCoordsX - 40;
                } else {
                    return thisCoordsX;
                }
            })
            .attr("y", (d, i) => {
                let thisCoordsY = realLineY + 38;
                if (i < realData.length - 1 && x(realData[i + 1].date) - x(d.date) < 70) {
                    return thisCoordsY + 5;
                } else {
                    return thisCoordsY;
                }
            })
            .attr("text-anchor", "middle")
            .attr("font-size", 10)
            .text((d) => d.date.toLocaleString("ru", options))

        realTicks.selectAll(".real-name")
            .data(realData).enter()
            .append("text")
            .attr("class", "real-name")
            .attr("x", (d, i) => {
                let thisCoordsX = x(d.date);
                if (i < realData.length - 1 && x(realData[i + 1].date) - thisCoordsX < 70) {
                    return thisCoordsX - 40;
                } else {
                    return thisCoordsX;
                }
            })
            .attr("y", (d, i) => {
                let thisCoordsY = realLineY + 23;
                if (i < realData.length - 1 && x(realData[i + 1].date) - x(d.date) < 70) {
                    return thisCoordsY + 5;
                } else {
                    return thisCoordsY;
                }
            })
            .attr("text-anchor", "middle")
            .attr("font-size", 14)
            .text((d) => d.step)

        let elem = svg.append("g");
        realData.forEach((item, i) => {
            if (item.status !== "plan") {
                let newData = [{x: x(item.date) - 6.9, y: realLineY + 1.1},
                    {x: x(item.date) - 2.3, y: realLineY + 5},
                    {x: x(item.date) + 4, y: realLineY - .9}];
                elem.append("path").datum(newData)
                    .attr("class", "line")
                    .attr("fill", "none")
                    .attr("stroke", "#1f497d")
                    .attr("stroke-width", 2)
                    .attr("d", d3.line()
                        .x(function (d, i) {
                            return d.x
                        })
                        .y(function (d, i) {
                            return d.y
                        })
                    )
            }

        })

        let name = svg.append("g");

        name.append("text")
            .attr("class", "name")
            .attr("x", 10)
            .attr("y", titleHeight + legendHeight + 30)
            .attr("font-size", 20)
            .attr("font-weight", 600)
            .text(obj.name)


    };

    render() {
        return (
            <Container>

                <Col md={12}>
                    <div id={"info"}>
                    </div>
                    <div style={{height: 220}} id={this.state.firstSelector.slice(1)}>
                    </div>
                    <div style={{height: 220}} id={this.state.secondSelector.slice(1)}>
                    </div>
                    <Row>

                        <Col md={2}>
                            <Form.Label>Объект</Form.Label>
                        </Col>
                        <Col md={2}>

                            <Form.Label>Начало периода</Form.Label>
                        </Col>
                        <Col md={2}>

                            <Form.Label>Конец периода</Form.Label>
                        </Col>
                        <Col md={2}>
                            <Form.Label>Показать</Form.Label>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: 5}} className="d-flex align-items-center">


                        <Col md={2}>
                            <Form.Control as="select" onChange={this.changeBuild} value={this.state.dataFirst.name}
                                          id="build-first">
                                {this.state.allData.map((d, i) => {
                                    return <option>{d}</option>
                                })}

                            </Form.Control>
                        </Col>
                        <Col md={2}>
                            <Form.Control as="select" onChange={this.changeInterval} value={this.state.startFirst}
                                          id="start-first">
                                {this.state.yearsFirst.map((d, i) => {
                                    return <option>{d}</option>
                                })}
                            </Form.Control>
                        </Col>
                        <Col md={2}>
                            <Form.Control as="select" onChange={this.changeInterval} value={this.state.endFirst}
                                          id="end-first">
                                {this.state.yearsFirst.map((d, i) => {
                                    return <option>{d}</option>
                                })}
                            </Form.Control>


                        </Col>
                        <Col md={2}>
                            <Form.Check style={{marginLeft: 20}} type="checkbox" onChange={this.hideCharts}
                                        checked={this.state.showFirst} id="show-first"/>
                        </Col>

                        <Col className="d-flex align-items-end" md={2}>
                            <Button block onClick={this.svgToPdf}>сохранить</Button>
                        </Col>
                    </Row>
                    <Row className="d-flex align-items-center">

                        <Col md={2}>
                            <Form.Control as="select" onChange={this.changeBuild} value={this.state.dataSecond.name}
                                          id="build-second">
                                {this.state.allData.map((d, i) => {
                                    return <option>{d}</option>
                                })}

                            </Form.Control>
                        </Col>
                        <Col md={2}>
                            <Form.Control as="select" onChange={this.changeInterval} value={this.state.startSecond}
                                          id="start-second">
                                {this.state.yearsSecond.map((d, i) => {
                                    return <option>{d}</option>
                                })}
                            </Form.Control>
                        </Col>
                        <Col md={2}>

                            <Form.Control as="select" onChange={this.changeInterval} value={this.state.endSecond}
                                          id="end-second">
                                {this.state.yearsSecond.map((d, i) => {
                                    return <option>{d}</option>
                                })}
                            </Form.Control>
                        </Col>
                        <Col md={2}>
                            <Form.Check style={{marginLeft: 20}} type="checkbox" onChange={this.hideCharts}
                                        checked={this.state.showSecond} id="show-second"/>
                        </Col>


                    </Row>
                </Col>

            </Container>
        );
    }
}

export default App;
