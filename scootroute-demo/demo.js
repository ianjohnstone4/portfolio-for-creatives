// Geographic coordinates and the City basemap share a local projection in metres.
const west = -123.147;
const north = 49.293;
const project = ([longitude, latitude]) => [(longitude - west) * 72719, (north - latitude) * 111195];
const byId = (id) => document.getElementById(id);
const ns = "http://www.w3.org/2000/svg";
const formatDistance = (metres) => metres < 1000 ? `${Math.round(metres / 10) * 10} m` : `${(metres / 1000).toFixed(1)} km`;
const minutes = (seconds) => Math.max(1, Math.round(seconds / 60));
const places = {
  "canada-place": "Canada Place", burrard: "Burrard & Canada Place",
  pender: "Hornby & West Pender", hastings: "Hornby & West Hastings",
  bute: "Beach & Bute", thurlow: "Beach & Thurlow", bidwell: "Beach & Bidwell",
  denman: "Davie & Denman", georgia: "Hornby & West Georgia", smithe: "Hornby & Smithe",
  "sunset-beach": "Sunset Beach", "english-bay": "English Bay Beach", "robson-square": "Robson Square",
};
const destinations = {
  "sunset-beach": ["bute", "thurlow"],
  "english-bay": ["bidwell", "denman"],
  "robson-square": ["georgia", "smithe"],
};
const rentals = [
  { label: "Lime scooter", pickup: "burrard", slot: 0, motion: "Scooter", overhead: 90, speed: 4.7 },
  { label: "Mobi e-bike", pickup: "hastings", slot: 0, motion: "E-bike", overhead: 120, speed: 5.2 },
  { label: "Lime scooter", pickup: "pender", slot: 1, motion: "Scooter", overhead: 90, speed: 4.7 },
];
const legIndex = new Map();
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
let journeys = [], selected = 0, destination = "sunset-beach";
let view = "compare", stage = 0, fraction = 0, playing = false, complete = false;
let animation = 0, previousTime = null, markerScale = 1;
const trip = () => journeys[selected];

function svgElement(tag, attrs) {
  const element = document.createElementNS(ns, tag);
  Object.entries(attrs).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

function prepareLeg(record) {
  if (!Array.isArray(record.coordinates) || record.coordinates.length < 2 ||
      !(record.metres > 0 && record.seconds > 0) ||
      !record.coordinates.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y) &&
        x >= west && x <= -123.107 && y >= 49.2735 && y <= north)) {
    throw new Error("Incomplete route");
  }
  const points = record.coordinates.map(project);
  const distances = [0];
  for (let i = 1; i < points.length; i++) {
    distances.push(distances[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  }
  return { ...record, points, distances };
}

function leg(from, to, profile) {
  const value = legIndex.get([from, to, profile].join("/"));
  if (!value) throw new Error("Missing mapped segment");
  return value;
}

function buildJourneys(id) {
  const options = rentals.map((rental) => {
    const dropoff = destinations[id][rental.slot];
    const legs = [leg("canada-place", rental.pickup, "foot"), leg(rental.pickup, dropoff, "bike"), leg(dropoff, id, "foot")];
    const times = [legs[0].seconds, legs[1].metres / rental.speed, legs[2].seconds];
    for (let i = 1; i < legs.length; i++) {
      const end = legs[i - 1].coordinates.at(-1), start = legs[i].coordinates[0];
      if (end[0] !== start[0] || end[1] !== start[1]) throw new Error("Disconnected route");
    }
    return { ...rental, dropoff, legs, times, total: times.reduce((a, b) => a + b) + rental.overhead,
      walking: legs[0].metres + legs[2].metres };
  });
  const direct = leg("canada-place", id, "foot");
  options.push({ label: "Walk the whole way", legs: [direct], times: [direct.seconds], total: direct.seconds, walking: direct.metres });
  return options;
}

function setOptions() {
  const group = byId("options");
  group.replaceChildren();
  journeys.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "route-choice";
    button.setAttribute("aria-pressed", String(selected === index));
    const label = document.createElement("span");
    const name = document.createElement("strong"), detail = document.createElement("small");
    name.textContent = item.label;
    detail.textContent = item.pickup ? `${places[item.pickup]} · ${formatDistance(item.walking)} walking` : `${formatDistance(item.walking)} on foot`;
    label.append(name, detail);
    const duration = document.createElement("span"), unit = document.createElement("small");
    duration.className = "duration";
    duration.textContent = String(minutes(item.total));
    unit.textContent = "min est.";
    duration.append(unit);
    button.append(label, duration);
    button.addEventListener("click", () => {
      selected = index;
      [...group.children].forEach((b, i) => b.setAttribute("aria-pressed", String(i === index)));
      drawMap();
    });
    group.append(button);
  });
}

