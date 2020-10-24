
/*
 Consolidation settlement is the basic souse of this script.
*/

window.onload = function (){

    window.devicePixelRatio = 3;

    ////////////////////////////////////////////////////////////////////////
    /*
     var inpFile = './data/unitConfig.txt';
     var arrInp = readFile(inpFile);
     var tmpArr = arrInp[0].split(/\s+/);
     var judge = tmpArr[0];
     // console.log(judge);
     */

    ////////////////////////////////////////////////////////////////////////
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

    /*
    var A = 1000;
    var b = 300;
    var tw = 19;
    var tf = 32;
    var r = 0;

    document.getElementById('H').value  =      A ;
    document.getElementById('b').value  =      b ;
    document.getElementById('tw').value =     tw ;
    document.getElementById('tf').value =     tf ;
    document.getElementById('r').value  =      r ;
     */

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

function graph(){
    window.open('./glaph.html','Glaph','width=300,height=150');
}

function main(form){

    var title = document.getElementById('title').value;
    document.getElementById('outTitle').innerHTML = title;

    //var span = 16.0; //m
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

    var ndiv = 500;
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

    /*
    result += '<img src="images/MoveLoad.jpg" alt="Stress Location" width="250px" /><br  />';
     */
    //
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
    DrawMN( ctx, ndiv+1, xx, qxmax, xx, qxmin, span, vaRange, name1, name2);
    //
    /*
    name = 'Deflection x PL<sup>3</sup>/(EI)';
    name1 = 'Span (m)';
    name2 = 'Deflection (-)';
    ctx = document.getElementById('Chart_Z').getContext('2d');
    DrawSingle( ctx, ndiv+1, xx, dxmax, span, name1, name2, name);
     */

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


    //cal();

}

////////////////////////////////////////////////////////////////////////
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

    npara = npara + 3;

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

/*
function OpenFile2(){

    var Inp = document.createElement('input');
    Inp.type = 'file';
    Inp.click();

    //ダイアログでファイルが選択された時
    Inp.addEventListener("change",function(evt){
	console.log("hello");
    },false);
}
*/

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
		    break;
		}else{
		    result += textArray[npara+k+2];
		    result += '\n';
		    //console.log(textArray[npara+k+2]);
		}
	    }
	    document.getElementById('memo').value = result;

	    npara = npara + 3;

	    main(form);
	    DrawSec(form);

	};


    },false);

}

////////////////////////////////////////////////////////////////////////


// Exe
function OnButtonClick(){


    // Input

    var bw = Number(document.getElementById('bw').value);
    var h = Number(document.getElementById('h').value);
    var fc = Number(document.getElementById('fc').value);
    var fy = Number(document.getElementById('fy').value);
    var fyt = Number(document.getElementById('fyt').value);

    /*
     var coverSide = Number(document.getElementById('coverSide').value);
     var coverTop = Number(document.getElementById('coverTop').value);
     var coverBot = Number(document.getElementById('coverBot').value);
     */

    var coverSide = 40.0;
    var coverTop = 60.0;
    var coverBot = 40.0;


    // Load Condition
    var IdType = [];
    var IdSide = [];
    var type;
    var para = [];
    var force = [[]];
    //
    var Num = Number(document.getElementById('LoadNum').value);
    var span = Number( document.getElementById('span').value );
    //
    var i;

    var wSelf = Number( document.getElementById('wSelf').value );

    var mmax1 = wSelf*Math.pow(span,2)/8.0;
    var mmax2 = 0.0;
    var ca1   = wSelf*Math.pow(span,2)/12.0;
    var ca2   = 0.0;
    var cb1   = wSelf*Math.pow(span,2)/12.0;
    var cb2   = 0.0;
    var ra1   = wSelf*span/2.0;
    var rb1   = wSelf*span/2.0;
    var ra2   = 0.0;
    var rb2   = 0.0;

    for( i = 1; i < Num+1; i++ ){
	//
	//
	type = 'type' + i;
	IdType[i] = document.getElementById(type).selectedIndex;
	IdSide[i] = document.getElementById('both'+i).selectedIndex;
	para[1] = Number(document.getElementById(i+'num1').value);
	para[2] = Number(document.getElementById(i+'num2').value);
	//
	if ( IdType[i] == 2 || IdType[i] == 6 ){
	    para[3] = 'None';
	}
	else{
	    para[3] = Number(document.getElementById(i+'num3').value);
	}
	//
	force[i] = analysis( IdType[i], IdSide[i], span, para[1], para[2], para[3] );
	//
	mmax1 = mmax1 + force[i][0];
	ca1   = ca1   + force[i][1];
	cb1   = cb1   + force[i][2];
	ra1   = ra1   + force[i][3];
	rb1   = rb1   + force[i][4];
	//
	mmax2 = mmax2 + force[i][5];
	ca2   = ca2   + force[i][6];
	cb2   = cb2   + force[i][7];
	ra2   = ra2   + force[i][8];
	rb2   = rb2   + force[i][9];
	//
    }
    //    console.log( mmax1,ca1,cb1,ra1,rb1,mmax2,ca2,cb2,ra2,rb2);

    // Load Combination
    var FacDL = Number(document.getElementById('FacDL').value) ;
    //var FacSDL = Number(document.getElementById('FacSDL').value) ;
    var FacLL = Number(document.getElementById('FacLL').value) ;
    var IdBeam = document.getElementById('Location').selectedIndex;

    var Mext,Mint,Mcent;
    var Mint2,Mcent2;
    var Vint;

    Mext  = 0.6* (FacDL*ca1+FacLL*ca2);
    Vint =  Math.max( FacDL*ra1+FacLL*ra2, FacDL*rb1+FacLL*rb2 );

    if( IdBeam == 0) {
	Mcent = FacDL*mmax1+FacLL*mmax2 - 0.35*( FacDL*ca1+FacLL*ca2 );
	Mcent = Math.max( Mcent, FacDL*mmax1+FacLL*mmax2 - 0.35*( FacDL*cb1+FacLL*cb2 ) );
    }
    if( IdBeam == 1) {
	Mint   = 1.2/0.6*Mext;
	Mcent  = FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*ca1+FacLL*ca2 );
	Mcent  = Math.max( Mcent, FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*cb1+FacLL*cb2 ) );
	Mint2  = 1.0/0.6*Mext;
	Mcent2 = FacDL*mmax1+FacLL*mmax2 - 0.75*( FacDL*ca1+FacLL*ca2 );
	Mcent2 = Math.max( Mcent2, FacDL*mmax1+FacLL*mmax2 - 0.75*( FacDL*cb1+FacLL*cb2 ) );
	Vint   = 1.1* Vint;
    }
    if( IdBeam == 2) {
	Mint   = 1.3/0.6*Mext;
	Mcent  = FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*ca1+FacLL*ca2 );
	Mcent  = Math.max( Mcent, FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*cb1+FacLL*cb2 ) );
	Vint   = 1.1* Vint;
    }

    // DOM Output

    var result = '';


    //
    result += '<h4> - Analysis </h4>';

    result += '<table><tr>';
    result += '<td>';
    result += 'M<sub>0,DL</sub>\' = ';
    result += '</td><td id="mmax1">';
    result += mmax1.toFixed(0);
    result += '</td><td>';
    result += 'kN.m &nbsp;';
    result += '</td>';
    result += '<td>';
    result += 'M<sub>0,LL</sub>\' = ';
    result += '</td><td id="mmax2">';
    result += mmax2.toFixed(0);
    result += '</td><td>';
    result += 'kN.m &nbsp;';
    result += '</td>';
    result += '</tr></table>';
    //
    result += '<table><tr>';
    result += '<td>';
    result += 'C<sub>a,DL</sub>\' = ';
    result += '</td><td id="ca1">';
    result += ca1.toFixed(0);
    result += '</td><td>';
    result += 'kN.m &nbsp;';
    result += '</td>';
    result += '<td>';
    result += 'C<sub>a,LL</sub>\' = ';
    result += '</td><td id="ca2">';
    result += ca2.toFixed(0);
    result += '</td><td>';
    result += 'kN.m &nbsp;';
    result += '</td>';

    result += '<td>';
    result += 'C<sub>b,DL</sub>\' = ';
    result += '</td><td id="cb1">';
    result += cb1.toFixed(0);
    result += '</td><td>';
    result += 'kN.m &nbsp;';
    result += '</td>';
    result += '<td>';
    result += 'C<sub>b,LL</sub>\' = ';
    result += '</td><td id="cb2">';
    result += cb2.toFixed(0);
    result += '</td><td>';
    result += 'kN.m &nbsp;';
    result += '</td>';
    result += '</tr>';
    //
    result += '<tr>';
    result += '<td>';
    result += 'V<sub>a,DL</sub>\' = ';
    result += '</td><td id="ra1">';
    result += ra1.toFixed(0);
    result += '</td><td>';
    result += 'kN &nbsp;';
    result += '</td>';
    result += '<td>';
    result += 'V<sub>a,LL</sub>\' = ';
    result += '</td><td id="ra2">';
    result += ra2.toFixed(0);
    result += '</td><td>';
    result += 'kN &nbsp;';
    result += '</td>';

    result += '<td>';
    result += 'V<sub>b,DL</sub>\' = ';
    result += '</td><td id="rb1">';
    result += rb1.toFixed(0);
    result += '</td><td>';
    result += 'kN &nbsp;';
    result += '</td>';
    result += '<td>';
    result += 'V<sub>b,LL</sub>\' = ';
    result += '</td><td id="rb2">';
    result += rb2.toFixed(0);
    result += '</td><td>';
    result += 'kN &nbsp;';
    result += '</td>';
    result += '</tr></table>';

    //
    result += '<h4> - Bending Moment </h4>';
    //
    if( IdBeam == 0)  {
	result += '<p><img src="images/single.jpg" alt="Location" height="100px" /><br  /></p>';
    }
    else if( IdBeam == 1)  {
	result += '<p><img src="images/multi.jpg" alt="Location" height="100px" /><br  /></p>';
    }
    else{
	result += '<p><img src="images/twoSpan.jpg" alt="Location" height="100px" /><br  /></p>';
    }

    result += '<input type="button" value="Rebar Reset" onclick="RebarSet();">';
    result += '&nbsp; with';

    result += '<select id="RebarStand" >';
    result += '    <option value="12">DB12</option>';
    result += '    <option value="16">DB16</option>';
    result += '    <option value="20">DB20</option>';
    result += '    <option value="25" selected>DB25</option>';
    result += '    <option value="28">DB28</option>';
    result += '    <option value="32">DB32</option>';
    result += '</select> &nbsp;';


    result += '<input type="button" value="Cal" onclick="Cal();">';
    result += '&nbsp; (After Load Set) &nbsp;';
    result += '<input type="button" value="Re-Cal" onclick="ReCal();">';

    result += '<table><tr>';

    result += '<td>';
    result += 'Location';
    result += '</td><td>';
    result += '';
    result += '</td><td>';
    result += 'External &nbsp;';
    result += '</td><td>';
    result += 'Center &nbsp;&nbsp;';
    result += '</td><td>';

    if( IdBeam == 1 ){
	result += 'Internal/End &nbsp;';
	result += '</td><td>';
	result += 'Internal/Int.&nbsp;';
	result += '</td><td>';
	result += 'Center/Int &nbsp;';
    }
    if( IdBeam == 2 ){
	result += 'Internal &nbsp;';
    }

    //
    result += '</td>';
    result += '</tr><tr>';

    // Bending Moment Top

    result += '<td>';
    result += 'M<sub>u</sub> &nbsp;';
    result += '</td><td>';
    result += 'Top &nbsp;';
    result += '</td><td id="m1">';
    result += Mext.toFixed(0);
    result += '</td><td>';
    result += '-';

    if( IdBeam == 1)  {
        result += '</td><td id="m3">';
	result += Mint.toFixed(0);
	result += '</td><td id="m4">';
	result += Mint2.toFixed(0);
	result += '</td><td>';
	result += '-';
    }
    if( IdBeam == 2)  {
        result += '</td><td id="m3">';
	result += Mint.toFixed(0);
    }
    //
    result += '</td>';
    result += '</tr><tr>';

    // Bending Moment Bot

    result += '<td>';
    result += '[kN.m]';
    result += '</td><td>';
    result += 'Bot &nbsp;';
    result += '</td><td>';
    result += '-';
    result += '</td><td id="m2">';
    result += Mcent.toFixed(0);

    if( IdBeam == 1)  {
        result += '</td><td>';
	result += '-';
	result += '</td><td>';
	result += '-';
	result += '</td><td id="m5">';
	result += Mcent2.toFixed(0);
    }
    if( IdBeam == 2)  {
        result += '</td><td>';
	result += '-';
    }

    //    result += '</td>';

    //
    result += '</td>';
    result += '</tr><tr>';


    //
    // Main Rebar Top Layer-1
    result += '<td>';
    result += 'Main RF. &nbsp;';
    result += '</td><td>';
    result += 'Top Layer 1 &nbsp;';


    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}

	result += '</td><td>';

	result += '<input type="text" id="1topNum'+i+'" onChange="Cal();">-';
	result += '<select id="1topRebar'+i+'" onChange="Cal();">';
	result += '    <option value="12">DB12</option>';
	result += '    <option value="16">DB16</option>';
	result += '    <option value="20">DB20</option>';
	result += '    <option value="25">DB25</option>';
	result += '    <option value="28">DB28</option>';
	result += '    <option value="32">DB32</option>';
	result += '</select> &nbsp;';

    }
    result += '</td>';
    result += '</tr><tr>';

    //
    // Main Rebar Top Layer-2
    result += '<td>';
    result += '</td><td>';
    result += 'Top Layer 2 &nbsp;';


    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}

	result += '</td><td>';

	result += '<input type="text" id="2topNum'+i+'" onChange="Cal();">-';
	result += '<select id="2topRebar'+i+'" onChange="Cal();">';
	result += '    <option value="12">DB12</option>';
	result += '    <option value="16">DB16</option>';
	result += '    <option value="20">DB20</option>';
	result += '    <option value="25">DB25</option>';
	result += '    <option value="28">DB28</option>';
	result += '    <option value="32">DB32</option>';
	result += '</select> &nbsp;';

    }

    result += '</td>';
    result += '</tr><tr>';

    //
    // Main Rebar Top Layer-3
    result += '<td>';
    result += '</td><td>';
    result += 'Top Layer 3 &nbsp;';


    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}

	result += '</td><td>';

	result += '<input type="text" id="3topNum'+i+'" onChange="Cal();">-';
	result += '<select id="3topRebar'+i+'" onChange="Cal();">';
	result += '    <option value="12">DB12</option>';
	result += '    <option value="16">DB16</option>';
	result += '    <option value="20">DB20</option>';
	result += '    <option value="25">DB25</option>';
	result += '    <option value="28">DB28</option>';
	result += '    <option value="32">DB32</option>';
	result += '</select> &nbsp;';

    }

    result += '</td>';
    result += '</tr><tr>';


    //
    // Main Rebar Bot Layer 3
    result += '<td>';
    result += '';
    result += '</td><td>';
    result += 'Bot Layer 3 &nbsp;';

    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}

	result += '</td><td>';
	result += '<input type="text" id="3botNum'+i+'" onChange="Cal();">-';
	result += '<select id="3botRebar'+i+'" onChange="Cal();">';
	result += '    <option value="12">DB12</option>';
	result += '    <option value="16">DB16</option>';
	result += '    <option value="20">DB20</option>';
	result += '    <option value="25">DB25</option>';
	result += '    <option value="28">DB28</option>';
	result += '    <option value="32">DB32</option>';
	result += '</select> &nbsp;';

    }

    result += '</td>';
    result += '</tr><tr>';


    //
    // Main Rebar Bot Layer 2
    result += '<td>';
    result += '';
    result += '</td><td>';
    result += 'Bot Layer 2 &nbsp;';

    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}

	result += '</td><td>';
	result += '<input type="text" id="2botNum'+i+'" onChange="Cal();">-';
	result += '<select id="2botRebar'+i+'" onChange="Cal();">';
	result += '    <option value="12">DB12</option>';
	result += '    <option value="16">DB16</option>';
	result += '    <option value="20">DB20</option>';
	result += '    <option value="25">DB25</option>';
	result += '    <option value="28">DB28</option>';
	result += '    <option value="32">DB32</option>';
	result += '</select> &nbsp;';

    }

    result += '</td>';
    result += '</tr><tr>';


    //
    // Main Rebar Bot Layer 1
    result += '<td>';
    result += '';
    result += '</td><td>';
    result += 'Bot Layer 1 &nbsp;';

    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}

	result += '</td><td>';
	result += '<input type="text" id="1botNum'+i+'" onChange="Cal();">-';
	result += '<select id="1botRebar'+i+'" onChange="Cal();">';
	result += '    <option value="12">DB12</option>';
	result += '    <option value="16">DB16</option>';
	result += '    <option value="20">DB20</option>';
	result += '    <option value="25">DB25</option>';
	result += '    <option value="28">DB28</option>';
	result += '    <option value="32">DB32</option>';
	result += '</select> &nbsp;';

    }

    result += '</td>';
    result += '</tr><tr>';

    //
    // dt
    /*
     result += '<td>';
     result += 'dt';
     result += '</td><td>';
     result += 'mm';


     for( i = 1; i <= 5; i++ ){
     if( IdBeam==0 && i == 3 ){
     break;
     }
     if( IdBeam==2 && i == 4 ){
     break;
     }
     result += '</td><td>';
     result += '<input type="text" id="dt'+i+'" >';
     }

     result += '</td>';
     */

    //
    result += '</tr><tr id="mn">';
    result += '</tr><tr id="es">';
    result += '</tr><tr id="phimn">';
    result += '</tr><tr id="ratio">';
    result += '</tr><tr id="dt">';
    result += '</tr><tr id="at">';

    //
    result += '</tr></table>';
    result += '<p id="note"></p>';

    document.getElementById('result').innerHTML = result;
    //

    // for shear

    result = '';
    result += '<h4> - Shear </h4>';

    result += '<table><tr>';
    result += '<td>';
    result += 'V<sub>u</sub>  = ';
    result += '</td><td id="vu">';
    result += Vint.toFixed(0);
    result += '</td><td>';
    result += 'kN';
    result += '</td>';
    result += '</tr></table>';

    document.getElementById('shear').innerHTML = result;

    //
    //DrawSec();
    //    RebarSet();

}

