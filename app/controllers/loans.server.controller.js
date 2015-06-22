'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');
var passport = require('passport');
var Promise  = require('bluebird');
var bcrypt   = Promise.promisifyAll(require('bcrypt'));
var crypto	= require('crypto');
var nodemailer = require('nodemailer');
var async = require('async');
var bookshelf = require('bookshelf');

var errorHandler = require('./errors.server.controller');
var config = require('../../config/config');
var connection = config.connection;
var loanModel = require('../models/loan.server.model');
var studentModel = require('../models/student.server.model');
var LibRuleModel = require('../models/librules.server.model');

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};


/**
 * Create a Loan
 */
exports.create = function(req, res) {
	var is_lock_mode = true;
	var lock_mode = is_lock_mode ? 'LOCK IN SHARE MODE' : '';

	var err = req.validationErrors();
	if (err) {
		return res.status(400).send({message: err});
	}

	var data = {};

	// Debug
	data.delay = req.body.debug ? 10 : 0;

	// Lấy thông tin sinh viên, MSSV
	data.student = req.body.student || false;
	if (!data.student) return res.status(400).send('Please enter student info');
	data.student_id = data.student.student_id || 0;
	if (!data.student_id) return res.status(400).send('Invalid student info');

	// Lấy thông tin các sách cần mượn
	data.books = req.body.books || false;
	if (!data.books || !data.books.length) return res.status(400).send('Please enter book info');

	// Thông tin nhân viên 
	data.staff_id = req.user.staff_id || 0;
	if (!data.staff_id) return res.status(400).send('Invalid staff info');

	// [1] Bắt đầu giao tác
	connection.beginTransaction(function(err) {
	    if (err) throw err;
	    var numOfBookItem = 0;

	    // [2]: Truy vấn tạo phiếu mượn, từ kết quả trả về, lấy ra mã phiếu mượn vừa nhập
	    connection.query('INSERT INTO `Loans` (`student_id`, `staff_id`) VALUES (?, ?)', 
	    	[data.student_id, data.staff_id], function(err, result) {
	        if (err || !result) {
	            connection.rollback(function() {
	                throw err;
	            });
	        }

	        data.loan_id = result.insertId;  // mã phiếu mượn
	        data.loan_result = result;
	        console.log('Loans ' + result.insertId + ' added');
	        var num_of_books = data.books.length;
	        var count = 0;

			connection.query('SELECT SLEEP(?)', [data.delay], function() {
		        // dùng forEach để tạo vòng lặp trên mỗi sách cần mượn
		        data.books.forEach(function(book) {
					// [3] Khóa sách cần thêm vào phiếu mượn
					connection.query('SELECT COUNT(*) FROM `Books` WHERE `book_id` = ? ' + lock_mode, [book.book_id], function(err, results) {

			        	// [4] Kiểm tra sách hiện tại có khả năng cho mượn hay không
		        		var is_can_booking = 0;
						connection.query('SELECT IsCanBooking(?) AS is_can_booking', [book.book_id], function(err, results) {
							if (!err) is_can_booking = results[0].is_can_booking || 0;

							// [5.1] Nếu sách không khả mượn, rollback
							if (is_can_booking != 1) {
								return connection.rollback(function() {
						            return res.status(400).send({
										message: 'Can not booking this book #' + book.book_id
									});
						        });
							}
							

							// [5.2] Ngược lại, lập chi tiết phiếu mượn
							connection.query('INSERT INTO `LoanDetails` (`loan_id`, `book_id`, `returned_time`, `is_return`) VALUES (?, ?, NULL, 0)', 
				        		[data.loan_id, book.book_id], function(err, result) {
				        			if (err) { 
							            connection.rollback(function() {
							                throw err;
							            });
							        }

							        // [6] Sau khi lập chi tiết phiếu mượn, điều chỉnh lại số lượng available_number của sách
							        connection.query('UPDATE Books \
							        	SET available_number = available_number - 1 WHERE book_id = ?', [book.book_id], function(err, result) {
										if (err) {
									        connection.rollback(function() {
									            throw err;
									        });
									    }					        		
							        });

							        count++;
							        // [7] Sau khi lập xong hết chi tiết phiếu mượn, commit transaction
							        if (count === num_of_books) commitTransaction();
				        	});
						});
					});
		        });
			});


	    });
	});

	function commitTransaction() {
		connection.commit(function(err) {
		    if (err) {
		        connection.rollback(function() {
		            throw err;
		        });
		    }

		    res.jsonp(data.loan_result);
		});
	}
};

