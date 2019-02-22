var styles = new Array();
var currstyles = [];
function TextStyle(tag, classes, year, index) {
  this.tag = tag;
  this.classes = classes;
  this.index = index;
  this.getClass = function() {
	if(this.classes !== undefined && this.classes !== null && this.classes !== ''){
		return 'vte-element ' + this.classes;
	}
	return 'vte-element';
  }
}
var tot = 0;
document.addEventListener('DOMContentLoaded', function() {
	var dtags = document.getElementsByClassName('vdtag');
	while(dtags.length > 0){
		var editor = document.createElement('DIV');
		var id = 'vte-body-'+tot.toString();
		var idCurr = 'vte-body-curr-'+tot.toString();
		var headerEl = loadHeader(id,tot);
		var bodyEl = loadBody(id);
		editor.appendChild(headerEl);
		editor.appendChild(bodyEl);
		document.body.replaceChild(editor, dtags[0]);
		
		var setters = document.getElementsByClassName('vte-setting-btn');
		for (var i = 0; i < setters.length; i++) {
			setters[i].addEventListener('click', function(){
				this.classList.toggle('vte-setting-active');
				applyEffect(headerEl,bodyEl,idCurr);
			});
		}
		currstyles.push([]);
		applyEffect(headerEl,bodyEl,idCurr);
		tot++;
	}
	
});
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
}
function loadHeader(id,tot){
	var header = document.createElement('DIV');
	header.className += 'vte-part vte-header';
	header.appendChild(charactersSetting(id,tot));

	return header;
}
function loadBody(id) {
	var body = document.createElement('DIV');
	body.className += 'vte-part vte-body';
	body.id =  id;
	return body;
}
function changeFocus(id, el2, docheck) {
	var el1 = document.getElementById(id);
	if(el1 !== null && el1 !== undefined) {
		el1.removeAttribute('ID');
		el1.removeAttribute('contenteditable');
		el1.addEventListener('click', function(){ changeFocus(id,el1); switchActiveStyle(el1);});
		//el1.onmouseup = el1.onkeyup = el1.onselectionchange =  function(){ getSelectionText();};
		if(docheck === true) {
			var lbr = el1.querySelector('br:last-child');
			if(lbr !== null){
				lbr.parentNode.removeChild(lbr);
			}
		}
	}
	if(el2 !== null && el2 !== undefined) {
		el2.id = id;
		el2.setAttributeNode(document.createAttribute('contenteditable'));
		el2.focus();
	}
	
	
}
function switchActiveStyle(el){
	var appliedStyles = [];
	var check = el.getAttribute('data-idstyle');
	if(check !== null) {
		var appliedStyles = check.split(';');
	}
	if(appliedStyles.length > 1) {
		var index = styles[appliedStyles[0].index];
		var curr = currstyles[index];
		for(var i = 0; i <  curr.length; i++) {
			curr[i].classList.remove('vte-setting-active');
		}
		currstyles[index] = [];
		for(var i = 0; i <  appliedStyles.length; i++) {
			if(appliedStyles[i] !==''){
			var el = document.querySelector('.v-setting[data-idstyle='+appliedStyles[i]+']');
			if(el !== null) {
				if(el.classList.contains('vte-setting-active') === false) {
					el.classList.add('vte-setting-active');
				}
			}
			currstyles[index].push(el);
			}
		}
	}
}
function applyEffect(header, body, idCurr) {
	var actives = header.querySelectorAll('.vte-setting-active.v-setting-el');
	var appliedStyles = '';
	if(actives.length > 0) {
		var newEl = buildEls(actives);
		if(newEl[0] != null){
			body.appendChild(newEl[0]);
		}else {
			body.appendChild(newEl[1]);
		}
		appliedStyles = newEl[2];
		changeFocus(idCurr, newEl[1], true);
	}
	actives = header.querySelectorAll('.vte-setting-active.v-setting-class');
	classes = ['',''];
	if(actives.length > 0) {
		classes = buildClasses(actives);
	}
	appendStyle(idCurr, classes[0], classes[1]+';'+appliedStyles);
}
function createElement(t) {
	var el = document.createElement(t.tag);
	el.className+=t.getClass();
	return el;
}
function buildEls(l) {
	var appliedStyles = l[0].getAttribute('data-idstyle');
	var last = createElement(styles[appliedStyles]);
	currstyles[styles[appliedStyles].index] = [];
	currstyles[styles[appliedStyles].index].push(l[0]);
	var first = null;
	if(l.length > 1){
		first = last;
		for(var i = 1; i < l.length; i++) {
			var st = l[i].getAttribute('data-idstyle');
			appliedStyles+=';'+ st;
			var temp = createElement(styles[st]);
			last.appendChild(temp);
			last = temp;
			currstyles[styles[st].index].push(l[i]);
		}
	}
	return [first, last, appliedStyles];
}
function buildClasses(l) {
	var appliedStyles = l[0].getAttribute('data-idstyle');
	var classes = styles[appliedStyles].getClass();
	currstyles[styles[appliedStyles].index].push(l[0]);
	for(var i = 1; i < l.length; i++) {
		var st = l[i].getAttribute('data-idstyle');
		appliedStyles+=';'+ st;
		classes += ' ' + styles[st].getClass();
		currstyles[styles[st].index].push(l[i]);
	}
	return [classes, appliedStyles];
}
function appendStyle(idEL, classes, appliedStyles) {
	var el = document.getElementById(idEL);
	if(classes !== undefined && classes !== null && classes !== ''){
			el.className+=(' '+classes);
	}
	var att = document.createAttribute('data-idstyle');       
	att.value = appliedStyles;          
	el.setAttributeNode(att);
}

