import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";

interface ChannelData {
  title: string;
  viewCount: number;
}

interface Props {
  userVideoData: ChannelData[];
  compareVideoData: ChannelData[];
}

const GroupedBarChart: React.FC<Props> = ({ userVideoData, compareVideoData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Prepare data
    const allViewCounts = [
      ...userVideoData.map((item) => item.viewCount),
      ...compareVideoData.map((item) => item.viewCount),
    ];
    const maximumValue = d3.max(allViewCounts) || 0;

    const data = userVideoData.map((item, index) => ({
      video: item.title,
      channel1Views: item.viewCount,
      channel2Views: compareVideoData[index]?.viewCount || 0,
    }));

    // SVG dimensions
    const svgWidth = 800;
    const svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 100, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const colors = ["#1f77b4", "#ff7f0e"]; // Colors for the bars

    // Clear existing chart
    d3.select(chartRef.current).select("svg").remove();

    // Create SVG container with background
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .style("background", "rgba(111,111,111,0.1)"); // Light background for visibility

    // Chart group
    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Scales
    const x0Scale = d3
      .scaleBand()
      .domain(data.map((d) => d.video))
      .range([0, width])
      .padding(0.2);

    const x1Scale = d3
      .scaleBand()
      .domain(["Channel 1", "Channel 2"])
      .range([0, x0Scale.bandwidth()])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, maximumValue]) // Scale to the maximum value
      .range([height, 0]);

    // Axes
    const xAxis = d3.axisBottom(x0Scale);
    const yAxis = d3.axisLeft(yScale);

    // Append Axes
    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px");

    chart.append("g").call(yAxis);

    // Grouped bars
    const groups = chart
      .selectAll(".group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "group")
      .attr("transform", (d) => `translate(${x0Scale(d.video)}, 0)`);

    // Channel 1 bars
    groups
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x1Scale("Channel 1") || 0)
      .attr("y", height) // Start from bottom
      .attr("width", x1Scale.bandwidth())
      .attr("height", 0) // Initial height is 0
      .attr("fill", colors[0])
      .transition()
      .duration(1000)
      .attr("y", (d) => yScale(d.channel1Views))
      .attr("height", (d) => height - yScale(d.channel1Views));

    // Channel 2 bars
    groups
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x1Scale("Channel 2") || 0)
      .attr("y", height) // Start from bottom
      .attr("width", x1Scale.bandwidth())
      .attr("height", 0) // Initial height is 0
      .attr("fill", colors[1])
      .transition()
      .duration(1000)
      .attr("y", (d) => yScale(d.channel2Views))
      .attr("height", (d) => height - yScale(d.channel2Views));

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top / 2})`);

    legend
      .selectAll("rect")
      .data(colors)
      .enter()
      .append("rect")
      .attr("x", (_, i) => i * 100)
      .attr("y", 0)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => d);

    legend
      .selectAll("text")
      .data(["Channel 1", "Channel 2"])
      .enter()
      .append("text")
      .attr("x", (_, i) => i * 100 + 20)
      .attr("y", 12)
      .text((d) => d)
      .style("font-size", "12px")
      .style("alignment-baseline", "middle");
  }, [userVideoData, compareVideoData]);

  // Framer Motion wrapper for overall chart animation
  return (
    <motion.div
      ref={chartRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5,
        ease: "easeInOut"
      }}
    />
  );
};

export default GroupedBarChart;