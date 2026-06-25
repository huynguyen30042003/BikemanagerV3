"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [text, setText] = useState("test");

  useEffect(() => {
    alert("mounted");
  }, []);

  return (
    <div>
      <div>{text}</div>

      <button
        type="button"
        onClick={() => {
          alert("clicked");
          setText("clicked");
        }}
      >
        Click
      </button>
    </div>
  );
}