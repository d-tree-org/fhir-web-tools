"use client";

import React, { useState } from "react";
import { AiTwotoneEye as EyeIcon, AiTwotoneEyeInvisible as EyeInvisibleIcon } from "react-icons/ai";

type Props = {
  label: string;
  value: string;
  className?: string;
};

const HiddenText = (props: Props) => {
  const [hidden, setHidden] = useState(false);
  return (
    <div className="flex flex-row items-center gap-2">
      <button onClick={() => setHidden(!hidden)} className="btn btn-xs">
        {
            hidden ? <EyeInvisibleIcon /> : <EyeIcon />
        }
        {props.label}
      </button>
      {hidden && <p className={props.className}>{props.value}</p>}
    </div>
  );
};

export default HiddenText;
