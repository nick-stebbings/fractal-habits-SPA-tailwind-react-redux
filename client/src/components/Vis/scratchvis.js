
  return {
    type: "vis",
    onupdate: ({ attrs }) => {
      const selectedDomain = document.querySelector(
        "option[selected=true]"
      ).value;
      if (
        HabitStore.list().length > 0 &&
        TreeStore.root()?.name === "" &&
        DomainStore.current().name === selectedDomain
      ) {
        updateStoresAndRenderTree(attrs.modalType);
        console.log("Habit Tree indexed");
      } else {
        if (HabitStore.list().length === 0) {
          TreeStore.clear();
          console.log("No habits for tree!");
          return;
        } else {
          console.log("Habit Tree loaded from store");
        }
        renderTree(
          svg,
          demoData,
          zoomer,
          {},
          canvasWidth,
          canvasHeight,
          attrs.modalType
        );
      }
    },
    oninit: ({ attrs }) => {
      const oldWindowWidth = stream(window.innerWidth);
      window.onresize = debounce(() => {
        let factor = 1 - 1 / (window.innerWidth / oldWindowWidth());
        zoomer.scaleBy(svg.transition().duration(250), 1 - factor);
        oldWindowWidth(document.body.getBoundingClientRect().width);
      }, debounceInterval);

      if (DomainStore.list().length > 0 && TreeStore.root()?.name == "") {
        updateStoresAndRenderTree(attrs.modalType);
        console.log("Habit Tree indexed");
      }
    },
    oncreate: ({ attrs }) => {
      canvasWidth < 600 && addSwipeGestures();

      // svg = select(`div#${attrs.divId}`)
      //   .classed("h-screen", true)
      //   .classed("w-full", true)
      //   .append("svg")
      //   .classed('vis-div', 'true')
      //   .attr("width", "100%")
      //   .attr("height", "100%")
      //   .attr("style", "pointer-events: all");

      // ({ canvasWidth, canvasHeight } = d3SetupCanvas(document));

      if (HabitStore.list().length !== 0 && TreeStore.root() && svg)
        renderTree(
          svg,
          demoData,
          zoomer,
          {},
          canvasWidth,
          canvasHeight,
          attrs.modalType
        );

      document.getElementById("reset-tree").addEventListener("click", (e) => {
        expandTree(TreeStore.root());
        renderTree(
          svg,
          demoData,
          zoomer,
          {},
          canvasWidth,
          canvasHeight,
          attrs.modalType
        );
      });
      document
        .getElementById("collapse-tree")
        .addEventListener("click", (e) => {
          const isActive = e.target.classList.contains('active');
          isActive ? e.target.classList.remove("active") : e.target.classList.add('active');
          e.target.textContent.includes("Collapse")
            ? collapseTree()
            : expandTree();
          e.target.textContent = e.target.textContent.includes("Collapse")
            ? "Expand"
            : "Collapse";
          renderTree(
            svg,
            demoData,
            zoomer,
            {},
            canvasWidth,
            canvasHeight,
            attrs.modalType
          );
        });