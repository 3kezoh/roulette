import confetti from "canvas-confetti";
import type { Component, JSX } from "solid-js";
import { batch, createSignal, For, Show } from "solid-js";
import Wheel from "./components/Wheel";
import { isEmpty, not, pipe, random } from "./helpers";

const App: Component = () => {
	const [getStudents, setStudents] = createSignal<string[]>([]);
	const [getIsSpinning, setIsSpinning] = createSignal(false);
	const [getTo, setTo] = createSignal(0, { equals: false });
	const [getPickedStudents, setPickedStudents] = createSignal<string[]>([]);
	const [getPickedStudent, setPickedStudent] = createSignal<string>();

	let dialog!: HTMLDialogElement;

	const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = async ({
		currentTarget,
	}) => {
		if (currentTarget.files === null) {
			return;
		}

		const [file] = currentTarget.files;

		if (file.type !== "text/plain") {
			return;
		}

		const text = await file.text();
		const lines = text.split("\n");
		const students = lines.filter((line) => /\S+/.test(line));

		batch(() => {
			setStudents(students);
			setTo(0);
		});
	};

	function onClick() {
		const students = getStudents();
		const to = random(0, students.length - 1);

		setTo(to);
	}

	const onTransitionStart: JSX.EventHandler<SVGGElement, TransitionEvent> = ({
		propertyName,
	}) => {
		if (propertyName === "rotate") {
			setIsSpinning(true);
		}
	};

	const onTransitionEnd: JSX.EventHandler<SVGGElement, TransitionEvent> = ({
		propertyName,
	}) => {
		if (propertyName === "rotate") {
			const to = getTo();
			const students = getStudents();
			const pickedStudent = students.at(to);

			setPickedStudent(pickedStudent);

			dialog.showModal();

			confetti({
				particleCount: 120,
				spread: 120,
			});
		}
	};

	const onClose: JSX.EventHandler<HTMLDialogElement, Event> = () => {
		const to = getTo();
		const students = getStudents();
		const pickedStudent = students.at(to);

		if (!pickedStudent) {
			return;
		}

		batch(() => {
			setStudents(students.toSpliced(to, 1));
			setPickedStudents((pickedStudents) => [...pickedStudents, pickedStudent]);
			setIsSpinning(false);
		});
	};

	return (
		<main class="grid grid-rows-[2fr_8fr_2fr] h-screen container mx-auto py-8">
			<header>
				<h1 class="text-2xl font-bold mb-4">Roulette</h1>
				<section aria-labelledby="upload">
					<h2 id="upload" class="sr-only">
						Upload
					</h2>
					<div class="flex flex-col gap-2">
						<label class="label" for="file">
							Choose a text file
						</label>
						<input
							id="file"
							accept="text/plain"
							type="file"
							onInput={onInput}
							class="file-input"
							aria-describedby="format"
						/>
						<span class="label" id="format">
							File format: .txt — one name per line.
						</span>
					</div>
				</section>
			</header>
			<Show when={pipe(getStudents(), isEmpty, not)}>
				<section aria-labelledby="roulette" class="min-h-0">
					<h2 class="sr-only" id="roulette">
						Roulette
					</h2>
					<button
						type="button"
						onClick={onClick}
						disabled={getIsSpinning()}
						class="group h-full w-fit flow-root m-auto"
						classList={{
							"cursor-not-allowed": getIsSpinning(),
							"hover:cursor-pointer": !getIsSpinning(),
						}}
					>
						<Show when={getStudents()} keyed>
							<Wheel
								data={getStudents()}
								onTransitionEnd={onTransitionEnd}
								onTransitionStart={onTransitionStart}
								to={getTo()}
							/>
						</Show>
						<span
							class="absolute top-1/2 -translate-1/2 tracking-wide text-2xl font-bold transition-all"
							classList={{
								"group-hover:text-3xl": !getIsSpinning(),
								"group-hover:tracking-widest": !getIsSpinning(),
							}}
						>
							SPIN
						</span>
					</button>
				</section>
				<section aria-labelledby="picked" class="min-h-0">
					<h2 class="text-xl font-semibold" id="picked">
						Recently picked
					</h2>
					<ul class="list max-h-full overflow-auto">
						<For each={getPickedStudents()}>
							{(pickedStudent) => <li class="list-row">{pickedStudent}</li>}
						</For>
					</ul>
				</section>
				<dialog class="modal" ref={dialog} onClose={onClose}>
					<div class="modal-box h-2/12 flex items-center justify-center text-2xl font-bold">
						{getPickedStudent()}
					</div>
					<form method="dialog" class="modal-backdrop">
						<button type="submit">close</button>
					</form>
				</dialog>
			</Show>
		</main>
	);
};

export default App;
