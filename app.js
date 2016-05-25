/* Dependencies */
var express = require('express');
var app = express();
var path = require('path');
var port = 8899;

var TLFPC01N = {
    version : { len : 1},
    term_fiid : { len : 4},
    term_id : { len : 16},
    crd_fiid : { len : 4},
    crd_pan : { len : 16},
    auth_type : { len : 4},
    auth_rte_stat : { len : 2},
    auth_originator : { len : 1},
    auth_responder : { len : 1},
    auth_tran_date : { len : 8},
    auth_tran_time : { len : 11},
    auth_pos_date : { len : 8},
    seq_num : { len : 12},
    tran_code : { len : 2},
    tran_code_from : { len : 2},
    tran_code_to : { len : 2},
    tran_from_acct : { len : 19},
    tran_to_acct : { len : 19},
    tran_mult_acct : { len : 1},
    tran_amt1 : { len : 15},
    tran_amt2 : { len : 15},
    tran_amt3 : { len : 15},
    tran_resp_byte1 : { len : 1},
    tran_resp_byte2 : { len : 2},
    tran_rvsl_rsn : { len : 2},
    tran_user_fld1 : { len : 1},
    tran_fee_amt1 : { len : 7},
    tran_comms_fee_amt1 : { len : 7},
    hopr1_amt : { len : 4},
    hopr2_amt : { len : 4},
    hopr3_amt : { len : 4},
    hopr4_amt : { len : 4},
    tran_fee_amt2 : { len : 7},
    tran_comms_fee_amt2 : { len : 7},
    ident_no : { len : 26},
    iss_bank_code : { len : 2},
    acq_bank_code : { len : 2},
    ben_bank_code : { len : 2},
    acq_fee : { len : 7},
    ben_fiid : { len : 4},
    ben_fee : { len : 7},
    switch_date : { len : 4},
    //bank_note : { len : 12},
    pcc_trace_no : { len : 12},
    dr_cr_flag : { len : 1},
    role_flag_acq : { len : 1},
    role_flag_iss : { len : 1},
    role_flag_ben : { len : 1},
    role_flag_flow : { len : 1},
    new_ref1 : { len : 32},
    new_ref2 : { len : 16},
    new_ref3 : { len : 11},
    tax_id : { len : 15 },
    alt_resp : { len : 2},
    external_resp : { len : 5},
    external_err_msg : { len : 26},
    cdm_admin : { len : 94},
    crd_pan_19 : { len : 19},
    switching_no : { len : 15},
    pcc_trace_no_1 : { len : 12},
    wd_dcc_area : { len : 48},
    interbank_fee : { len : 6},
    waive_fee : { len : 6},
    from_acct_branch : { len : 4},
    to_acct_branch : { len : 4},
    from_acct_product_code : { len : 9},
    to_acct_product_code : { len : 9},
    tcb_resp : { len : 40},
    tcb_acct_date : { len : 10},
    tcb_tran_date : { len : 10},
    tcb_tran_time : { len : 8},
    legacy_acct_date : { len : 8},
    atc : { len : 5},
    pos_entry_mode : { len : 3},
    rquid : { len : 19},
    filler : { len : 65}
    
};

/*
var countLength = 0;
for(var i in TLFPC01N){
  
  countLength = countLength + TLFPC01N[i].len
  console.log(i +'->'+TLFPC01N[i].len+'->'+countLength); // alerts key
}
console.log(countLength);
*/
var Promise = require('bluebird');
var mongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;


