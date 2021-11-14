import stream from "mithril/stream";
import DateTime from "luxon/src/datetime.js";
import DomainStore from "../../store/domain-store";
import HabitStore from "../../store/habit-store";
import HabitDateStore from "../../store/habit-date-store";
import DateStore from "../../store/date-store";
import NodeStore from "../../store/habit-node-store";
import TreeStore from "../../store/habit-tree-store";

// Streams for change of context indication
const fetching = stream(false);
// const changedFromDemo = stream();
const changedToDemo = stream();
const outOfDateBoundary = stream();
const changedDate = stream();
const newDate = stream();
const pendingCalendarRefresh = stream(false);
const changedDomain = stream();
const changedHabit = stream();
const newRecord = stream();

// Streams for calendar widget/date selector states
const calendarDates = stream(["", "", "", "", "", "", ""]);
const statuses = stream();
const parsedDates = () =>
  DateStore.listForHabit().map((d) => DateTime.fromSQL(d?.h_date).ts);

function changeOfModelContext() {
  const isDemo = m.route.param("demo");
  // // Reset when you switch data sources
  // changedFromDemo(!isDemo && HabitStore.current()?.name !== 'Select a Life-Domain to start tracking' && DomainStore.current()?.name === 'Sports');
  changedToDemo(
    isDemo &&
      HabitDateStore.list().length === 28 &&
      HabitDateStore.list()[0].date_id !== 1
  );

  // Reset the current date when you switch to a habit with no record of that date
  outOfDateBoundary(
    HabitStore.current() &&
      changedDate() &&
      DateTime.fromSQL(HabitStore.current()?.initiation_date) >
        DateTime.fromSQL(DateStore.current()?.h_date)
  );
  // Set indicator when a new date needs to be automatically added
  const todaysDate = DateTime.now().startOf("day");
  const maxDate = DateTime.fromMillis(Math.max.apply(null, parsedDates()));
  if (
    !isDemo &&
    DateStore.listForHabit().length > 0 &&
    !newDate() &&
    maxDate < todaysDate
  )
    console.log(newDate(true));

  let needRefresh =
    changedToDemo() ||
    outOfDateBoundary() ||
    changedDomain() ||
    newRecord() ||
    newDate() ||
    changedDate() ||
    newRecord();
  if (needRefresh && !changedDate()) {
    // Sanity check logs::
    console.log("newRecord() :>> ", newRecord());
    // console.log("changedFromDemo() :>> ", changedFromDemo());
    console.log("changedToDemo() :>> ", changedToDemo());
    console.log("changedDomain() :>> ", changedDomain());
    console.log("newDate() :>> ", newDate());
    console.log("outOfDateBoundary() :>> ", outOfDateBoundary());
    console.log(" HabitDateStore.list() :>> ", HabitDateStore.list());
  }
  return needRefresh;
}

function updatedMinAndMaxForCurrentHabit() {
  const minDate = DateTime.fromMillis(Math.min.apply(null, parsedDates()));
  const maxDate = DateTime.fromMillis(Math.max.apply(null, parsedDates()));
  return [minDate, maxDate];
}

function updateDomainSelectors() {
  document.querySelectorAll(".domain-selector").forEach((selector) => {
    let current = DomainStore.current();
    let newIndex = DomainStore.list().indexOf(current);
    selector.selectedIndex = newIndex;
  });

  Array.from(document.querySelectorAll(".domain-selector option"))
    .filter((opt) => opt.text === DomainStore.current()?.name)
    .forEach((opt) => {
      opt.setAttribute("selected", "true");
    });
}

function preLoadHabitDateData() {
  if (m.route.param("demo")) return;
  fetching(true);
  return NodeStore.index().then(() => {
    HabitStore.current() && HabitDateStore.runFilter(HabitStore.current()?.id);
    DateStore.current() &&
      HabitDateStore.runDateFilterOnCurrentList(DateStore.current()?.id);
    fetching(false);
  });
}

function loadTreeData() {
  return TreeStore.index(
    m.route.param("demo"),
    DomainStore.current()?.id,
    DateStore.current()?.id
  );
}

function populateCalendar() {
  return (
    DateStore.listForHabit().length > 0 &&
    HabitDateStore.indexForHabitPeriod(HabitStore.current()?.id, 14)
      .then((data) => {
        console.log(DomainStore.current());
        console.log(HabitStore.fullList());
        DateStore.indexDatesOfHabit(HabitStore.current());
        let newStatusInfo = data?.slice(-7).map((date) => ({
          date_id: date.date_id,
          completed_status: date.completed_status,
        }));
        newStatusInfo.habitId = HabitStore.current().id;
        statuses(newStatusInfo);
        const dates =
          statuses() &&
          statuses()
            .map((statusObj) => {
              return (
                DateStore.dateFromDateObjectArray(
                  statusObj.date_id,
                  DateStore.listForHabit()
                ) || ""
              );
            })
            .slice(-7);
        DateStore.listForHabit(DateStore.listForHabit().slice(-7));
        calendarDates(dates);
      })
      .then(() => {
        changedDate(true);
      })
      .catch((error) => {
        console.log("Could not populate calendar", error);
      })
  );
}

const resetContextStates = () => {
  fetching(false);
  newRecord(false);
  // changedFromDemo(false) ;
  changedToDemo(false);
  changedDomain(false);
  changedDate(false);
  newDate(false);
  if (outOfDateBoundary()) {
    let newListForHabit = DateStore.filterForHabit(HabitStore.current());
    DateStore.current(newListForHabit[newListForHabit.length - 1]);
    outOfDateBoundary(false);
  }
};

export {
  fetching,
  newRecord,
  // changedFromDemo,
  changedDate,
  newDate,
  changedDomain,
  changedHabit,
  outOfDateBoundary,
  changeOfModelContext,
  updateDomainSelectors,
  resetContextStates,
  updatedMinAndMaxForCurrentHabit,
  loadTreeData,
  populateCalendar,
  pendingCalendarRefresh,
  calendarDates,
  statuses,
  preLoadHabitDateData,
};