function addStop(point, label, title, isEndpoint) {
  const group = svgElement("g", { transform: `translate(${point.join(" ")}) scale(${markerScale})` });
  const t = svgElement("title", {});
  t.textContent = title;
  group.append(t, svgElement("circle", { r: isEndpoint ? 10 : 8, fill: isEndpoint ? "#284836" : "#fffdf8", stroke: isEndpoint ? "white" : "#375742", "stroke-width": 1.8 }));
  const text = svgElement("text", { "text-anchor": "middle", y: 3.6, "font-size": isEndpoint ? 10 : 9.5, fill: isEndpoint ? "white" : "#284836" });
  text.textContent = label;
  group.append(text);
  byId("map-stops").append(group);
}

function drawMap() {
  if (!trip()) return;
  const legs = trip().legs, svg = byId("map");
  const focus = view === "play" && !complete ? [legs[stage]] : legs;
  // Include the projected bounding box and a pixel gutter at every aspect ratio.
  const frame = byId("map-frame").getBoundingClientRect();
  const aspect = frame.width / Math.max(1, frame.height);
  const points = focus.flatMap((part) => part.points);
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  const left = Math.min(...xs), right = Math.max(...xs), top = Math.min(...ys), bottom = Math.max(...ys);
  const width = Math.max((right - left) * 1.2 + 105, ((bottom - top) * 1.2 + 105) * aspect, 380 * aspect);
  const height = width / aspect;
  // Keep the map within the local extract. For very wide/narrow screens centre a fitted viewport with letterboxing.
  const fitW = Math.min(width, 2909), fitH = Math.min(height, 2169);
  const x = Math.max(0, Math.min(2909 - fitW, (left + right - fitW) / 2));
  const y = Math.max(0, Math.min(2169 - fitH, (top + bottom - fitH) / 2));
  svg.setAttribute("viewBox", [x, y, fitW, fitH].join(" "));
  markerScale = Math.max(fitW / Math.max(1, frame.width), fitH / Math.max(1, frame.height));
  const layer = byId("route-lines");
  layer.replaceChildren();
  // All geometry comes from routed legs. Each polyline remains independent at handoffs.
  legs.forEach((part, i) => {
    const active = view !== "play" || complete || stage === i;
    const attrs = { points: part.points.map(([a, b]) => a.toFixed(2) + "," + b.toFixed(2)).join(" "), "vector-effect": "non-scaling-stroke" };
    const isWalk = part.profile === "foot";
    layer.append(svgElement("polyline", { ...attrs, stroke: "#fffdf8", "stroke-width": active ? 6.5 : 4, opacity: active ? 1 : .55 }));
    layer.append(svgElement("polyline", { ...attrs, stroke: isWalk ? "#785038" : "#24583b", "stroke-width": active ? 3.8 : 2,
      ...(isWalk ? { "stroke-dasharray": "2.4 5.5" } : {}), opacity: active ? 1 : .45 }));
  });
  const stops = byId("map-stops");stops.replaceChildren();
  if (view !== "play" || stage === 0 || complete) addStop(legs[0].points[0], "A", "Start at Canada Place", true);
  if (legs.length > 1) {
    addStop(legs[1].points[0], "P", "Pickup at " + places[trip().pickup], false);
    addStop(legs[1].points.at(-1), "R", "Return at " + places[trip().dropoff], false);
  }
  if (view !== "play" || stage === legs.length - 1 || complete) addStop(legs.at(-1).points.at(-1), "B", places[destination], true);
  byId("map-title").textContent = trip().label + " from Canada Place to " + places[destination];
  byId("map-description").textContent = trip().pickup
    ? `A marks Canada Place. P marks pickup at ${places[trip().pickup]}. The ride follows ${legs[1].via}. R marks return at ${places[trip().dropoff]}. B marks ${places[destination]}.`
    : "The dotted line follows pedestrian paths from Canada Place to " + places[destination] + ".";
  byId("map-caption").textContent = view === "play" && !complete ? stageCopy()[stage].map
    : trip().pickup ? `Pickup at ${places[trip().pickup]}. Return at ${places[trip().dropoff]}.`
      : `Walking route from Canada Place to ${places[destination]}.`;
  byId("traveller").setAttribute("visibility", view === "play" ? "visible" : "hidden");
  if (view === "play") updateMarker();
}

