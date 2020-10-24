/*
2020/10 Modified by Tsunoppy
/*
 Consolidation settlement is the basic souse of this script.
*/

window.onload = function (){

    window.devicePixelRatio = 3;

    var title = 'Crane Loading';
    var span = 16.0;
    var LoadNum = 1;

    var p1 = 70.0;
    var s1 = 0.0;
    var pv = 1.1;

    var wSelf = 3.5;
    var Es = 2.00*Math.pow(10,5);
    var Is = 654762;

    document.getElementById('title').value = title;
    document.getElementById('span').value = span.toFixed(3);
    document.getElementById('LoadNum').value = LoadNum;
    ////////////////////////////////////////////////////////////////////////
    document.getElementById('p_01').value = (50.0).toFixed(2);
    document.getElementById('s_01').value = s1.toFixed(3);
    document.getElementById('pv_01').value = (1.0).toFixed(2);
    addLoad();
    document.getElementById('p_02').value = (50.0).toFixed(2);
    document.getElementById('s_02').value = (2.5).toFixed(3);
    document.getElementById('pv_02').value = (1.0).toFixed(2);
    addLoad();
    document.getElementById('p_03').value = p1.toFixed(2);
    document.getElementById('s_03').value = (0.5).toFixed(3);
    document.getElementById('pv_03').value = pv.toFixed(2);
    addLoad();
    document.getElementById('p_04').value = p1.toFixed(2);
    document.getElementById('s_04').value = (2.5).toFixed(3);
    document.getElementById('pv_04').value = pv.toFixed(2);
    ////////////////////////////////////////////////////////////////////////

    document.getElementById('wSelf').value = wSelf.toFixed(2);
    document.getElementById('Es').value = Es.toFixed(0);
    document.getElementById('Is').value = Is.toFixed(0);

    document.getElementById('gMax').value = 0.0;
    document.getElementById('vMax').value = 0.0;

    ////////////////////////////////////////////////////////////////////////
    // Added 2020/10
    document.getElementById('ndiv').value = 100;

    var result = '<h2> - Description </h2>\n';
    result += '<p>\n';
    result += 'Vertical Loading for the two cranes per a span, 5ton Crane and 7ton crane';
    result += '\n';
    result += '</p>';
    result += '\n';
    result += '<p>';
    result += '\n';
    result += 'CG1, Crane Girder: H-1000x350x19x32';
    result += '\n';
    result += '</p>\n';
    result += '<hr>\n';

    document.getElementById('memo').value = result;

    var form = document.inputForm;
    DrawSec(form);

};

// Point loading
function PR(p,l,a,x){


    var point = [];
    var ra,rb,mx,qx;
    var b = l-a;

    ra = p*b/l;
    rb = p*a/l;

    if( x < a ){
	mx = p*b*x/l;
	qx = p*b/l;
    }else{
	mx = p*a*(l-x)/l;
	qx = -p*a/l;
    }

    var delta = p*1000*Math.pow(l*1000,3)*def(l*1000,a*1000,x*1000);
    //var delta = def(l,a,x);

    point[0] = mx;
    point[1] = ra;
    point[2] = rb;
    point[3] = qx;
    point[4] = delta;

    return point;
}


/*
  Main Program, exe when click result
*/

