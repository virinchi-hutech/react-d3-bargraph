import React, { useEffect, Component } from 'react'
import './BarchartGrouped.css'
import * as d3 from 'd3';

interface BarchartGroupedProps {
    data: any;
    history: any;
}

interface BarchartGroupedState {
    node: any;
    height: number;
    width: number;
    svg?: any;
    total: Function;
    yearList: any;
}

class BarchartGrouped extends Component<BarchartGroupedProps, BarchartGroupedState> {
    state = {
        node: null,
        height: 0,
        width: 0,
        svg: null,
        total: (str: any): any => { },
        yearList: [2014],
    }
    componentDidMount() {
        this.drawChart()
    }
    componentDidUpdate() {
        // this.initDiagram(400, 600)
    }

    formatNumber = (str: string) => {
        return parseFloat(str.trim().replace("$", "").replace("m", "")) * 1000000;
    }


    drawChart() {
        var data = this.props.data.map((d: any) => {
            var _temp = { name: d.name }
            this.state.yearList.forEach((i: any) => {
                _temp = {
                    ..._temp,
                    [i]: d[i]
                }
            })
            return _temp
        })
        var svg = d3.select("svg"),
            margin = { top: 20, right: 20, bottom: 30, left: 40 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x0 = d3.scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.1);

        var x1 = d3.scaleBand()
            .padding(0.05);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var z: any = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var keys = Object.keys(data[0]).filter((i: string) => i !== 'name');

        x0.domain(data.map(function (d) { return d.name; }));
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(data, (d: any) => { return d3.max(keys, (key: string) => { return this.formatNumber(d[key]); }); })]).nice();

        g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function (d: any) { return "translate(" + x0(d.name) + ",0)"; })
            .selectAll("rect")
            .data((d: any) => {
                return keys.map((key: string) => {
                    return { key: key, value: key === 'name' ? d[key] : this.formatNumber(d[key]) };
                });
            })
            .enter().append("rect")
            .attr("x", function (d: any) { return x1(d.key); })
            .attr("y", (d: any) => { return y(d.value); })
            .attr("width", x1.bandwidth())
            .attr("height", (d: any) => { return height - y(d.value); })
            .attr("fill", (d: any) => { return z(d.key); })
            .append("svg")
            .attr("height", 10)
            

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0));

        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("sales");

        var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z)

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d) { return d; });

    }

    parseData = (year: string) => {
        var data: any = this.props.data[parseInt(year)]
        d3.select("#chart").html("");
    }

    toggleYear = (event, year: number) => {
        d3.select("svg").html("");
        if (event.target.checked) {
            this.setState({
                yearList: [...this.state.yearList, year]
            })

        } else {
            this.setState({
                yearList: this.state.yearList.filter((item: number) => item !== year)
            })

        }

        setTimeout(() => {
            this.drawChart()
        }, 500)
    }

    render() {
        return (
            <>
                <div id="chart">
                    <button onClick={() => { this.props.history.push('/') }}>Simple View</button>
                    <input defaultChecked={this.state.yearList.includes(2020)} type="checkbox" onClick={(event) => { this.toggleYear(event, 2020) }} />
                    <label > 2020</label>
                    <input defaultChecked={this.state.yearList.includes(2019)} type="checkbox" onClick={(event) => { this.toggleYear(event, 2019) }} />
                    <label > 2019</label>
                    <input defaultChecked={this.state.yearList.includes(2018)} type="checkbox" onClick={(event) => { this.toggleYear(event, 2018) }} />
                    <label > 2018</label>
                    <input defaultChecked={this.state.yearList.includes(2017)} type="checkbox" onClick={(event) => { this.toggleYear(event, 2017) }} />
                    <label > 2017</label>
                    <input defaultChecked={this.state.yearList.includes(2016)} type="checkbox" onClick={(event) => { this.toggleYear(event, 2016) }} />
                    <label > 2016</label>
                    <input defaultChecked={this.state.yearList.includes(2015)} type="checkbox" onClick={(event) => { this.toggleYear(event, 2015) }} />
                    <label > 2015</label>
                    <input defaultChecked={this.state.yearList.includes(2014)} type="checkbox" onClick={(event) => { this.toggleYear(event, 2014) }} />
                    <label > 2014</label>
                </div>
                <svg width="1200" height="700"></svg>
            </>
        )
    }
}
export default BarchartGrouped