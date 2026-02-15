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
      .curve(d3.curveMonotoneX)

    svg.append('path')
      .datum(parsed)
      .attr('fill', 'rgba(100, 181, 246, 0.35)')
      .attr('stroke', '#64b5f6')
      .attr('stroke-width', 2)
      .attr('d', area)

    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b %d')))

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y))


    const focus = svg.append('g')
      .style('display', 'none')

    focus.append('line')
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', 'white')
      .attr('stroke-dasharray', '3,3')


    focus.append('circle')
      .attr('r', 4)
      .attr('fill', '#1976d2')

    const label = focus.append('text')
      .attr('x', 9)
      .attr('dy', '-0.35em')
      .style('font-size', '12px')
      .style('fill', '#333')

    const bisectDate = d3.bisector<typeof parsed[number], Date>(
      d => d.date
    ).left


    svg.append('rect')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('width', width)
      .attr('height', height)
      .on('mouseenter', () => focus.style('display', null))
      .on('mouseleave', () => focus.style('display', 'none'))
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event)
        const date = x.invert(mx)

        const i = bisectDate(parsed, date, 1)
        const a = parsed[i - 1]
        const b = parsed[i]
        const d = b && date.getTime() - a.date.getTime() >
          b.date.getTime() - date.getTime()
          ? b
          : a

        focus.select('circle')
          .attr('cx', x(d.date))
          .attr('cy', y(d.value))

        focus.select('line')
          .attr('x1', x(d.date))
          .attr('x2', x(d.date))

        label
          .attr('transform', `translate(${x(d.date)}, ${y(d.value)})`)
          .text(d.value)
      })

  }, [data])

  return <svg ref={ref} width={500} height={300} />
}
