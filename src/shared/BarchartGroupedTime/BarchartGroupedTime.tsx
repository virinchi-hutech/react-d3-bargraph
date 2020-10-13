import React, { useEffect, Component } from 'react'
import './BarchartGroupedTime.css'
import * as d3 from 'd3';

interface BarchartGroupedProps {
    data: any;
    history: any;
}

interface BarchartGroupedState {
    fruits: any;
    months: any;
    monthsToggle: any;
    fruitsToggle: any;
}

class BarchartGroupedTime extends Component<BarchartGroupedProps, BarchartGroupedState> {
    state = {
        fruits: [],
        months: [],
        monthsToggle: [],
        fruitsToggle: [],
    }
    componentDidMount() {
        this.setState({
            fruitsToggle: Object.keys(this.props.data[0]).filter((item: string) => item !== 'name'),
            monthsToggle: this.props.data.map((item: any) => { return item.name.trim() })
        })
        setTimeout(() => {
            this.drawChart()
            var _fruits = Object.keys(this.props.data[0]).filter((item: string) => item !== 'name').map((item: string) => { return this.createFruitToggleElement(item) })
            var _months = this.props.data.map((item: any) => { return item.name }).map((item: string) => { return this.createMonthToggleElement(item) })
            this.setState({
                fruits: _fruits,
                months: _months
            })
        }, 300)

    }

    createFruitToggleElement = (item) => {
        return (
            <>
                <input type="checkbox" defaultChecked={this.state.fruitsToggle.includes(item.trim())} onClick={(event) => { this.toggleFruit(event, item) }} />
                <label > {item}</label>
            </>
        )
    }
    createMonthToggleElement = (item) => {
        return (
            <>
                <input type="checkbox" defaultChecked={this.state.monthsToggle.includes(item.trim())} onClick={(event) => { this.toggleMonth(event, item) }} />
                <label > {item}</label>
            </>
        )
    }
    componentDidUpdate() {
        // this.initDiagram(400, 600)
    }

    formatNumber = (str: string) => {
        return parseFloat(str.trim().replace("$", "").replace("m", "")) * 1000000;
    }


    drawChart() {
        var data = this.props.data.filter((item: any) => {
            console.log(this.state.monthsToggle, item.name, this.state.monthsToggle.includes(item.name));
            return this.state.monthsToggle.includes(item.name)
        }).map((d: any) => {
            var _temp = { name: d.name }
            this.state.fruitsToggle.forEach((i: any) => {
                _temp = {
                    ..._temp,
                    [i]: d[i]
                }
            })
            return _temp
        })
        console.log(data);

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

    toggleMonth = (event, str: string) => {
        d3.select("svg").html("");
        if (event.target.checked) {
            this.setState({
                monthsToggle: [...this.state.monthsToggle, str]
            })

        } else {
            this.setState({
                monthsToggle: this.state.monthsToggle.filter((item: string) => item !== str)
            })

        }

        setTimeout(() => {
            this.drawChart()
        }, 500)
    }

    toggleFruit = (event, str: string) => {

        d3.select("svg").html("");
        if (event.target.checked) {
            this.setState({
                fruitsToggle: [...this.state.fruitsToggle, str]
            })

        } else {
            this.setState({
                fruitsToggle: this.state.fruitsToggle.filter((item: string) => item !== str)
            })

        }
        setTimeout(() => {
            this.drawChart()
        }, 500)
    }
    render() {
        return (
            <>

                <div className="chart-opts">
                    <button onClick={() => { this.props.history.push('/') }}>simple view</button>
                    <button onClick={() => { this.props.history.push('/group') }}>group view</button>
                </div>
                <div className="chart-opts">
                    {this.state.months}
                </div>
                <div className="chart-opts">
                    {this.state.fruits}
                </div>
                <svg width="1200" height="700"></svg>
            </>
        )
    }
}
export default BarchartGroupedTime