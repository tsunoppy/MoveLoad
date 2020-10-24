//--------------------------------------------------
var nw = require('nw.gui');
//
var fs = require('fs');
//var iconv = require('iconv-lite');
//--------------------------------------------------
/*
var win = nw.Window.get();
win.showDevTools('', true);
win.on("devtools-opened", function(url) {
    console.log("devtools-opened: " + url);
    document.getElementById('devtools').src = url;
});
*/

//nw.Window.get().showDevTools();

//--------------------------------------------------

var menubar = new nw.Menu({
  type: 'menubar'
});

var fileMenu = new nw.Menu();

fileMenu.append(new nw.MenuItem({
  label: 'New File      Ctrl+N',
    click: function() {
	window.location.reload();
  }
}));

/*
fileMenu.append(new nw.MenuItem({
  label: 'New File As New Window',
    click: function() {
	var gui = require('nw.gui');
	var link = window.location.href;
	var win = gui.Window.open (link, {
	    position: 'mouse',
	    width: 720,
	    height: 500
	});
  }
}));
*/

fileMenu.append(new nw.MenuItem({
  label: 'Open',
    click: function() {
	//window.location.reload();
	OpenFile();
  }
}));
//////////////////////////////////////////////////////////////////////

/*
var openRecentMenu = new nw.Menu();

openRecentMenu.append(new nw.MenuItem({
  label: 'Recente File X',
  click: function() {
    alert('Clicked to open a recent file');
  }
}));

*/

//menubar.append(new nw.MenuItem({ label: 'File', submenu: fileMenu}));
/*
fileMenu.append(new nw.MenuItem({ label: 'Open Recent File', submenu: openRecentMenu}));
*/


fileMenu.append(new nw.MenuItem({
    label: 'Save',
    click: function() {
	downloadAsFile( document.title + '.txt', '');
    }
}));

/*
fileMenu.append(new nw.MenuItem({
    label: 'Export MN data',
    click: function() {
	ExportAsFile( document.title + '_MN.txt', '');
    }
}));
*/

fileMenu.append(new nw.MenuItem({
  label: 'Print',
  click: function() {
      window.print();
  }
}));


fileMenu.append(new nw.MenuItem({
    label: 'Close',
    click: function() {
        win.close();
    }
}));

fileMenu.append(new nw.MenuItem({
    label: 'Exit',
    click: function() {
        nw.App.quit();
    }
}));

/*
fileMenu.append(new nw.MenuItem({
    label: 'Dev',
    click: function() {
	nw.Window.get().showDevTools();
    }
}));
*/

menubar.append(new nw.MenuItem({ label: 'File', submenu: fileMenu}));
////////////////////////////////////////////////////////////////////////

var fileMenu2 = new nw.Menu();


fileMenu2.append(new nw.MenuItem({
    label: "Cut",
    click: function() {
	document.execCommand("cut");
    }
}));

fileMenu2.append(new nw.MenuItem({
    label: "Copy",
    click: function() {
	document.execCommand("copy");
    }
}));

fileMenu2.append(new nw.MenuItem({
    label: "Paste",
    click: function() {
	document.execCommand("paste");
    }
}));

/*
fileMenu2.append(new nw.MenuItem({
    label: 'Insert Memo',
    click: function() {
	var ins = "";

	ins += "<p>";
	ins += "Comment,";
	ins += "</p>";
	ins += "<p>";
	ins += '<textarea name="example" cols="70" rows="8"></textarea>';
	ins += "</p>";
	document.getElementById('Insert').innerHTML = ins;
    }
}));
*/


menubar.append(new nw.MenuItem({ label: 'Edit', submenu: fileMenu2}));

////////////////////////////////////////////////////////////////////////


var fileMenu3 = new nw.Menu();

fileMenu3.append(new nw.MenuItem({
  label: 'Maximimu',
    click: function() {
	win.maximize();
    }
}));


fileMenu3.append(new nw.MenuItem({
    label: 'Unmaximize',
    click: function() {
	win.unmaximize();
    }
}));

fileMenu3.append(new nw.MenuItem({
    label: 'Zoom 150%',
    click: function() {
	var zoomPercent = 150;
	win.zoomLevel = Math.log(zoomPercent/100) / Math.log(1.2);
    }
}));

fileMenu3.append(new nw.MenuItem({
    label: 'Zoom 125%',
    click: function() {
	var zoomPercent = 125;
	win.zoomLevel = Math.log(zoomPercent/100) / Math.log(1.2);
    }
}));