function stageCopy() {
  const item = trip();
  if (!item.pickup) return [{ name: "Walk to " + places[destination], text: "From Canada Place along the pedestrian network.", map: "Walking to " + places[destination] + "." }];
  return [
    { name: "Walk to pickup", text: places[item.pickup] + " · Sample pickup location", map: "Walk from Canada Place to " + places[item.pickup] + "." },
    { name: "Ride to the return point", text: places[item.dropoff] + " · Via " + item.legs[1].via, map: "Ride via " + item.legs[1].via + "." },
    { name: "Walk to " + places[destination], text: "From " + places[item.dropoff] + " to your destination.", map: "Final walk from " + places[item.dropoff] + " to " + places[destination] + "." },
  ];
}

function showChoices() {
  stop();
  view = "compare"; complete = false;
  byId("choices").hidden = false; byId("details").hidden = true;
  byId("panel-title").textContent = "Compare sample trips";
  byId("panel-intro").textContent = "See how the planner handles pickup, return and the final walk. Vehicles, parking and your movement are simulated.";
  setOptions();drawMap();
}

function renderStages() {
  const list = byId("stages");list.replaceChildren();
  stageCopy().forEach((step, i) => {
    const li = document.createElement("li"), dot = document.createElement("span"), body = document.createElement("div");
    const name = document.createElement("strong"), desc = document.createElement("small"), time = document.createElement("span");
    li.className = "stage" + (view === "play" && i === stage ? " active" : "");
    if (view === "play" && i === stage) li.setAttribute("aria-current", "step");
    dot.className = "stage-dot";dot.textContent = String(i + 1);
    name.textContent = step.name;
    desc.textContent = step.text + " · " + formatDistance(trip().legs[i].metres);
    time.className = "stage-time";time.textContent = minutes(trip().times[i]) + " min";
    body.append(name, desc);li.append(dot, body, time);list.append(li);
  });
}

function showDetail() {
  stop();
  view = "detail"; stage = 0; fraction = 0; complete = false;
  byId("choices").hidden = true;byId("details").hidden = false;
  byId("panel-title").textContent = places[destination];
  byId("panel-intro").textContent = "Sample journey from Canada Place. Playback uses a simulated location.";
  const summary = byId("trip-summary"), label = document.createElement("h2"), time = document.createElement("span");
  summary.className = "trip-summary";label.textContent = trip().label;time.textContent = minutes(trip().total) + " min estimated";
  summary.replaceChildren(label, time);
  byId("launch").hidden = false;byId("playback").hidden = true;
  renderStages();drawMap();
  byId("panel-title").focus({preventScroll:true});
}

