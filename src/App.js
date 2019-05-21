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

      {date: "2017-11-17", step: "монтаж1", status: "done"},
      {date: "2018-12-18", step: "монтаж2", status: "bad"},
      {date: "2019-05-19", step: "монтаж3", status: "done"},
      {date: "2020-11-20", step: "монтаж4", status: "plan"},
      {date: "2021-12-21", step: "монтаж5", status: "plan"},
      {date: "2022-7-22", step: "монтаж6", status: "plan"},
      {date: "2023-11-23", step: "монтаж7", status: "plan"},
      {date: "2024-8-24", step: "монтаж8", status: "plan"},
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

    let startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(0);
    startDate.setFullYear(data[0].date.getFullYear());
    console.log(startDate.getFullYear());

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

      let yearsArr = [];

          dataCustom.steps.forEach((d)=> {let year = d3.timeParse("%Y-%m-%d")(d.date).getFullYear()
              if(!yearsArr.includes(year)) {
                  yearsArr.push(year);
              }

          } );

          console.log(yearsArr);



      let titles = svg.append("g");
      let grid = svg.append("g");

      titles.selectAll("rect").data(yearsArr).enter()
          .append("rect")
          .attr("width", width/yearsArr.length)
          .attr("height", 30)
          .attr("x", (d, i)=> {return width/yearsArr.length * i})
          .attr("y", 0)
          .attr("fill", "white")
          .attr('stroke', "steelblue")
          .attr("opacity", 0.3)

      titles.selectAll("text")
          .data(yearsArr).enter()
          .append("text")
          .text((d)=> d)
          .attr("text-anchor", "middle")
          .attr("x", (d, i)=> {return (width/yearsArr.length * i) + width/yearsArr.length / 2})
          .attr("y", 21)

      grid.selectAll("rect").data(yearsArr).enter()
          .append("rect")
          .attr("width", width/yearsArr.length)
          .attr("height", 250)
          .attr("x", (d, i)=> {return width/yearsArr.length * i})
          .attr("y", 31)
          .attr("fill", (d)=> {
              let now = new Date();
              if(d === now.getFullYear() ) {
                  return "white";
              }
              else {
                  return "#b0dcff"
              }
          })
          .attr('stroke', "grey")
          .attr("opacity", 0.3)


/*    let xAxis = svg.append("g")
        .attr("transform", "translate(0,15)")
        .call(d3.axisTop(x));*/

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
          return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.step, status: d.status }
      });

    let rectsData = [];
    rectsData = rectsData.concat(data);
    rectsData.splice(0,1);
    rectsData.splice(rectsData.length-1, 1);
    console.log(rectsData);

      rectsData.forEach((item, i)=> {
          let line = svg.append("g");
          let newData = [{x: item.date, y: 60}, {x: real[i].date, y: 196}];
          line.append("path").datum(newData)
              .attr("class", "line")  // I add the class line to be able to modify this line later on.
              .attr("fill", "none")
              .attr("stroke", "grey")
              .attr("stroke-width", 1.5)
              .attr("stroke-dasharray", "4 2")
              .attr("d", d3.line()
                  .x(function(d, i) { return x(d.x) })
                  .y(function(d, i) { return d.y })
              );
      })

    svg.selectAll(".plan-tick").data(rectsData).enter().append("rect").attr("class", "plan-tick").attr("id", (d, i)=> "plan" + i).attr("x", (d)=> x(d.date)).attr("y", (d)=> 50-9)
        .attr("height", 14)
        .attr("width", 14)
        .attr("fill", "#1f497d")
        .attr("transform", (d) => "rotate(45," + x(d.date) + ", 40)")
        .attr("stroke", "#1f497d")
        .attr("stroke-width", 2);




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

    let realTicks = svg.append("g");

      realTicks.selectAll(".real-tick").data(real).enter().append("rect").attr("class", "real-tick").attr("id", (d, i)=> "real" + i).attr("x", (d)=> x(d.date)).attr("y", (d)=> 200 - 9)
          .attr("height", 14)
          .attr("width", 14)
          .attr("fill", (d, i)=> { console.log(d);
              if(d.status === "done") {
                  return "#00ab4f";
              } else if (d.status === "bad") {
                  return "#ff0a00"
              } else if (d.status === "plan") {
                  return "#a5a5a5"
              }
          })
          .attr("transform", (d) => "rotate(45," + x(d.date) + ", 190)")
          .attr("stroke", (d, i)=> { console.log(d);
              if(d.status !== "plan") {
                  return "#1f497d";
              } else  {
                  return "#676767"
              }
          })
          .attr("stroke-width", 2);

/*      realTicks.selectAll(".real-tick-elem").data(real).enter().append("path")
          .attr("class", "real-tick-elem")

          .attr("d", d3.line()
              .x(function(d, i) { return x(d.date) })
              .y(function(d, i) { return 200 })
          )
          .attr("fill", "none")
          .attr("stroke", "red")
          .attr("stroke-width", 1.5)
          //.attr("transform", (d) => "rotate(45," + x(d.date) + ", 190)");*/
      let elem = svg.append("g");
      real.forEach((item, i)=> {
          if(item.status !== "plan") {
              let newData = [{x: x(item.date) -4.9, y: 201.1}, {x:  x(item.date) - .7, y: 205}, {x: x(item.date) + 5, y: 199.1}];
              elem.append("path").datum(newData)
                  .attr("class", "line")  // I add the class line to be able to modify this line later on.
                  .attr("fill", "none")
                  .attr("stroke", "#1f497d")
                  .attr("stroke-width", 2)
                  .attr("d", d3.line()
                      .x(function(d, i) { return d.x })
                      .y(function(d, i) { return d.y })
                  )
          }

      })




  };

  render() {
    return (
        <div id={"info"}>
        </div>
    );
  }
}

export default App;
