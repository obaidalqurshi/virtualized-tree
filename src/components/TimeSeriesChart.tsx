import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import type { TimePoint } from '../types/tree'

export function TimeSeriesChart({data}: {data: TimePoint[]}){
  const ref = useRef<SVGSVGElement | null>(null)

  useEffect(()=>{
    if(!ref.current) return;

    const parsed = data.map(d =>({
      date: new Date(d.date),
      value: d.value,
    }))
   const width = 460;
   const height = 250;

   const svg = d3.select(ref.current)
   svg.selectAll("*").remove();

   const x = d3.scaleTime()
    .domain(d3.extent(parsed, d => d.date) as [Date, Date])
    .range([40,  width - 20])

  const y = d3.scaleLinear()
    .domain([0, d3.max(parsed, d => d.value)!])
    .nice()
    .range([height -30 , 10 ])
 

  const line = d3.line<any>()
    .x(d=> x(d.date))
    .y(d=> y(d.value))

  svg.append("path")
    .datum(parsed)
    .attr("fill", "none")
    .attr("stroke", "lightblue")
    .attr("stroke-width", 2)
    .attr("d", line)
    
  svg.append("g")
    .attr("transform", `translate(0, ${height - 30})`)
    .call(d3.axisBottom(x))
  svg.append("g")
    .attr("transform", `translate(40, 0)`)
    .call(d3.axisLeft(y))

  }, [data])
  return <svg ref={ref} width={500} height={300} />
}