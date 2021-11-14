const SubmitButton = {
  view: ({ attrs }) => (
    <div
      name={attrs.name}
      className={
        attrs.class
          ? `${attrs.class} button-container submit-button`
          : 'button-container submit-button'
      }
    >
      <button
        id={attrs.id}
        type="submit"
        value="submit"
        disabled={attrs.disabled}
        className="flex-no-shrink text-balance-buttontext-neutral font-heavy flex items-center h-8 px-2 my-1 font-sans tracking-wide uppercase"
      >
        {attrs.label}
      </button>
    </div>
  ),
};

export default SubmitButton;
