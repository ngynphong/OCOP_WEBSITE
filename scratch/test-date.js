const dateStr = "2026-04-22T09:53:56.082583";
const d = new Date(dateStr);
console.log("Date:", d);
console.log("Time:", d.getTime());
console.log("Is NaN:", isNaN(d.getTime()));
