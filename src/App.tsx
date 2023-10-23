import { Show, createSignal, type Component, JSX } from "solid-js";
import Button from "./components/Button";
import Wheel from "./components/Wheel";
import { isEmpty, not, pipe, random } from "./helpers";

const App: Component = () => {
  const [getStudents, setStudents] = createSignal<string[]>([]);
  const [getIsSpinning, setIsSpinning] = createSignal(false);
  const [getState, setState] = createSignal<{ from: number; to?: number }>({
    from: 0,
  });

  const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = async ({
    currentTarget,
  }) => {
    if (currentTarget.files === null) {
      return;
    }

    const [file] = currentTarget.files;
    const text = await file.text();
    const students = text.split("\n");

    setStudents(students);
  };

  function onClick() {
    setState(({ from, to }) => {
      const students = getStudents();
      const nextTo = random(0, students.length - 1);

      if (to !== undefined) {
        return {
          from: to,
          to: nextTo,
        };
      }

      return {
        from,
        to: nextTo,
      };
    });
  }

  function onTransitionStart() {
    setIsSpinning(true);
  }

  function onTransitionEnd() {
    setIsSpinning(false);
  }

  return (
    <div class="grid gap-2 justify-items-center">
      <input type="file" onInput={onInput} />
      <Show when={pipe(getStudents(), isEmpty, not)}>
        <div class="relative">
          <Wheel
            data={getStudents()}
            onTransitionEnd={onTransitionEnd}
            onTransitionStart={onTransitionStart}
            radius={500}
            innerRadius={96}
            {...getState()}
          />
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 absolute top-1/2 right-0 border-2 -translate-y-1/2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
            />
          </svg>
          <Button
            onClick={onClick}
            disabled={getIsSpinning()}
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-48 h-48"
          >
            Spin
          </Button>
        </div>
      </Show>
    </div>
  );
};

export default App;
