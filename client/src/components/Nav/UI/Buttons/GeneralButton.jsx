const GeneralButton = {
  view: ({ attrs }) => (
    <div
      className="button-container general-button"
    >
      <span className={attrs.color && attrs.color}>
        <button
          type="submit"
          id={attrs.id}
          name={attrs.name}
          data-id={attrs.dataAttr}
          type="button"
          className="flex-no-shrink text-balance-buttontext-neutral rounded-xl font-heavy flex items-center h-12 px-2 font-sans tracking-wide uppercase"
        >
          {attrs.label}
        </button>
      </span>
    </div>
  ),
};

export default GeneralButton;
