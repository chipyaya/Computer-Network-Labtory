var express = require('express');
var async = require('async')
var wifi = require('node-wifi');
var sleep = require('sleep');
var func = require('./redirect');
var app = express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/case1', function (req, res) {
    res.render('case1.html');
});

app.get('/case2', function (req, res) {
    res.render('case2.html');
});

app.get('/scan', function (req, res) {
    var date = new Date();
    var c = date.getSeconds();
    res.end(JSON.stringify(c));
});

function median(a){
    a.sort()
    return a[parseInt((sampleN+1)/2)]
}

var ssids_fix = ['7', '12', '13']
var freqs_fix = [2437, 2437, 2412]
var websites1 = ['google.com.tw', 'www.ntu.edu.tw', 'mrtg.csie.ntu.edu.tw']
var websites2 = ['www.pcs.csie.ntu.edu.tw/views/courses/cnl/2017/2017_Lab1_Firewall_NAT(concept).pdf',
                'www.pcs.csie.ntu.edu.tw/views/courses/cnl/2017/2017_Lab1_Firewall_NAT(exeriment).pdf',
                'www.pcs.csie.ntu.edu.tw/views/courses/cnl/2017/2017_Lab2_concept.pdf',
                'www.pcs.csie.ntu.edu.tw/views/courses/cnl/2017/2017_Lab2_experiment.pdf',
                'www.pcs.csie.ntu.edu.tw/views/courses/cnl/2017/2017_Lab3_IPv6_Mobility(concept).pdf',
                'www.pcs.csie.ntu.edu.tw/views/courses/cnl/2017/2017_Lab3_IPv6_Mobility(experiment).pdf'];

var ssid2website = {}
var signal_levels = []
//var sleep_seconds = 1

for (var i = 0; i < ssids_fix.length; i++){
    ssid2website[ssids_fix[i]] = websites1[i]
    signal_levels.push([])
}

var sampleN = 1
var array = new Array(sampleN-1)

for (var i = 0; i < array.length; i++){
    array[i] = i+1
}

wifi.init({
    iface : null // network interface, choose a random wifi interface if set to null 
});

app.get('/scan1', function (req, res) {
    var url = "";
    var case_num = 1;
    async.waterfall([
        function(callback){
            wifi.scan(function(err, networks) {
                //console.log(networks)
                var newNetworks = []
                if (err) {
                    console.log(err);
                } else {
                    for (var i = 0; i < networks.length; i++){
                        for (var j = 0; j < ssids_fix.length; j++){
                            if((networks[i].ssid == ssids_fix[j]) && (networks[i].frequency == freqs_fix[j])){
                            //if(networks[i].ssid == ssids_fix[j]){
                                signal_levels[j].push(networks[i].signal_level)
                                newNetworks.push(networks[i])
                            }
                        }
                    }
                    newNetworks.sort(function(a, b){
                        return parseInt(a.ssid) > parseInt(b.ssid)
                    })
                }
                //console.log('init:', newNetworks)
                callback(null, newNetworks);
            })
        },
        function(newNetworks, callback){
            async.everySeries(array, function(c, callback){
                //sleep.sleep(sleep_seconds)      // sleep sleep_seconds seconds
                wifi.scan(function(err, networks) {
                    if (err) {
                        console.log(err);
                    } else {
                        for (var i = 0; i < networks.length; i++){
                            for (var j = 0; j < ssids_fix.length; j++){
                                if((networks[i].ssid == ssids_fix[j]) && (networks[i].frequency == freqs_fix[j])){
                                //if(networks[i].ssid == ssids_fix[j]){
                                    signal_levels[j].push(networks[i].signal_level)
                                }
                            }
                        }
                        callback(null, !err);
                    }
                })

            }, function (err, result) {
                callback(null, newNetworks)
            });
        },
    ], function (err, newNetworks) {
        for (var i = 0; i < newNetworks.length; i++){
            newNetworks[i].signal_level = median(signal_levels[i])
        }
        //console.log('Median:', newNetworks);

        if(newNetworks.length > 0){
            url = ssid2website[func.Redirect1(newNetworks)]
            console.log(url);
            res.end(url);

        }
        else{
            console.log('Cannot detect enough APs (at least 1 for case 1)')
        }
    });
});