// Cal Beam Capacity
function Cal(){

    // Input

    var bw = Number(document.getElementById('bw').value);
    var h = Number(document.getElementById('h').value);
    var fc = Number(document.getElementById('fc').value);
    var fy = Number(document.getElementById('fy').value);
    var fyt = Number(document.getElementById('fyt').value);

    var i,j;
    var IdBeam = document.getElementById('Location').selectedIndex;

    var NumTop = new Array(5);
    var IdTop  = new Array(5);
    var NumBot = new Array(5);
    var IdBot  = new Array(5);

    for( i = 1; i <= 5; i++ ){
	NumTop[i] = new Array(5);
	IdTop[i] = new Array(5);
	NumBot[i] = new Array(5);
	IdBot[i] = new Array(5);
	for( j = 1; j <= 5; j++ ){
	    NumTop[i][j]=0;
	    IdTop[i][j]=0;
	    NumBot[i][j]=0;
	    IdBot[i][j]=0;
	}
    }

    var dt = [];
    var m  = [];
    var ph = [];

    var mn = [];


    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}
	for( j = 1; j <= 3; j++ ){
	    NumTop[i][j] = Number( document.getElementById(j+'topNum'+i).value);
	    IdTop[i][j]  = document.getElementById(j+'topRebar'+i).selectedIndex;
	    NumBot[i][j] = Number( document.getElementById(j+'botNum'+i).value);
	    IdBot[i][j]  = document.getElementById(j+'botRebar'+i).selectedIndex;
	}

	//	m[i] = Number( document.getElementById('m'+i).innerHTML );

    }

    // for shear
    var avIndex = document.ShearForm.DiaShearName.selectedIndex;
    var avPitch = Number( document.getElementById('pitch').value ) ;
    var avStrNum = Number( document.getElementById('strNum').value );
    var avIndex2 = document.ShearForm2.DiaShearName2.selectedIndex;
    var avPitch2 = Number( document.getElementById('pitch2').value );


    // Preparation
    // Section Area.
    var rat1,rat2,rac1,rac2;
    var code = 17;

    var bb = bw;
    var srat = 0.0;
    var sr = 40.0;
    var st = 0.0;
    var sigy1 = fy;
    var sigy2 = fy;

    var at = [];

    // Cal

    var pmin1 = 1.4/fy;
    var pmin2 = 0.25*Math.sqrt(fc)/fy;
    var pmin = Math.max(pmin1,pmin2);

    //

    var dt1,dt2,dt3;

    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}

	// for negative
	if( i== 1 || i ==3 || i==4 ){
	    rat1 = NumTop[i][1] * Rebar[IdTop[i][1]].As;
	    rat2 = NumTop[i][2] * Rebar[IdTop[i][2]].As;
	    rat2 = rat2 + NumTop[i][3] * Rebar[IdTop[i][3]].As;
	    rac1 = NumBot[i][1] * Rebar[IdBot[i][1]].As;
	    rac2 = NumBot[i][2] * Rebar[IdBot[i][2]].As;
	    rac2 = rac2 + NumBot[i][3] * Rebar[IdBot[i][3]].As;
	    mn[i] = mnut(Rebar[IdTop[i][1]].dia, fc,  bw,  h,  bb,  rat1,
			 rat2,  rac1,  rac2,  srat,  sr,
			 st,  sigy1,  sigy2, code);

	    dt1 = h - dtu2( code, Rebar[IdTop[i][1]].dia );
	    dt2 = dt1 - 2.7*Rebar[IdTop[i][1]].dia;
	    dt3 = dt2 - 2.7*Rebar[IdTop[i][1]].dia;
	    dt[i] = dt1*NumTop[i][1] + dt2*NumTop[i][2] + dt3*NumTop[i][3];
	    dt[i] = dt[i]/(NumTop[i][1] + NumTop[i][2] + NumTop[i][3]);

	}

	// for positive
	if( i ==2 || i==5 ){
	    rac1 = NumTop[i][1] * Rebar[IdTop[i][1]].As;
	    rac2 = NumTop[i][2] * Rebar[IdTop[i][2]].As;
	    rac2 = rac2 + NumTop[i][3] * Rebar[IdTop[i][3]].As;
	    rat1 = NumBot[i][1] * Rebar[IdBot[i][1]].As;
	    rat2 = NumBot[i][2] * Rebar[IdBot[i][2]].As;
	    rat2 = rat2 + NumBot[i][3] * Rebar[IdBot[i][3]].As;
	    mn[i] = mnuu(Rebar[IdBot[i][1]].dia, fc,  bw,  h,  bb,  rat1,
			 rat2,  rac1,  rac2,  srat,  sr,
			 st,  sigy1,  sigy2, code);

	    dt1 = h - dtb2( code, Rebar[IdBot[i][1]].dia );
	    dt2 = dt1 - 2.7*Rebar[IdBot[i][1]].dia;
	    dt3 = dt2 - 2.7*Rebar[IdBot[i][1]].dia;
	    dt[i] = dt1*NumBot[i][1] + dt2*NumBot[i][2] + dt3*NumBot[i][3];
	    dt[i] = dt[i]/(NumBot[i][1] + NumBot[i][2] + NumBot[i][3]);

	}

	//dt[i] = Number( document.getElementById('dt'+i).value );
	m[i] = Number( document.getElementById('m'+i).innerHTML );
	ph[i] = phiFlex(mn[i][2]);
	at[i] = rat1+rat2;

    }


    // Out Put

    var result = '';
    result += '<td>';
    result += 'M<sub>n</sub>';
    result += '</td><td>';
    result += ' [kN.m]';

    for( i = 1; i <= 5; i++ ){
	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}
	result += '<td>';
	result += mn[i][0].toFixed(0);
    }
    document.getElementById('mn').innerHTML = result;

    //

    result = '';
    result += '<td>';
    result += 'es, &phi;';
    result += '</td><td>';
    result += ' [%] ,-';

    for( i = 1; i <= 5; i++ ){
	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}
	result += '<td>';
	result += mn[i][2].toFixed(2);
	result += ' , ';
	result += ph[i].toFixed(2);
    }
    document.getElementById('es').innerHTML = result;

    //

    result = '';
    result += '<td>';
    result += '&phi; M<sub>n</sub> ';
    result += '</td><td>';
    result += '[kN.m]';

    for( i = 1; i <= 5; i++ ){
	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}
	result += '<td>';
	result += (ph[i]*mn[i][0]).toFixed(0);
    }
    document.getElementById('phimn').innerHTML = result;

    //

    result = '';
    result += '<td>';
    result += 'M<sub>u</sub>/(&phi; M<sub>n</sub>)';
    result += '</td><td>';
    result += '';

    for( i = 1; i <= 5; i++ ){
	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}
	result += '<td>';
	result += (m[i]/(ph[i]*mn[i][0])).toFixed(2);
	if( (m[i]/(ph[i]*mn[i][0])) < 1.0 ) {
	    result += ' <strong> - OK </strong>';
	}
	else{
	    result += ' <strong> - NG </strong>';
	}
    }

    document.getElementById('ratio').innerHTML = result;

    //

    result = '';
    result += '<td>';
    result += 'd';
    result += '</td><td>';
    result += 'mm';

    for( i = 1; i <= 5; i++ ){
	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}
	result += '<td>';
	result += (dt[i]).toFixed(0);
    }

    document.getElementById('dt').innerHTML = result;
    //

    //

    result = '';
    result += '<td>';
    result += 'a<sub>t</sub>, &rho;';
    result += '</td><td>';
    result += 'mm<sup>2</sup>, %';

    for( i = 1; i <= 5; i++ ){
	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}
	result += '<td>';
	result += (at[i]).toFixed(0);
	result += ', ';
	result += (at[i]/(bw*dt[i])*100).toFixed(2);
	if( (at[i]/(bw*dt[i])) > pmin ) {
	    result += ' <strong> - OK </strong>';
	}
	else{
	    result += ' <strong> - NG </strong>';
	}
    }

    document.getElementById('at').innerHTML = result;
    //

    result = '';

    result += '<p>';
    result += 'Remark;';
    result += '</p>';

    result += '<p>';
    result += 'p<sub>min1</sub> = 0.25 &radic; (fc) / fy =';
    result += (pmin1*100).toFixed(2);
    result += '&nbsp; %, ';
    result += '&nbsp;&nbsp; p<sub>min2</sub> = 1.4 / fy =';
    result += (pmin2*100).toFixed(2);
    result += '&nbsp; %, &nbsp; ->';
    result += '&nbsp;&nbsp; p<sub>min</sub> = Max[ p<sub>min1</sub>, p<sub>min2</sub> ] = ';
    result += (pmin*100).toFixed(2);
    result += '&nbsp; %';
    result += '</p>';


    document.getElementById('note').innerHTML = result;

    // Draw Section
    var coverSide = 40;
    var coverTop = 60;
    var coverBot = 60;

    var strIndex = Number(document.ShearForm.DiaShearName.selectedIndex);
    var diat =  Number(document.ShearForm.DiaShearName.value);

    for( i = 1; i <= 5; i++ ){
	document.getElementById('picture'+i).innerHTML = '';
    }

    for( i = 1; i <= 5; i++ ){
	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}
	result += '<td>';
	result += (m[i]/(ph[i]*mn[i][0])).toFixed(2);

	var nxtop   = NumTop[i][1];
	var nxtop2  = NumTop[i][2];
	var nxtop3  = NumTop[i][3];
	var sti     = IdTop[i][1];
	var stiTop2 = IdTop[i][2];
	var stiTop3 = IdTop[i][3];

	var nxbot   = NumBot[i][1];
	var nxbot2  = NumBot[i][2];
	var nxbot3  = NumBot[i][3];
	var stiBot  = IdBot[i][1];
	var stiBot2 = IdBot[i][2];
	var stiBot3 = IdBot[i][3];

	DrawSec2 (h,bw,coverSide,coverTop,coverBot
		  ,diat,strIndex
		  ,nxtop,nxtop2,nxtop3,sti,stiTop2,stiTop3
		  ,nxbot,nxbot2,nxbot3,stiBot,stiBot2,stiBot3
		  ,'picture'+i);
    }


    var d = h;

    for( i = 1; i <= 5; i++ ){
	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}
	if( d >= dt[i]){
	    d = dt[i];
	}
    }

    var av = 2.0* Vbar[avIndex].As + avStrNum * Vbar[avIndex2].As * ( avPitch / avPitch2 );
    var avmin1 = 0.062*Math.sqrt(fc)*bw*avPitch/fyt;
    var avmin2 = 0.35*bw*avPitch/fyt;
    var avmin = Math.max(avmin1,avmin2);

    var rhov1 = 0.062*Math.sqrt(fc)/fyt;
    var rhov2 = 0.35/fy;
    var rhov  = Math.max(rhov1,rhov2);

    var pv = av/(bw*avPitch);
    var taucn = 0.17*Math.sqrt(fc);
    var tausn = pv*fyt;
    var taun = taucn + tausn;

    result = '';

    result += '<table><tr>';
    result += '<td>';
    result += 'd  = ';
    result += '</td><td>';
    result += d.toFixed(0) + 'mm,';
    result += '</td><td>';
    result += '&nbsp; s  = ';
    result += '</td><td>';
    result += avPitch.toFixed(0) + 'mm,';
    result += '</td><td>';
    result += '&nbsp; A<sub>v</sub>  = ';
    result += '</td><td>';
    result += av.toFixed(0) + 'mm<sup>2</sup>,';
    result += '</td><td>';
    result += '&nbsp; &rho; = ';
    result += '</td><td>';
    result += (pv*100).toFixed(2) + '%';
    result += '</td>';
    result += '</tr></table>';

    var vu = Number( document.getElementById('vu').innerHTML);
    var tauu = vu*1000/(bw*d);
    var phiv = 0.75;

    result += '<table><tr>';
    result += '<td>';
    result += '&tau;<sub>u</sub>  = V<sub>u</sub> / ( bw d )  = ';
    result += '</td><td>';
    result += tauu.toFixed(2) + 'N/mm<sup>2</sup>,';
    result += '</td>';
    result += '</tr></table>';

    result += '<table><tr>';
    result += '<td>';
    result += '&tau;<sub>c,n</sub>  = 0.17 &radic;(fc) = ';
    result += '</td><td>';
    result += taucn.toFixed(2) + 'N/mm<sup>2</sup>,';
    result += '</td><td>';
    result += '&nbsp; &tau;<sub>s,n</sub> = &rho; fyt = ';
    result += '</td><td>';
    result += tausn.toFixed(2) + 'N/mm<sup>2</sup> ( < 0.66 &radic;(fc) =';
    result += '</td><td>';
    result += (0.66*Math.sqrt(fc)).toFixed(2) + 'N/mm<sup>2</sup> ),';
    result += '</td><td>';
    result += '&nbsp; &tau;<sub>n</sub> =';
    result += '</td><td>';
    result += taun.toFixed(2) + 'N/mm<sup>2</sup>';
    result += '</td>';
    result += '</tr></table>';

    result += '<table><tr>';
    result += '<td>';
    result += '-> &phi;(0.75) &tau;<sub>n</sub> =';
    result += '</td><td>';
    result += (phiv*taun).toFixed(2) + 'N/mm<sup>2</sup>';
    result += '</td><td>';
    result += '&nbsp; &tau;u / ( &phi; &tau;<sub>n</sub> ) =';
    result += '</td><td>';
    result += (tauu/(phiv*taun)).toFixed(2);
    result += '</td><td>';
    if( tauu < phiv*taun ){
	result += '-- <strong> OK </strong>';
    }
    else{
	result += '-- <strong> NG </strong>';
    }
    result += '</tr></table>';

    result += '<table><tr>';
    result += '<td>';
    result += '&rho;<sub>min1</sub> = 0.062 &radic;(fc) / fy = ';
    result += '</td><td>';
    result += (rhov1*100).toFixed(2) + '%,';
    result += '</td><td>';
    result += '&nbsp; &rho;<sub>min2</sub> = 0.35/fyt = ';
    result += '</td><td>';
    result += (rhov2*100).toFixed(2) + '%,';
    result += '</td><td>';
    result += '&nbsp; &rho;<sub>min</sub> =';
    result += '</td><td>';
    result += (rhov*100).toFixed(2) + '%';
    result += '</td><td>';
    if( rhov < pv ){
	result += '-- <strong> OK </strong>';
    }
    else{
	result += '-- <strong> NG </strong>';
    }

    result += '</td>';
    result += '</tr></table>';

    //result += '<h4> - Main RF. </h4>';
    document.getElementById('result2').innerHTML = result;
}

// Draw Beam Section Per Input Data
var canvas, ctx;
var scale, xscale, yscale, xcen, ycen;
function ST2obj(name,dia,As,x,y,fs) {
    this.name = name;
    this.dia = dia;
    this.As = As;
    this.x = x;
    this.y = y;
    this.fs = fs;
}
var Steel = new Array();
var rhog, Ag, Ast;