fileMenu3.append(new nw.MenuItem({
    label: 'Zoom 100%',
    click: function() {
	win.zoomLevel = 0;
    }
}));


menubar.append(new nw.MenuItem({ label: 'View', submenu: fileMenu3}));


////////////////////////////////////////////////////////////////////////

/*

var fileMenu4 = new nw.Menu();


fileMenu4.append(new nw.MenuItem({
  label: 'Setting',
    click: function() {
	var link = "views/setting.html";
	var win = nw.Window.open (link, {
	    position: 'center',
	    width: 300,
	    height: 300
	});
  }
}));

fileMenu4.append(new nw.MenuItem({
  label: 'Load Combination',
    click: function() {
	var link = "views/under.html";
	var win = nw.Window.open (link, {
	    position: 'center',
	    width: 300,
	    height: 300
	});
  }
}));

fileMenu4.append(new nw.MenuItem({
  label: 'Units',
    click: function() {
	var link = "views/under.html";
	var win = nw.Window.open (link, {
	    position: 'center',
	    width: 300,
	    height: 300
	});
  }
}));

menubar.append(new nw.MenuItem({ label: 'Design', submenu: fileMenu4}));
*/

/*
////////////////////////////////////////////////////////////////////////
// Dev Toosls!!!!

var fileMenu4 = new nw.Menu();

fileMenu4.append(new nw.MenuItem({
  label: 'Developer Tools',
    click: function() {
	nw.Window.get().showDevTools();
  }
}));

menubar.append(new nw.MenuItem({ label: 'Tools', submenu: fileMenu4}));
*/

////////////////////////////////////////////////////////////////////////

/*
var fileMenu5 = new nw.Menu();

fileMenu5.append(new nw.MenuItem({
  label: 'Units',
    click: function() {
	var link = "Units.html";
	var win = nw.Window.open (link, {
	    position: 'center',
	    width: 500,
	    height: 300
	});
  }
}));

menubar.append(new nw.MenuItem({ label: 'Design', submenu: fileMenu5}));
*/


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
var fileMenu6 = new nw.Menu();

fileMenu6.append(new nw.MenuItem({
  label: 'About us',
    click: function() {
	var link = "views/us.html";
	var win = nw.Window.open (link, {
	    position: 'center',
	    width: 500,
	    height: 400
	});
  }
}));


menubar.append(new nw.MenuItem({ label: 'Help', submenu: fileMenu6}));


////////////////////////////////////////////////////////////////////////

var win = nw.Window.get();
win.menu = menubar;


////////////////////////////////////////////////////////////////////////
// Short Cut Option
var option = {
    key : "Ctrl+N",
    //key : "A",
    active : function() {
	console.log("Global desktop keyboard shortcut: " + this.key + " active.");
    },
    failed : function(msg) {// :(, fail to register the |key| or couldn't parse the |key|.
	console.log(msg);
    }
};

// Create a shortcut with |option|.
var shortcut = new nw.Shortcut(option);

// Register global desktop shortcut, which can work without focus.
nw.App.registerGlobalHotKey(shortcut);

// If register |shortcut| successfully and user struck "Ctrl+Shift+A", |shortcut|
// will get an "active" event.
// You can also add listener to shortcut's active and failed event.
shortcut.on('active', function() {
    console.log("Global desktop keyboard shortcut: " + this.key + " active.");
    window.location.reload();
});

shortcut.on('failed', function(msg) {
    console.log(msg);
});

/*
// Unregister the global desktop shortcut.
nw.App.unregisterGlobalHotKey(shortcut);
*/

////////////////////////////////////////////////////////////////////////
function readFile(inpFile){
    var i;
    //var inpFile = './data/config.txt'
    var contentInp = fs.readFileSync(inpFile);
    var bufInp  = new Buffer(contentInp, 'binary');
    var UtfContentInp = iconv.decode(bufInp, "UTF-8");
    var arrInp = UtfContentInp.split(/\r\n|\r|\n/);
    for( i = 0; i<arrInp.length; i++){
	arrInp[i] = arrInp[i].trim();
    }
    return arrInp;
    /*
    var tmpArr = [];
    // Read from first low.
    tmpArr = arrInp[0].split(/\s+/);
    var judge = Number( tmpArr[0] );
    document.getElemenbById('').checked = true;
    writeFile( outFile, reader.result);
    */
}

//ファイルの書き込み関数
////////////////////////////////////////////////////////////////////////
/* utf-8
 */

function writeFile(path, data) {

    fs.writeFile(path, data, function (err) {
	if (err) {
	    throw err;
	}
    });
}
