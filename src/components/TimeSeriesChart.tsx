import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import type { TimePoint } from '../types/tree'

export function TimeSeriesChart({ data }: { data: TimePoint[] }) {
  const ref = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!ref.current || !data.length) return

    const parsed = data.map(d => ({
      date: new Date(d.date),
      value: d.value,
    }))

    const width = 460
    const height = 250
    const margin = { top: 10, right: 20, bottom: 30, left: 40 }

    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    const x = d3.scaleTime()
      .domain(d3.extent(parsed, d => d.date) as [Date, Date])
      .range([margin.left, width - margin.right])

    const y = d3.scaleLinear()
      .domain([0, d3.max(parsed, d => d.value)!])
      .nice()
      .range([height - margin.bottom, margin.top])

    const area = d3.area<typeof parsed[number]>()
      .x(d => x(d.date))
      .y0(y(0))
      .y1(d => y(d.value))

    svg.append('path')
      .datum(parsed)
      .attr('fill', 'rgba(100, 181, 246, 0.35)')
      .attr('stroke', '#64b5f6')
      .attr('stroke-width', 2)
      .attr('d', area)

    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat('%b %d') as any) as any)

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y))
    svg.selectAll('.dot')
      .data(parsed)
      .join('circle')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.value))
      .attr('r', 5)
      .attr('fille', '#1976d2')
      .attr('cursor', 'pointer')
      .append('title')
      .text(d => `Date: ${d.date.toLocaleDateString()}\nValue: ${d.value}`)

    

  }, [data])

  return <svg ref={ref} width={500} height={300} />
}