function DrawSec2 (h,b,coverSide,coverTop,coverBot
		   ,diat,strIndex
		   ,nxtop,nxtop2,nxtop3,sti,stiTop2,stiTop3
		   ,nxbot,nxbot2,nxbot3,stiBot,stiBot2,stiBot3
		   ,picture)
{

    var cover = coverSide;
    var bwtorsion = b - 2.0*coverSide - diat;
    var htorsion = h - coverTop - coverBot - diat;

    var result = '<canvas width=\"260\" height=\"235\" id=\"picCanvas'+picture+'\"></canvas>';
    document.getElementById(picture).innerHTML = result;

    var canvas = document.getElementById('picCanvas'+picture);
    ctx = canvas.getContext("2d");

    var xcen = canvas.width / 2 - 35;
    var ycen = canvas.height / 2 + 20;

    var xscale = (canvas.width-110)/b;
    var yscale = (canvas.height-80)/h;
    var scale = (xscale < yscale) ? xscale : yscale;

    // Draw Beam Section
    ctx.beginPath();
    ctx.rect(xcen-b/2*scale,ycen-h/2*scale,b*scale,h*scale);
    ctx.fillStyle = "rgb(242,244,255)";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Draw Beam Torsional Str.
    ctx.beginPath();
    ctx.rect(xcen-bwtorsion/2*scale,ycen-h/2*scale+coverTop*scale+Vbar[strIndex].dia/2*scale,bwtorsion*scale,htorsion*scale);
    ctx.lineWidth = diat*scale;
    ctx.strokeStyle = "blue";
    ctx.stroke();

    ctx.lineWidth = 1;

    // Draw Dimension Lines
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.font = "12pt sans-serif";
    ctx.textAlign = "center";

    // Draw Beam Dimensions
    ctx.beginPath();
    ctx.moveTo(xcen-b/2*scale,ycen-h/2*scale-10);
    ctx.lineTo(xcen-b/2*scale,ycen-h/2*scale-30);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xcen+b/2*scale,ycen-h/2*scale-10);
    ctx.lineTo(xcen+b/2*scale,ycen-h/2*scale-30);
    ctx.stroke();
    drawLineArrow2(xcen-b/2*scale,ycen-h/2*scale-20,xcen+b/2*scale,ycen-h/2*scale-20);
    ctx.fillText(b,xcen,ycen-h/2*scale-30);

    ctx.beginPath();
    ctx.moveTo(xcen+b/2*scale+10,ycen-h/2*scale);
    ctx.lineTo(xcen+b/2*scale+30,ycen-h/2*scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xcen+b/2*scale+10,ycen+h/2*scale);
    ctx.lineTo(xcen+b/2*scale+30,ycen+h/2*scale);
    ctx.stroke();

    drawLineArrow2(xcen+b/2*scale+20,ycen-h/2*scale,xcen+b/2*scale+20,ycen+h/2*scale);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(h,xcen+b/2*scale+30,ycen);

    // Create Steel Array & Check
    var xpos, ypos, spac;
    Ag = b*h;


    if (nxtop < 2 || nxbot <2 ) {
	alert('At leaset, 2 Layers needed');
	return;
    }
    //    spac = (b - 2*coverSide - nx*Rebar[sti].dia)/(nx-1);

    var ns = nxtop + nxtop2 + nxtop3 + nxbot + nxbot2 + nxbot3;

    var idx = 0;

    // Top Rebar, Layer 1
    spac = (b - 2*coverSide - 2*Vbar[strIndex].dia - Rebar[sti].dia)/(nxtop-1);
    for (var i = 0; i < nxtop; i++) {
	xpos = -b/2 + cover + Vbar[strIndex].dia + Rebar[sti].dia/2 + spac*i;
	ypos = h/2 - coverTop - Vbar[strIndex].dia - Rebar[sti].dia/2;
	Steel[idx++] = new ST2obj(Rebar[sti].name,Rebar[sti].dia,Rebar[sti].As,xpos,-ypos,0);
    }
    // Top Rebar, Layer 2
    if(nxtop2==1){
	spac = 0.0;
    }
    else{
	spac = (b - 2*coverSide - 2*Vbar[strIndex].dia - Rebar[sti].dia)/(nxtop2-1);
    }
    for (var i = 0; i < nxtop2; i++) {
	xpos = -b/2 + cover + Vbar[strIndex].dia + Rebar[sti].dia/2 + spac*i;
	ypos = h/2 - coverTop - Vbar[strIndex].dia - Rebar[sti].dia/2 - Rebar[stiTop2].dia*2.7;
	Steel[idx++] = new ST2obj(Rebar[sti].name,Rebar[stiTop2].dia,Rebar[stiTop2].As,xpos,-ypos,0);
    }
    // Top Rebar, Layer 3
    if(nxtop3==1){
	spac = 0.0;
    }
    else{
	spac = (b - 2*coverSide - 2*Vbar[strIndex].dia - Rebar[sti].dia)/(nxtop3-1);
    }
    for (var i = 0; i < nxtop3; i++) {
	xpos = -b/2 + cover + Vbar[strIndex].dia + Rebar[sti].dia/2 + spac*i;
	ypos = h/2 - coverTop - Vbar[strIndex].dia - Rebar[sti].dia/2 - 2*Rebar[stiTop2].dia*2.7;
	Steel[idx++] = new ST2obj(Rebar[sti].name,Rebar[stiTop3].dia,Rebar[stiTop3].As,xpos,-ypos,0);
    }

    // Bot Rebar, Layer 1
    spac = (b - 2*coverSide - 2*Vbar[strIndex].dia - Rebar[sti].dia)/(nxbot-1);
    for (var i = 0; i < nxbot; i++) {
	xpos = -b/2 + cover + Vbar[strIndex].dia + Rebar[sti].dia/2 + spac*i;
	ypos = h/2 - coverBot - Vbar[strIndex].dia - Rebar[sti].dia/2;
	Steel[idx++] = new ST2obj(Rebar[sti].name,Rebar[stiBot].dia,Rebar[stiBot].As,xpos,ypos,0);
    }

    // Bot Rebar, Layer 2
    if(nxbot2==1){
	spac = 0.0;
    }
    else{
	spac = (b - 2*coverSide - 2*Vbar[strIndex].dia - Rebar[sti].dia)/(nxbot2-1);
    }
    for (var i = 0; i < nxbot2; i++) {
	xpos = -b/2 + cover + Vbar[strIndex].dia + Rebar[sti].dia/2 + spac*i;
	ypos = h/2 - coverBot - Vbar[strIndex].dia - Rebar[sti].dia/2 - Rebar[stiBot2].dia*2.7;
	Steel[idx++] = new ST2obj(Rebar[sti].name,Rebar[stiBot2].dia,Rebar[stiBot2].As,xpos,ypos,0);
    }
    // Bot Rebar, Layer 3
    if(nxbot3==1){
	spac = 0.0;
    }
    else{
	spac = (b - 2*coverSide - 2*Vbar[strIndex].dia - Rebar[sti].dia)/(nxbot3-1);
    }
    for (var i = 0; i < nxbot3; i++) {
	xpos = -b/2 + cover + Vbar[strIndex].dia + Rebar[sti].dia/2 + spac*i;
	ypos = h/2 - coverBot - Vbar[strIndex].dia - Rebar[sti].dia/2 - 2*Rebar[stiBot2].dia*2.7;
	Steel[idx++] = new ST2obj(Rebar[sti].name,Rebar[stiBot3].dia,Rebar[stiBot3].As,xpos,ypos,0);
    }

    // Draw Rebar
    ctx.fillStyle = "red";
    for (var i = 0; i < ns; i++) {
	ctx.beginPath();
	ctx.arc(xcen+Steel[i].x*scale,ycen+Steel[i].y*scale,Steel[i].dia/2*scale,0,2*Math.PI,true);
	ctx.fill();
    }

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



//------------------------------------------------------------------
// Steel Rebar Data
//------------------------------------------------------------------

function STobj(name,dia,As,O) {
    this.name = name;
    this.dia = dia;
    this.As = As;
    this.O = O;
}

var Rebar = new Array();

Rebar[0] = new STobj("DB12",12,113,37.7);
Rebar[1] = new STobj("DB16",16,201,50.3);
Rebar[2] = new STobj("DB20",20,314,62.8);
Rebar[3] = new STobj("DB25",25,491,78.5);
Rebar[4] = new STobj("DB28",28,616,88.0);
Rebar[5] = new STobj("DB32",32,804,100.5);

var Vbar = new Array();

Vbar[0] = new STobj("RB9",9,63.6,28.2);
Vbar[1] = new STobj("DB10",10,78.5,31.4);
Vbar[2] = new STobj("DB12",12,113.0,37.7);



//------------------------------------------------------------------------
// Load Control
//------------------------------------------------------------------------

function LoadCon (i,type,Load,Model){

    var Num = document.getElementById('LoadNum').value;

    /*
     var i = 1;
     var type = 'type1';
     var Load = 'Load001';
     var Model = 'Model001';
     */

    var id = document.getElementById(type).selectedIndex;

    var result = '';

    ModelInit_1(i,type,Load,id);

    //Draw Model
    if( id==0 ){
	result += '<p><br></p><p><br></p>';
	document.getElementById(Model).innerHTML = result;
    }
    if( id == 1 ){
	result += '<p><img src="images/cmq-1.jpg" alt="Location" width="100%" /><br  /></p>';
	document.getElementById(Model).innerHTML = result;
    }
    if( id == 2 ){
	result += '<p><img src="images/cmq-2.jpg" alt="Location" width="100%" /><br  /></p>';
	document.getElementById(Model).innerHTML = result;
    }
    if( id == 3 ){
	result += '<p><img src="images/cmq-3.jpg" alt="Location" width="100%" /><br  /></p>';
	document.getElementById(Model).innerHTML = result;
    }
    if( id == 4 ){
	result += '<p><img src="images/cmq-4.jpg" alt="Location" width="100%" /><br  /></p>';
	document.getElementById(Model).innerHTML = result;
    }
    if( id == 5 ){
	result += '<p><img src="images/cmq-5.jpg" alt="Location" width="100%" /><br  /></p>';
	document.getElementById(Model).innerHTML = result;
    }
    if( id == 6 ){
	result += '<p><img src="images/cmq-6.jpg" alt="Location" width="100%" /><br  /></p>';
	document.getElementById(Model).innerHTML = result;
    }
    if( id == 7 ){
	result += '<p><img src="images/cmq-7.jpg" alt="Location" width="100%" /><br  /></p>';
	document.getElementById(Model).innerHTML = result;
    }

}
//------------------------------------------------------------------------
// Add Load Input -- Uniform
//------------------------------------------------------------------------
function ModelInit_1( i, type, Load, id ){

    var result = '';

    if( id ==0 ){
	document.getElementById(Load).innerHTML = result;
    }

    //
    if (id == 1 || id==2 || id==3 || id == 4 || id == 5 ) {
	var ly = 3.0;
	var gg = 5.0;
	var qq = 5.0;
	result += '<td>';
	result += '&omega;<sub>DL</sub> = ';
	result += '</td>';
	result += '<td>';
	result += '<input type="text" id="'+i+'num1" > kN/m<sup>2</sup> &nbsp;';
	result += '</td>';
	result += '<td>';
	result += '&omega;<sub>LL</sub> = ';
	result += '</td>';
	result += '<td>';
	result += '<input type="text" id="'+i+'num2" > kN/m<sup>2</sup>';
	result += '</td>';
	if (id == 1 || id==3 || id == 4 || id == 5 ) {
	    result += '<td>';
	    result += 'L<sub>y</sub> = ';
	    result += '</td>';
	    result += '<td>';
	    result += '<input type="text" id="'+i+'num3" > ';
	    result += '</td>';
	    result += '<td>';
	    result += 'm &nbsp;';
	    result += '</td>';
	}

	document.getElementById(Load).innerHTML = result;

	document.getElementById(i+'num1').value = gg.toFixed(3);
	document.getElementById(i+'num2').value = qq.toFixed(3);
	if (id == 1 || id==3 || id == 4 || id == 5 ) {
	    document.getElementById(i+'num3').value = ly.toFixed(3);
	}
    }

    if ( id==6 || id==7 ) {
	var span = document.getElementById('span').value;
	var la = span/2;
	var pg = 10.0;
	var pq = 10.0;
	result += '<td>';
	result += 'P<sub>DL</sub> = ';
	result += '</td>';
	result += '<td>';
	result += '<input type="text" id="'+i+'num1" > kN &nbsp;';
	result += '</td>';
	result += '<td>';
	result += 'P<sub>LL</sub> = ';
	result += '</td>';
	result += '<td>';
	result += '<input type="text" id="'+i+'num2" > kN ';
	result += '</td>';
	if (id == 7 ) {
	    result += '<td>';
	    result += 'L<sub>a</sub> = ';
	    result += '</td>';
	    result += '<td>';
	    result += '<input type="text" id="'+i+'num3" > ';
	    result += '</td>';
	    result += '<td>';
	    result += 'm &nbsp;';
	    result += '</td>';
	}

	document.getElementById(Load).innerHTML = result;

	document.getElementById(i+'num1').value = pg.toFixed(1);
	document.getElementById(i+'num2').value = pq.toFixed(1);
	if (id == 7 ) {
	    document.getElementById(i+'num3').value = la.toFixed(3);
	}
    }
}

//------------------------------------------------------------------------
// Draw Model
//------------------------------------------------------------------------
function DrawModel (Model,type) {

    var span = Number(document.getElementById('span').value);
    var id = document.getElementById(type).selectedIndex;
    var CanvasName = 'picCanvas2';
    //
    var a = Number( document.getElementById('num1').value );
    //
    var b = span;
    var h = a;
    //
    var result = '<canvas width=\"260\" height=\"235\" id=\"'+ CanvasName + '\"></canvas>';
    document.getElementById(Model).innerHTML = result;
    //
    var canvas = document.getElementById(CanvasName);
    ctx = canvas.getContext("2d");
    //
    var xcen = canvas.width / 2 - 35;
    var ycen = canvas.height / 2 - 20;
    //
    var xscale = (canvas.width-110)/b;
    //var yscale = (canvas.height-80)/h;
    var yscale = (canvas.height-80)/b;
    var scale = (xscale < yscale) ? xscale : yscale;

    // Draw Beam Section
    ctx.beginPath();
    ctx.rect(xcen-b/2*scale,ycen-h/2*scale,b*scale,h*scale);
    ctx.fillStyle = "rgb(242,244,255)";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Draw Beam Lines
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.font = "12pt sans-serif";
    ctx.textAlign = "center";
    ctx.lineWidth = (0.3)*scale;

    // Draw Beam
    ctx.beginPath();
    ctx.moveTo(xcen-b/2*scale,ycen+h/2*scale);
    ctx.lineTo(xcen+b/2*scale,ycen+h/2*scale);
    ctx.stroke();
    ctx.fill();

    ctx.lineWidth = 1;
    // Draw Beam Dimensions
    ctx.beginPath();
    ctx.moveTo(xcen-b/2*scale,ycen+h/2*scale+10);
    ctx.lineTo(xcen-b/2*scale,ycen+h/2*scale+30);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xcen+b/2*scale,ycen+h/2*scale+10);
    ctx.lineTo(xcen+b/2*scale,ycen+h/2*scale+30);
    ctx.stroke();
    drawLineArrow2(xcen-b/2*scale,ycen+h/2*scale+20,xcen+b/2*scale,ycen+h/2*scale+20);
    ctx.fillText(b.toFixed(3)+' m',xcen,ycen+h/2*scale+40);

    ctx.beginPath();
    ctx.moveTo(xcen+b/2*scale+10,ycen-h/2*scale);
    ctx.lineTo(xcen+b/2*scale+30,ycen-h/2*scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xcen+b/2*scale+10,ycen+h/2*scale);
    ctx.lineTo(xcen+b/2*scale+30,ycen+h/2*scale);
    ctx.stroke();

    drawLineArrow2(xcen+b/2*scale+20,ycen-h/2*scale,xcen+b/2*scale+20,ycen+h/2*scale);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(h.toFixed(2)+' m',xcen+b/2*scale+30,ycen);

}

