import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as d3 from "d3";

const dataCustom = {
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

      {date: "2017-12-17", step: "монтаж1"},
      {date: "2018-12-18", step: "монтаж2"},
      {date: "2019-08-19", step: "монтаж3"},
      {date: "2020-11-20", step: "монтаж4"},
      {date: "2021-12-21", step: "монтаж5"},
      {date: "2022-7-22", step: "монтаж6"},
      {date: "2023-11-23", step: "монтаж7"},
      {date: "2024-8-24", step: "монтаж8"},
  ]
};




class App extends Component {

  componentDidMount() {
    this.createChart();
  }

  dataBuilder = () => {
    return dataCustom.steps;
  }

  createChart = () => {
    let data = this.dataBuilder();

   // console.log(data.steps[0].date);

    let margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 1200 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    let svg = d3.select("#info")
        .append("svg")
        .attr("width", 1500)
        .attr("height", 500)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    data = data.map((d)=> {
     return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.step }
     });

    //data.unshift()
    let startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(0);
    startDate.setFullYear(data[0].date.getFullYear());
    console.log(startDate);

      let lastDate = new Date();
      lastDate.setDate(31);
      lastDate.setMonth(11);
      lastDate.setFullYear(data[data.length-1].date.getFullYear());
      console.log(lastDate);

    data.push({date: lastDate});
    data.unshift({date: startDate});

    console.log(data);

    let x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([ 0, width ]);

      let x1 = d3.scaleTime()
          .domain(d3.extent(data, function(d) { return d.date; }))
          .range([ x(data[1].date), x(data[data.length-2].date) ]);

      console.log(x(data[data.length-2].date));

    let xAxis = svg.append("g")
        .attr("transform", "translate(0,15)")
        .call(d3.axisTop(x));

    let line = svg.append('g');

    line.append("path")
        .datum(data)
        .attr("class", "line")  // I add the class line to be able to modify this line later on.
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d, i) { return x1(d.date) })
            .y(function(d, i) { return 50 })
        );

      let real = dataCustom.real;

      real = real.map((d)=> {
          return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.step }
      });

    let rectsData = [];
    rectsData = rectsData.concat(data);
    rectsData.splice(0,1);
    rectsData.splice(rectsData.length-1, 1);
    console.log(rectsData);

      rectsData.forEach((item, i)=> {
          let line = svg.append("g");
          let newData = [{x: item.date, y: 54}, {x: real[i].date, y: 196}];
          line.append("path").datum(newData)
              .attr("class", "line")  // I add the class line to be able to modify this line later on.
              .attr("fill", "none")
              .attr("stroke", "grey")
              .attr("stroke-width", 1.5)
              .attr("stroke-dasharray", "4 2")
              .attr("d", d3.line()
                  .x(function(d, i) { return x(d.x)-3 })
                  .y(function(d, i) { return d.y })
              );
      })

    svg.selectAll(".plan-tick").data(rectsData).enter().append("rect").attr("class", "plan-tick").attr("id", (d, i)=> "plan" + i).attr("x", (d)=> x(d.date)).attr("y", (d)=> 50-5)
        .attr("height", 10)
        .attr("width", 10)
        .attr("fill", "blue")
        .attr("transform", (d) => "rotate(45," + x(d.date) + ", 40)");




    console.log(real);

    let realLine = svg.append("g");

    realLine.append("path")
        .datum(real)
        .attr("class", "line")  // I add the class line to be able to modify this line later on.
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d, i) { return x(d.date) })
            .y(function(d, i) { return 200 })
        );

      svg.selectAll(".real-tick").data(real).enter().append("rect").attr("class", "real-tick").attr("id", (d, i)=> "real" + i).attr("x", (d)=> x(d.date)).attr("y", (d)=> 200 - 5)
          .attr("height", 10)
          .attr("width", 10)
          .attr("fill", "blue")
          .attr("transform", (d) => "rotate(45," + x(d.date) + ", 190)");




  };

  render() {
    return (
        <div id={"info"}>
        </div>
    );
  }
}

export default App;
