import React, { useEffect, Component } from 'react'
import './Bargraph.css'
import * as d3 from 'd3';

interface BarChartProps {
    data: any;
    history: any;
}

interface BarChartState {

}

class BarChart extends Component<BarChartProps, BarChartState> {
    state = {

    }
    componentDidMount() {
        this.parseData("2020")
    }
    componentDidUpdate() {
        // this.initDiagram(400, 600)
    }

    changeChart = (data: any) => {
        this.drawChart(data);
    }

    formatNumber = (str: string) => {
        return parseFloat(str.trim().replace("$", "").replace("m", "")) * 10;
    }

    drawChart(data: any) {
        var w = 600,
            h = 400,
            topMargin = 15,
            labelSpace = 40,
            innerMargin = w / 2 + labelSpace,
            outerMargin = 15,
            gap = 20,
            dataRange = d3.max(data.map((d: any) => { return this.formatNumber(d.sales) }));

        /* edit with care */
        var chartWidth = w - innerMargin - outerMargin,
            barWidth = h / data.length,
            yScale = d3.scaleLinear().domain([0, data.length]).range([0, h - topMargin]),
            total = d3.scaleLinear().domain([0, parseInt(dataRange)]).range([0, chartWidth - labelSpace]);

        var vis = d3.select("#chart").append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("border", "1px solid black");



        var bar = vis.selectAll("g.bar")
            .data(data)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function (d, i) {
                return "translate(0," + (yScale(i) + topMargin) + ")";
            });


        bar.append("text")
            .attr("class", "below")
            .attr("x", 12)
            .attr("dy", "1.2em")
            .attr("text-anchor", "left")
            .text(function (d: any) { return `${d.name} (${d.sales})` })
            .style("fill", "#000000");


        bar.append("rect")
            .attr("class", "malebar")
            .attr("height", barWidth - gap)
            .attr("x", 10);


        bar.append("svg")
            .attr("height", barWidth - gap)
            .append("text")
            .attr("class", "up")
            .attr("x", 12)
            .attr("dy", "1.2em")
            .attr("text-anchor", "left")
            .text(function (d: any) { return `${d.name} (${d.sales})` })
            .style("fill", "#ffffff");

        var bars = d3.selectAll("g.bar")
            .data(data);

        bars.selectAll("rect.malebar")
            .transition()
            .attr("width", (d: any) => { return total(this.formatNumber(d.sales)); });

        bars.selectAll("svg")
            .attr("width", (d: any) => { return total(this.formatNumber(d.sales)) + 10; });

    }

    parseData = (year: string) => {
        var data: any = this.props.data[parseInt(year)]
        d3.select("#chart").html("");
        this.drawChart(data)
    }

    render() {
        return (
            <>
                <button onClick={() => { this.parseData("2017") }}>2017</button>
                <button onClick={() => { this.parseData("2018") }}>2018</button>
                <button onClick={() => { this.parseData("2019") }}>2019</button>
                <button onClick={() => { this.parseData("2020") }}>2020</button>
                <button onClick={() => { this.props.history.push('/group') }}>Show all</button>
                <div id="chart"></div>
            </>
        )
    }
}
export default BarChart