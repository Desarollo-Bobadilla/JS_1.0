const url = "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

let data = [];

function get_Data(callback) {
  fetch(url).then(res => res.json()).then(res => {
    callback(res);
  });
}

get_Data( (value) => {
  data = value;

  // CREATE TABLE

  let table = document.createElement("table");
  table.className = "table table-striped table-hover";
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");

  table.appendChild(thead);
  table.appendChild(tbody);

  document.getElementById("body").appendChild(table);

  // HEADERS

  let row_1 = document.createElement("tr");
  row_1.className = "table-dark";
  let heading_1 = document.createElement("th");
  let heading_2 = document.createElement("th");
  let heading_3 = document.createElement("th");

  heading_1.innerHTML = "#";
  heading_2.innerHTML = "Event";
  heading_3.innerHTML = "🐿️";

  row_1.appendChild(heading_1);
  row_1.appendChild(heading_2);
  row_1.appendChild(heading_3);
  thead.appendChild(row_1);

  // INFORMATION

  let activities = {};
  let register = 0;
  let counter = 0;

  for(let i = 0; i < data.length; i++) {

    // Each row
    let events = data[i].events;
    let pass = data[i].squirrel;
    register++;

    // Register on table
    let row = document.createElement("tr");
    let number = document.createElement("th");
    let event = document.createElement("th");
    let occurs = document.createElement("th");

    number.innerHTML = register;
    event.innerHTML = events;
    occurs.innerHTML = pass;

    if (pass == true) {
      row.style.backgroundColor = "lightblue";
    }
  
    row.appendChild(number);
    row.appendChild(event);
    row.appendChild(occurs);
    thead.appendChild(row);

    // Created dictionary with activities
    
    for (let j = 0; j < events.length; j++) {
      let activity = activities[events[j]];

      if (typeof activity == "undefined") {
        activities[events[j]] = [0, 0, 0, 0];
      }
    }
  }

  // CALCULATE THE MCC
  const act = Object.keys(activities);

  for (let i = 0; i < act.length; i++) {
    let actual = act[i];
    
    for (let j = 0; j < data.length; j++) {

      let events = data[j].events;
      let pass = data[j].squirrel;
      
      if (events.includes(actual)) {
        if(pass == true) {
          activities[actual][3] += 1;
        }
        else{
          activities[actual][2] += 1;
        }
      }
      else {
        if(pass == true) {
          activities[actual][1] += 1;
        }
        else{
          activities[actual][0] += 1;
        }
      }

    }
  }

  // Print the MACC

  // HEADERS

  row_1 = document.createElement("tr");
  row_1.className = "table-dark";
  heading_1 = document.createElement("th");
  heading_2 = document.createElement("th");
  heading_3 = document.createElement("th");

  heading_1.innerHTML = "#";
  heading_2.innerHTML = "Event";
  heading_3.innerHTML = "Correlation";

  row_1.appendChild(heading_1);
  row_1.appendChild(heading_2);
  row_1.appendChild(heading_3);
  thead.appendChild(row_1);

  let MACC = {};

  for (let i = 0; i < act.length; i++) {

    let actual = act[i];
    MACC[actual] = ((activities[actual][3]*activities[actual][0]) - (activities[actual][2]*activities[actual][1]))/Math.sqrt((activities[actual][2]+activities[actual][3])*(activities[actual][1]+activities[actual][3])*(activities[actual][0]+activities[actual][2])*(activities[actual][0]+activities[actual][1]));
  }

  let items = Object.keys(MACC).map( (key) => {return [key, MACC[key]];});
  items.sort((first, second) => {return second[1]-first[1];});
  let keys = items.map( (e) => {return e;});

  for (let i = 0; i < keys.length; i++) {
    let actual = keys[i];
    counter += 1;

    // Register on table
    let row = document.createElement("tr");
    let number = document.createElement("th");
    let event = document.createElement("th");
    let occurs = document.createElement("th");
  
    number.innerHTML = counter;
    event.innerHTML = actual[0];
    occurs.innerHTML = actual[1];
    
    row.appendChild(number);
    row.appendChild(event);
    row.appendChild(occurs);
    thead.appendChild(row);
  }


});