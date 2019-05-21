import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as d3 from "d3";

const dataCustom = {
  name: "ExBuild",
  steps: [
      {date: "2017-11-17", step: "монтаж"},
      {date: "2018-11-18", step: "монтаж"},
      {date: "2019-11-19", step: "монтаж"},
      {date: "2020-11-20", step: "монтаж"},
      {date: "2021-11-21", step: "монтаж"},
      {date: "2022-11-22", step: "монтаж"},
      {date: "2023-11-23", step: "монтаж"},
      {date: "2024-11-24", step: "монтаж"},
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

    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 1200 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    let svg = d3.select("#info")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    data = data.map((d)=> {
     return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.step }
     });

    console.log(data);
    let x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([ 0, width ]);

    let xAxis = svg.append("g")
        .attr("transform", "translate(0,15)")
        .call(d3.axisTop(x));

    let line = svg.append('g')
        .attr("clip-path", "url(#clip)");

    line.append("path")
        .datum(data)
        .attr("class", "line")  // I add the class line to be able to modify this line later on.
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return 50 })
        )

    svg.selectAll(".plan-tick").data(data).enter().append("rect").attr("class", "plan-tick").attr("x", (d)=> x(d.date)).attr("y", (d)=> 50)

  };

  render() {
    return (
        <div id={"info"}>
        </div>
    );
  }
}

export default App;