function main(form){

    // Read Data
    var title = document.getElementById('title').value;
    document.getElementById('outTitle').innerHTML = title;

    var span = Number(document.getElementById('span').value);
    var LoadNum = Number(document.getElementById('LoadNum').value);

    var wSelf = Number(document.getElementById('wSelf').value);
    var Es = Number(document.getElementById('Es').value);
    var Is = Number(document.getElementById('Is').value);

    // For Graph
    var rangeM  = Number(document.getElementById('gMax').value);
    var vaRange = Number(document.getElementById('vMax').value);

    var i,j;

    var space = [];
    var p = [];
    var pvF = [];

    var k;
    var kNum = LoadNum-1;

    var tmp,kk;

    for( k = 0; k <= kNum; k++ ){
	kk = k+1;
	tmp = 'pv_0' + kk;
	pvF[k] = Number(document.getElementById(tmp).value);
	tmp = 'p_0' + kk;
	p[k] = pvF[k]*Number(document.getElementById(tmp).value);
	tmp = 's_0' + kk;
	if(k==0){
	    space[k] = Number(document.getElementById(tmp).value);
	}else{
	    space[k] = space[k-1] + Number(document.getElementById(tmp).value);
	}
    }

    // Cal Start
    //var ndiv = 500;
    var ndiv = Number(document.getElementById('ndiv').value);
    var devSpan = span/ndiv;
    var devLim = (span-space[kNum])/ndiv;

    var Mmax=0.0;
    var Ramax=0.0;
    var Rbmax=0.0;
    var dmax=0.0;

    var mx,ra,rb,qx,dx;

    var a = 0.0;
    var x;

    var amax1,amax2,amax3,amaxDa,amaxDx;

    var mxmax = [0];
    var qxmax = [0];
    var qxmin = [0];
    var dxmax = [0];

    for( j = 1; j <= ndiv+1; j++ ){
	mxmax[j] = 0;
	qxmax[j] = 0;
	qxmin[j] = 0;
	dxmax[j] = 0;
    }

    for( i = 1; i <= ndiv+1; i++ ){

	a = (i-1)*devLim;
	x = 0.0;

	for( j = 1; j <= ndiv+1; j++ ){

	    x = (j-1)*devSpan;

	    ra = wSelf*span/2.0;
	    rb = wSelf*span/2.0;
	    mx = wSelf/2.0*(span*x-Math.pow(x,2));
	    qx = wSelf*span/2.0-wSelf*x;
	    dx = (x*1000)*wSelf/24.0*(
		Math.pow(span*1000,3)
		    -2.0*Math.pow(x*1000,2)*span*1000
		    +Math.pow(x*1000,3)
	    );
	    dx = dx/(Es*Is*10000);

	    for( k = 0; k <= kNum; k++ ){
		mx = mx + PR(p[k],span,a+space[k],x)[0];
		ra = ra + PR(p[k],span,a+space[k],x)[1];
		rb = rb + PR(p[k],span,a+space[k],x)[2];
		qx = qx + PR(p[k],span,a+space[k],x)[3];
		dx = dx + PR(p[k],span,a+space[k],x)[4]/(Es*Is*10000);;
	    }

	    if(mx>mxmax[j]){
		mxmax[j] = mx;
	    }
	    if(qx>qxmax[j]){
		qxmax[j] = qx;
	    }
	    if(qx<qxmin[j]){
		qxmin[j] = qx;
	    }
	    if(dx>dxmax[j]){
		dxmax[j] = dx;
	    }

	    if(ra>Ramax){
		Ramax = ra;
		amax2 = Number(a);
	    }
	    if(rb>Rbmax){
		Rbmax = rb;
		amax3 = Number(a);
	    }
	    if(mx>Mmax){
		Mmax = mx;
		amax1 = Number(a);
	    }
	    if(dx>dmax){
		dmax = dx;
		amaxDa = Number(a);
		amaxDx = Number(x);
	    }

	}
    }

    // Output data
    var xx = [];
    for( j = 1; j <= ndiv+1; j++ ){
	xx[j] = (j-1)*devSpan;
    }

    var result;
    ////////////////////////////////////////////////////////////////////////

    result = '';

    result += '<h2>- Design Condition </h2>';
    result += '<p>';
    result += 'span =';
    result += (span).toFixed(3);
    result += 'm';
    result += '</p>';

    result += '<p>';
    result += 'E =';
    result += Es.toFixed(0);
    result += 'N/mm<sup>2</sup>';
    result += ',&nbsp; ';
    result += 'I =';
    result += Is.toFixed(0);
    result += 'cm<sup>4</sup>';
    result += '</p>';
    result += '<hr>';

    document.getElementById('designCondition').innerHTML = result;

    ////////////////////////////////////////////////////////////////////////

    document.getElementById('description').innerHTML = document.getElementById('memo').value;

    ////////////////////////////////////////////////////////////////////////
    result = '';

    result += '<h2>- Load Condition </h2>';
    result += '<p>';
    result += '-- Uniform Load';
    result += '&nbsp;';
    result += '&nbsp;';
    result += '&nbsp;';
    result += '&omega;=';
    result += wSelf.toFixed(3);
    result += 'kN/m';
    result += '</p>';

    result += '<p>';
    result += '-- Point Load';
    result += '</p>';

    document.getElementById('LoadCondition_U').innerHTML = result;

    ////////////////////////////////////////////////////////////////////////

    result = '';

    result += '<table>';
    result += '<tbody>';
    result += '<tr>';
    result += '<td width="60pt">';
    result += 'No.';
    result += '</td>';
    result += '<td width="100pt">';
    result += 'Load (P)';
    result += '</td>';
    result += '<td width="100pt">';
    result += 'Spacing';
    result += '</td>';
    result += '<td width="100pt">';
    result += 'Impact Fac., &alpha;';
    result += '</td>';
    result += '<td width="100pt">';
    result += '&alpha; x P';
    result += '</td>';
    result += '</tr>';

    var pF = [];
    for( k = 0; k <= kNum; k++ ){
	kk = k+1;
	tmp = 'p_0' + kk;
	p[k] = Number(document.getElementById(tmp).value);
	tmp = 'pv_0' + kk;
	pF[k] = Number(document.getElementById(tmp).value);
	tmp = 's_0' + kk;
	space[k] = Number(document.getElementById(tmp).value);

	result += '<tr>';
	result += '<td>';
	result += 'No.'+kk+': ';
	result += '</td>';
	result += '<td>';
	result += 'P<sub>'+kk+'</sub>=';
	result += p[k].toFixed(2);
	result += '&nbsp;kN</td>';
	result += '<td>';
	result += 'S<sub>'+kk+'</sub>=';
	result += space[k].toFixed(3);
	result += '&nbsp;m</td>';
	result += '<td>';
	result += pF[k].toFixed(2);
	result += '</td>';
	result += '<td>';
	result += (pF[k]*p[k]).toFixed(2);
	result += '&nbsp;kN</td>';
	result += '</tr>';
    }

    result += '</tbody>';
    result += '</table>';


    document.getElementById('LoadCondition').innerHTML = result;

    ////////////////////////////////////////////////////////////////////////

    result = '';
    result += '<hr>';
    result += '<h2>- Stress Diagram </h2>';

    result += '<h2>';
    result += '<table><tbody>';
    result += '<tr><td width="360px">';
    result += 'Max. Bending Moment';
    result += '</td>';
    result += '<td>';
    result += 'Max. Shear Force';
    result += '</td>';
    result += '</tr>';
    result += '</tbody></table>';
    result += '</h2>';

    document.getElementById('test').innerHTML = result;


    ////////////////////////////////////////////////////////////////////////
    // Draw
    var name = 'Maximum Bending Moment';
    var name1 = 'Span (m)';
    var name2 = 'Bending Moment (kN.m)';
    var ctx = document.getElementById("Chart_X").getContext('2d');

    if( rangeM < Mmax ){
	rangeM = Mmax;
    }
    if( vaRange < Ramax ){
	vaRange = Ramax;
    }

    /*
    for( j = 1; j <= ndiv+1; j++ ){
	mxmax[j] = - mxmax[j];
    }
     */

    DrawSingle( ctx, ndiv+1, xx, mxmax, span, rangeM, name1, name2, name);
    //
    name1 = 'Positive Shear';
    name2 = 'Negative Shear';
    ctx = document.getElementById('Chart_Y').getContext('2d');
    DrawShear( ctx, ndiv+1, xx, qxmax, xx, qxmin, span, vaRange, name1, name2);


    // Data output
    var content = '<table><tr><td>';
    content += "position,m </td><td>Moment,kN.m, </td><td>Positive Shear,kN </td><td>Negative Shear,kN </td></tr>";
    for( j = 1; j <= ndiv+1; j++ ){
	content += "<tr><td>" + xx[j].toFixed(2) +"</td><td>";
	content += mxmax[j].toFixed(2) +"</td><td>";
	content += qxmax[j].toFixed(2) +"</td><td>";
	content += qxmin[j].toFixed(2) +"</td></tr>";
    }
    content += "</table>";
    writeFile("data/tmpFile.txt", content);
    document.getElementById('output_stress').innerHTML = content;


    ////////////////////////////////////////////////////////////////////////

    result = '';
    result += '<h2> - Maximum Stress </h2>';
    result += '<p>';
    result += 'Length from the first to No.'+ LoadNum +' Loading = ';
    var length = 0.0;
    for( k = 1; k <= kNum; k++ ){
	length = length + space[k];
    }
    result += length.toFixed(2);
    result += 'm';
    result += '</p>';

    result += '<table>';
    result += '<tbody>';
    result += '<tr>';

    result += '<td>';
    result += 'Max.';
    result += '</td>';

    result += '<td width="100px">';
    result += '</td>';

    result += '<td >';
    result += 'First wheel at ';
    result += '&nbsp;&nbsp;';
    result += '</td>';

    result += '<td>';
    result += 'Last wheel at ';
    result += '&nbsp;&nbsp;';
    result += '</td>';

    result += '<td>';
    result += 'Center of loading at ';
    result += '</td>';

    result += '</tr>';
    //
    result += '<tr>';

    result += '<td>';
    result += 'V<sub>Left</sub>=';
    result += '</td>';

    result += '<td>';
    result += Ramax.toFixed(2);
    result += 'kN';
    result += '</td>';

    result += '<td>';
    result += amax2.toFixed(2);
    result += 'm';
    result += '</td>';

    result += '<td>';
    result += (amax2+space[kNum]).toFixed(2);
    result += 'm';
    result += '</td>';

    result += '<td>';
    result += ((amax2+amax2+space[kNum])/2).toFixed(2);
    result += 'm';
    result += '</td>';

    result += '</tr>';
    //
    result += '<tr>';

    result += '<td>';
    result += 'V<sub>Right</sub>=';
    result += '</td>';

    result += '<td>';
    result += Rbmax.toFixed(2);
    result += 'kN';
    result += '</td>';

    result += '<td>';
    result += amax3.toFixed(2);
    result += 'm';
    result += '</td>';

    result += '<td>';
    result += (amax3+space[kNum]).toFixed(2);
    result += 'm';
    result += '</td>';

    result += '<td>';
    result += ((amax3+amax3+space[kNum])/2).toFixed(2);
    result += 'm';
    result += '</td>';

    result += '</tr>';
    //
    result += '<tr>';

    result += '<td>';
    result += 'M<sub>max</sub>=';
    result += '</td>';

    result += '<td>';
    result += Mmax.toFixed(2);
    result += 'kN.m';
    result += '&nbsp;&nbsp;';
    result += '</td>';

    result += '<td>';
    result += amax1.toFixed(2);
    result += 'm';
    result += '</td>';

    result += '<td>';
    result += (amax1+space[kNum]).toFixed(2);
    result += 'm';
    result += '</td>';

    result += '<td>';
    result += ((amax1+amax1+space[kNum])/2).toFixed(2);
    result += 'm';
    result += '</td>';

    result += '</tr>';
    result += '</tbody>';
    result += '</table>';

    //

    result += '<hr>';
    result += '<h2> - Deflection </h2>';

    var delta = dmax;
    result += '<p>';
    result += '&delta; =';
    result += (delta/10).toFixed(2);
    result += 'cm = Span/ ';
    result += (span*1000/delta).toFixed(0);
    result += '&nbsp; ';
    result += 'at ';
    result += amaxDx.toFixed(2);
    result += 'm, when the first wheel at ';
    result += amaxDa.toFixed(2);
    result += 'm';
    result += '</p>';

    result += '<br>';

    document.getElementById('outAnalysis').innerHTML = result;

}

