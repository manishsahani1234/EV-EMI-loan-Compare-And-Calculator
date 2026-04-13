function fmt(n) {
    return Math.round(n).toLocaleString('en-IN');
}

function calcEMI(P, r, n) {
    if (r === 0) return P / n;
    var mr = r / 12 / 100;
    return P * mr * Math.pow(1 + mr, n) / (Math.pow(1 + mr, n) - 1);
}

function syncSlider(sl) {
    var pct = ((parseFloat(sl.value) - parseFloat(sl.min)) / (parseFloat(sl.max) - parseFloat(sl.min))) * 100;
    sl.style.setProperty('--val', pct + '%');
}

function update() {
    var P = parseFloat(document.getElementById('inp-loan').value) || 0;
    var rate = parseFloat(document.getElementById('inp-rate').value) || 0;
    var months = parseInt(document.getElementById('inp-tenure').value) || 1;

    var emi = calcEMI(P, rate, months);
    var total = emi * months;
    var interest = Math.max(0, total - P);

    document.getElementById('res-emi').textContent = fmt(emi);
    document.getElementById('res-principal').textContent = fmt(P);
    document.getElementById('res-interest').textContent = fmt(interest);
    document.getElementById('res-total').textContent = fmt(total);

    document.getElementById('lbl-loan').textContent = '₹ ' + fmt(P);
    document.getElementById('lbl-rate').textContent = rate + '%';
    document.getElementById('lbl-tenure').textContent = months + ' Months';

    var circ = 188.5;
    var pPct = total > 0 ? P / total : 1;
    var iPct = 1 - pPct;
    var pDash = pPct * circ;
    var iDash = iPct * circ;

    var dp = document.getElementById('donut-principal');
    var di = document.getElementById('donut-interest');

    dp.setAttribute('stroke-dasharray', pDash + ' ' + (circ - pDash));
    dp.setAttribute('stroke-dashoffset', 0);
    di.setAttribute('stroke-dasharray', iDash + ' ' + (circ - iDash));
    di.setAttribute('stroke-dashoffset', -pDash);

    document.getElementById('pct-principal').textContent = (pPct * 100).toFixed(1) + '%';
    document.getElementById('pct-interest').textContent = (iPct * 100).toFixed(1) + '%';
}

function wire(inpId, slId) {
    var inp = document.getElementById(inpId);
    var sl = document.getElementById(slId);

    inp.addEventListener('input', function () {
        sl.value = inp.value;
        syncSlider(sl);
        update();
    });

    sl.addEventListener('input', function () {
        inp.value = sl.value;
        syncSlider(sl);
        update();
    });

    syncSlider(sl);
}

wire('inp-loan', 'sl-loan');
wire('inp-rate', 'sl-rate');
wire('inp-tenure', 'sl-tenure');
update();
