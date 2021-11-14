import React from "react";

export const ExpandTextButton = ({ buttonTextOff, buttonTextOn }) => {
  const handleClick = function (e) {
    let hidden;
    let parentVnode = e.target.parent;
    const contentContainer = parentVnode.querySelector(".feature-card-content");
    const button = parentVnode.querySelector("button");
    const hiddenParagraphs = parentVnode.querySelectorAll("p.long-content");

    hiddenParagraphs.forEach((paragraph) => {
      const cl = paragraph.classList;
      hidden = cl.contains("hidden");
      hidden ? cl.remove("hidden") : cl.add("hidden");
    });
    button.textContent = hidden ? buttonTextOn : buttonTextOff;

    const height = contentContainer.scrollHeight;
    const { maxHeight } = window.getComputedStyle(contentContainer);
    contentContainer.style.maxHeight =
      maxHeight === "356px" ? `${height + 16}px` : "356px";
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="button font-std hover:bg-balance-basic-digblue rounded-l-2xl rounded-b-2xl bottom-6 absolute px-4 font-semibold py-1 tracking-widest uppercase"
    >
      {buttonTextOff}
    </button>
  );
};
