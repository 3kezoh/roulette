import { JSX, Show, batch, createSignal, type Component } from "solid-js";
import Wheel from "./components/Wheel";
import { isEmpty, not, pipe, random } from "./helpers";

const App: Component = () => {
  const [getStudents, setStudents] = createSignal<string[]>([]);
  const [getIsSpinning, setIsSpinning] = createSignal(false);
  const [getTo, setTo] = createSignal(0, { equals: false });

  const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = async ({
    currentTarget,
  }) => {
    if (currentTarget.files === null) {
      return;
    }

    const [file] = currentTarget.files;
    const text = await file.text();
    const students = text.split("\n");

    batch(() => {
      setStudents(students);
      setTo(0);
    });
  };

  function onClick() {
    const students = getStudents();
    const nextTo = random(0, students.length - 1);

    setTo(nextTo);
  }

  function onTransitionStart() {
    setIsSpinning(true);
  }

  function onTransitionEnd() {
    setIsSpinning(false);
  }

  return (
    <section class="grid justify-items-center h-screen container mx-auto py-16">
      <div class="form-control">
        <label class="label" for="file">
          <span class="label-text">Pick a file</span>
        </label>
        <input
          id="file"
          type="file"
          onInput={onInput}
          class="file-input file-input-bordered"
        />
      </div>
      <Show when={pipe(getStudents(), isEmpty, not)}>
        <div class="relative h-fit self-center">
          <Show when={getStudents()} keyed>
            <Wheel
              data={getStudents()}
              onTransitionEnd={onTransitionEnd}
              onTransitionStart={onTransitionStart}
              radius={800}
              innerRadius={128}
              to={getTo()}
            />
          </Show>
          <svg
            viewBox="0 0 10 10"
            class="w-8 h-8 absolute top-1/2 -right-4 -translate-y-1/2"
          >
            <polygon points="0 5, 10 10, 10 0" />
          </svg>
          <button
            onClick={onClick}
            disabled={getIsSpinning()}
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-64 h-64 tracking-widest text-xl font-bold transition-all"
            classList={{
              "hover:text-2xl": !getIsSpinning(),
              "cursor-not-allowed": getIsSpinning(),
            }}
          >
            SPIN
          </button>
        </div>
      </Show>
    </section>
  );
};

export default App;
