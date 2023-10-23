import { JSX, ParentComponent, mergeProps, splitProps } from "solid-js";

const Button: ParentComponent<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props
) => {
  const defaultProps = { type: "button" as const };
  const propsWithDefault = mergeProps(defaultProps, props);
  const [local, others] = splitProps(propsWithDefault, ["children"]);

  function getClassList() {
    return {
      "cursor-not-allowed": others.disabled,
    };
  }

  return (
    <button classList={getClassList()} {...others}>
      {local.children}
    </button>
  );
};

export default Button;
