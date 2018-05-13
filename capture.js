const screenshot = require('desktop-screenshot');
const fs = require('fs');
const ask = require('./ask');
const beep = require("beepwin");

function seconds_to_time(s) {
    let sec_num = parseInt(s, 10); // don't forget the second param
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {hours = "0" + hours;}
    if (minutes < 10) {minutes = "0" + minutes;}
    if (seconds < 10) {seconds = "0" + seconds;}
    return hours + ':' + minutes + ':' + seconds;
}


let interval = 1;
let count = 10;
let do_beep = 'y';

let output = 'outpoop';

fs.mkdir(output, () => {});

function pad(num, size = 5) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

console.log('hey there!');

function init() {
    ask([
        `how many screenshots you need? (now: ${count}): `,
        `with what interval (in seconds, now: ${interval})?: `,
        `shoule I beep? (now: ${do_beep}) (y/n): `,
    ]).then((data) => {
        count = parseInt(data[0]) || count;
        interval = parseFloat(data[1]) || interval;
        do_beep = data[2] || 'y';

        console.log('');
        console.log('COUNT:     ', count);
        console.log('INTERVAL:  ', interval);
        console.log('DO BEEP:   ', do_beep);

        countdown(() => run())
    });
}

function countdown(cb) {
    console.log('\nESTIMATED TIME :: ', seconds_to_time(count * interval + (interval * 5)));
    let c = 5;
    process.stdout.write('\nready in ' + c);
    let timer = setInterval(() => {
        if (c > 0) {
            process.stdout.write(' ' + (--c));
            beep(5000, 25);
        } else {
            clearInterval(timer);
            process.stdout.write(' GO!\n\n');

            beep(5000, 25);
            beep(5000, 25);
            cb();
        }
    }, 1000);
}

function run() {

    let i = 0;
    let timer = setInterval(() => {
        let f = output + '/' + pad(++i) + '.png';
        screenshot(f, function (error, complete) {
            if (complete) console.log("pew! -", f);
            if (i < count) {
                if (do_beep.toLowerCase() === 'y') beep(300, 5);
            } else {
                clearInterval(timer);
                if (do_beep.toLowerCase() === 'y') {
                    beep(2000, 120);
                    beep(2000, 120);
                    beep(4000, 100);
                    beep(4000, 100);
                }
                console.log('\nDONE!\n');
                console.log(' - press Ctrl+C to exit');
                ask([` - Enter to do it again`]).then(() => init());
            }
        });
    }, interval * 1000);
}

init();