//------------------------------------------------------------------------
// Stress Analaysis for Mo and C
//------------------------------------------------------------------------
function analysis(id,id2,span,p1,p2,p3){

    // Initial Parameter Set
    //------------------------------------------------------------------------

    var mmax1;
    var ca1,cb1;
    var ra1,rb1;
    var mmax2;
    var ca2,cb2;
    var ra2,rb2;

    // Additional Parameter
    var wdl,wll;
    var lam;
    var a,b;

    // Start Cal
    //------------------------------------------------------------------------

    if(id == 1){
	// Uniform 01
	wdl = p1*p3;
	wll = p2*p3;
	//
	mmax1 = wdl*Math.pow(span,2)/8.0;
	ca1 = wdl*Math.pow(span,2)/12.0;
	cb1 = ca1;
	ra1 = wdl*span/2.0;
	rb1 = ra1;
	//
	mmax2 = wll*Math.pow(span,2)/8.0;
	ca2 = wll*Math.pow(span,2)/12.0;
	cb2 = ca2;
	ra2 = wll*span/2.0;
	rb2 = ra2;
    }

    else if(id == 2){
	// Uniform 02
	wdl = p1*span/2.0;
	wll = p2*span/2.0;
	//
	mmax1 = wdl*Math.pow(span,2)/12.0;
	ca1 = wdl*Math.pow(span,2)*5.0/96.0;
	cb1 = ca1;
	ra1 = wdl*span/4.0;
	rb1 = ra1;
	//
	mmax2 = wll*Math.pow(span,2)/12.0;
	ca2 = wll*Math.pow(span,2)*5.0/96.0;
	cb2 = ca2;
	ra2 = wll*span/4.0;
	rb2 = ra2;
    }

    else if(id == 3){
	// Uniform 03
	lam = span/p3;
	//
	ca1   = ( Math.pow(lam,2)/24.0 - 1.0/48.0 + 1.0/(192*lam) ) * p1 * Math.pow(p3,3);
	cb1   = ca1;
	mmax1 = ( Math.pow(lam,2)/16.0 - 1.0/48.0 ) * p1 * Math.pow(p3,3);
	ra1   = ( lam/4.0 - 1.0/8.0 ) * p1 * Math.pow(p3,2);
	rb1   = ra1;
	//
	ca2   = ( Math.pow(lam,2)/24.0 - 1.0/48.0 + 1.0/(192*lam) ) * p2 * Math.pow(p3,3);
	cb2   = ca2;
	mmax2 = ( Math.pow(lam,2)/16.0 - 1.0/48.0 ) * p2 * Math.pow(p3,3);
	ra2   = ( lam/4.0 - 1.0/8.0 ) * p2 * Math.pow(p3,2);
	rb2   = ra2;
    }

    else if(id == 4){
	//
	lam = p3/(span/2);
	//
	ca1   = ( lam/8.0 + 5.0/192.0 ) * p1 * Math.pow(span/2.0,3);
	cb1   = ca1;
	mmax1 = ( lam/4.0 ) * p1 * Math.pow(span/2.0,3);
	ra1   = ( lam/4.0 + 1.0/8.0 ) * p1 * Math.pow( span/2.0, 2);
	rb1   = ra1;
	//
	ca2   = ( lam/8.0 + 5.0/192.0 ) * p2 * Math.pow(span/2.0,3);
	cb2   = ca2;
	mmax2 = ( lam/4.0 ) * p2 * Math.pow(span/2.0,3);
	ra2   = ( lam/4.0 + 1.0/8.0 ) * p2 * Math.pow( span/2.0, 2);
	rb2   = ra2;
    }

    else if(id == 5){
	//
	lam = p3/(span/3.0);
	//
	ca1   = ( lam/3.0 + 5.0/192.0 ) * p1 * Math.pow(span/3.0,3);
	cb1   = ca1;
	mmax1 = ( lam/2.0 + 1.0/24.0 ) * p1 * Math.pow(span/3.0,3);
	ra1   = ( lam/2.0 + 1.0/8.0 ) * p1 * Math.pow( span/3.0, 2);
	rb1   = ra1;
	//
	ca2   = ( lam/3.0 + 5.0/192.0 ) * p2 * Math.pow(span/3.0,3);
	cb2   = ca2;
	mmax2 = ( lam/2.0 + 1.0/24.0 ) * p2 * Math.pow(span/3.0,3);
	ra2   = ( lam/2.0 + 1.0/8.0 ) * p2 * Math.pow( span/3.0, 2);
	rb2   = ra2;
    }

    else if(id == 6){
	//
	mmax1 = p1*span/4.0;
	ca1 = p1*span/8.0;
	cb1 = ca1;
	ra1 = p1/2.0;
	rb1 = ra1;
	//
	mmax2 = p2*span/4.0;
	ca2 = p2*span/8.0;
	cb2 = ca1;
	ra2 = p2/2.0;
	rb2 = ra1;
    }

    else if(id == 7){
	//
	a = p3;
	b = span-a;
	//
	mmax1 = p1*a*b/span;
	ca1 = p1*a*Math.pow(b,2)/Math.pow(span,2);
	cb1 = p1*b*Math.pow(a,2)/Math.pow(span,2);
	ra1 = p1*b/span;
	rb1 = p1*a/span;
	//
	mmax2 = p2*a*b/span;
	ca2 = p2*a*Math.pow(b,2)/Math.pow(span,2);
	cb2 = p2*b*Math.pow(a,2)/Math.pow(span,2);
	ra2 = p2*b/span;
	rb2 = p2*a/span;
    }

    else{
	mmax1 =  0.0;
	ca1 =  0.0;
	cb1 =  0.0;
	ra1 =  0.0;
	rb1 =  0.0;
	mmax2 =  0.0;
	ca2 =  0.0;
	cb2 =  0.0;
	ra2 =  0.0;
	rb2 =  0.0;
    }

    // Multiled by 2.0 for Both side
    if( id2 == 0 ){
	mmax1 = mmax1*2.0;
	ca1 = ca1*2.0;
	cb1 = cb1*2.0;
	ra1 = ra1*2.0;
	rb1 = rb1*2.0;
	mmax2 = mmax2*2.0;
	ca2 = ca2*2.0;
	cb2 = cb2*2.0;
	ra2 = ra2*2.0;
	rb2 = rb2*2.0;
    }
    //    console.log( mmax1,ca1,cb1,ra1,rb1,mmax2,ca2,cb2,ra2,rb2);
    return [mmax1,ca1,cb1,ra1,rb1,mmax2,ca2,cb2,ra2,rb2];

}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function mnut(x, fc,  b,  dd,  bb,  rat1,
	      rat2,  rac1,  rac2,  srat,  sr,
	      st,  sigy1,  sigy2, code)
{
    /*
     console.log(x,  fc,  b,  dd,  bb,  rat1,
     rat2,  rac1,  rac2,  srat,  sr,
     st,  sigy1,  sigy2, code);
     */
    //************************************************************************/
    /* Declare of Variable*/
    /*
     Function mbut(x, fc, b, dd, bb, rat1, rat2, rac1, rac2, srat, sr, st, sigy1, sigy2, code)
     'ACI 梁耐力の算定(上端引張り）
     'fc       設計基準強度N/mm2
     'b        梁幅mm
     'dd       梁せいmm
     'bb       有効幅mm
     'rat1, rat2, rac1, rac2  主筋断面積mm2
     'srat     スラブ鉄筋
     'sr       スラブ筋の鉄筋重臣距離
     'st       スラブ厚mm
     'sigy1    主筋の降伏応力度N/mm2
     'sigy2    スラブ筋の降伏応力度N/mm2
     'code     鉄筋の並び(fappase)
     '
     'se 鉄筋のヤング係数N/mm2
     'eu コンクリートの圧縮ひずみ0.003
     'xn 中立軸mm
     'sep 鉄筋の許容ひずみ
     */

    var i,nn;
    /*  double b,fc;*/
    var k1,k2,k3,se,EPS,sep;
    /*double e;*/
    var dc1,dc2,dt1,dt2;
    /*  double xn;*/
    /*  double dd,bb,st;*/
    var rsc1,rsc2,rst1,rst2,srs,cc;
    var rsc1nxt,rsc2nxt,rst1nxt,rst2nxt,srsnxt,ccnxt;
    var xnnxt;
    var f,fnxt,xn2;
    /*double ssepu;*/
    /*  double rat1,rat2,rac1,rac2,srat;*/
    /*  double sr,sigy1,sigy2;*/
    var kk;
    /*  double mbut;*/
    /*  int code;*/
    /*  double x;*/

    /*  char wavename[60]; */

    /*円周率、重力加速度*/
    var pi,g;
    pi = 3.141592;
    g = 980.0;

    var mbut,eu,ssepu,xn;
    //************************************************************************/
    /* Calculation */

    //************************************************************************/
    /* Initial Condition and Preparation */

    if( fc <= 28.0 ){
	k1 = 0.85;
    }
    else if( 28.0 < fc < 56.0 ){
	k1 = 0.85 - 0.05 * (fc - 28.0) / 7.0;
    }
    else if( 56.0 <= fc ){
	k1 = 0.65;
    }
    k3 = 0.85;
    se = 2.05 * Math.pow( 10.0, 5.0);
    eu = 0.003;
    EPS = Math.pow(10.0,-8.0);
    sep = 0.02;

    /* Concede Covering*/

    dc1 = dtb2(code, x);
    dc2 = dc1 + 2.7 * rdd(x);
    dt1 = dd - dtu2(code, x);
    dt2 = dt1 - 2.7 * rdd(x);

    xn = dd / 4.0 + 50.0;
    k2 = 0.5 * k1;
    rsc1 = sig(se, eu, xn, dc1, sigy1);
    rsc2 = sig(se, eu, xn, dc2, sigy1);
    rst1 = sig(se, eu, xn, dt1, sigy1);
    rst2 = sig(se, eu, xn, dt2, sigy1);
    srs = sig(se, eu, xn, dd - sr, sigy2);
    cc = k1 * k3 * fc * b * xn;
    f = cc + rac1 * rsc1 + rac2 * rsc2 + rat1 * rst1 + rat2 * rst2 + srat * srs;
    xnnxt = 1.0;

    /*'歪1.0%の時のcodeデータ*/
    kk = 1;

    /*'収斂計算/Shouting*/
    nn = 10000;
    for( i = 1 ; i <= nn ; i++ ) {

	if ( kk == 2 ){
	    eu = -sep * xnnxt / (xnnxt - dt1);
	}

	rsc1nxt = sig(se, eu, xnnxt, dc1, sigy1);
	rsc2nxt = sig(se, eu, xnnxt, dc2, sigy1);
	rst1nxt = sig(se, eu, xnnxt, dt1, sigy1);
	rst2nxt = sig(se, eu, xnnxt, dt2, sigy1);
	srsnxt = sig(se, eu, xnnxt, dd - sr, sigy2);
	ccnxt = k1 * k3 * fc * b * xnnxt;

	fnxt = ccnxt + rac1 * rsc1nxt + rac2 * rsc2nxt + rat1 * rst1nxt + rat2 * rst2nxt + srat * srsnxt;

	xn2 = xnnxt;
	xnnxt = (fnxt * xn - f * xnnxt) / (fnxt - f);

	if ( xnnxt < 0.0){xnnxt = xn + 1.0;
			 }
	f = fnxt;
	xn = xn2;

	if ( Math.abs(fnxt) < EPS){
	    ssepu = -eu * (xn - dt1) / xn;
	    if(ssepu < sep + EPS ){
		//goto OUT;
		break;
	    }

	    kk = 2;

	    /*'再初期設定/Re-Setting Initial Condition */
	    xn = dd / 4.0 + 50.0;
	    eu = -sep * xn / (xn - dt1);
	    k2 = 0.5 * k1;
	    rsc1 = sig(se, eu, xn, dc1, sigy1);
	    rsc2 = sig(se, eu, xn, dc2, sigy1);
	    rst1 = sig(se, eu, xn, dt1, sigy1);
	    rst2 = sig(se, eu, xn, dt2, sigy1);
	    srs = sig(se, eu, xn, dd - sr, sigy2);
	    cc = k1 * k3 * fc * b * xn;
	    f = cc + rac1 * rsc1 + rac2 * rsc2 + rat1 * rst1 + rat2 * rst2 + srat * srs;
	    xnnxt = 1.0;
	}

    }

    // OUT:

    rsc1 = rsc1nxt;
    rsc2 = rsc2nxt;
    rst1 = rst1nxt;
    rst2 = rst2nxt;
    srs = srsnxt;
    cc = ccnxt;

    /*'曲げモーメントの算定 Calculation of bending moment*/
    mbut = cc * (dd / 2.0 - k2 * xn);
    mbut = mbut + rst1 * rat1 * (dd / 2.0 - dt1);
    mbut = mbut + rst2 * rat2 * (dd / 2.0 - dt2);
    mbut = mbut + rsc1 * rac1 * (dd / 2.0 - dc1);
    mbut = mbut + rsc2 * rac2 * (dd / 2.0 - dc2);
    mbut = mbut - srs * srat * (dd / 2.0 - sr);
    mbut = mbut / Math.pow(10.0,6.0);
    /*
     mbut(2) = xn;
     mbut(3) = -eu * (xn - dt1) / xn * 100;
     mbut(4) = eu * 100;
     */
    if(-eu * (xn - dt1) / xn > sep + EPS * 2 ){
	//printf("\n# **** Error **** ");
    }

    var x1 = mbut;
    var x2 = eu*100.0;
    var x3 = -eu * (xn - dt1) / xn * 100.0;
    var x4 = xn;

    return [x1,x2,x3,x4];

}

