const ResetButton = {
  view: ({ attrs }) => (
    <div className="button-container reset-button">
      <button
        id={attrs.id}
        className="flex-no-shrink text-balance-buttontext-neutral rounded-xl font-heavy flex items-center h-12 px-2 font-sans tracking-wide uppercase"
      >
        {attrs.label}
      </button>
    </div>
  ),
};

export default ResetButton;