var count_i = 0;
mongoClient.connectAsync('mongodb://localhost:27017/local')
    .then(function(db) {
        var LineByLineReader = require('line-by-line'),
            lr = new LineByLineReader('tlfpc01n.txt');
        
        lr.on('error', function (err) {
            // 'err' contains error object
        });
        
        lr.on('line', function (line) {
            // pause emitting of lines...
            lr.pause();
        
            // ...do your asynchronous line processing..
            setTimeout(function () {
        
                // ...and continue emitting lines.
                //console.log(line);
                var curr_msg = line;
                //console.log(curr_msg);
                var curr_pos = 0;
                var _TLFPC01N_DATA = {};
                for(var j in TLFPC01N){
                    var curr_len = TLFPC01N[j].len;
                    var curr_cut_data = curr_msg.substr(curr_pos, curr_len);
                    curr_pos = curr_pos + curr_len;
                    //console.log(curr_posx);
                    //TLFPC01N[j].data = curr_cut_data;
                    _TLFPC01N_DATA[j] = curr_cut_data;
                    
                    
                    
                }
                _TLFPC01N_DATA._id = count_i;
                _TLFPC01N_DATA.time_stamp = displayTime();
                if (count_i == 0) {
                    console.log(count_i + ' -> ' + displayTime());
                }
                
                count_i++;
                insertCollection(db, _TLFPC01N_DATA, function(){
                //console.log(_TLFPC01N_DATA);
                });
              
                //db.collection('TLFPC01N').insert(TLFPC01N, function(){
                //console.log(curr_msg);

                        
                lr.resume();
            }, 0);
        });
        
        lr.on('end', function () {
            // All lines are read, file is closed now.
            console.log(count_i-1 + ' -> ' + displayTime());
            console.log('Read file complete...')
        });        
    
//return db.collection('WebData').findAsync({})
});
    
function insertCollection(db, collection, callback) {

    db.collection('TLFPC01N').insert(collection, function(err) {
      if (err) {
        throw err;
      }
    });

  callback();
}

function displayTime() {
    var str = "";

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()
    var milliseconds = currentTime.getMilliseconds();
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds +":" + milliseconds + " ";
    if(hours > 11){
        str += "PM"
    } else {
        str += "AM"
    }
    return str;
}



/*
var fs = require('fs');
    fs.readFile('tlfpc01_split.txt','utf8', function(err, data) {
      var array = data.toString().split("\n");
      if (err) throw err;
        var count_i = 0;
        for(i in array) {
            //console.log(array[i]);
            var curr_msg = array[i];
            console.log(curr_msg);
            var curr_pos = 0;
            var _TLFPC01N_DATA = {};
            for(var j in TLFPC01N){
                var curr_len = TLFPC01N[j].len;
                var curr_cut_data = curr_msg.substr(curr_pos, curr_len);
                curr_pos = curr_pos + curr_len;
                //console.log(curr_posx);
                //TLFPC01N[j].data = curr_cut_data;
                _TLFPC01N_DATA[j] = curr_cut_data;
                
                
                
            }
            _TLFPC01N_DATA._id = count_i;
            _TLFPC01N_DATA.time_stamp = displayTime(); 
            count_i++;
            insertCollection(db, _TLFPC01N_DATA, function(){
                //console.log(_TLFPC01N_DATA);
            });
          
            //db.collection('TLFPC01N').insert(TLFPC01N, function(){
            //console.log(curr_msg);

                        
        }
        
    });
*/





/*


var server = app.listen(port, function() {
    console.log('Listening on port: ' + port);
});
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs'); 
app.set('view engine', 'jade'); 
//app.use(express.static('public'));

//app.use(express.static(__dirname + '/views'));
//Store all HTML files in view folder.
//app.use(express.static(__dirname + '/Script'));
 
app.get('/', function(req, res) {
    

	var Promise = require('bluebird');
	var mongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;
	 
	mongoClient.connectAsync('mongodb://localhost:27017/local')
		.then(function(db) {
			return db.collection('WebData').findAsync({})
		})
		.then(function(cursor) {
			return cursor.toArrayAsync();
		})
		.then(function(content) {
			//console.log(content);
			//res.status(200).json(content);
			res.render('index', { title:'Me', content: content } );
		})
		.catch(function(err) {
			throw err;
		});
		
});*/