function mnuu( x,  fc,  b,  dd,  bb,  rat1,
	       rat2,  rac1,  rac2,  srat,  sr,
	       st,  sigy1,  sigy2, code)
{
    /*
     console.log(x,  fc,  b,  dd,  bb,  rat1,
     rat2,  rac1,  rac2,  srat,  sr,
     st,  sigy1,  sigy2, code);
     */
    //************************************************************************/
    /* Declare of Variable*/
    /*
     double mbuu(x, fc, b, dd, bb, rat1, rat2, rac1, rac2, srat, sr, st, sigy1, sigy2, code)
     'ACI 梁耐力の算定(下端引張り）
     'fc       設計基準強度N/mm2
     'b        梁幅mm
     'dd       梁せいmm
     'bb       有効幅mm
     'rat1, rat2, rac1, rac2  主筋断面積mm2
     'srat     スラブ鉄筋
     'sr       スラブ筋の鉄筋重臣距離
     'st       スラブ厚mm
     'sigy1    主筋の降伏応力度N/mm2
     'sigy2    スラブ筋の降伏応力度N/mm2
     'code     鉄筋の並び(fappase)
     '
     'se 鉄筋のヤング係数N/mm2
     'eu コンクリートの圧縮ひずみ0.003
     'xn 中立軸mm
     'sep 鉄筋の許容ひずみ
     Dim mb(1 To 4) As Double
     */

    var i,nn;
    var k1,k2,k3,se,EPS,sep;
    var dc1,dc2,dt1,dt2;
    /*  double dd,st,bb;*/
    var rsc1,rsc2,rst1,rst2,srs,cc;
    var rsc1nxt,rsc2nxt,rst1nxt,rst2nxt,srsnxt,ccnxt;
    var xnnxt;
    var f,fnxt,xn2;
    /*  double rat1,rat2,rac1,rac2,srat;*/
    /*  double sr,sigy1,sigy2; */
    var kk;

    /*円周率、重力加速度*/
    var pi,g;
    pi = 3.141592;
    g = 980.0;

    var mbuu,eu,ssepu,xn;
    //************************************************************************/
    /* Calculation */

    //************************************************************************/
    /* Initial Condition and Preparation */

    if( fc <= 28.0 ){
	k1 = 0.85;
    }
    else if( 28.0 < fc < 56.0 ){
	k1 = 0.85 - 0.05 * (fc - 28.0) / 7.0;
    }
    else if( 56.0 <= fc ){
	k1 = 0.65;
    }
    k3 = 0.85;
    se = 2.05 * Math.pow( 10.0, 5.0);
    eu = 0.003;
    EPS = Math.pow(10.0,-8.0);
    sep = 0.02;

    /* Concede Covering*/

    dc1 = dtu2(code, x);
    dc2 = dc1 + 2.7 * rdd(x);
    dt1 = dd - dtb2(code, x);
    dt2 = dt1 - 2.7 * rdd(x);


    xn = dd / 4.0 + 50.0;
    k2 = 0.5 * st / xn + 0.5 * k1 * b * (k1 * xn - st) / (b * (k1 * xn - st) + bb * st);
    if( k1 * xn < st ){
	k2 = 0.5 * k1;
    }
    else{
	rsc1 = sig(se, eu, xn, dc1, sigy1);
	rsc2 = sig(se, eu, xn, dc2, sigy1);
	rst1 = sig(se, eu, xn, dt1, sigy1);
	rst2 = sig(se, eu, xn, dt2, sigy1);
	srs = sig(se, eu, xn, sr, sigy2);
	cc = k3 * fc * (b * (k1 * xn - st) + bb * st);
    }
    if ( k1 * xn < st ){
	cc = k1 * k3 * fc * bb * xn;
    }
    f = cc + rac1 * rsc1 + rac2 * rsc2 + rat1 * rst1 + rat2 * rst2 + srat * srs;
    xnnxt = 1.0;

    /*'歪1.0%の時のcodeデータ*/
    kk = 1;

    /*'収斂計算/Shouting*/
    nn = 10000;
    for( i = 1 ; i <= nn ; i++ ) {

	if ( kk == 2 ){
	    eu = -sep * xnnxt / (xnnxt - dt1);
	}

	k2 = 0.5 * st / xnnxt + 0.5 * k1 * b * (k1 * xnnxt - st) / (b * (k1 * xnnxt - st) + bb * st);

	if ( k1 * xnnxt < st ){
	    k2 = 0.5 * k1;
	}

	rsc1nxt = sig(se, eu, xnnxt, dc1, sigy1);
	rsc2nxt = sig(se, eu, xnnxt, dc2, sigy1);
	rst1nxt = sig(se, eu, xnnxt, dt1, sigy1);
	rst2nxt = sig(se, eu, xnnxt, dt2, sigy1);
	srsnxt = sig(se, eu, xnnxt, sr, sigy2);
	ccnxt = k3 * fc * (b * (k1 * xnnxt - st) + bb * st);

	if ( k1 * xnnxt < st){
	    ccnxt = k1 * k3 * fc * bb * xnnxt;
	}

	/*'    If ccnxt < 0 Then ccnxt = 0#*/

	fnxt = ccnxt + rac1 * rsc1nxt + rac2 * rsc2nxt + rat1 * rst1nxt + rat2 * rst2nxt + srat * srsnxt;
	xn2 = xnnxt;
	xnnxt = (fnxt * xn - f * xnnxt) / (fnxt - f);
	/* 'If xnnxt < 0# Then xnnxt = xn + 1#*/
	f = fnxt;
	xn = xn2;

	/*LOG*/
	/*    printf("%d",kk);*/

	if ( Math.abs(fnxt) < EPS ){

	    ssepu = -eu * (xn - dt1) / xn;

	    if (ssepu < sep + EPS ){
		break;
	    }

	    kk = 2;
	    /*      printf("%d!!!Change",kk);*/

	    /*'再初期設定/Re-Setting Initial Condition */
	    xn = dd / 4.0 + 50.0;
	    k2 = 0.5 * st / xn + 0.5 * k1 * b * (k1 * xn - st) / (b * (k1 * xn - st) + bb * st);

	    if ( k1 * xn < st ){
		k2 = 0.5 * k1;
	    }

	    eu = -sep * xn / (xn - dt1);
	    rsc1 = sig(se, eu, xn, dc1, sigy1);
	    rsc2 = sig(se, eu, xn, dc2, sigy1);
	    rst1 = sig(se, eu, xn, dt1, sigy1);
	    rst2 = sig(se, eu, xn, dt2, sigy1);
	    srs = sig(se, eu, xn, sr, sigy2);
	    cc = k3 * fc * (b * (k1 * xn - st) + bb * st);

	    if ( k1 * xn < st){
		cc = k1 * k3 * fc * bb * xn;
	    }

	    f = cc + rac1 * rsc1 + rac2 * rsc2 + rat1 * rst1 + rat2 * rst2 + srat * srs;
	    xnnxt = 1.0;

	}
    }
    // OUT:

    rsc1 = rsc1nxt;
    rsc2 = rsc2nxt;
    rst1 = rst1nxt;
    rst2 = rst2nxt;
    srs = srsnxt;
    cc = ccnxt;

    /*'曲げモーメントの算定 Calculation of bending moment*/
    mbuu = cc * (dd / 2.0 - k2 * xn);
    mbuu = mbuu + rst1 * rat1 * (dd / 2.0 - dt1);
    mbuu = mbuu + rst2 * rat2 * (dd / 2.0 - dt2);
    mbuu = mbuu + rsc1 * rac1 * (dd / 2.0 - dc1);
    mbuu = mbuu + rsc2 * rac2 * (dd / 2.0 - dc2);
    mbuu = mbuu + srs * srat * (dd / 2.0 - sr);
    mbuu = mbuu / Math.pow( 10.0, 6.0);
    /*
     mb(2) = xn;
     mb(3) = -eu * (xn - dt1) / xn * 100;
     mb(4) = eu * 100;
     */
    if ( -eu * (xn - dt1) / xn > sep + EPS * 2 ){
	//printf("\n# **** Error **** ");
    }

    var x1 = mbuu;
    var x2 = eu*100.0;
    var x3 = -eu * (xn - dt1) / xn * 100.0;
    var x4 = xn;

    return [x1,x2,x3,x4];
}

/* ------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------ */
function sig(  se,  eu,  xn,  dt,  sigy)
{
    /*
     'se 鉄筋の応力度N/mm2
     'sigy 降伏応力度
     */
    var aaa;
    aaa = se * eu * (xn - dt) / xn;
    if (Math.abs( aaa ) > sigy ){
	if( aaa < 0.0 ){
	    aaa = -sigy;
	}
	if( aaa >= 0.0 ){
	    aaa = sigy;
	}
    }
    return aaa;
}

/**************************************************************************/

function dtu2( code, x)
/*
 引張重臣距離
 'from fappase
 'x:鉄筋呼径
 */
{
    var aaa;
    if (code == 16 ){
	aaa = 60.0 + 0.5 * rD(x);
    }
    if( code ==17 ){
	aaa = 60.0 + 1.5 * rD(x);
    }
    if( code == 18){
	aaa = 60.0 + 0.5 * rD(x);
    }
    if( code == 19){
	aaa = 60.0 + 1.5 * rD(x);
    }
    return aaa;
}

/**************************************************************************/

function dtb2( code, x)
/*
 '引張重臣距離
 'from fappase
 'x:鉄筋呼径
 */
{
    var aaa;
    if( code == 16 ){
	aaa = 60.0 + 0.5 * rD(x);
    }
    if( code == 17 ){
	aaa = 60.0 + 1.5 * rD(x);
    }
    if( code == 18 ){
	aaa = 60.0 + 1.5 * rD(x);
    }
    if( code == 19 ){
	aaa = 60.0 + 0.5 * rD(x);
    }
    return aaa;
}

function rD( x) /*'鉄筋の外径*/
{
    var aaa;
    /*  aaa = "未登録"*/
    aaa = x*1.2;
    if (x == 10){aaa = 11.0;}
    if (x == 13){aaa = 14.0;}
    if (x == 16){aaa = 18.0;}
    if (x == 19){aaa = 21.0;}
    if (x == 22){aaa = 25.0;}
    if (x == 25){aaa = 28.0;}
    if (x == 29){aaa = 33.0;}
    if (x == 32){aaa = 36.0;}
    if (x == 35){aaa = 40.0;}
    if (x == 38){aaa = 43.0;}
    if (x == 41){aaa = 46.0;}
    return aaa;
}

/**************************************************************************/

function rdd(x) /*'鉄筋の公称直径*/
{
    var aaa;
    aaa = x;
    /*rdd = "未登録"*/
    if (x == 10){aaa = 9.53;}
    if (x == 13){aaa = 12.7;}
    if (x == 16){aaa = 15.9;}
    if (x == 19){aaa = 19.1;}
    if (x == 22){aaa = 22.2;}
    if (x == 25){aaa = 25.4;}
    if (x == 29){aaa = 28.6;}
    if (x == 32){aaa = 31.8;}
    if (x == 35){aaa = 34.9;}
    if (x == 38){aaa = 38.1;}
    return aaa;
}

//------------------------------------------------------------------------
function phiFlex(es)
{
    if( es < 0.2 ){
	return 0.65;
    }
    if( 0.2 <= es && es < 0.5 ){
	return 0.65+(es/100-0.002)*(250/3);
    }
    else{
	return 0.90;
    }
}

//------------------------------------------------------------------------
function Self()
{
    var bw = document.getElementById('bw').value;
    var h = document.getElementById('h').value;

    var wSelf = (bw/1000)*(h/1000)*24;
    document.getElementById('wSelf').value = wSelf.toFixed(2);
}

//------------------------------------------------------------------------
function RebarSet()
{
    var i;
    var j;
    var numberTop,numberBot;
    var IdBeam = document.getElementById('Location').selectedIndex;

    var rebarId = document.getElementById('RebarStand').selectedIndex;

    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}

	for( j = 1; j <= 3; j++ ){
	    if(j==3){
		numberTop = 0;
		numberBot = 0;
	    }
	    if(j==2){
		numberTop = 3;
		numberBot = 3;
		if(i==1 || i==3 || i==4) {
		    numberBot = 0;
		}
		else{
		    numberTop = 0;
		}
	    }
	    if(j==1){
		numberTop = 3;
		numberBot = 3;
	    }
	    document.getElementById(j+'topNum'+i).value = numberTop;
	    document.getElementById(j+'topRebar'+i).selectedIndex = rebarId;
	    document.getElementById(j+'botNum'+i).value = numberBot;
	    document.getElementById(j+'botRebar'+i).selectedIndex = rebarId;
	}
    }

}

