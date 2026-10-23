/* Masked-data hero background: builds a grid of realistic records, then
   flips it row by row, each row turning edge-on and coming back as a
   fresh record (raw <-> masked). Runs on any page with a .hero-bg grid.
   Reduced-motion and no-WAAPI browsers get the static grid. */
(function(){
  var host=document.querySelector(".hero-bg .rows"); if(!host) return;
  var NAMES=["James Carter","Maria Lopez","Wei Chen","Aisha Khan","Liam O'Brien","Nadia Petrov","Omar Haddad","Grace Kim","Tom Reyes","Sara Blum","Yuki Tanaka","Diego Marquez","Hannah Weiss","Ravi Patel","Noa Adler","Sofia Rossi"];
  function ri(n){return Math.random()*n|0;}
  function dg(n){var o="";for(var i=0;i<n;i++)o+=ri(10);return o;}
  function pad(v){v=""+v;return v.length<2?"0"+v:v;}
  function dots(n){var o="";for(var i=0;i<n;i++)o+="•";return o;}
  // Each cell renders a realistic value and the masked form of the same field.
  function gen(type){
    if(type==="name"){var n=NAMES[ri(NAMES.length)];return {raw:n, masked:n.charAt(0)+dots(Math.max(4,n.length-1))};}
    if(type==="ssn"){var t=dg(4);return {raw:"0"+dg(2)+"-"+dg(2)+"-"+t, masked:dots(3)+"-"+dots(2)+"-"+t};}
    if(type==="email"){var u="user"+dg(4);return {raw:u+"@example.com", masked:u.charAt(0)+dots(6)+"@"+dots(4)+".com"};}
    if(type==="dob"){var y=1960+ri(45),mo=pad(1+ri(12)),d=pad(1+ri(27));return {raw:y+"-"+mo+"-"+d, masked:(""+y).slice(0,2)+dots(2)+"-"+dots(2)+"-"+dots(2)};}
    if(type==="card"){var l=dg(4);return {raw:dg(4)+" "+dg(4)+" "+dg(4)+" "+l, masked:dots(4)+" "+dots(4)+" "+dots(4)+" "+l};}
    var m=dg(2);return {raw:"MRN"+dg(4)+m, masked:"MRN"+dots(4)+m};
  }
  function paint(sp){ var masked=sp._state==="masked"; sp.textContent=masked?sp._v.masked:sp._v.raw; sp.classList.toggle("masking",masked); }

  var PAT=["name","ssn","email","dob","card","mrn","name","email","card","ssn"], ROWS=16;
  // Enough columns to overflow the screen edges (sized to the monitor, not the window).
  var COLS=Math.max(12, Math.min(32, Math.ceil(Math.max(window.innerWidth, (window.screen&&screen.width)||0)/120)+3));
  var rows=[], frag=document.createDocumentFragment();
  for(var r=0;r<ROWS;r++){
    var row=document.createElement("div"); row.className="row";
    for(var c=0;c<COLS;c++){
      var sp=document.createElement("span"); sp.className="cell";
      sp._type=PAT[(c+r)%PAT.length]; sp._v=gen(sp._type); sp._state="raw"; paint(sp);
      row.appendChild(sp);
    }
    frag.appendChild(row); rows.push(row);
  }
  host.appendChild(frag);

  if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if(typeof Element.prototype.animate !== "function") return;

  // Flip one row edge-on, swap its values, flip it back. masked->raw draws a fresh record.
  function flipRow(row){
    var down=row.animate([{transform:"rotateX(0deg)"},{transform:"rotateX(90deg)"}],{duration:220,easing:"cubic-bezier(.4,0,1,.5)",fill:"forwards"});
    down.onfinish=function(){
      for(var i=0;i<row.children.length;i++){
        var sp=row.children[i];
        if(sp._state==="raw"){ sp._state="masked"; }
        else { sp._v=gen(sp._type); sp._state="raw"; }
        paint(sp);
      }
      row.animate([{transform:"rotateX(-90deg)"},{transform:"rotateX(0deg)"}],{duration:240,easing:"cubic-bezier(0,.5,.3,1)"});
      down.cancel();
    };
  }

  var STEP=110;
  function wave(){
    for(var i=0;i<rows.length;i++){ (function(row,d){ setTimeout(function(){ flipRow(row); }, d); })(rows[i], i*STEP); }
    setTimeout(wave, rows.length*STEP + 1600);
  }
  setTimeout(wave, 1100);
})();