////////////////////////////////////////////////////////////////////////
// Save File
var downloadAsFile = function(fileName, content) {

    var textArray = [];

    textArray[0]    = document.title;
    textArray[1]    = document.getElementById('title').value ;
    //
    //textArray[2]    = document.getElementById('title').value ;
    textArray[2]    = "brank";
    textArray[3]    = document.getElementById('span').value ;
    textArray[4]    = document.getElementById('LoadNum').value ;
    //textArray[5]    = document.getElementById('p_01').value ;
    //textArray[6]    = document.getElementById('s_01').value ;
    textArray[7]    = document.getElementById('wSelf').value ;
    textArray[8]    = document.getElementById('Es').value ;
    textArray[9]    = document.getElementById('Is').value ;
    //textArray[10]   = document.getElementById('LoadNum').value ;
    //textArray[11]   = document.getElementById('memo').value ;
    textArray[5]   = document.getElementById('gMax').value;
    textArray[6]   = document.getElementById('vMax').value;
    textArray[10]   = "brank";
    textArray[11]   = "brank";

    var k;
    var kNum = textArray[4]-1;
    var kk;
    var tmp;

    var space = [];
    var p = [];
    var pF = [];

    for( k = 0; k <= kNum; k++ ){
	kk = k+1;
	tmp = 'p_0' + kk;
	p[k] = Number(document.getElementById(tmp).value);
	tmp = 'pv_0' + kk;
	pF[k] = Number(document.getElementById(tmp).value);
	tmp = 's_0' + kk;
	space[k] = Number(document.getElementById(tmp).value);
    }

    for( k = 0; k <= kNum; k++ ){
	textArray[12+3*(k)]   = p[k];
	textArray[13+3*(k)]   = space[k];
	textArray[14+3*(k)]   = pF[k];
    }

    var npara = 14+3*kNum;

    textArray[npara+1]   = "Begin/";
    textArray[npara+2]   = document.getElementById('memo').value ;
    textArray[npara+3]   = "End/";

    /* revise & add */
    ndiv = Number(document.getElementById('ndiv').value);
    textArray[npara+4] = ndiv;
    /*npara = npara + 3;*/
    npara = npara + 4;

    //
    var i;
    content ='';

    for( i = 0; i<=npara; i++){
	content += textArray[i] + "\n";
    }

    var blob = new Blob([content]);
    var url = window.URL || window.webkitURL;
    var blobURL = url.createObjectURL(blob);

    var a = document.createElement('a');
    a.download = fileName;
    a.href = blobURL;
    a.click();
};