app.get('/scan2', function (req, res) {
    var url = "";
    var case_num = 1;
    async.waterfall([
        function(callback){
            wifi.scan(function(err, networks) {
                //console.log(networks)
                var newNetworks = []
                if (err) {
                    console.log(err);
                } else {
                    for (var i = 0; i < networks.length; i++){
                        for (var j = 0; j < ssids_fix.length; j++){
                            if((networks[i].ssid == ssids_fix[j]) && (networks[i].frequency == freqs_fix[j])){
                            //if(networks[i].ssid == ssids_fix[j]){
                                signal_levels[j].push(networks[i].signal_level)
                                newNetworks.push(networks[i])
                            }
                        }
                    }
                    newNetworks.sort(function(a, b){
                        return parseInt(a.ssid) > parseInt(b.ssid)
                    })
                }
                //console.log('init:', newNetworks)
                callback(null, newNetworks);
            })
        },
        function(newNetworks, callback){
            async.everySeries(array, function(c, callback){
                //sleep.sleep(sleep_seconds)      // sleep sleep_seconds seconds
                wifi.scan(function(err, networks) {
                    if (err) {
                        console.log(err);
                    } else {
                        for (var i = 0; i < networks.length; i++){
                            for (var j = 0; j < ssids_fix.length; j++){
                                if((networks[i].ssid == ssids_fix[j]) && (networks[i].frequency == freqs_fix[j])){
                                //if(networks[i].ssid == ssids_fix[j]){
                                    signal_levels[j].push(networks[i].signal_level)
                                }
                            }
                        }
                        callback(null, !err);
                    }
                })

            }, function (err, result) {
                callback(null, newNetworks)
            });
        },
    ], function (err, newNetworks) {
        for (var i = 0; i < newNetworks.length; i++){
            newNetworks[i].signal_level = median(signal_levels[i])
        }
        //console.log('Median:', newNetworks);

        if(newNetworks.length == 3){
            console.log(newNetworks);
            var ssid_ret2 = func.Redirect2(newNetworks, [0.6 * 10, 0.6 * Math.pow(1+16, 0.5), 0.6 * Math.pow(81+16, 0.5)]);
            console.log('Redirect2:', ssid_ret2, websites2[ssid_ret2]);
            url = websites2[ssid_ret2]
            console.log(url);
            res.end(url);
            //open(websites2[ssid_ret2], 'google-chrome');
        }
        else{
            console.log('Cannot detect enough APs (at least 3 for case 2)')
        }
    });
});

app.get('/scan3', function (req, res) {
    var url = "";
    var case_num = 1;
    async.waterfall([
        function(callback){
            wifi.scan(function(err, networks) {
                //console.log(networks)
                var newNetworks = []
                if (err) {
                    console.log(err);
                } else {
                    for (var i = 0; i < networks.length; i++){
                        for (var j = 0; j < ssids_fix.length; j++){
                            if((networks[i].ssid == ssids_fix[j]) && (networks[i].frequency == freqs_fix[j])){
                            //if(networks[i].ssid == ssids_fix[j]){
                                signal_levels[j].push(networks[i].signal_level)
                                newNetworks.push(networks[i])
                            }
                        }
                    }
                    newNetworks.sort(function(a, b){
                        return parseInt(a.ssid) > parseInt(b.ssid)
                    })
                }
                //console.log('init:', newNetworks)
                callback(null, newNetworks);
            })
        },
        function(newNetworks, callback){
            async.everySeries(array, function(c, callback){
                //sleep.sleep(sleep_seconds)      // sleep sleep_seconds seconds
                wifi.scan(function(err, networks) {
                    if (err) {
                        console.log(err);
                    } else {
                        for (var i = 0; i < networks.length; i++){
                            for (var j = 0; j < ssids_fix.length; j++){
                                if((networks[i].ssid == ssids_fix[j]) && (networks[i].frequency == freqs_fix[j])){
                                //if(networks[i].ssid == ssids_fix[j]){
                                    signal_levels[j].push(networks[i].signal_level)
                                }
                            }
                        }
                        callback(null, !err);
                    }
                })

            }, function (err, result) {
                callback(null, newNetworks)
            });
        },
    ], function (err, newNetworks) {
        for (var i = 0; i < newNetworks.length; i++){
            newNetworks[i].signal_level = median(signal_levels[i])
        }
        //console.log('Median:', newNetworks);

        console.log(JSON.stringify(newNetworks));
        res.end(JSON.stringify(newNetworks));
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