function OnButtonClick(){


    // Input

    var bw = Number(document.getElementById('bw').value);
    var h = Number(document.getElementById('h').value);
    var fc = Number(document.getElementById('fc').value);
    var fy = Number(document.getElementById('fy').value);
    var fyt = Number(document.getElementById('fyt').value);

    /*
     var coverSide = Number(document.getElementById('coverSide').value);
     var coverTop = Number(document.getElementById('coverTop').value);
     var coverBot = Number(document.getElementById('coverBot').value);
     */

    var coverSide = 40.0;
    var coverTop = 60.0;
    var coverBot = 40.0;


    // Load Condition
    var IdType = [];
    var IdSide = [];
    var type;
    var para = [];
    var force = [[]];
    //
    var Num = Number(document.getElementById('LoadNum').value);
    var span = Number( document.getElementById('span').value );
    //
    var i;

    var wSelf = Number( document.getElementById('wSelf').value );

    var mmax1 = wSelf*Math.pow(span,2)/8.0;
    var mmax2 = 0.0;
    var ca1   = wSelf*Math.pow(span,2)/12.0;
    var ca2   = 0.0;
    var cb1   = wSelf*Math.pow(span,2)/12.0;
    var cb2   = 0.0;
    var ra1   = wSelf*span/2.0;
    var rb1   = wSelf*span/2.0;
    var ra2   = 0.0;
    var rb2   = 0.0;

    for( i = 1; i < Num+1; i++ ){
	//
	//
	type = 'type' + i;
	IdType[i] = document.getElementById(type).selectedIndex;
	IdSide[i] = document.getElementById('both'+i).selectedIndex;
	para[1] = Number(document.getElementById(i+'num1').value);
	para[2] = Number(document.getElementById(i+'num2').value);
	//
	if ( IdType[i] == 2 || IdType[i] == 6 ){
	    para[3] = 'None';
	}
	else{
	    para[3] = Number(document.getElementById(i+'num3').value);
	}
	//
	force[i] = analysis( IdType[i], IdSide[i], span, para[1], para[2], para[3] );
	//
	mmax1 = mmax1 + force[i][0];
	ca1   = ca1   + force[i][1];
	cb1   = cb1   + force[i][2];
	ra1   = ra1   + force[i][3];
	rb1   = rb1   + force[i][4];
	//
	mmax2 = mmax2 + force[i][5];
	ca2   = ca2   + force[i][6];
	cb2   = cb2   + force[i][7];
	ra2   = ra2   + force[i][8];
	rb2   = rb2   + force[i][9];
	//
    }
    //    console.log( mmax1,ca1,cb1,ra1,rb1,mmax2,ca2,cb2,ra2,rb2);

    // Load Combination
    var FacDL = Number(document.getElementById('FacDL').value) ;
    //var FacSDL = Number(document.getElementById('FacSDL').value) ;
    var FacLL = Number(document.getElementById('FacLL').value) ;
    var IdBeam = document.getElementById('Location').selectedIndex;

    var Mext,Mint,Mcent;
    var Mint2,Mcent2;
    var Vint;

    Mext  = 0.6* (FacDL*ca1+FacLL*ca2);
    Vint =  Math.max( FacDL*ra1+FacLL*ra2, FacDL*rb1+FacLL*rb2 );

    if( IdBeam == 0) {
	Mcent = FacDL*mmax1+FacLL*mmax2 - 0.35*( FacDL*ca1+FacLL*ca2 );
	Mcent = Math.max( Mcent, FacDL*mmax1+FacLL*mmax2 - 0.35*( FacDL*cb1+FacLL*cb2 ) );
    }
    if( IdBeam == 1) {
	Mint   = 1.2/0.6*Mext;
	Mcent  = FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*ca1+FacLL*ca2 );
	Mcent  = Math.max( Mcent, FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*cb1+FacLL*cb2 ) );
	Mint2  = 1.0/0.6*Mext;
	Mcent2 = FacDL*mmax1+FacLL*mmax2 - 0.75*( FacDL*ca1+FacLL*ca2 );
	Mcent2 = Math.max( Mcent2, FacDL*mmax1+FacLL*mmax2 - 0.75*( FacDL*cb1+FacLL*cb2 ) );
	Vint   = 1.1* Vint;
    }
    if( IdBeam == 2) {
	Mint   = 1.3/0.6*Mext;
	Mcent  = FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*ca1+FacLL*ca2 );
	Mcent  = Math.max( Mcent, FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*cb1+FacLL*cb2 ) );
	Vint   = 1.1* Vint;
    }

    // DOM Output

    var result = '';


    //
    result += '<h4> - Analysis </h4>';

    result += '<table><tr>';
    result += '<td>';
    result += 'M<sub>0,DL</sub>\' = ';
    result += '</td><td id="mmax1">';
    result += mmax1.toFixed(0);
    result += '</td><td>';
    result += 'kN.m &nbsp;';
    result += '</td>';
    result += '<td>';
    result += 'M<sub>0,LL</sub>\' = ';
    result += '</td><td id="mmax2">';
    result += mmax2.toFixed(0);
    result += '</td><td>';
    result += 'kN.m &nbsp;';
    result += '</td>';
    result += '</tr></table>';
    //
    result += '<table><tr>';
    result += '<td>';
    result += 'C<sub>a,DL</sub>\' = ';
    result += '</td><td id="ca1">';
    result += ca1.toFixed(0);
    result += '</td><td>';
    result += 'kN.m &nbsp;';
    result += '</td>';
    result += '<td>';
    result += 'C<sub>a,LL</sub>\' = ';
    result += '</td><td id="ca2">';
    result += ca2.toFixed(0);
    result += '</td><td>';
    result += 'kN.m &nbsp;';
    result += '</td>';

    result += '<td>';
    result += 'C<sub>b,DL</sub>\' = ';
    result += '</td><td id="cb1">';
    result += cb1.toFixed(0);
    result += '</td><td>';
    result += 'kN.m &nbsp;';
    result += '</td>';
    result += '<td>';
    result += 'C<sub>b,LL</sub>\' = ';
    result += '</td><td id="cb2">';
    result += cb2.toFixed(0);
    result += '</td><td>';
    result += 'kN.m &nbsp;';
    result += '</td>';
    result += '</tr>';
    //
    result += '<tr>';
    result += '<td>';
    result += 'V<sub>a,DL</sub>\' = ';
    result += '</td><td id="ra1">';
    result += ra1.toFixed(0);
    result += '</td><td>';
    result += 'kN &nbsp;';
    result += '</td>';
    result += '<td>';
    result += 'V<sub>a,LL</sub>\' = ';
    result += '</td><td id="ra2">';
    result += ra2.toFixed(0);
    result += '</td><td>';
    result += 'kN &nbsp;';
    result += '</td>';

    result += '<td>';
    result += 'V<sub>b,DL</sub>\' = ';
    result += '</td><td id="rb1">';
    result += rb1.toFixed(0);
    result += '</td><td>';
    result += 'kN &nbsp;';
    result += '</td>';
    result += '<td>';
    result += 'V<sub>b,LL</sub>\' = ';
    result += '</td><td id="rb2">';
    result += rb2.toFixed(0);
    result += '</td><td>';
    result += 'kN &nbsp;';
    result += '</td>';
    result += '</tr></table>';

    //
    result += '<h4> - Bending Moment </h4>';
    //
    if( IdBeam == 0)  {
	result += '<p><img src="images/single.jpg" alt="Location" height="100px" /><br  /></p>';
    }
    else if( IdBeam == 1)  {
	result += '<p><img src="images/multi.jpg" alt="Location" height="100px" /><br  /></p>';
    }
    else{
	result += '<p><img src="images/twoSpan.jpg" alt="Location" height="100px" /><br  /></p>';
    }

    result += '<input type="button" value="Rebar Reset" onclick="RebarSet();">';
    result += '&nbsp; with';

    result += '<select id="RebarStand" >';
    result += '    <option value="12">DB12</option>';
    result += '    <option value="16">DB16</option>';
    result += '    <option value="20">DB20</option>';
    result += '    <option value="25" selected>DB25</option>';
    result += '    <option value="28">DB28</option>';
    result += '    <option value="32">DB32</option>';
    result += '</select> &nbsp;';


    result += '<input type="button" value="Cal" onclick="Cal();">';
    result += '&nbsp; (After Load Set) &nbsp;';
    result += '<input type="button" value="Re-Cal" onclick="ReCal();">';
    result += '&nbsp; without Beam Modeling &nbsp;';

    result += '<table><tr>';

    result += '<td>';
    result += 'Location';
    result += '</td><td>';
    result += '';
    result += '</td><td>';
    result += 'External &nbsp;';
    result += '</td><td>';
    result += 'Center &nbsp;&nbsp;';
    result += '</td><td>';

    if( IdBeam == 1 ){
	result += 'Internal/End &nbsp;';
	result += '</td><td>';
	result += 'Internal/Int.&nbsp;';
	result += '</td><td>';
	result += 'Center/Int &nbsp;';
    }
    if( IdBeam == 2 ){
	result += 'Internal &nbsp;';
    }

    //
    result += '</td>';
    result += '</tr><tr>';

    // Bending Moment Top

    result += '<td>';
    result += 'M<sub>u</sub> &nbsp;';
    result += '</td><td>';
    result += 'Top &nbsp;';
    result += '</td><td id="m1">';
    result += Mext.toFixed(0);
    result += '</td><td>';
    result += '-';

    if( IdBeam == 1)  {
        result += '</td><td id="m3">';
	result += Mint.toFixed(0);
	result += '</td><td id="m4">';
	result += Mint2.toFixed(0);
	result += '</td><td>';
	result += '-';
    }
    if( IdBeam == 2)  {
        result += '</td><td id="m3">';
	result += Mint.toFixed(0);
    }
    //
    result += '</td>';
    result += '</tr><tr>';

    // Bending Moment Bot

    result += '<td>';
    result += '[kN.m]';
    result += '</td><td>';
    result += 'Bot &nbsp;';
    result += '</td><td>';
    result += '-';
    result += '</td><td id="m2">';
    result += Mcent.toFixed(0);

    if( IdBeam == 1)  {
        result += '</td><td>';
	result += '-';
	result += '</td><td>';
	result += '-';
	result += '</td><td id="m5">';
	result += Mcent2.toFixed(0);
    }
    if( IdBeam == 2)  {
        result += '</td><td>';
	result += '-';
    }

    //    result += '</td>';

    //
    result += '</td>';
    result += '</tr><tr>';


    //
    // Main Rebar Top Layer-1
    result += '<td>';
    result += 'Main RF. &nbsp;';
    result += '</td><td>';
    result += 'Top Layer 1 &nbsp;';


    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}

	result += '</td><td>';

	result += '<input type="text" id="1topNum'+i+'" onChange="Cal();">-';
	result += '<select id="1topRebar'+i+'" onChange="Cal();">';
	result += '    <option value="12">DB12</option>';
	result += '    <option value="16">DB16</option>';
	result += '    <option value="20">DB20</option>';
	result += '    <option value="25">DB25</option>';
	result += '    <option value="28">DB28</option>';
	result += '    <option value="32">DB32</option>';
	result += '</select> &nbsp;';

    }
    result += '</td>';
    result += '</tr><tr>';

    //
    // Main Rebar Top Layer-2
    result += '<td>';
    result += '</td><td>';
    result += 'Top Layer 2 &nbsp;';


    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}

	result += '</td><td>';

	result += '<input type="text" id="2topNum'+i+'" onChange="Cal();">-';
	result += '<select id="2topRebar'+i+'" onChange="Cal();">';
	result += '    <option value="12">DB12</option>';
	result += '    <option value="16">DB16</option>';
	result += '    <option value="20">DB20</option>';
	result += '    <option value="25">DB25</option>';
	result += '    <option value="28">DB28</option>';
	result += '    <option value="32">DB32</option>';
	result += '</select> &nbsp;';

    }

    result += '</td>';
    result += '</tr><tr>';

    //
    // Main Rebar Top Layer-3
    result += '<td>';
    result += '</td><td>';
    result += 'Top Layer 3 &nbsp;';


    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}

	result += '</td><td>';

	result += '<input type="text" id="3topNum'+i+'" onChange="Cal();">-';
	result += '<select id="3topRebar'+i+'" onChange="Cal();">';
	result += '    <option value="12">DB12</option>';
	result += '    <option value="16">DB16</option>';
	result += '    <option value="20">DB20</option>';
	result += '    <option value="25">DB25</option>';
	result += '    <option value="28">DB28</option>';
	result += '    <option value="32">DB32</option>';
	result += '</select> &nbsp;';

    }

    result += '</td>';
    result += '</tr><tr>';


    //
    // Main Rebar Bot Layer 3
    result += '<td>';
    result += '';
    result += '</td><td>';
    result += 'Bot Layer 3 &nbsp;';

    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}

	result += '</td><td>';
	result += '<input type="text" id="3botNum'+i+'" onChange="Cal();">-';
	result += '<select id="3botRebar'+i+'" onChange="Cal();">';
	result += '    <option value="12">DB12</option>';
	result += '    <option value="16">DB16</option>';
	result += '    <option value="20">DB20</option>';
	result += '    <option value="25">DB25</option>';
	result += '    <option value="28">DB28</option>';
	result += '    <option value="32">DB32</option>';
	result += '</select> &nbsp;';

    }

    result += '</td>';
    result += '</tr><tr>';


    //
    // Main Rebar Bot Layer 2
    result += '<td>';
    result += '';
    result += '</td><td>';
    result += 'Bot Layer 2 &nbsp;';

    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}

	result += '</td><td>';
	result += '<input type="text" id="2botNum'+i+'" onChange="Cal();">-';
	result += '<select id="2botRebar'+i+'" onChange="Cal();">';
	result += '    <option value="12">DB12</option>';
	result += '    <option value="16">DB16</option>';
	result += '    <option value="20">DB20</option>';
	result += '    <option value="25">DB25</option>';
	result += '    <option value="28">DB28</option>';
	result += '    <option value="32">DB32</option>';
	result += '</select> &nbsp;';

    }

    result += '</td>';
    result += '</tr><tr>';


    //
    // Main Rebar Bot Layer 1
    result += '<td>';
    result += '';
    result += '</td><td>';
    result += 'Bot Layer 1 &nbsp;';

    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}

	result += '</td><td>';
	result += '<input type="text" id="1botNum'+i+'" onChange="Cal();">-';
	result += '<select id="1botRebar'+i+'" onChange="Cal();">';
	result += '    <option value="12">DB12</option>';
	result += '    <option value="16">DB16</option>';
	result += '    <option value="20">DB20</option>';
	result += '    <option value="25">DB25</option>';
	result += '    <option value="28">DB28</option>';
	result += '    <option value="32">DB32</option>';
	result += '</select> &nbsp;';

    }

    result += '</td>';
    result += '</tr><tr>';

    //
    // dt
    /*
     result += '<td>';
     result += 'dt';
     result += '</td><td>';
     result += 'mm';


     for( i = 1; i <= 5; i++ ){
     if( IdBeam==0 && i == 3 ){
     break;
     }
     if( IdBeam==2 && i == 4 ){
     break;
     }
     result += '</td><td>';
     result += '<input type="text" id="dt'+i+'" >';
     }

     result += '</td>';
     */

    //
    result += '</tr><tr id="mn">';
    result += '</tr><tr id="es">';
    result += '</tr><tr id="phimn">';
    result += '</tr><tr id="ratio">';
    result += '</tr><tr id="dt">';
    result += '</tr><tr id="at">';

    //
    result += '</tr></table>';
    result += '<p id="note"></p>';

    document.getElementById('result').innerHTML = result;
    //

    // for shear

    result = '';

    result += '<table><tr>';
    result += '<td>';
    result += 'V<sub>u</sub>  = ';
    result += '</td><td id="vu">';
    result += Vint.toFixed(0);
    result += '</td><td>';
    result += 'kN';
    result += '</td>';
    result += '</tr></table>';

    document.getElementById('shear').innerHTML = result;

    //
    //DrawSec();
    RebarSet();

}

//
//------------------------------------------------------------------------

function ReCal(){


    // Input

    var bw = Number(document.getElementById('bw').value);
    var h = Number(document.getElementById('h').value);
    var fc = Number(document.getElementById('fc').value);
    var fy = Number(document.getElementById('fy').value);
    var fyt = Number(document.getElementById('fyt').value);

    /*
     var coverSide = Number(document.getElementById('coverSide').value);
     var coverTop = Number(document.getElementById('coverTop').value);
     var coverBot = Number(document.getElementById('coverBot').value);
     */

    var coverSide = 40.0;
    var coverTop = 60.0;
    var coverBot = 40.0;


    // Load Condition
    var IdType = [];
    var IdSide = [];
    var type;
    var para = [];
    var force = [[]];
    //
    var Num = Number(document.getElementById('LoadNum').value);
    var span = Number( document.getElementById('span').value );
    //
    var i;

    var wSelf = Number( document.getElementById('wSelf').value );

    var mmax1 = wSelf*Math.pow(span,2)/8.0;
    var mmax2 = 0.0;
    var ca1   = wSelf*Math.pow(span,2)/12.0;
    var ca2   = 0.0;
    var cb1   = wSelf*Math.pow(span,2)/12.0;
    var cb2   = 0.0;
    var ra1   = wSelf*span/2.0;
    var rb1   = wSelf*span/2.0;
    var ra2   = 0.0;
    var rb2   = 0.0;

    for( i = 1; i < Num+1; i++ ){
	//
	//
	type = 'type' + i;
	IdType[i] = document.getElementById(type).selectedIndex;
	IdSide[i] = document.getElementById('both'+i).selectedIndex;
	para[1] = Number(document.getElementById(i+'num1').value);
	para[2] = Number(document.getElementById(i+'num2').value);
	//
	if ( IdType[i] == 2 || IdType[i] == 6 ){
	    para[3] = 'None';
	}
	else{
	    para[3] = Number(document.getElementById(i+'num3').value);
	}
	//
	force[i] = analysis( IdType[i], IdSide[i], span, para[1], para[2], para[3] );
	//
	mmax1 = mmax1 + force[i][0];
	ca1   = ca1   + force[i][1];
	cb1   = cb1   + force[i][2];
	ra1   = ra1   + force[i][3];
	rb1   = rb1   + force[i][4];
	//
	mmax2 = mmax2 + force[i][5];
	ca2   = ca2   + force[i][6];
	cb2   = cb2   + force[i][7];
	ra2   = ra2   + force[i][8];
	rb2   = rb2   + force[i][9];
	//
    }
    //    console.log( mmax1,ca1,cb1,ra1,rb1,mmax2,ca2,cb2,ra2,rb2);

    // Load Combination
    var FacDL = Number(document.getElementById('FacDL').value) ;
    //var FacSDL = Number(document.getElementById('FacSDL').value) ;
    var FacLL = Number(document.getElementById('FacLL').value) ;
    var IdBeam = document.getElementById('Location').selectedIndex;

    var Mext,Mint,Mcent;
    var Mint2,Mcent2;
    var Vint;

    Mext  = 0.6* (FacDL*ca1+FacLL*ca2);
    Vint =  Math.max( FacDL*ra1+FacLL*ra2, FacDL*rb1+FacLL*rb2 );

    if( IdBeam == 0) {
	Mcent = FacDL*mmax1+FacLL*mmax2 - 0.35*( FacDL*ca1+FacLL*ca2 );
	Mcent = Math.max( Mcent, FacDL*mmax1+FacLL*mmax2 - 0.35*( FacDL*cb1+FacLL*cb2 ) );
    }
    if( IdBeam == 1) {
	Mint   = 1.2/0.6*Mext;
	Mcent  = FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*ca1+FacLL*ca2 );
	Mcent  = Math.max( Mcent, FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*cb1+FacLL*cb2 ) );
	Mint2  = 1.0/0.6*Mext;
	Mcent2 = FacDL*mmax1+FacLL*mmax2 - 0.75*( FacDL*ca1+FacLL*ca2 );
	Mcent2 = Math.max( Mcent2, FacDL*mmax1+FacLL*mmax2 - 0.75*( FacDL*cb1+FacLL*cb2 ) );
	Vint   = 1.1* Vint;
    }
    if( IdBeam == 2) {
	Mint   = 1.3/0.6*Mext;
	Mcent  = FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*ca1+FacLL*ca2 );
	Mcent  = Math.max( Mcent, FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*cb1+FacLL*cb2 ) );
	Vint   = 1.1* Vint;
    }

    // DOM Output

    var result = '';
    //
    document.getElementById('mmax1').innerHTML = mmax1.toFixed(0);
    document.getElementById('mmax2').innerHTML = mmax2.toFixed(0);
    //
    document.getElementById('ca1').innerHTML = ca1.toFixed(0);
    document.getElementById('ca2').innerHTML = ca2.toFixed(0);
    //
    document.getElementById('cb1').innerHTML = cb1.toFixed(0);
    document.getElementById('cb2').innerHTML = cb2.toFixed(0);
    //
    document.getElementById('ra1').innerHTML = ra1.toFixed(0);
    document.getElementById('ra2').innerHTML = ra2.toFixed(0);
    //
    document.getElementById('rb1').innerHTML = rb1.toFixed(0);
    document.getElementById('rb2').innerHTML = rb2.toFixed(0);

    // Bending Moment Top

    document.getElementById('m1').innerHTML = Mext.toFixed(0);

    if( IdBeam == 1)  {
        document.getElementById('m3').innerHTML = Mint.toFixed(0);
	document.getElementById('m4').innerHTML = Mint2.toFixed(0);
    }
    if( IdBeam == 2)  {
	document.getElementById('m3').innerHTML = Mint.toFixed(0);
    }
    //

    // Bending Moment Bot

    document.getElementById('m2').innerHTML = Mcent.toFixed(0);

    if( IdBeam == 1)  {
	document.getElementById('m5').innerHTML = Mcent2.toFixed(0);
    }
    if( IdBeam == 2)  {
    }

    // for shear

    result = '';
    result += '<table><tr>';
    result += '<td>';
    result += 'V<sub>u</sub>  = ';
    result += '</td><td id="vu">';
    result += Vint.toFixed(0);
    result += '</td><td>';
    result += 'kN';
    result += '</td>';
    result += '</tr></table>';

    document.getElementById('shear').innerHTML = result;

    //
    //Cal();
}


////////////////////////////////////////////////////////////////////////
// For Deflection
////////////////////////////////////////////////////////////////////////