//////////////////////////////////////////////////


function OpenFile(){

    //window.location.reload();
    //console.log("hello");
    var Inp = document.createElement('input');
    Inp.type = 'file';
    Inp.click();

    //ダイアログでファイルが選択された時
    Inp.addEventListener("change",function(evt){

	var file = evt.target.files;

	//FileReaderの作成
	var reader = new FileReader();
	//テキスト形式で読み込む
	reader.readAsText(file[0]);

	//読込終了後の処理
	reader.onload = function(ev){

	    //CR+LF,CR,LF のいずれかの改行コードでsplitします。
	    var textArray = reader.result.split(/\r\n|\r|\n/);
	    var form = document.inputForm;
	    //
	    document.title = textArray[0]    ;
	    document.getElementById('title').value  = textArray[1]    ;
	    //
	    //document.getElementById('title').value  = textArray[2]    ;
	    document.getElementById('span').value  = (Number(textArray[3])).toFixed(3)    ;
	    //document.getElementById('LoadNum').value  = textArray[4]    ;
	    //document.getElementById('p_01').value  = textArray[5]    ;
	    //document.getElementById('s_01').value  = textArray[6]    ;
	    document.getElementById('gMax').value = textArray[5]   ;
	    document.getElementById('vMax').value = textArray[6]   ;
	    //
	    document.getElementById('wSelf').value  = (Number(textArray[7])).toFixed(3)    ;
	    document.getElementById('Es').value  = textArray[8]    ;
	    document.getElementById('Is').value  = textArray[9]    ;
	    //document.getElementById('memo').value  = textArray[10]    ;

	    //document.getElementById('memo').value  = textArray[11]   ;
	    //document.getElementById('LoadNum').value  = 1 ;

	    var k;
	    var kNum = textArray[4]-1;
	    var kk;
	    var tmp;

	    var space = [];
	    var p = [];
	    var pF = [];

	    var tmpkk = document.getElementById('LoadNum').value;

	    for ( k=1; k<tmpkk; k++){
		removeLoad();
	    }

	    for( k = 0; k <= kNum; k++ ){
		if(k > 0 ){
		    addLoad();
		}
		p[k]     = Number(textArray[12+3*(k)])   ;
		space[k] = Number(textArray[13+3*(k)])   ;
		pF[k]    = Number(textArray[14+3*(k)])   ;
		//console.log(p[k],space[k],pF[k]);
	    }

	    for( k = 0; k <= kNum; k++ ){
		kk = k+1;
		tmp = 'p_0' + kk;
		document.getElementById(tmp).value =  p[k].toFixed(2) ;
		tmp = 's_0' + kk;
		document.getElementById(tmp).value = space[k].toFixed(3);
		tmp = 'pv_0' + kk;
		document.getElementById(tmp).value = pF[k].toFixed(2);
	    }

	    //console.log("hello");
	    var npara = 14+3*kNum;

	    var result  = '';
	    for( k=1; k<=100; k++ ){
		//textArray[npara+1]   = "Begin/";
		if( textArray[npara+k+2]=="End/"){
		    nind = npara + k + 2;
		    break;
		}else{
		    result += textArray[npara+k+2];
		    result += '\n';
		    //console.log(textArray[npara+k+2]);
		}
	    }
	    document.getElementById('memo').value = result;

	    npara = npara + 3;

	    // revise add 20/10
	    nind = nind + 1;
	    var ndiv = textArray[nind];
	    document.getElementById('ndiv').value = ndiv;

	    main(form);
	    DrawSec(form);

	};


    },false);

}

