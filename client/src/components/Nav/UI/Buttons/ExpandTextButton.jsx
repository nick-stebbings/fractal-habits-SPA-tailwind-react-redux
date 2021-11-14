// src/view/components/Layout/Nav/UI/Buttons/ExpandTextButton.jsx

const ExpandTextButton = {
  view: ({ attrs: { parentVnode, buttonTextOff, buttonTextOn } }) => (
    <button
      type="button"
      onClick={function () {
        let hidden;
        const contentContainer = parentVnode.dom.querySelector('.feature-card-content');
        const button = parentVnode.dom.querySelector('button');
        const hiddenParagraphs = parentVnode.dom.querySelectorAll(
          'p.long-content',
        );

        hiddenParagraphs.forEach((paragraph) => {
          const cl = paragraph.classList;
          hidden = cl.contains('hidden');
          hidden ? cl.remove('hidden') : cl.add('hidden');
        });
        button.textContent = hidden ? buttonTextOn : buttonTextOff;

        const height = contentContainer.scrollHeight;
        const { maxHeight } = window.getComputedStyle(contentContainer);
        contentContainer.style.maxHeight = (maxHeight === '356px' ? `${height + 16}px` : '356px');
      }}
      className="button font-std hover:bg-balance-basic-digblue rounded-l-2xl rounded-b-2xl bottom-6 absolute px-4 font-semibold py-1 tracking-widest uppercase"
    >
      {buttonTextOff}
    </button>
  ),
};

export default ExpandTextButton;