function DefCheck(){


    // Input

    var bw = Number(document.getElementById('bw').value);
    var h = Number(document.getElementById('h').value);
    var fc = Number(document.getElementById('fc').value);
    var fy = Number(document.getElementById('fy').value);
    var fyt = Number(document.getElementById('fyt').value);

    var coverSide = 40.0;
    var coverTop = 60.0;
    var coverBot = 40.0;

    // Load Condition
    var IdType = [];
    var IdSide = [];
    var type;
    var para = [];
    var force = [[]];
    //
    var Num = Number(document.getElementById('LoadNum').value);
    var span = Number( document.getElementById('span').value );
    //
    var i;

    var wSelf = Number( document.getElementById('wSelf').value );

    var mmax1 = wSelf*Math.pow(span,2)/8.0;
    var mmax2 = 0.0;
    var ca1   = wSelf*Math.pow(span,2)/12.0;
    var ca2   = 0.0;
    var cb1   = wSelf*Math.pow(span,2)/12.0;
    var cb2   = 0.0;
    var ra1   = wSelf*span/2.0;
    var rb1   = wSelf*span/2.0;
    var ra2   = 0.0;
    var rb2   = 0.0;

    for( i = 1; i < Num+1; i++ ){
	//
	//
	type = 'type' + i;
	IdType[i] = document.getElementById(type).selectedIndex;
	IdSide[i] = document.getElementById('both'+i).selectedIndex;
	para[1] = Number(document.getElementById(i+'num1').value);
	para[2] = Number(document.getElementById(i+'num2').value);
	//
	if ( IdType[i] == 2 || IdType[i] == 6 ){
	    para[3] = 'None';
	}
	else{
	    para[3] = Number(document.getElementById(i+'num3').value);
	}
	//
	force[i] = analysis( IdType[i], IdSide[i], span, para[1], para[2], para[3] );
	//
	mmax1 = mmax1 + force[i][0];
	ca1   = ca1   + force[i][1];
	cb1   = cb1   + force[i][2];
	ra1   = ra1   + force[i][3];
	rb1   = rb1   + force[i][4];
	//
	mmax2 = mmax2 + force[i][5];
	ca2   = ca2   + force[i][6];
	cb2   = cb2   + force[i][7];
	ra2   = ra2   + force[i][8];
	rb2   = rb2   + force[i][9];
	//
    }
    // Load Combination
    var FacDL = Number(document.getElementById('FacDL2').value) ;
    //var FacSDL = Number(document.getElementById('FacSDL').value) ;
    var FacLL = Number(document.getElementById('FacLL2').value) ;
    var IdBeam = document.getElementById('Location').selectedIndex;

    var Mext,Mint,Mcent;
    var Mint2,Mcent2;
    var Vint;

    Mext  = 0.6* (FacDL*ca1+FacLL*ca2);
    Vint =  Math.max( FacDL*ra1+FacLL*ra2, FacDL*rb1+FacLL*rb2 );

    if( IdBeam == 0) {
	Mcent = FacDL*mmax1+FacLL*mmax2 - 0.35*( FacDL*ca1+FacLL*ca2 );
	Mcent = Math.max( Mcent, FacDL*mmax1+FacLL*mmax2 - 0.35*( FacDL*cb1+FacLL*cb2 ) );
    }
    if( IdBeam == 1) {
	Mint   = 1.2/0.6*Mext;
	Mcent  = FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*ca1+FacLL*ca2 );
	Mcent  = Math.max( Mcent, FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*cb1+FacLL*cb2 ) );
	Mint2  = 1.0/0.6*Mext;
	Mcent2 = FacDL*mmax1+FacLL*mmax2 - 0.75*( FacDL*ca1+FacLL*ca2 );
	Mcent2 = Math.max( Mcent2, FacDL*mmax1+FacLL*mmax2 - 0.75*( FacDL*cb1+FacLL*cb2 ) );
	Vint   = 1.1* Vint;
    }
    if( IdBeam == 2) {
	Mint   = 1.3/0.6*Mext;
	Mcent  = FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*ca1+FacLL*ca2 );
	Mcent  = Math.max( Mcent, FacDL*mmax1+FacLL*mmax2 - 0.65*( FacDL*cb1+FacLL*cb2 ) );
	Vint   = 1.1* Vint;
    }

    // Crack Moment

    var i,j;

    var NumTop = new Array(5);
    var IdTop  = new Array(5);
    var NumBot = new Array(5);
    var IdBot  = new Array(5);

    for( i = 1; i <= 5; i++ ){
	NumTop[i] = new Array(5);
	IdTop[i] = new Array(5);
	NumBot[i] = new Array(5);
	IdBot[i] = new Array(5);
	for( j = 1; j <= 5; j++ ){
	    NumTop[i][j]=0;
	    IdTop[i][j]=0;
	    NumBot[i][j]=0;
	    IdBot[i][j]=0;
	}
    }

    var dt = [];

    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}
	for( j = 1; j <= 3; j++ ){
	    NumTop[i][j] = Number( document.getElementById(j+'topNum'+i).value);
	    IdTop[i][j]  = document.getElementById(j+'topRebar'+i).selectedIndex;
	    NumBot[i][j] = Number( document.getElementById(j+'botNum'+i).value);
	    IdBot[i][j]  = document.getElementById(j+'botRebar'+i).selectedIndex;
	}

    }

    // Preparation
    // Section Area.
    var rat1,rat2,rac1,rac2;
    var code = 17;
    var at = [];
    var ac = [];

    // Cal

    var dt1,dt2,dt3;

    for( i = 1; i <= 5; i++ ){

	if( IdBeam==0 && i == 3 ){
	    break;
	}
	if( IdBeam==2 && i == 4 ){
	    break;
	}

	// for negative
	if( i== 1 || i ==3 || i==4 ){
	    rat1 = NumTop[i][1] * Rebar[IdTop[i][1]].As;
	    rat2 = NumTop[i][2] * Rebar[IdTop[i][2]].As;
	    rat2 = rat2 + NumTop[i][3] * Rebar[IdTop[i][3]].As;
	    rac1 = NumBot[i][1] * Rebar[IdBot[i][1]].As;
	    rac2 = NumBot[i][2] * Rebar[IdBot[i][2]].As;
	    rac2 = rac2 + NumBot[i][3] * Rebar[IdBot[i][3]].As;
	    dt1 = h - dtu2( code, Rebar[IdTop[i][1]].dia );
	    dt2 = dt1 - 2.7*Rebar[IdTop[i][1]].dia;
	    dt3 = dt2 - 2.7*Rebar[IdTop[i][1]].dia;
	    dt[i] = dt1*NumTop[i][1] + dt2*NumTop[i][2] + dt3*NumTop[i][3];
	    dt[i] = dt[i]/(NumTop[i][1] + NumTop[i][2] + NumTop[i][3]);

	}

	// for positive
	if( i ==2 || i==5 ){
	    rac1 = NumTop[i][1] * Rebar[IdTop[i][1]].As;
	    rac2 = NumTop[i][2] * Rebar[IdTop[i][2]].As;
	    rac2 = rac2 + NumTop[i][3] * Rebar[IdTop[i][3]].As;
	    rat1 = NumBot[i][1] * Rebar[IdBot[i][1]].As;
	    rat2 = NumBot[i][2] * Rebar[IdBot[i][2]].As;
	    rat2 = rat2 + NumBot[i][3] * Rebar[IdBot[i][3]].As;
	    dt1 = h - dtb2( code, Rebar[IdBot[i][1]].dia );
	    dt2 = dt1 - 2.7*Rebar[IdBot[i][1]].dia;
	    dt3 = dt2 - 2.7*Rebar[IdBot[i][1]].dia;
	    dt[i] = dt1*NumBot[i][1] + dt2*NumBot[i][2] + dt3*NumBot[i][3];
	    dt[i] = dt[i]/(NumBot[i][1] + NumBot[i][2] + NumBot[i][3]);

	}

	at[i] = rat1+rat2;
	ac[i] = rac1+rac2;

    }

    var fr = 0.62 * Math.sqrt(fc);
    var Ig = bw*Math.pow(h,3)/12.0;
    var ec = 4700*Math.sqrt(fc);
    var es = 2.05*Math.pow(10,5);
    var n  = es/ec;
    var mcr = fr*Ig/(h/2);
    mcr = mcr/Math.pow(10,6);

    var thick = Number( document.getElementById('thick').value );
    var clearA = Number( document.getElementById('a0').value );
    //
    var idType = document.getElementById('defBoth').selectedIndex;
    var bee = Number(be( idType, bw, span*1000, thick, clearA*1000));
    var Igbar = phai(bw, bee, dt[2], thick)*Ig;

    var mcrC = tMcr( bee,bw,h,thick,fc )

    /*
    var Icrb  = icr(0,
		    bw,h,dt[2],(h-dt[2]),bee,thick,
		    at[2],ac[2],n);
    */
    var Icrb  = icr(1,
		    bw,h,dt[2],(h-dt[2]),bee,thick,
		    at[2],ac[2],n);

    var Ie = Math.pow(mcrC/Mcent,3)*Igbar + (1-Math.pow(mcrC/Mcent,3))*Icrb;


    var Icrb2,Ie2;
    var Ief;
    if( IdBeam == 0)  {
	Icrb2  = icr(0,
		     bw,h,dt[1],(h-dt[1]),bw,thick,
		     at[1],ac[1],n);
	Ie2 = Math.pow(mcr/Mext,3)*Ig + (1-Math.pow(mcr/Mext,3))*Icrb2;
	Ief = 0.5*Ie+0.5*Ie2;
    }
    else{
	Icrb2  = icr(0,
		     bw,h,dt[3],(h-dt[3]),bw,thick,
		     at[3],ac[3],n);
	Ie2 = Math.pow(mcr/Mint,3)*Ig + (1-Math.pow(mcr/Mint,3))*Icrb2;
	Ief = 0.85*Ie+0.15*Ie2;
    }

    // Calculation of deflection

    var rho = Number(ac[2]/(bw*dt[2]));
    var lam = 2.0/(1.0+50*rho);

    var d=[];
    dmaxDL = defSimple( wSelf, span, ec, Ief);
    dmaxLL = 0;

    for( i = 1; i < Num+1; i++ ){
	//
	//
	type = 'type' + i;
	IdType[i] = document.getElementById(type).selectedIndex;
	IdSide[i] = document.getElementById('both'+i).selectedIndex;
	para[1] = Number(document.getElementById(i+'num1').value);
	para[2] = Number(document.getElementById(i+'num2').value);
	//
	if ( IdType[i] == 2 || IdType[i] == 6 ){
	    para[3] = 'None';
	}
	else{
	    para[3] = Number(document.getElementById(i+'num3').value);
	}
	//
	d = defMax( IdType[i], IdSide[i], span, para[1], para[2], para[3], ec, Ief );
	//
	dmaxDL = dmaxDL + d[0];
	dmaxLL = dmaxLL + d[1];
	//
    }

    var dLT = dmaxLL + FacDL*lam*dmaxDL + FacLL*lam*dmaxLL;

    // DOM Output

    var result = '';

    //
    result += '<table><body><tr><td>';
    result += 'E<sub>c</sub> = 4700 &radic;(fc) = ';
    result += ec.toFixed(0);
    result += 'N/mm<sup>2</sup>, &nbsp;';
    result += 'n = E<sub>s</sub> / E<sub>c</sub> = ';
    result += n.toFixed(2);
    result += '-, &nbsp;';
    result += 'f<sub>r</sub> = 0.62 &radic;(fc) = ';
    result += fr.toFixed(2);
    result += 'N/mm<sup>2</sup>, &nbsp;';
    result += '</td></tr></tbody></table>';
    //
    //
    result += '<p>';
    result += '<h4>';
    result += '-- M<sub>cr</sub>/M<sub>a</sub>';
    result += '</h4>';
    result += '</p>';
    //

    result += '<table><tr>';

    result += '<td>';
    result += 'Location';
    result += '</td><td>';
    result += '';
    result += '</td><td>';
    result += 'External &nbsp;';
    result += '</td><td>';
    result += 'Center &nbsp;&nbsp;';
    result += '</td><td>';

    if( IdBeam == 1 ){
	result += 'Internal/End &nbsp;';
	result += '</td><td>';
	result += 'Internal/Int.&nbsp;';
	result += '</td><td>';
	result += 'Center/Int &nbsp;';
    }
    if( IdBeam == 2 ){
	result += 'Internal &nbsp;';
    }

    //
    result += '</td>';
    result += '</tr><tr>';

    // Bending Moment Top

    result += '<td>';
    result += 'M<sub>a</sub> &nbsp;';
    result += '</td><td>';
    result += 'Top &nbsp;';
    result += '</td><td id="m1">';
    result += Mext.toFixed(0);
    result += '</td><td>';
    result += '-';

    if( IdBeam == 1)  {
        result += '</td><td id="m3">';
	result += Mint.toFixed(0);
	result += '</td><td id="m4">';
	result += Mint2.toFixed(0);
	result += '</td><td>';
	result += '-';
    }
    if( IdBeam == 2)  {
        result += '</td><td id="m3">';
	result += Mint.toFixed(0);
    }
    //
    result += '</td>';
    result += '</tr><tr>';

    // Bending Moment Bot

    result += '<td>';
    result += '[kN.m]';
    result += '</td><td>';
    result += 'Bot &nbsp;';
    result += '</td><td>';
    result += '-';
    result += '</td><td id="m2">';
    result += Mcent.toFixed(0);

    if( IdBeam == 1)  {
        result += '</td><td>';
	result += '-';
	result += '</td><td>';
	result += '-';
	result += '</td><td id="m5">';
	result += Mcent2.toFixed(0);
    }
    if( IdBeam == 2)  {
        result += '</td><td>';
	result += Mint.toFixed(0);
    }

    //
    result += '</td>';
    result += '</tr><tr>';

    // Mcr/Ma

    result += '<td>';
    result += 'M<sub>cr</sub>/M<sub>a</sub>';
    result += '</td><td>';
    result += '';
    result += '</td><td>';
    result += (mcr/Mext).toFixed(2);
    result += '</td><td>';
    result += (mcrC/Mcent).toFixed(2);

    if( IdBeam == 1)  {
        result += '</td><td>';
	result += (mcr/Mint).toFixed(2);
	result += '</td><td>';
	result += (mcr/Mint2).toFixed(2);
	result += '</td><td id="m5">';
	result += (mcrC/Mcent2).toFixed(2);
    }
    if( IdBeam == 2)  {
        result += '</td><td>';
	result += (mcr/Mint).toFixed(2);
    }

    /*
    result += '</tr><tr id="mcr">';
    result += '</tr><tr id="icr">';
    result += '</tr><tr id="ie">';
    */

    //
    result += '</tr></table>';

    //

    result += '<p>';
    result += '<h4>';
    result += '-- Midspan section';
    result += '</h4>';
    result += '</p>';
    //
    result += '<table><body><tr><td>';
    result += 'I<sub>g</sub> = ';
    result += Igbar.toExponential(3);
    result += 'mm<sup>4</sup>, &nbsp;';
    result += 'M<sub>cr</sub> = ';
    result += mcrC.toFixed(0);
    result += 'kN.m, &nbsp;';
    result += '</td></tr></tbody></table>';
    //
    result += '<table><body><tr><td>';
    result += 'Effective Beam Width, be = ';
    result += bee.toFixed(0);
    result += 'mm, &nbsp;';
    result += 'Ig(T-Shape)/Ig(Rec.) = ';
    result += (Igbar/Ig).toFixed(2);
    result += '-, &nbsp;';
    result += 'Icr/Ig(T) = ';
    result += (Icrb/Igbar).toFixed(2);
    result += '-, &nbsp;';
    result += '</td></tr></tbody></table>';
    //
    result += '<table><body><tr><td>';
    result += 'Ie = (M<sub>cr</sub>/M<sub>a</sub>)<sup>3</sup>';
    result += 'I<sub>g</sub> + [ 1 - (M<sub>cr</sub>/M<sub>a</sub>)<sup>3</sup> ]';
    result += 'I<sub>cr</sub> = ';
    result += Ie.toExponential(3);
    result += 'mm<sup>4</sup>, &nbsp;';
    result += 'Ie/Ig(Rec.) = ';
    result += (Ie/Ig).toFixed(2);
    result += '-, &nbsp;';
    result += 'Ie/Ig = ';
    result += (Ie/Igbar).toFixed(2);
    result += '-, &nbsp;';
    result += '</td></tr></tbody></table>';

    //
    result += '<p>';
    result += '<h4>';
    result += '-- Support Section';
    result += '</h4>';
    result += '</p>';

    //
    result += '<table><body><tr><td>';
    result += 'I<sub>g</sub> = ';
    result += Ig.toExponential(3);
    result += 'mm<sup>4</sup>, &nbsp;';
    result += 'M<sub>cr</sub> = ';
    result += mcr.toFixed(0);
    result += 'kN.m, &nbsp;';
    result += 'Icr/Ig = ';
    result += (Icrb2/Ig).toFixed(2);
    result += '-, &nbsp;';
    result += '</td></tr></tbody></table>';
    //
    result += '<table><body><tr><td>';
    result += 'Ie = (M<sub>cr</sub>/M<sub>a</sub>)<sup>3</sup>';
    result += 'I<sub>g</sub> + [ 1 - (M<sub>cr</sub>/M<sub>a</sub>)<sup>3</sup> ]';
    result += 'I<sub>cr</sub> = '
    result += Ie2.toExponential(3);
    result += 'mm<sup>4</sup>, &nbsp;';
    result += 'Ie/Ig(Rec.) = ';
    result += (Ie2/Ig).toFixed(2);
    result += '-, &nbsp;';
    result += '</td></tr></tbody></table>';


    //
    result += '<p>';
    result += '<h4>';
    result += '-- Average effective I<sub>e</sub>, Long term multiplier due to creep and shrinkage &lambda;';
    result += '</h4>';
    result += '</p>';
    //

    result += '<table><tr>';
    result += '<td>';

    if( IdBeam == 0)  {
	result += 'I<sub>e</sub> = 0.5 I<sub>e(m)</sub> + 0.25 ( I<sub>e(1)</sub> + I<sub>e,2</sub> ) = ';
    }
    else if( IdBeam == 1)  {
	result += 'I<sub>e</sub> = 0.85 I<sub>e(m)</sub> + 0.15 ( I<sub>e(1)</sub> ) = ';
    }
    else{
	result += 'I<sub>e</sub> = 0.85 I<sub>e(m)</sub> + 0.15 ( I<sub>e(1)</sub> ) = ';
    }

    result += '</td><td>'
    result += Ief.toExponential(3);
    result += ' mm<sup>4</sup>, (Ie/Ig(rec)='
    result += (Ief/Ig).toFixed(2);
    result += ')'

    result += '</td>';
    result += '</tr></table>';

    result += '<table><tr>';
    result += '<td>';
    result += '&rho; = ';
    result += (rho*100).toFixed(2);
    result += '%, &nbsp; &lambda;  = 2.0 /( 1 + 50 &rho;\' ) = ';
    result += lam.toFixed(2);
    result += '&nbsp; (at midspan in this case)';
    result += '</td>';
    result += '</tr></table>';

    //
    result += '<p>';
    result += '<h4>';
    result += '-- Deflection';
    result += '</h4>';
    result += '</p>';
    //
    result += '<table><tr>';
    result += '<td>';
    result += 'd<sub>DL</sub> = ';
    result += dmaxDL.toFixed(2);
    result += 'mm, &nbsp;';
    result += 'd<sub>LL</sub> = ';
    result += dmaxLL.toFixed(2);
    result += 'mm';
    result += '</td>';
    result += '</tr></table>';

    result += '<table><tr>';

    result += '<td>';
    result += '&delta;<sub>LL</sub> = ';
    result += dmaxLL.toFixed(2);
    result += 'mm, &nbsp;';
    result += '</td>';
    result += '<td>';
    result += '( 1/';
    result += (span*1000/dmaxLL).toFixed(0);
    result += ' ) < l/180, l/360 ';
    result += '</td>';

    result += '</tr><tr>';

    result += '<td>';
    result += '&delta;<sub>LT</sub> = &delta;<sub>LL</sub> + '+ lam.toFixed(2) +' x d<sub>sus</sub> = ';
    result += dLT.toFixed(2);
    result += 'mm, &nbsp;';
    result += '</td>';
    result += '<td>';
    result += '( 1/';
    result += (span*1000/dLT).toFixed(0);
    result += ' ) < l/240, l/480';
    result += '</td>';

    result += '</tr></table>';

    document.getElementById('def').innerHTML = result;
    //

}

