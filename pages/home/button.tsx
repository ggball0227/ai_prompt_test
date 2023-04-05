import * as React from "react";

export default function IconButton(props: {
  onClick?: () => void;
  icon?: JSX.Element;
  text?: string;
  bordered?: boolean;
  shadow?: boolean;
  noDark?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <div onClick={props.onClick} title={props.title} role="button">
      <div>{props.icon ? props.icon : ""}</div>
      {props.text && <div>{props.text}</div>}
    </div>
  );
}