////////////////////////////////////////////////////////////////////////
// Draw Tools
var canvas, ctx;
var scale, xscale, yscale, xcen, ycen;


function drawFilledPolygon (shape) {
    ctx.beginPath();
    ctx.moveTo(shape[0][0],shape[0][1]);
    for (p in shape)
	if (p > 0) ctx.lineTo(shape[p][0],shape[p][1]);
    ctx.lineTo(shape[0][0],shape[0][1]);
    ctx.fill();
}

function translateShape (shape,x,y) {
    var rv = [];
    for (p in shape)
	rv.push([ shape[p][0] + x, shape[p][1] + y ]);
    return rv;
}

function rotateShape (shape,ang) {
    var rv = [];
    for (p in shape)
	rv.push(rotatePoint(ang,shape[p][0],shape[p][1]));
    return rv;
}

function rotatePoint (ang,x,y) {
    return [
	(x * Math.cos(ang)) - (y * Math.sin(ang)),
	(x * Math.sin(ang)) + (y * Math.cos(ang))
    ];
}

function drawLineArrow (x1,y1,x2,y2) {
    var arrow = [
	[ 2, 0 ],
	[ -8, -5 ],
	[ -8, 5 ]
    ];
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    var ang = Math.atan2(y2-y1,x2-x1);
    drawFilledPolygon(translateShape(rotateShape(arrow,ang),x2,y2));
}

