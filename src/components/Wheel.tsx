import * as d3 from "d3";
import { For, createMemo, type Component, JSX } from "solid-js";
import { random, toDegree } from "../helpers";

interface WheelProps {
  data: string[];
  onTransitionEnd?: JSX.EventHandler<SVGGElement, TransitionEvent>;
  onTransitionStart?: JSX.EventHandler<SVGGElement, TransitionEvent>;
  radius: number;
  innerRadius: number;
  to?: number;
}

const Wheel: Component<WheelProps> = (props) => {
  const pie = d3.pie<string>().value(1);

  function getArcs() {
    const { data } = props;
    const colors = d3.quantize(d3.interpolateRainbow, data.length);
    const arcs = pie(data);

    return arcs.map((arc, index) => ({ ...arc, color: colors.at(index) }));
  }

  function getStep() {
    const [{ startAngle, endAngle }] = getArcs();

    return endAngle - startAngle;
  }

  function getInitialAngle() {
    const step = getStep();

    return (Math.PI - step) / 2;
  }

  const getFrom = createMemo<[number] | [number, number]>(
    ([from, to]) => {
      if (props.to === undefined) {
        return [from];
      }

      if (to === undefined) {
        return [from, props.to];
      }

      return [to, props.to];
    },
    [0],
    { equals: false }
  );

  const getAngle = createMemo<number>(
    (previousAngle) => {
      const { data, to } = props;
      const [from] = getFrom();

      const step = getStep();

      if (to === undefined) {
        return previousAngle;
      }

      const randomTurns = random(4, 6);
      const nextAngle = previousAngle + randomTurns * 2 * Math.PI;

      if (from >= to) {
        return nextAngle + (from - to - data.length) * step;
      }

      return nextAngle + (from - to) * step;
    },
    getInitialAngle(),
    { equals: false }
  );

  function getHeight() {
    return props.radius;
  }

  function getWidth() {
    return props.radius;
  }

  function getCenterX() {
    const width = getWidth();

    return width / 2;
  }

  function getCenterY() {
    const height = getHeight();

    return height / 2;
  }

  const onTransitionEnd: JSX.EventHandler<SVGGElement, TransitionEvent> = (
    event
  ) => props.onTransitionEnd?.(event);

  const onTransitionStart: JSX.EventHandler<SVGGElement, TransitionEvent> = (
    event
  ) => props.onTransitionStart?.(event);

  return (
    <svg width={getWidth()} height={getHeight()}>
      <g transform={`translate(${getCenterX()}, ${getCenterY()})`}>
        <g
          class={`transition-all duration-[3s] ease-[cubic-bezier(0.33,0,0,1)]`}
          style={{ rotate: `${getAngle()}rad` }}
          onTransitionEnd={onTransitionEnd}
          onTransitionStart={onTransitionStart}
        >
          <For each={getArcs()}>
            {({ data, startAngle, endAngle, color }) => {
              const arc = d3.arc();
              const width = getHeight();
              const innerRadius = props.innerRadius;
              const outerRadius = width / 2;

              const d = arc({
                startAngle,
                endAngle,
                innerRadius,
                outerRadius,
              });

              if (d === null) {
                return;
              }

              const translation = outerRadius - innerRadius / 2;
              const middleAngle = (startAngle + endAngle) / 2;
              // 88.5 (~ 90°) because 0 is at -y (12 o’clock) and positive angles proceeds clockwise.
              const rotation = toDegree(middleAngle) - 88.5;
              const transform = `rotate(${rotation}) translate(${translation})`;

              return (
                <g>
                  <path d={d} fill={color} stroke="black" stroke-width={1} />
                  <text text-anchor="end" transform={transform}>
                    {data}
                  </text>
                </g>
              );
            }}
          </For>
        </g>
      </g>
    </svg>
  );
};

export default Wheel;
