import * as d3 from "d3";
import { For, createMemo, type Component } from "solid-js";
import { random, toDegree } from "../helpers";

interface WheelProps {
  data: string[];
  radius: number;
  from: number;
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

  const getAngle = createMemo<number>((previousAngle) => {
    const { data, from, to } = props;
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
  }, getInitialAngle());

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

  return (
    <svg width={getWidth()} height={getHeight()}>
      <g transform={`translate(${getCenterX()}, ${getCenterY()})`}>
        <g
          class={`transition-all duration-[3s] ease-[cubic-bezier(0.33,0,0,1)]`}
          style={{ rotate: `${getAngle()}rad` }}
        >
          <For each={getArcs()}>
            {({ data, startAngle, endAngle, color }) => {
              const arc = d3.arc();
              const width = getHeight();
              const innerRadius = width / 6;
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
