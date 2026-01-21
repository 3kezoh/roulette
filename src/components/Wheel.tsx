import * as d3 from "d3";
import { type Component, createMemo, For, type JSX } from "solid-js";
import { random, toDegree } from "../helpers";

interface WheelProps {
	data: string[];
	onTransitionEnd?: JSX.EventHandler<SVGGElement, TransitionEvent>;
	onTransitionStart?: JSX.EventHandler<SVGGElement, TransitionEvent>;
	to?: number;
}

const Wheel: Component<WheelProps> = (props) => {
	const pie = d3.pie<string>().value(1);

	function getArcs() {
		const { data } = props;
		const colors = d3.quantize(d3.interpolateRainbow, data.length + 1);
		const arcs = pie(data);

		return arcs.map((arc, index) => ({ ...arc, color: colors.at(index) }));
	}

	function getStep() {
		const [{ startAngle, endAngle }] = getArcs();

		return endAngle - startAngle;
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
	);

	const step = getStep();
	const initialAngle = (Math.PI - step) / 2;

	const getAngle = createMemo<number>((previousAngle) => {
		const { data, to } = props;

		if (to === undefined) {
			return previousAngle;
		}

		const [from] = getFrom();
		const step = getStep();
		const randomTurns = random(3, 6);
		const nextAngle = previousAngle + randomTurns * 2 * Math.PI;

		if (from >= to) {
			return nextAngle + (from - to - data.length) * step;
		}

		return nextAngle + (from - to) * step;
	}, initialAngle);

	const onTransitionEnd: JSX.EventHandler<SVGGElement, TransitionEvent> = (
		event,
	) => props.onTransitionEnd?.(event);

	const onTransitionStart: JSX.EventHandler<SVGGElement, TransitionEvent> = (
		event,
	) => props.onTransitionStart?.(event);

	const viewBox = 1000;
	const center = viewBox / 2;
	const padding = viewBox * 0.05;
	const size = 1000 - padding;
	const outerRadius = size / 2;
	const innerRadius = outerRadius / 2;
	const translation = outerRadius - innerRadius / 2;
	const arcLength = (2 * Math.PI * outerRadius) / props.data.length;

	const fontSize = Math.max(
		size * 0.015,
		Math.min(size * 0.03, arcLength * 0.33),
	);

	const pointerSize = size * 0.06;
	const pointerHalf = pointerSize / 2;
	const pointerX = size + padding / 2 - pointerHalf;
	const pointerY = center - pointerHalf;
	const pointerPoints = `0 ${pointerHalf}, ${pointerSize} ${pointerSize}, ${pointerSize} 0`;
	const pointerTransform = `translate(${pointerX}, ${pointerY})`;

	return (
		<svg
			role="img"
			aria-label="roulette"
			viewBox={`0 0 ${viewBox} ${viewBox}`}
			class="h-full w-full"
		>
			<g transform={`translate(${center}, ${center})`}>
				<g
					class={`transition-all duration-[3s] ease-[cubic-bezier(0.33,0,0,1)]`}
					style={{ rotate: `${getAngle()}rad` }}
					onTransitionEnd={onTransitionEnd}
					onTransitionStart={onTransitionStart}
				>
					<For each={getArcs()}>
						{({ data, startAngle, endAngle, color }) => {
							const arc = d3.arc();

							const d = arc({
								startAngle,
								endAngle,
								innerRadius,
								outerRadius,
							});

							if (d === null) {
								return;
							}

							const middleAngle = (startAngle + endAngle) / 2;
							const rotation = toDegree(middleAngle) - 90;
							const transform = `rotate(${rotation}) translate(${translation})`;

							return (
								<g>
									<path d={d} fill={color} stroke={color} />
									<text
										font-size={fontSize.toString()}
										transform={transform}
										text-anchor="middle"
										dominant-baseline="middle"
										class="tracking-wide font-bold"
									>
										{data}
									</text>
								</g>
							);
						}}
					</For>
				</g>
			</g>
			<polygon points={pointerPoints} transform={pointerTransform} />
		</svg>
	);
};

export default Wheel;