function updateMarker() {
  const leg = trip().legs[stage], distances = leg.distances, target = fraction * distances.at(-1);
  let i = distances.findIndex((d) => d >= target);
  if (i <= 0) i = target <= 0 ? 1 : distances.length - 1;
  const before = leg.points[i - 1], after = leg.points[i];
  const t = (target - distances[i - 1]) / (distances[i] - distances[i - 1] || 1);
  const x = before[0] + (after[0] - before[0]) * t, y = before[1] + (after[1] - before[1]) * t;
  byId("traveller").setAttribute("transform", `translate(${x} ${y}) scale(${markerScale * .43})`);
  byId("progress-track").firstElementChild.style.transform = `scaleX(${fraction})`;
}

function stop() {
  cancelAnimationFrame(animation); playing = false; previousTime = null;
}
function showControls() {
  const last = stage === trip().legs.length - 1;
  const ended = fraction >= 1;
  byId("play").hidden = ended;
  byId("play").textContent = playing ? "Pause" : fraction ? "Resume" : "Play stage";
  byId("next").textContent = complete ? "Compare trips" : !ended ? "Skip to stop" : stage === 0 ? "Simulate pickup" : "Confirm sample return";
  byId("stage-message").textContent = complete ? "You’ve arrived at " + places[destination] + "."
    : ended && !last ? stage === 0 ? "At the pickup point. Simulate unlocking to start the ride."
      : "At the return point. Confirm the sample return to begin the final walk."
    : `Stage ${stage + 1} of ${trip().legs.length}. ${stageCopy()[stage].map}`;
}
function atStop() {
  stop(); fraction = 1; complete = stage === trip().legs.length - 1;
  updateMarker();
  if (complete) drawMap();
  showControls();
}
function tick(now) {
  if (!playing) return;
  const elapsed = previousTime === null ? 0 : now - previousTime;
  previousTime = now;
  const duration = Math.max(4200, Math.min(15000, trip().legs[stage].metres * 8));
  fraction = Math.min(1, fraction + elapsed / duration);
  if (fraction >= 1) { atStop(); return; }
  updateMarker();
  animation = requestAnimationFrame(tick);
}
function play() { stop();playing = true;showControls();animation = requestAnimationFrame(tick); }
function startStage() {
  stop();view = "play";fraction = 0;complete = false;
  byId("launch").hidden = true;byId("playback").hidden = false;
  renderStages();drawMap();showControls();
  if (!reduced.matches) play();
}
byId("destination").addEventListener("change", (event) => {
  destination = event.target.value;
  selected = 0;journeys = buildJourneys(destination);showChoices();
});
byId("review").addEventListener("click", showDetail);
byId("back").addEventListener("click", () => {showChoices();byId("review").focus({preventScroll:true});});
byId("launch").addEventListener("click", () => {stage = 0;startStage();byId("play").focus({preventScroll:true});});
byId("play").addEventListener("click", () => { if (playing) {stop();showControls();} else play(); });
byId("next").addEventListener("click", () => {
  if (complete) {showChoices();byId("review").focus({preventScroll:true});}
  else if (fraction < 1) atStop();
  else {stage++;startStage();}
});
const pausePlayback = () => { if (playing) {stop();showControls();} };
document.addEventListener("visibilitychange", () => {if (document.hidden) pausePlayback();});
reduced.addEventListener("change", () => {if(reduced.matches) pausePlayback();});
window.addEventListener("resize", drawMap);
async function init() {
  try {
    const response = await fetch("./routes.json");
    if (!response.ok) throw new Error("Routes unavailable");
    const { legs } = await response.json();
    legs.forEach((entry) => legIndex.set([entry.from, entry.to, entry.profile].join("/"), prepareLeg(entry)));
    // Validate every available selection before revealing the controls.
    for (const id of Object.keys(destinations)) buildJourneys(id);
    journeys = buildJourneys(destination);
    byId("destination").disabled = false;byId("review").hidden = false;byId("timing").hidden = false;
    showChoices();
  } catch {
    byId("loading").textContent = "The saved routes couldn’t load. Refresh the page to try again, or return to the case study.";
  }
}
init();
