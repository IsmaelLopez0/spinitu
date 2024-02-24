import GenericLoading from "./GenericLoading";

export default function Button({
  children,
  text,
  className,
  color = "cararra",
  type = "solid",
  ...props
}) {
  const colors = {
    cararra: {
      type: {
        solid: "bg-cararra-400 text-cararra-50",
        outline: "bg-transparent text-cararra-950 border border-cararra-300",
      },
    },
    swirl: {
      type: {
        solid: "bg-swirl-400 text-cararra-50",
        outline: "bg-transparent text-swirl-70 border border-swirl-500",
      },
    },
    mindaro: {
      type: {
        solid: "bg-mindaro-500 text-white",
        outline: "bg-transparent text-mindaro-700 border border-mindaro-500",
      },
    },
    orchid: {
      type: {
        solid: "bg-orchid-500 text-cararra-50",
        outline: "bg-transparent text-orchid-600 border border-orchid-400",
      },
    },
  };
  return (
    <button
      onClick={() => props.onClick && !props.isLoading && props.onClick()}
      className={`py-3 px-6 rounded-lg ${colors[color]?.type[type]} ${className}`}
      {...props}
    >
      {props.isLoading ? <GenericLoading /> : children ?? text}
    </button>
  );
}