function drawLineArrow2 (x1,y1,x2,y2) {
    var arrow = [
	[ 0, 0 ],
	[ 10, -5 ],
	[ 10, 5 ]
    ];
    var arrow2 = [
	[ 0, 0 ],
	[ -10, -5 ],
	[ -10, 5 ]
    ];
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    var ang = Math.atan2(y2-y1,x2-x1);
    drawFilledPolygon(translateShape(rotateShape(arrow,ang),x1,y1));
    drawFilledPolygon(translateShape(rotateShape(arrow2,ang),x2,y2));
}


function drawFilledPolygon (shape) {
    ctx.beginPath();
    ctx.moveTo(shape[0][0],shape[0][1]);
    for (p in shape)
	if (p > 0) ctx.lineTo(shape[p][0],shape[p][1]);
    ctx.lineTo(shape[0][0],shape[0][1]);
    ctx.fill();
}

function translateShape (shape,x,y) {
    var rv = [];
    for (p in shape)
	rv.push([ shape[p][0] + x, shape[p][1] + y ]);
    return rv;
}

function rotateShape (shape,ang) {
    var rv = [];
    for (p in shape)
	rv.push(rotatePoint(ang,shape[p][0],shape[p][1]));
    return rv;
}

function rotatePoint (ang,x,y) {
    return [
	(x * Math.cos(ang)) - (y * Math.sin(ang)),
	(x * Math.sin(ang)) + (y * Math.cos(ang))
    ];
}

function drawLineArrow (x1,y1,x2,y2) {
    var arrow = [
	[ 2, 0 ],
	[ -8, -5 ],
	[ -8, 5 ]
    ];
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    var ang = Math.atan2(y2-y1,x2-x1);
    drawFilledPolygon(translateShape(rotateShape(arrow,ang),x2,y2));
}

function drawLineArrow2 (x1,y1,x2,y2) {
    var arrow = [
	[ 0, 0 ],
	[ 10, -5 ],
	[ 10, 5 ]
    ];
    var arrow2 = [
	[ 0, 0 ],
	[ -10, -5 ],
	[ -10, 5 ]
    ];
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    var ang = Math.atan2(y2-y1,x2-x1);
    drawFilledPolygon(translateShape(rotateShape(arrow,ang),x1,y1));
    drawFilledPolygon(translateShape(rotateShape(arrow2,ang),x2,y2));
}


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// 2D Glaph;
////////////////////////////////////////////////////////////////////////
function DrawShear(ctx,num,DataX,DataY,DataX2,DataY2,mnmax,ymax,Name1,Name2){

    var dataXY = [];
    var dataXY2 = [];
    var i;
    for(i=0;i<=num;i++){
	dataXY.push({ x:DataX[i], y:DataY[i]});
    }
    for(i=0;i<=num;i++){
	dataXY2.push({ x:DataX2[i], y:DataY2[i]});
    }

    var dataD = {
        datasets: [
	    {
		cubicInterpolationMode: 'monotone',
		borderColor: "gray",
		borderWidth: 1,
		//backgroundColor: "snow",
		label: Name1,
		data: dataXY
	    },
	    {
		//cubicInterpolationMode: 'linear',
		lineTension: 0,
		borderColor: "black",
		borderWidth: 1.5,
		backgroundColor: "rgba(0,140,232,.4)",
		label: Name2,
		data: dataXY2
	    }
	]
    };

    var scatterChart = new Chart(ctx, {
	//type: 'scatter',
	type: 'line',
	data: dataD,
	options: {
	    elements: {
		point: {radius: 0}
	    },
            scales: {
		xAxes: [{
                    type: 'linear',
                    position: 'bottom',
		    //gridLines: {
		    //display:false
		    //},
		    scaleLabel: {                 //軸ラベル設定
			display: true,             //表示設定
			fontSize: 14,              //フォントサイズ
			fontColor: 'black',
			labelString: 'Span (m)'  //ラベル

		    },
		    ticks: {                      //最大値最小値設定
                        min: 0,                   //最小値
                        max: mnmax,                  //最大値
			stepSize: mnmax/1,              //軸間隔
			//suggestedMax: mnmax,
			fontColor: 'black',
                        fontSize: 12              //フォントサイズ
		    }
		}],
		yAxes: [{                      //y軸設定
                    display: true,             //表示設定
                    scaleLabel: {              //軸ラベル設定
			display: true,          //表示設定
			fontSize: 14,               //フォントサイズ
			fontColor: 'black',
			labelString: 'Shear (kN)'  //ラベル
                    },
		    ticks: {                      //最大値最小値設定
                        suggestedMin: -ymax,                   //最小値
                        suggestedMax: ymax,                  //最大値
			//stepSize: 5,              //軸間隔
			fontColor: 'black',
                        fontSize: 12              //フォントサイズ
		    }
		}]
	    }
	}

    });

    //Chart.defaults.global.elements.line.tension = 0;
}