//---------------HEADER SETTINGS--------------------

function charactersSetting() {
	var setting = document.createElement('DIV');
	
	var alwayson = document.createElement('SPAN');
	alwayson.className += 'vte-setting-active v-setting v-setting-el';
	var idStyle = 'alwaysOn-'+tot.toString();
	var att = document.createAttribute('data-idstyle');       
	att.value = idStyle;          
	alwayson.setAttributeNode(att);
	styles[idStyle]=new TextStyle('span','',tot);
	setting.appendChild(alwayson);
	
	var bold = document.createElement('BUTTON');
	bold.appendChild(document.createTextNode('B'));
	bold.className += 'vte-setting-btn v-setting v-setting-el';
	var att = document.createAttribute("title");       
	att.value = 'Bold';          
	bold.setAttributeNode(att);
	idStyle = 'v-bold-'+tot.toString();
	att = document.createAttribute('data-idstyle');       
	att.value = idStyle;          
	bold.setAttributeNode(att);
	styles[idStyle] = new TextStyle('STRONG','v-bold',tot);
	setting.appendChild(bold);
	
	var italic = document.createElement('BUTTON');
	italic.appendChild(document.createTextNode('I'));
	italic.className += 'vte-setting-btn v-setting v-setting-el';
	att = document.createAttribute("title");       
	att.value = 'Italic';                           
	italic.setAttributeNode(att);
	idStyle = 'v-italic-'+tot.toString();
	att = document.createAttribute('data-idstyle');       
	att.value = idStyle;          
	italic.setAttributeNode(att);
	styles[idStyle] = new TextStyle('EM','v-italic',tot);
	setting.appendChild(italic);
	
	var underline = document.createElement('BUTTON');
	underline.appendChild(document.createTextNode('U'));
	underline.className += 'vte-setting-btn v-setting v-setting-class';
	att = document.createAttribute("title");       
	att.value = 'Underline';                           
	underline.setAttributeNode(att);
	idStyle = 'v-underline-'+tot.toString();
	att = document.createAttribute('data-idstyle');       
	att.value = idStyle;          
	underline.setAttributeNode(att);
	styles[idStyle] = new TextStyle('span','v-underline',tot);
	setting.appendChild(underline);
	
	
	var linethrough = document.createElement('BUTTON');
	linethrough.appendChild(document.createTextNode('T'));
	linethrough.className += 'v-linethrough vte-setting-btn v-setting v-setting-class';
	att = document.createAttribute("title");       
	att.value = 'Line through';                           
	linethrough.setAttributeNode(att);
	idStyle = 'v-linethrough-'+tot.toString();
	att = document.createAttribute('data-idstyle');       
	att.value = idStyle;          
	linethrough.setAttributeNode(att);
	styles[idStyle] = new TextStyle('span','v-linethrough',tot);
	setting.appendChild(linethrough);

	var overline = document.createElement('BUTTON');
	overline.appendChild(document.createTextNode('O'));
	overline.className += 'v-overline vte-setting-btn v-setting v-setting-class';
	att = document.createAttribute("title");       
	att.value = 'Overline';                           
	overline.setAttributeNode(att);
	idStyle = 'v-overline-'+tot.toString();
	att = document.createAttribute('data-idstyle');       
	att.value = idStyle;          
	overline.setAttributeNode(att);
	styles[idStyle] = new TextStyle('span','v-overline',tot);
	setting.appendChild(overline);

	return setting;
}