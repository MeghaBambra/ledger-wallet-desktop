// @flow

import * as d3 from 'd3'
import d from 'debug'

import type { Props } from '.'
import type { CTX } from './types'

const debug = d('Chart')

export default function refreshNodes({ ctx, node, props }: { ctx: CTX, node: any, props: Props }) {
  const { NODES, COLORS } = ctx
  const { hideAxis, interactive, id } = props

  // Container

  ensure({ NODES, key: 'svg' }, () => d3.select(node).append('svg'))
  ensure({ NODES, key: 'wrapper' }, () => NODES.svg.append('g'))
  ensure({ NODES, key: 'defs' }, () => NODES.wrapper.append('defs'))

  // Axis & ticks

  ensure({ onlyIf: !hideAxis, NODES, key: 'axisBot' }, () => NODES.wrapper.append('g'))
  ensure({ onlyIf: !hideAxis, NODES, key: 'axisLeft' }, () => NODES.wrapper.append('g'))
  ensure({ onlyIf: !hideAxis, NODES, key: 'yTicks' }, () => NODES.wrapper.append('g'))

  // Focus bars

  ensure({ onlyIf: interactive, NODES, key: 'xBar' }, () =>
    NODES.wrapper
      .append('line')
      .attr('stroke', COLORS.focusBar)
      .attr('stroke-width', '1px')
      .attr('stroke-dasharray', '3, 2'),
  )

  ensure({ onlyIf: interactive, NODES, key: 'yBar' }, () =>
    NODES.wrapper
      .append('line')
      .attr('stroke', COLORS.focusBar)
      .attr('stroke-width', '1px')
      .attr('stroke-dasharray', '3, 2'),
  )

  // Gradient

  ensure({ NODES, key: 'gradient' }, () =>
    NODES.defs
      .append('linearGradient')
      .attr('id', `gradient-${id || ''}`)
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%'),
  )

  ensure({ NODES, key: 'gradientStart' }, () =>
    NODES.gradient
      .append('stop')
      .attr('stop-color', COLORS.gradientStart)
      .attr('offset', '0'),
  )

  ensure({ NODES, key: 'gradientStop' }, () =>
    NODES.gradient
      .append('stop')
      .attr('stop-color', COLORS.gradientStop)
      .attr('offset', '1'),
  )

  ensure({ NODES, key: 'fillArea' }, () =>
    NODES.wrapper.append('path').attr('fill', `url(#gradient-${id || ''})`),
  )

  // Line

  ensure({ NODES, key: 'line' }, () =>
    NODES.wrapper
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', COLORS.line)
      .attr('stroke-width', '2px'),
  )

  // Tooltip & focus point

  ensure({ onlyIf: interactive, NODES, key: 'tooltip' }, () =>
    d3
      .select(node)
      .append('div')
      .style('position', 'absolute')
      .style('top', '0')
      .style('left', '0')
      .style('pointer-events', 'none'),
  )

  ensure({ onlyIf: interactive, NODES, key: 'focus' }, () =>
    NODES.wrapper
      .append('g')
      .append('circle')
      .attr('fill', COLORS.focus)
      .attr('r', 4),
  )

  ctx.NODES = NODES
}

function ensure(
  { onlyIf: condition = true, NODES, key }: { onlyIf?: boolean, NODES: Object, key: string },
  create,
) {
  if (!condition && NODES[key]) {
    remove(NODES, key)
  }
  if (condition && !NODES[key]) {
    append(NODES, key, create())
  }
}

function remove(NODES, key) {
  debug(`Destroying ${key}`)
  NODES[key].remove()
  NODES[key] = null
}

function append(NODES, key, node) {
  debug(`Appending ${key}`)
  NODES[key] = node
}