////////////////////////////////////////////////////////////////////////
function DrawSingle(ctx,num,DataX,DataY,mnmax,ymax,Name1,Name2,Name){

    var dataXY = [];
    var i;
    for(i=0;i<=num;i++){
	dataXY.push({ x:DataX[i], y:DataY[i]});
    }

    //Chart.defaults.global.scaleLabel = "<%=-value%>";
    //Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%= -value %>";

    var scatterChart = new Chart(ctx, {
	//type: 'scatter',
	type: 'line',
	data: {
            datasets: [
		{
		    cubicInterpolationMode: 'monotone',
		    borderColor: "black",
		    borderWidth: 1,
		    backgroundColor: "rgba(0,140,232,.4)",
		    //backgroundColor: "snow",
		    label: Name,
		    data: dataXY
		}
	    ]
	},
	options: {
	    elements: {
		point: {radius: 0}
	    },
            scales: {
		xAxes: [{
                    type: 'linear',
                    position: 'bottom',
		    //gridLines: {
		    //display:false
		    //},
		    scaleLabel: {                 //軸ラベル設定
			display: true,             //表示設定
			fontSize: 14,              //フォントサイズ
			fontColor: 'black',
			labelString: Name1  //ラベル

		    },
		    ticks: {                      //最大値最小値設定
                        min: 0,                   //最小値
                        max: mnmax,                  //最大値
			stepSize: mnmax/1,              //軸間隔
			//suggestedMax: mnmax,
			fontColor: 'black',
                        fontSize: 12              //フォントサイズ
		    }
		}],
		yAxes: [{                      //y軸設定
                    display: true,             //表示設定
                    scaleLabel: {              //軸ラベル設定
			display: true,          //表示設定
			fontSize: 14,               //フォントサイズ
			fontColor: 'black',
			labelString: Name2  //ラベル
                    },
		    ticks: {                      //最大値最小値設定
			reverse: true,
                        //min: -ymax*0.2,                   //最小値
			suggestedMin: -ymax,
                        suggestedMax: ymax,                  //最大値
			//stepSize: 5,              //軸間隔
			fontColor: 'black',
                        fontSize: 12              //フォントサイズ
		    }
		}]
	    }
	}

    });

    //Chart.defaults.global.elements.line.tension = 0;
}

//------------------------------------------------------------------------
// Load ADD & Remove
//------------------------------------------------------------------------

function addLoad(){

    var Num = Number(document.getElementById('LoadNum').value);
    var i = Num+1;
    document.getElementById('LoadNum').value = i;

    var result = '';

    result += '<td>';
    result += 'No.'+i+': &nbsp;';
    result += '</td>';
    //
    result += '<td>';
    result += 'P<sub>'+i+'</sub> =';
    result += '<input type="text" id="p_0'+i+'" onChange="DrawSec(this.form);">';
    result +='</td>';
    //
    result += '<td>';
    result += 's<sub>'+i+'</sub> =';
    result += '<input type="text" id="s_0'+i+'" onChange="DrawSec(this.form);">';
    result +='</td>';

    result += '<td>';
    result += '<input type="text" id="pv_0'+i+'" onChange="DrawSec(this.form);">';
    result += '</td>';

    document.getElementById(i).innerHTML = result;
    paraAdd(i);

    DrawSec(document.inputForm);
}

function removeLoad(){

    var Num = Number(document.getElementById('LoadNum').value);

    // Error Message
    if ( Num <= 1 ) {
	alert('can not remove!');
	return;
    }

    var i = Num-1;
    document.getElementById('LoadNum').value = i;

    var result = '';
    document.getElementById(Num).innerHTML = result;
    DrawSec(document.inputForm);
}

function paraAdd(i){

    var ip = i-1;
    document.getElementById('p_0'+i).value = document.getElementById('p_0'+ip).value ;
    document.getElementById('s_0'+i).value = (2.5).toFixed(3);
    document.getElementById('pv_0'+i).value = document.getElementById('pv_0'+ip).value ;
}

