var tab = {
    init: function(){
	var i;
	var tabs = this.setup.tabs;
	var pages = this.setup.pages;

	for(i=0; i<pages.length; i++) {
	    if(i !== 0) pages[i].style.display = 'none';
	    tabs[i].onclick = function(){ tab.showpage(this); return false; };
	}
    },

    showpage: function(obj){
	var tabs = this.setup.tabs;
	var pages = this.setup.pages;
	var num;

	for(num=0; num<tabs.length; num++) {
	    if(tabs[num] === obj) break;
	}

	for(var i=0; i<pages.length; i++) {
	    if(i == num) {
		pages[num].style.display = 'block';
		tabs[num].className = 'present';
	    }
	    else{
		pages[i].style.display = 'none';
		tabs[i].className = null;
	    }
	}
    }
};

tab.setup = {
    tabs: document.getElementById('tab').getElementsByTagName('li'),
    pages: [
	document.getElementById('page1'),
	document.getElementById('page2'),
	document.getElementById('page3'),
	//document.getElementById('page4')
    ]
};

tab.init();

var tab2 = {
    init: function(){
	var i;
	var tab2s = this.setup.tab2s;
	var page2s = this.setup.page2s;

	for(i=0; i<page2s.length; i++) {
	    if(i !== 0) page2s[i].style.display = 'none';
	    tab2s[i].onclick = function(){ tab2.showpage(this); return false; };
	}
    },

    showpage: function(obj){
	var tab2s = this.setup.tab2s;
	var page2s = this.setup.page2s;
	var num;

	for(num=0; num<tab2s.length; num++) {
	    if(tab2s[num] === obj) break;
	}

	for(var i=0; i<page2s.length; i++) {
	    if(i == num) {
		page2s[num].style.display = 'block';
		tab2s[num].className = 'present';
	    }
	    else{
		page2s[i].style.display = 'none';
		tab2s[i].className = null;
	    }
	}
    }
};

tab2.setup = {
    tab2s: document.getElementById('tab2').getElementsByTagName('li'),
    page2s: [
	document.getElementById('page11'),
	document.getElementById('page12'),
	document.getElementById('page13'),
	document.getElementById('page14')
    ]
};

tab2.init();
