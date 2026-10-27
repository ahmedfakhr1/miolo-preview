(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Lisbon time */
  function lisbon(){
    var p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Lisbon',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var h=0,m=0;p.forEach(function(x){if(x.type==='hour')h=+x.value%24;if(x.type==='minute')m=+x.value});
    return h*60+m;
  }
  var status=document.getElementById('status');
  if(status){
    var t=lisbon(),open=9*60,close=16*60+30;
    status.textContent=t>=open&&t<close?'Open now, until 16h30':(t<open?'Opens today at 9h':'Closed for today, open again at 9h');
  }
  var greet=document.getElementById('greet');
  if(greet){
    var g=lisbon()/60;
    greet.textContent=g<12?'Good morning':(g<18?'Good afternoon':'Good evening');
  }

  /* reveal on enter */
  var rv=[].slice.call(document.querySelectorAll('.rv'));
  if('IntersectionObserver' in window&&!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
    rv.forEach(function(el){io.observe(el)});
  }else rv.forEach(function(el){el.classList.add('in')});

  /* fixed bar takes the ink of the chapter under it */
  var bar=document.getElementById('bar');
  if(bar&&'IntersectionObserver' in window){
    var chapters=[].slice.call(document.querySelectorAll('[data-ink]'));
    var probe=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting)return;
        var light=e.target.getAttribute('data-ink')==='light';
        bar.classList.toggle('is-light',light);
        var onHero=e.target.id==='top';
        bar.classList.toggle('on-hero',onHero);
        if(e.target.getAttribute('data-bg'))bar.style.backgroundColor=e.target.getAttribute('data-bg');
      });
    },{rootMargin:'-40px 0px -92% 0px'});
    chapters.forEach(function(c){probe.observe(c)});
  }

  /* favorites: active row swaps the photograph */
  var rows=[].slice.call(document.querySelectorAll('.favs__row'));
  var pics=[].slice.call(document.querySelectorAll('.favs__photo img'));
  function activate(row){
    rows.forEach(function(r){r.setAttribute('aria-expanded',r===row?'true':'false')});
    var k=row.getAttribute('data-img');
    pics.forEach(function(p){p.classList.toggle('on',p.getAttribute('data-k')===k)});
  }
  rows.forEach(function(r){
    r.addEventListener('click',function(){activate(r)});
    r.addEventListener('focus',function(){activate(r)});
    r.addEventListener('mouseenter',function(){if(window.matchMedia('(hover:hover)').matches)activate(r)});
  });
  if(rows.length&&'IntersectionObserver' in window){
    var seen=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)activate(e.target)})},{rootMargin:'-46% 0px -46% 0px'});
    rows.forEach(function(r){seen.observe(r)});
  }

  /* menu: diet filter */
  var chips=[].slice.call(document.querySelectorAll('[data-f]'));
  if(chips.length){
    var items=[].slice.call(document.querySelectorAll('.item'));
    var secs=[].slice.call(document.querySelectorAll('.m-sec'));
    var empty=document.getElementById('empty');
    var apply=function(){
      var on=chips.filter(function(c){return c.getAttribute('aria-pressed')==='true'}).map(function(c){return c.getAttribute('data-f')});
      var shown=0;
      items.forEach(function(it){
        var d=(it.getAttribute('data-diet')||'').split(' ');
        var ok=on.every(function(f){return d.indexOf(f)>-1});
        it.hidden=!ok;if(ok)shown++;
      });
      secs.forEach(function(s){s.hidden=!s.querySelector('.item:not([hidden])')});
      empty.classList.toggle('show',shown===0);
    };
    chips.forEach(function(c){c.addEventListener('click',function(){c.setAttribute('aria-pressed',c.getAttribute('aria-pressed')==='true'?'false':'true');apply()})});

    /* section chips follow the scroll */
    var links=[].slice.call(document.querySelectorAll('.m-chips a'));
    if('IntersectionObserver' in window){
      var so=new IntersectionObserver(function(es){es.forEach(function(e){
        if(e.isIntersecting){links.forEach(function(l){var on=l.getAttribute('href')==='#'+e.target.id;l.classList.toggle('on',on);if(on){var bar=l.parentNode;bar.scrollTo({left:l.offsetLeft-32,behavior:reduce?'auto':'smooth'})}})}
      })},{rootMargin:'-30% 0px -65% 0px'});
      secs.forEach(function(s){so.observe(s)});
    }
  }
})();