/**
 * Show the current Loan
 */
exports.read = function(req, res) {

	res.jsonp(req.loan);
};

exports.out_of_date = function(req, res) {
	connection.query('CALL ListLoanOutOfDate()', [], function(err, result) {
        if (err || !result) {
            connection.rollback(function() {
                throw err;
            });
        }

        console.log(err, result);
        res.jsonp(result);
    });
};

exports.loan_by_student = function(req, res) {
	var uid = req.query.student_id || 0;
	connection.query('SELECT * FROM Loans L WHERE student_id = ?', [uid], function(err, result) {
        if (err || !result) {
            connection.rollback(function() {
                throw err;
            });
        }

        console.log(err, result);
        res.jsonp(result);
    });
}

/**
 * Update a Loan
 */
exports.update = function(req, res) {
	var loan = req.loan ;

	loan = _.extend(loan , req.body);

	loan.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(loan);
		}
	});
};

exports.test  = function(req, res) {
	res.jsonp(LibRuleModel.get('book_mins', 100));
}

/**
 * Delete an Loan
 */
exports.delete = function(req, res) {
	var loan = req.loan ;

	loan.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(loan);
		}
	});
};

/**
 * List of Loans
 */
exports.list = function(req, res) { 
	return connection.query('CALL ShowAllLoans()', [], function(err, rows, fields) {
		if (err || !rows[0]) {
			console.log(err);
	        return res.jsonp([]);
	    }

	    return res.jsonp(rows[0]);
	});
};

exports.listNotReturn = function(req, res) {
	var uid = parseInt(req.query.student_id) || 0;

	var procedureString = 'CALL GetLoanNotReturn()';
	if (uid > 0)  procedureString = 'CALL GetLoanNotReturnByUid(?)';

	return connection.query(procedureString, [uid], function(err, rows, fields) {
		if (err || !rows[0]) {
			console.log(err);
	        return res.jsonp([]);
	    }

	    return res.jsonp(rows[0]);
	})
};

exports.returnBookSubmit = function(req, res) {
	var books = req.query.books || [];
	var loan_id = req.query.loan_id || 0;

	if (loan_id > 0) {
		books.forEach(function(book) {
			var book_id = parseInt(book);
			var returned_time = new Date().toMysqlFormat();

			connection.query("CALL ReturnTheBook(?, ?)", [loan_id, book_id], function(err, rows, fields) {
				if (err) {
					console.log(err);
			        
			    }
			});
		});

		return res.jsonp('ok');
	}
	

	return res.status(400).send('Error!');
};

/**
 * Loan middleware
 */
exports.loanByID = function(req, res, next, id) { 

	connection.query('CALL FindLoanById(?)', [id], function(err, rows, fields) {
		console.log('fields: ', fields);
		console.log('rows: ', rows);
		if (err || !rows[0] || !rows[0].length ) {
	        return res.status(403).send('Not found');
	    }


		var loan = {
			loan_id: rows[0][0].loan_id,
			created: rows[0][0].created,
			student_id: rows[0][0].student_id,
			student_name: rows[0][0].student_name,
			books: []
		};

		rows[0].forEach(function(row) {
			var book = {
				book_id			: row.book_id,
				returned_time	: row.returned_time,
				name			: row.book_name,
				category_id		: row.category_id,
				language_id		: row.language_id,
				publisher_id	: row.publisher_id,
				number			: row.number,

			}
			loan.books.push(book);
		});

		req.loan = loan;

		next();	    	

	});
};

/**
 * Loan authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.loan.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
