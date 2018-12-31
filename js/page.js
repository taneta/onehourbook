let a;

/*
  based on https://github.com/LouisT/SeededShuffle/
*/

function randomSeed() {
  return Math.random().toString(36).substring(7);
}

class Shuffle {
  shuffle(arr, seed, copy) {
    seed = seed || randomSeed();
    if (this.getType(arr) !== "Array" || !this.setSeed(seed)) {
      return null;
    }
    let shuff = (copy?arr.slice(0):arr),
      size = shuff.length,
      map = this.genMap(size);
    for (var i = size - 1; i > 0; i--) {
      shuff[i] = shuff.splice(map[size-1-i],1,shuff[i])[0];
    }
    return shuff;
  }

  unshuffle(arr, seed, copy) {
    if (this.getType(arr) !== "Array" || !this.setSeed(seed)) {
      return null;
    }
    var shuff = (copy?arr.slice(0):arr),
      size = shuff.length,
      map = this.genMap(size);
    for (var i = 1; i < size; i++) {
      shuff[i] = shuff.splice(map[size-1-i],1,shuff[i])[0];
    }
    return shuff;
  }

  genMap(size) {
    var map = new Array(size);
    for (var x = 0; x < size; x++) {
      //Don't change these numbers.
      map[x] = ((this.__seed = (this.__seed*9301+49297)%233280)/233280.0)*size|0;
    }
    return map;
  }

  setSeed(seed) {
    if (!/(number|string)/i.test(this.getType(seed))) {
      return false;
    }
    if (isNaN(seed)) {
      seed = String(seed).split('').map(function(x){return x.charCodeAt(0)}).join('');
    }
    return this.__seed = Number(seed);
  }

  getType(obj) {
    return Object.prototype.toString.call(obj).match(/^\[object (.*)\]$/)[1];
  }
}

// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray(strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");
  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );
  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];
  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;
  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec(strData)) {
    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];
    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
      strMatchedDelimiter.length &&
      (strMatchedDelimiter != strDelimiter)
    ) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);
    }
    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      var strMatchedValue = arrMatches[2].replace(
        new RegExp("\"\"", "g"),
        "\""
      );
    } else {
      // We found a non-quoted value.
      var strMatchedValue = arrMatches[3];
    }
    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }
  // Return the parsed data.
  return (arrData);
}


function loadChapters() {
  fetch('data.csv').catch(console.error).then((r) => {
    r.text().then((t) => {
      new Shuffle().shuffle(CSVToArray(t)).forEach(appendChapter);
    });
  });
}

function formatHeader(place, time, date) {
  if (!place && !time && !date) return '-';
  if (date) {
    date = `${Number(date.split('-')[2])} Дек`;
  }
  return [place, date, time].filter(x => !!x).join(', ');
}


function formatText(text) {
  const ps = text.split('\n\n').filter(x => !!x).map(s => s.replace('\n', '<br>'));
  return `<p>${ps.join('</p><p>')}</p>`;
}

function appendChapter(arr) {
  if (!arr[7] || arr[7] === 'Edit') return;
  const container = document.getElementById('contentbwrap');
  container.innerHTML +=
    `<article class="hentry page post">
       <header class="entry-header">
          <div>
            <span class="entry-datebwrap published chapter-title">${arr[8] || '***'}</span>
          </div>
       </header>
       <div class="post-body entry-content clearfixpbt post_text">
         ${formatText(arr[7])}  
       </div>
       <div class="entry-metabwrap entry-header">
          <span class="posted-onbwrap">
            <span class="entry-datebwrap published">${formatHeader(arr[5], arr[3], arr[6])}</span>
          </span>
        </div>
    </article>`;
}

window.onload = loadChapters;