function def(span,a,x){
    // Coded by Tsunoda, Feb/2018
    // Deflection factor for the point load;
    // span: Span of the single beam [mm]
    // a   : Point load position from the left end [mm]
    // x   : objective parameter [mm]
    // Retun alpha, where del = PxL^3/(EI) x alpha;
    //
    // Declare
    var b = span-a;
    var a2 = x;
    var b2 = span-x;
    // Declare for Cal
    var alpha, beta, gamma;
    var dev;
    // Cal
    if( a2 <= a ){
	// Preparation
	alpha = 1.0/3.0 * Math.pow( a2, 3 );
	beta = span/2.0*( Math.pow(a,2) - Math.pow(a2,2) )
	    - 1.0/3.0 * ( Math.pow(a,3) - Math.pow(a2,3) );
	gamma = 1.0/3.0*Math.pow(span-a,3);
	// Finalize
	dev = b*b2*alpha
	    + a2*b*beta
	    + a*a2*gamma;
	dev = dev/Math.pow(span,5);
    }else {
	// Preparation
	alpha = 1.0/3.0 * Math.pow( a, 3 );
	beta = span/2.0* ( Math.pow(a2,2) - Math.pow(a,2) )
	    - 1.0/3.0* ( Math.pow(a2,3) - Math.pow(a,3) );
	gamma = 1.0/3.0* Math.pow(span-a2,3);
	// Finalize
	dev = b*b2*alpha
	    + a*b2*beta
	    + a*a2*gamma;
	dev = dev/Math.pow(span,5);
    }
    //
    return dev;
    //
}


////////////////////////////////////////////////////////////////////////
// DrawSec

function DrawSec (form) {

    // Input
    var b = Number(form.span.value);
    var h = b/10.0;

    // Load Input
    var space = [];
    var p = [];
    var pvF = [];
    var k;
    var LoadNum = Number(document.getElementById('LoadNum').value);
    var kNum = LoadNum-1;
    var tmp,kk;

    for( k = 0; k <= kNum; k++ ){
	kk = k+1;
	tmp = 'pv_0' + kk;
	pvF[k] = Number(document.getElementById(tmp).value);
	tmp = 'p_0' + kk;
	p[k] = pvF[k]*Number(document.getElementById(tmp).value);
	tmp = 's_0' + kk;
	if(k==0){
	    // space[k] = Number(document.getElementById(tmp).value);
	    // space[0] shall be zero!! for the drawing.
	    space[k] = 0.0;
	}else{
	    space[k] = space[k-1] + Number(document.getElementById(tmp).value);
	}
    }

    // Get Maximum
    var pmax = 0.0;
    for( k=0; k<=kNum; k++ ){
	if( p[k] > pmax ){
	    pmax = p[k];
	}
	//console.log(k,p[k],space[k]);
    }

    var x1 = 0.5* ( b - space[kNum]+space[0] );
    var xpos = [];
    var ypos = [];
    //console.log(x1);

    for( k=0; k<=kNum; k++ ){
	xpos[k] = x1 + space[k];
	ypos[k] = p[k]/pmax*h*0.5;
    }

    // Start
    var result = '<canvas width=\"650\" height=\"100\" id=\"picCanvas\"></canvas>';
    document.getElementById('picture').innerHTML = result;
    canvas = document.getElementById('picCanvas');
    ctx = canvas.getContext("2d");

    var size = 2;
    canvas.width  = 650 * size;
    canvas.height = 100 * size;
    ctx.scale( 1, 1);

    // Drawing
    xcen = canvas.width / 2 - 0;
    ycen = canvas.height / 2 + 10;

    xscale = (canvas.width-10)/b;
    yscale = (canvas.height-80)/h;
    scale = (xscale < yscale) ? xscale : yscale;

    // Draw Dimension Lines
    ctx.lineWidth = 2;
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.font = "14pt sans-serif";
    ctx.textAlign = "center";


    ctx.beginPath();
    ctx.moveTo(xcen-b/2*scale,ycen+h/2*scale);
    ctx.lineTo(xcen+b/2*scale,ycen+h/2*scale);
    ctx.stroke();

    // Draw Beam Dimensions
    // Span
    drawLineArrow2(xcen-b/2*scale+xpos[0]*scale,    ycen-h/2*scale-10,
		   xcen-b/2*scale+xpos[kNum]*scale, ycen-h/2*scale-10);
    ctx.textAlign = "center";
    ctx.fillText((space[kNum]-space[0]).toFixed(3)+' m',
		 xcen,ycen-h/2*scale-20);

    // Initial position
    drawLineArrow2(xcen-b/2*scale,               ycen+10,
		   xcen-b/2*scale+xpos[0]*scale, ycen+10);
    ctx.textAlign = "center";
    ctx.fillText('> S1',
		 xcen-b/2*scale+xpos[0]/2*scale,ycen);

    ctx.lineWidth = 2;

    for( k=0; k<=kNum; k++){
	drawLineArrow(xcen-b/2*scale+xpos[k]*scale, ycen-ypos[k]/2.0*scale,
		      xcen-b/2*scale+xpos[k]*scale, ycen+h/2    *scale);
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText((k+1),
		     xcen-b/2*scale+xpos[k]*scale,
		     ycen+h/2*scale+20);

	// Describe the spacing
	if( k>=1 ){
	    ctx.fillText( 'S'+(k+1),
			  xcen-b/2*scale + (xpos[k-1]+xpos[k])/2*scale,
			  ycen-h/2*scale+15);
	}

    }

}