//
//------------------------------------------------------------------------

function phai(bw, be, dd, t)
{
    /*
     Output I/Ie
     'bw:width of beam
     'be:total beam width including coopelation area
     'dd:depth of beam
     'thickness of slab
     */

    var b1 = be / bw;
    var t1 = t / dd;

    var alpha = 1.0 + (b1 - 1.0) * Math.pow(t1 , 3);
    var beta = 1.0 + (b1 - 1.0) * Math.pow(t1 , 2);
    var gamma = 1.0 + (b1 - 1.0) * t1;

    var a = 4.0 * alpha - 3.0 * Math.pow( beta , 2 )/ gamma;

    return a;

}

function be(idType, bw, span, thick, a0)
{
    /*
     effective flange width for RC beam

     idType: 0: Both Side (T Section)
     idType: 1: One Side

     bw    : Beam width, mm
     span  : Beam Span, mm
     thick : Slab Thickness, mm
     a0    : clear distance to the next web, mm
     */

    var b1,b2,b3;
    var bee;

    if( idType == 0){
	b1 = span/4.0;
	b2 = bw + 2*8*thick;
	b3 = bw + a0;
    }
    else if( idType ==1){
	b1 = bw + span/12.0;
	b2 = bw + 6*thick;
	b3 = bw + a0/2.0;
    }
    else{
	bee = 0;
	return bee;
    }

    bee = Math.min(b1,b2,b3);
    return bee;

}

function icr(idType,
	     bw,h,d,dc,be,thick,
	     as,ac,n)
{
    /*
     Moment of inertia of cracked section transformed to concrete, mm4

     idType:
     --- 0: Rectangular
     --- 1: Flanged Sections

     bw,h: beam width, beam height, mm
     d   : effective depth, mm
     dc  : distance from concrte surface to compression steel, mm
     be  : effective with, mm
     thick: slab thickness, mm

     as  : area of tension steel, mm2
     ac  : area of comppression steel,mm2
     n   : young modulus, N/mm2

     */


    //

    var a,aa;
    var ig;
    var r = (n-1)*ac/(n*as);


    if( idType == 0){

	var B = bw/(n*as);

	//ig = bw*Math.pow(h,3)/12.0;

	a = ( Math.sqrt(2*d*B*(1.0+r*dc/d) + Math.pow(1+r,2))
	      - (1+r) )	/B;

	aa = bw*Math.pow(a,3)/3 + n*as*Math.pow(d-a,2)
	    + (n-1)*ac*Math.pow(a-dc,2);

    }

    else if( idType == 1){

	var C = bw/(n*as);
	var f = thick*(be-bw)/(n*as);
	var yt = h
		-0.5*((be-bw)*Math.pow(thick,2) + bw*Math.pow(h,2))/
		((be-bw)*thick + bw*h);

	ig = (be-bw)*Math.pow(thick,3)/12.0
	    + bw*Math.pow(h,3)/12.0
	    + (be-bw)*thick*Math.pow(h-thick/2-yt,2)
	    + bw*h*Math.pow(yt-h/2,2);

	a = ( Math.sqrt( C*(2*d+thick*f+2*r*dc) + Math.pow(f+r+1,2) )
	      -(f+r+1) )/C;

	aa = (be-bw)*Math.pow(thick,3)/12.0
	    + bw*Math.pow(a,3)/3.0
	    + (be-bw)*thick*Math.pow(a-thick/2,2)
	    + n*as*Math.pow(d-a,2)
	    + (n-1)*ac*Math.pow(a-dc,2);

    }

    else{
	aa = 0.0;
    }

    return aa;

}
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// Library of the calculation of deflection
// 2017/09/18: Coded By Tsunoda
////////////////////////////////////////////////////////////////////////
/*
  Notation
  ----------------------------------------------------------------------
  For defSlabDiv_**
  - omega  : Load on Slab, kN/m2
  For Others
  - omega  : Uniform Distributed Load, kN/m
  - p      : Point Load: kN
  - lx     : Span, m
  - lambda : ly/lx
  - ec     : young modulus, N/mm2
  - inersia: moment of inersia, mm4
  ----------------------------------------------------------------------
  Output
  - return : deflection, mm
  */
////////////////////////////////////////////////////////////////////////
function defMax(IdType, IdSide, span, para1, para2, para3, ec, Ie)
{
    /*
      IdType
      0: None</option>
      1: Uniform 01
      2: Uniform 02
      3: Uniform 03
      4: Uniform 04
      5: Uniform 05
      6: Point Load 01
      7: Point Load 02
     */

    var defDL,defLL;

    switch (IdType) {

    case 0:
	defDL = 0;
	defLL = 0;
	break;

    case 1:
	defDL = defSimple(para1*para3,span,ec,Ie);
	defLL = defSimple(para2*para3,span,ec,Ie);
	break;

    case 2:
	defDL = defTriangle(para1*span,span,ec,Ie);
	defLL = defTriangle(para2*span,span,ec,Ie);
	break;

    case 3:
	defDL = defSlabDiv_0( para1, para3, span/para3, ec, Ie)
	defLL = defSlabDiv_0( para2, para3, span/para3, ec, Ie)
	break;

    case 4:
	defDL = defSlabDiv_1( para1, span/2, para3/(span/2), ec, Ie)
	defLL = defSlabDiv_1( para2, span/2, para3/(span/2), ec, Ie)
	break;

    case 5:
	defDL = defSlabDiv_2( para1, span/3, para3/(span/3), ec, Ie)
	defLL = defSlabDiv_2( para2, span/3, para3/(span/3), ec, Ie)

	break;

    case 6:
	defDL = defCenterPoint( para1, span, ec, Ie )
	defLL = defCenterPoint( para2, span, ec, Ie )
	break;

    case 7:
	defDL = defPoint( para1, span, para3, ec, Ie )
	defLL = defPoint( para2, span, para3, ec, Ie )
	break;
    }

    if( IdSide == 0 ){
	return [2.0*defDL,2.0*defLL];
    }
    else{
	return [defDL,defLL];
    }


}
////////////////////////////////////////////////////////////////////////
function defSimple( omega, span, ec, inersia )
{
    var w    = omega; // from kN/m to N/mm
    var span = span*1000.0;  // from m to mm
    var dmax;
    dmax = 5/384* w*Math.pow(span,4)/(ec*inersia);
    return dmax;
}
////////////////////////////////////////////////////////////////////////
function defTriangle( omega, span, ec, inersia )
{
    var w    = omega; // from kN/m to N/mm
    var span = span*1000.0;  // from m to mm
    var dmax;
    dmax = 1/120* w*Math.pow(span,4)/(ec*inersia);
    return dmax;
}
////////////////////////////////////////////////////////////////////////
function defSlabDiv_0( omega, lx, lambda, ec, inersia )
{
    var w    = omega/1000; // from kN/m2 to N/mm2
    var span = lx*1000.0;  // from m to mm
    var dmax;
    dmax = w/(3840*ec*inersia)*Math.pow(span,5)*Math.pow(5.0*Math.pow(lambda,2)-1.0,2);
    return dmax;
}
////////////////////////////////////////////////////////////////////////
function defSlabDiv_1( omega, lx, lambda, ec, inersia )
{
    var w    = omega/1000; // from kN/m2 to N/mm2
    var span = lx*1000.0;  // from m to mm
    var dmax;
    var dmax1 = 7/256*w*Math.pow(span,5)/(ec*inersia);
    var dmax2 = 1/24*w*(2*lambda-3)*Math.pow(span,5)/(ec*inersia);
    dmax = dmax1 + dmax2;
    return dmax;
}
////////////////////////////////////////////////////////////////////////
function defSlabDiv_2( omega, lx, lambda, ec, inersia )
{
    var w    = omega/1000; // from kN/m2 to N/mm2
    var span = lx*1000.0;  // from m to mm
    var dmax;
    var dmax1 = 259/960* w*Math.pow(span,5)/(ec*inersia);
    var dmax2 = 23/96*(2*lambda-3)*w*Math.pow(span,5)/(ec*inersia);
    dmax = dmax1 + dmax2;
    return dmax;
}
////////////////////////////////////////////////////////////////////////
function defCenterPoint( p, span, ec, inersia )
{
    var w    = p*1000; // from kN to N
    var span = span*1000.0;  // from m to mm
    var dmax;
    dmax = 1/48* p*Math.pow(span,3)/(ec*inersia);
    return dmax;
}
////////////////////////////////////////////////////////////////////////
function defPoint( p, span, a, ec, inersia )
{
    var w    = p*1000; // from kN to N
    var span = span*1000.0;  // from m to mm
    var a    = a*1000.0;  // from m to mm
    var b = span-a;
    var dmax;
    dmax = p*b*Math.sqrt(
	Math.pow( Math.pow(span,2) - Math.pow(b,2) , 3 ) );
    dmax = dmax/(9*Math.sqrt(3)*ec*inersia*span);
    return dmax;
}

////////////////////////////////////////////////////////////////////////
// Crack Moment for T-Shape Beam
// 2017/10/04: Coded By Tsunoda
////////////////////////////////////////////////////////////////////////
//  Notation
//                  be
//      <-------------------------->
//  --  ----------------------------  --     --
//  |             * * * *                     |
//  |             *   * *                     | t
//  |   --------          ----------         --
// h|           |         |
//  |           |         |
//  |           | *     * |
//  |           | * * * * |
//  --          -----------
//              <---bw---->
/*
  - be     : Beam width with cooperation slab, mm
  - bw     : Beam width, mm
  - h      : Beam Depth, mm
  - t      : Slab Thickness, mm
  - fc     : Compressive concrete strength, N/mm2
  ----------------------------------------------------------------------
  Output
  - Return : crack Moment for T-Shape, kN.m
  */
////////////////////////////////////////////////////////////////////////
function tMcr( be,bw,h,t,fc )
{
    var a1 = be*t;
    var a2 = bw*(h-t);
    var y1 = t/2.0;
    var y2 = t+(h-t)/2;

    var ybar = (a1*y1+a2*y2)/(a1+a2);
    var yt = h-ybar;

    var ig = be*Math.pow(t,3)/12;
    ig = ig + be*t*Math.pow(ybar-t/2,2);
    ig = ig + bw*Math.pow(h-t,3)/12;
    ig = ig + bw*(h-t)*Math.pow(yt-(h-t)/2,2);

    var fr = 0.62*Math.sqrt(fc);

    mcr = fr*ig/yt;
    mcr = mcr*Math.pow(10,-6);

    return mcr;

}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// Allowbale Moment Capacity
// 2017/10/06 Coded By Tsunoda
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function subgma( fc, ft, n, dc1, gamma,
		 pt, b, d
	       )
{
    /* Function gmad(fc, ft, n, dc1, gamma, pt, b, d)  */
    /* fc   (N/mm2): Permissible Concrete Compressible Stress */
    /* ft   (N/mm2): Permissible Reinforcement Tensile Stress */
    /* n        (-): Yang Modulus Ratio (Steel/Concrete) */
    /* dc1      (-): Compressible Re-bar Location ---dc/d----*/
    /* γ        (-): Ratio of the Compressible to Tensile Re-bar (gamma 腹筋比 Ac/At)*/
    /* pt       (-): 引っ張り鉄筋比at/b/d*/
    /* b       (mm): Beam Width */
    /* d       (mm): Effective Beam Depth */
    /* judge       : 鉄筋orコンクリートのどちらで決まっているかを算定*/

    var xn1,c1,c2;
    var judge;
    var gma;

    var xn1 = Math.pow ( (n * (1.0 + gamma) - gamma) , 2.0) + 2.0 / pt * (n * (1.0 + gamma * dc1) - gamma * dc1);
    xn1 = pt * ( Math.pow( xn1 , 0.5) - (n * (1.0 + gamma) - gamma));
    var c1 = n * (1.0 - xn1) * (3.0 - xn1) - gamma * (n - 1) * (xn1 - dc1) * (3.0 * dc1 - xn1);
    c1 = c1 * pt * fc / (3.0 * xn1);
    var c2 = n * (1.0 - xn1) * (3.0 - xn1) - gamma * (n - 1) * (xn1 - dc1) * (3.0 * dc1 - xn1);
    c2 = c2 * pt * ft / (3.0 * n * (1.0 - xn1));

    if( c1 < c2 ){
	judge = 'C';
	gma = c1 * b * Math.pow( d , 2.0) / Math.pow( 10.0, 6.0);
    }
    if( c2 <= c1){
	judge = 'S';
	gma = c2 * b * Math.pow( d , 2.0) / Math.pow( 10.0, 6.0);
    }

    var x1 = gma;
    var j1 = judge;

    return [x1,j1];

}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// 2D Glaph;
////////////////////////////////////////////////////////////////////////


function DrawMN(ctx,num,DataX,DataY,DataX2,DataY2,mnmax,ymax,Name1,Name2){

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
////////////////////////////////////////////////////////////////////////
// 2D Glaph;
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

function cal(){

    // Input
    var C,shI,area,shZ,whI,whZ,ix,iy;
    var A = Number(document.getElementById('H').value);
    var b = Number(document.getElementById('b').value);
    var tw = Number(document.getElementById('tw').value);
    var tf = Number(document.getElementById('tf').value);
    var r = Number(document.getElementById('r').value);

    var pi = 3.141592;

    // Cal
    C = r * (10.0 - 3.0 * pi) / (12.0 - 3.0 * pi);
    shI = b * Math.pow(tf,3.0) / 6.0
	+ Math.pow(A - 2.0 * tf, 3.0) * tw / 12.0
	+ Math.pow(A - tf,2.0) * b * tf / 2.0;
    shI = shI + (4.0 - pi) * Math.pow(r, 2.0) * Math.pow(A / 2.0 - tf - C, 2.0);
    area = 2.0 * b * tf + (A - 2.0 * tf) * tw + Math.pow(r , 2.0) * (4.0 - pi);
    shZ=shI*2.0/A;
    //
    shI=shI/10000.0;
    shZ=shZ/1000.0;
    area=area/100.0;
    whI = tf * Math.pow( b, 3.0) /12.0 / 10000.0;
    whZ = whI / b *  20.0;
    ix = Math.sqrt(shI/area);
    iy = Math.sqrt(whI/area);

    console.log(area,shI);
    return area,shI,shZ,whI,whZ,ix,iy;

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


    // Draw Beam Section
    /*
    ctx.beginPath();
    ctx.rect(xcen-b/2*scale,ycen-h/2*scale,b*scale,h*scale);

    ctx.fillStyle = "rgb(242,244,255)";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
     */

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

    // Y Dir.

    /*
    ctx.beginPath();
    ctx.moveTo(xcen+b/2*scale+10,ycen-h/2*scale);
    ctx.lineTo(xcen+b/2*scale+30,ycen-h/2*scale);
    ctx.stroke();
     //
    ctx.beginPath();
    ctx.moveTo(xcen+b/2*scale+10,ycen+h/2*scale);
    ctx.lineTo(xcen+b/2*scale+30,ycen+h/2*scale);
    ctx.stroke();
     */

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
